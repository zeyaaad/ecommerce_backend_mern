
import jwt from 'jsonwebtoken';
import { userModel } from '../../../databases/models/user.model.js';
import AppError from '../../utils/services/AppError.js';
import { catchAsyncError } from './../../utils/middleware/catchAsyncError.js';

import bcrypt from 'bcrypt';
import { cartModel } from './../../../databases/models/cart.model.js';
import { SendEmail } from '../../utils/Email/sendEmail.js';
import { SendResetEmail } from '../../utils/Email/sendResetEmail.js';

export const Register = catchAsyncError(async (req, res, next) => {
    let { name, email, password, phone } = req.body;

    const emailParts = email.split("@");
    if (emailParts.length > 1) {
        email = `${emailParts[0]}@${emailParts[1].toLowerCase()}`;
    }

    let exist = await userModel.findOne({ email });
    if (exist) return next(new AppError("User Already Exists", 409));

    let hashedPass = await bcrypt.hash(password, Number(process.env.ROUNDED));
    let inserted = await userModel.insertMany({ name, email, password: hashedPass, phone });

    let token = jwt.sign({ id: inserted[0]._id }, process.env.SECRET_KEY);
    let data = {
        email: email,
        api: `${process.env.FRONT_URL}/verify/${token}`
    };
    
    let user = await userModel.findById(inserted[0]._id);
    user.verifyToken = token;
    await SendEmail(data);
    await user.save();

    let cart = new cartModel({ user: user._id, totalPrice: 0, cartItems: [] });
    await cart.save();

    res.status(201).json({ message: "success" });
});



export const Login = catchAsyncError(async (req, res, next) => {
    let { email, password } = req.body;

    // Normalize the email to lowercase before searching
    const emailParts = email.split("@");
    if (emailParts.length > 1) {
        email = `${emailParts[0]}@${emailParts[1].toLowerCase()}`;
    }

    let exist = await userModel.findOne({ email });

    if (!exist) {
        return next(new AppError("Incorrect Email or password", 401));
    }

    if (!exist.verified) {
        return next(new AppError("Verify your email first", 401));
    }

    let matched = await bcrypt.compare(password, exist.password);

    if (matched) {
        let token = jwt.sign({ name: exist.name, id: exist._id, role: exist.role }, process.env.SECRET_KEY);
        return res.json({ message: "success", token });
    } else {
        return next(new AppError("Incorrect Email or password", 401));
    }
});


export const adminLogin=catchAsyncError(async(req,res,next)=>{
    let {email,password}=req.body
    let exist=await userModel.findOne({email});
    if(!exist) return next(new AppError("Incorrect Email or password",401));
    if(exist.role!=="admin") return next(new AppError("Unauthorized",401))
    let matched=await bcrypt.compare(password,exist.password);
    if(matched){
        let token=jwt.sign({name:exist.name,id:exist._id,role:exist.role},process.env.SECRET_KEY);
        return res.json({message:"success",token})
    }else{
        return next(new AppError("Incorrect Email or password",401));   
    }

})

export const changePasswrod=catchAsyncError(async(req,res,next)=>{
    let {currentpassword,password}=req.body
    let matched=await bcrypt.compare(currentpassword,req.user.password);
    req.body.changePasswordAt=Date.now();
    if(matched){
        req.body.password = await bcrypt.hash(password, Number(process.env.ROUNDED));
        await userModel.findByIdAndUpdate(req.user._id,{...req.body});
        let token=jwt.sign({name:req.user.name,id:req.user._id,role:req.user.role},process.env.SECRET_KEY);
        return res.json({message:"success",token})
    }else{
        return next(new AppError("Incorrect currunt Password",401));   
    }
})

export const protectRoute=catchAsyncError(async(req,res,next)=>{
    let {token}=req.headers;
    if(!token) return next(new AppError("must Provide token",401));

    let decoded=await jwt.verify(token,process.env.SECRET_KEY);

    let user=await userModel.findById(decoded.id);
    if(!user) return next(new AppError("user Not found",404));

    if(user.changePasswordAt){
        let changeTime= parseInt(user.changePasswordAt.getTime()/1000);
        if(changeTime>decoded.iat) return next(new AppError("invaild token",401));
    }

    req.user=user;
    next()
}) 


export const allowTo=(...roles)=>{
    return catchAsyncError(async(req,res,next)=>{
        
        if(!roles.includes(req.user.role)) return next(new AppError("Unauthorized",401));
        next()
    })
}


export const changeUserData=catchAsyncError(async(req,res,next)=>{
    await userModel.findByIdAndUpdate(req.user._id,{...req.body});
    res.status(200).json({message:"success"});
}
)


export const protectRouteFront=catchAsyncError(
    async(req,res,next)=>{
    let {token}=req.params;
    if(!token) return res.json({status:false});

    let decoded=await jwt.verify(token,process.env.SECRET_KEY);

    let user=await userModel.findById(decoded.id);
    if(!user) return res.json({status:false});

    if(user.changePasswordAt){
        let changeTime= parseInt(user.changePasswordAt.getTime()/1000);
        if(changeTime>decoded.iat) return res.json({status:false});
    }

    return res.json({status:true});
}) 
export const isAdmin=catchAsyncError(
    async(req,res,next)=>{
    let {token}=req.params;
    if(!token) return res.json({status:false});

    let decoded=await jwt.verify(token,process.env.SECRET_KEY);

    let user=await userModel.findById(decoded.id);
    if(!user) return res.json({status:false});

    if(user.changePasswordAt){
        let changeTime= parseInt(user.changePasswordAt.getTime()/1000);
        if(changeTime>decoded.iat) return res.json({status:false});
        
    }
    if(user.role!="admin") return res.json({status:false})

    return res.json({status:true});
}) 




export const verify=async(req,res)=>{
    let {token}=req.params;
    let exist=await userModel.findOne({verifyToken:token})
    if(!exist) return res.json({message:"Invaild token"})
    exist.verified=true 
    exist.verifyToken=null;
    await exist.save()
    res.json({message:"success"})
}


export const reSendVerfiyEmail=async(req,res,next)=>{
    let{email}=req.body;
    let exist=await userModel.findOne({email});
    if(!exist) return next(new AppError("Email Not Found",404));
    if(exist.verified==true) return next(new AppError("You Already Verfieded",409)); 
    let token = jwt.sign({id:exist._id},process.env.SECRET_KEY)
    let data={email:email ,
        api:`${process.env.FRONT_URL}/verify/${token}`
    }
    let user=await userModel.findById(exist._id)
    user.verifyToken=token;
    await SendEmail(data)
    await user.save();
    res.json({message:"success"});
}




export const forgetPassword=catchAsyncError(async(req,res)=>{
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; 
    await user.save();

    await SendResetEmail({email:email,token:resetToken})

    res.json({ message: 'success' });
  
})



export const resetPassword = catchAsyncError(async (req, res) => {
    const token = req.header("token"); 
    const { newPassword } = req.body;
    
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

        const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);

        const user = await userModel.findOne({
            _id: decodedToken.userId,
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.ROUNDED));

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.json({ message: 'success' });
   
});



export const checkResetToken = catchAsyncError(async (req, res) => {
    const token = req.header("token"); 

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);

    const user = await userModel.findOne({
        _id: decodedToken.userId,
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }


    res.status(200).json({ message: true });
   
});





export const ChangeEmail=catchAsyncError(async(req,res,next)=>{
    let {email}=req.body ;
    let exist=await userModel.findOne({email});
    if(exist) return next(new AppError("Email Already Exist",409));

    let user=await userModel.findById(req.user._id);
    let token= jwt.sign({id:req.user._id,email},process.env.SECRET_KEY_EMAIL);
    let data={email:email ,
        api:`${process.env.FRONT_URL}/verifyChangeEmail/${token}`
    }
    user.verifyChangeEmailToken=token;
    await SendEmail(data)
    await user.save()
    res.json({message:"success"});
})


export const verifyChangeEmail=catchAsyncError(async(req,res,next)=>{
    let {token}=req.params;
    let exist=await userModel.findOne({_id:req.user._id});

    if(exist.verifyChangeEmailToken!=token) {
        res.json({message:"invaild token"});
        return 
    } else {
    let decoded=await jwt.verify(token,process.env.SECRET_KEY_EMAIL);
    exist.email=decoded.email
    exist.changePasswordAt=Date.now();
    await exist.save()
    let newToken = jwt.sign({ name: exist.name, id: exist._id, role: exist.role }, process.env.SECRET_KEY);
    res.json({message:"success",token:newToken})
}
})
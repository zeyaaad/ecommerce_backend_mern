
import AppError from "../../utils/services/AppError.js";
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import { wishListModel } from "../../../databases/models/wishList.model.js";


export const addToWishList=catchAsyncError(async(req,res,next)=>{
    req.body.user=req.user._id

    let isExist=await wishListModel.findOne({user:req.user._id,product:req.body.product})
    if(isExist) return next(new AppError("You already Added Product to wishList",409));

    let added=new wishListModel(req.body);
    await added.save();
    res.status(201).json({message:"success"})
})


export const getAllWishList=catchAsyncError(async(req,res,next)=>{

    let data=await wishListModel.find({user:req.user._id}).populate("product");
    res.json({message:"success",data});
})






export const deleteFromWishList=catchAsyncError(async(req,res,next)=>{
    let{id}=req.params

    let isOwner=await wishListModel.findOne({_id:id,user:req.user._id});
    if(!isOwner) return next(new AppError("Unauthorize",401));


    let data=await wishListModel.findByIdAndDelete(id);
    !data && next(new AppError("Not Found product",404))
    data && res.json({message:"success"});

})




export const clearWishList=catchAsyncError(async(req,res,next)=>{

    await wishListModel.deleteMany({user:req.user._id})
    res.json({message:"success"})

})









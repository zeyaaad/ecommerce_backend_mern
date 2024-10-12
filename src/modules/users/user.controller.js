import AppError from "../../utils/services/AppError.js";
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import {deleteOne, updateOne } from "../../utils/handlers/refactor.handerl.js";
import ApiFeatures from "../../utils/services/apiFeaturs.js";
import { userModel } from "../../../databases/models/user.model.js";

export const addUser=catchAsyncError(async(req,res,next)=>{
    let user=new userModel(req.body);
    await user.save();
    res.status(201).json({message:"success"})
})



export const getAllUsers=catchAsyncError(async(req,res,next)=>{
    let apiFeatures=new ApiFeatures(userModel.find(),req.query).pangination().fields().filter().search().sort();
    let data=await apiFeatures.Query;
    res.json({message:"success",page:apiFeatures.page,data});
})

export const getUserById=catchAsyncError(async(req,res,next)=>{
    let{id}=req.params
    let data=await userModel.findById(id);
    !data && next(new AppError("Not Found User",404))
    data && res.json({message:"success",data});
})

export const updateUser=catchAsyncError(async(req,res,next)=>{
    let {id}=req.params;
    let data=await userModel.findOneAndUpdate({_id:id},{...req.body},{new:true});
    !data && next(new AppError(`Not Found user`,404))
    data && res.json({message:"success",data});
})

export const changePassword=catchAsyncError(async(req,res,next)=>{
    let {id}=req.params;
    req.body.changePasswordAt=Date.now();
    let data=await userModel.findOneAndUpdate({_id:id},{...req.body},{new:true});
    !data && next(new AppError(`Not Found user`,404))
    data && res.json({message:"success",data});
})

export const deleteUser=deleteOne(userModel,"user")




export const getUserData=(req,res,next)=>{
    res.json({message:"success",data:{
        id:req.user._id,
        name:req.user.name,
        email:req.user.email,
        phone:req.user.phone,
        role:req.user.role
    }})
}
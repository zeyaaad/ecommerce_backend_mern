
import AppError from "../../utils/services/AppError.js";
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import ApiFeatures from "../../utils/services/apiFeaturs.js";
import { reviewModel } from "../../../databases/models/review.model.js";
import { contactModel } from "../../../databases/models/contact.model.js";

export const addMessage=catchAsyncError(async(req,res,next)=>{
    req.body.user=req.user._id


    let message=new contactModel(req.body);
    await message.save();
    res.status(201).json({message:"success"})
})


export const getAllMessages=catchAsyncError(async(req,res,next)=>{
    let apiFeatures=new ApiFeatures(contactModel.find(),req.query).pangination().fields().filter().search().sort();
    let data=await apiFeatures.Query
    res.json({message:"success",page:apiFeatures.page,data});
})


export const deleteMessage=catchAsyncError(async(req,res,next)=>{
    let{id}=req.params

    let data=await contactModel.findByIdAndDelete(id);
    !data && next(new AppError("Not Found message",404))
    data && res.json({message:"success"});


})













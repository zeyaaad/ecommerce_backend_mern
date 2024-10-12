
import AppError from "../../utils/services/AppError.js";
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import ApiFeatures from "../../utils/services/apiFeaturs.js";
import { couponModel } from "../../../databases/models/coupon.model.js";
import QRCode from "qrcode";

export const addCoupon=catchAsyncError(async(req,res,next)=>{
    let exist=await couponModel.findOne({code:req.body.code});
    if(exist) return next(new AppError("code alreadt exist",409));
    let coupon=new couponModel(req.body);
    await coupon.save();
    res.status(201).json({message:"success"})
})

export const getAllCoupons = catchAsyncError(async (req, res, next) => {
    let apiFeatures = new ApiFeatures(couponModel.find(), req.query)
        .pangination()
        .fields()
        .filter()
        .search()
        .sort();
    
    let data = await apiFeatures.Query;

    const updatedData = await Promise.all(
        data.map(async (element) => {
            let url = await QRCode.toDataURL(element.code); 
            element = element.toObject(); 
            element.url = url; 
            return element; 
        })
    );

    res.json({ message: "success", page: apiFeatures.page, data: updatedData });
});

export const getCouponById=catchAsyncError(async(req,res,next)=>{
    let{id}=req.params
    let data=await couponModel.findById(id);
    
    !data && next(new AppError("Not Found coupon",404))
    let url = await QRCode.toDataURL(data.code); 
    data && res.json({message:"success",url,data});
})


export const updateCoupon=catchAsyncError(async(req,res,next)=>{
    let{id}=req.params


    let data=await couponModel.findByIdAndUpdate(id,{...req.body});
    !data && next(new AppError("Not Found coupon",404))
    data && res.json({message:"success",data});
})


export const deleteCoupon=catchAsyncError(async(req,res,next)=>{
    let{id}=req.params


    let data=await couponModel.findByIdAndDelete(id);
    !data && next(new AppError("Not Found coupon",404))
    data && res.json({message:"success"});


})













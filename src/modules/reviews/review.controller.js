
import AppError from "../../utils/services/AppError.js";
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import ApiFeatures from "../../utils/services/apiFeaturs.js";
import { reviewModel } from "../../../databases/models/review.model.js";
import { productModel } from "../../../databases/models/product.model.js";


async function calcAVG(productId) {
    let allReviews = await reviewModel.find({ product: productId });
    
    if (allReviews.length === 0) {
        await productModel.findByIdAndUpdate(productId,{ratingAvg:1,ratingCount:0});
        return 1;
    }

    let totalRating = allReviews.reduce((sum, review) => {
        return sum + review.rating; 
    }, 0); 

    let avgRating = totalRating / allReviews.length;

    await productModel.findByIdAndUpdate(productId,{ratingAvg:avgRating,ratingCount:allReviews.length});
}



export const addReview=catchAsyncError(async(req,res,next)=>{
    req.body.user=req.user._id

    let isReviewed=await reviewModel.findOne({user:req.user._id,product:req.body.product})
    if(isReviewed) return next(new AppError("You already reviewed",409));

    let review=new reviewModel(req.body);
    await review.save();
    await calcAVG(req.body.product)
    res.status(201).json({message:"success"})
})


export const getAllReviews=catchAsyncError(async(req,res,next)=>{
    let apiFeatures=new ApiFeatures(reviewModel.find(),req.query).pangination().fields().filter().search().sort();
    let data=await apiFeatures.Query
    res.json({message:"success",page:apiFeatures.page,data});
})

export const getReviewById=catchAsyncError(async(req,res,next)=>{
    let{id}=req.params
    let data=await reviewModel.findById(id);
    !data && next(new AppError("Not Found review",404))
    data && res.json({message:"success",data});
})


export const updateReview=catchAsyncError(async(req,res,next)=>{
    let{id}=req.params

    let isOwner=await reviewModel.findOne({_id:id,user:req.user._id});
    if(!isOwner) return next(new AppError("Unauthorize",401));

    let data=await reviewModel.findByIdAndUpdate(id,{...req.body});
    !data && next(new AppError("Not Found review",404))
    data && res.json({message:"success",data});
})


export const deleteReview=catchAsyncError(async(req,res,next)=>{
    let{id}=req.params

    let isOwner=await reviewModel.findOne({_id:id,user:req.user._id});
    if(!isOwner) return next(new AppError("Unauthorize",401));


    let data=await reviewModel.findByIdAndDelete(id);
    !data && next(new AppError("Not Found review",404))
    await calcAVG(data.product);
    data && res.json({message:"success"});



})



export const isReviewed=catchAsyncError(async(req,res,next)=>{
    let product= await reviewModel.findOne({user:req.user._id,product:req.params.product})
    if(product) return res.json({status:true});
    return res.json({status:false});
})















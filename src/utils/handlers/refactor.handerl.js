import { catchAsyncError } from "../middleware/catchAsyncError.js"
import AppError from "../services/AppError.js"
import slugify from "slugify"
import { removeImage } from "../services/removefile.js"
export const deleteOne=(model,keyword)=>{
   return catchAsyncError(async(req,res,next)=>{
    let{id}=req.params
    let data=await model.findByIdAndDelete(id) 
    !data && next(new AppError(`Not Found ${keyword}`,404))

    data && res.json({message:"success",data});
})
}



export const addOne=(model)=>{
    return catchAsyncError(async(req,res,next)=>{
    let{name}=req.body;
    let brand=new model({name,slug:slugify(name)});
    await brand.save();
    res.status(201).json({message:"success"})
})
}

export const updateOne=(model,keyword)=>{
    return catchAsyncError(async(req,res,next)=>{
    let{id}=req.params
    let{title}=req.body;
    let{name}=req.body;
    if(title) req.body.slug=slugify(title);
    if(name) req.body.slug=slugify(name);
    let data=await model.findByIdAndUpdate(id,{...req.body},{new:true});
    !data && next(new AppError(`Not Found ${keyword}`,404))
    data && res.json({message:"success",data});
})
}
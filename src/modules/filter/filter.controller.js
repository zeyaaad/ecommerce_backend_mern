import { productModel } from "../../../databases/models/product.model.js";
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import AppError from "../../utils/services/AppError.js";
import { categoryModel } from './../../../databases/models/category.model.js'   ;
import { subCategoryModel } from './../../../databases/models/subcategory.model.js';
import { brandModel } from './../../../databases/models/brand.model.js';





export const getByCategory=catchAsyncError(async(req,res,next)=>{
    let {slug}=req.params;
    let category=await categoryModel.findOne({slug})
    if(!category) return next(new AppError("Not found Category",404))
    let data=await productModel.find({category:category._id});
    res.json({message:"success",data,name:category.name});
})
export const getBySubCategory=catchAsyncError(async(req,res,next)=>{
    let {slug}=req.params;
    let subCategory=await subCategoryModel.findOne({slug})
    if(!subCategory) return next(new AppError("Not found subCategory",404))
    let data=await productModel.find({subCategory:subCategory._id});
    res.json({message:"success",data,name:subCategory.name});
})

export const getByBrand=catchAsyncError(async(req,res,next)=>{
    let {slug}=req.params;
    let brand=await brandModel.findOne({slug})
    if(!brand) return next(new AppError("Not found brand",404))
    let data=await productModel.find({brand:brand._id});
    res.json({message:"success",data,name:brand.name});
})
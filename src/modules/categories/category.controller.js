import slugify from "slugify";
import { categoryModel } from "../../../databases/models/category.model.js";
import AppError from "../../utils/services/AppError.js";
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import {  deleteOne, updateOne } from "../../utils/handlers/refactor.handerl.js";
import ApiFeatures from './../../utils/services/apiFeaturs.js';
import { checkIsExist } from "../../utils/services/checkIsExist.js";
import { removeImage } from "../../utils/services/removefile.js";



export const addCategory = catchAsyncError(async (req, res, next) => {
    let filename;

    if (!req.file) {
        return next(new AppError('Image is required', 400));  
    }

    filename = req.file.filename;  

    let allCategories = await categoryModel.find();
    let isExist = checkIsExist(allCategories, req.body.name, "name");

    if (isExist) {
        removeImage("category",filename);
        return next(new AppError("Category name already exists", 409));
    }

    req.body.slug = slugify(req.body.name);
    req.body.image = filename;
    let brand = new categoryModel(req.body);
    await brand.save();

    res.status(201).json({ message: "success" });
});




export const getAllCategories=catchAsyncError(async(req,res,next)=>{
    let apiFeatures=new ApiFeatures(categoryModel.find(),req.query).pangination().fields().filter().search().sort();
    let data=await apiFeatures.Query
    res.json({message:"success",page:apiFeatures.page,data});
})
export const getAll=catchAsyncError(async(req,res,next)=>{
    let data=await categoryModel.find();
    res.json({message:"success",data});
})

export const getCategoryById=catchAsyncError(async(req,res,next)=>{
    let{id}=req.params
    let data=await categoryModel.findById(id);
    !data && next(new AppError("Not Found Category",404))
    data && res.json({message:"success",data});
})

export const updateCategory = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    
    let category = await categoryModel.findById(id);
    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    if (req.body.name) {
        let allCategories = await categoryModel.find();
        let isExist = checkIsExist(allCategories, req.body.name, "name", id); 

        if (isExist) {
            return next(new AppError("Category name already exists", 409));
        }

        req.body.slug = slugify(req.body.name); 
    }

    if (req.file) {
            if (category.image) {
                const file = category.image.split('\\').pop(); 
                await removeImage("category", file);
            }

        req.body.image = req.file.filename;
    }

    await categoryModel.findByIdAndUpdate(id,{...req.body});

    res.status(200).json({ message: "Category updated successfully" });
});

export const deleteCategory=catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    
    let category = await categoryModel.findByIdAndDelete(id);
    if (!category) {
        return next(new AppError("Category not found", 404));
    }
    if (category.image) {
        removeImage("category", category.image);
    }


    res.status(200).json({ message: "Category Removed successfully" });
});



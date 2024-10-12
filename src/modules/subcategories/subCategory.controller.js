import slugify from "slugify";
import AppError from "../../utils/services/AppError.js";
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import { subCategoryModel } from './../../../databases/models/subcategory.model.js';
import { deleteOne, updateOne } from "../../utils/handlers/refactor.handerl.js";
import ApiFeatures from "../../utils/services/apiFeaturs.js";
import { checkIsExist } from "../../utils/services/checkIsExist.js";
import { removeImage } from "../../utils/services/removefile.js";



export const addSubCategory=catchAsyncError(async(req,res,next)=>{
    if (!req.file) {
        return next(new AppError('image is required', 400));  
    }
    let allSubCategoy=await subCategoryModel.find();
   let isExist= checkIsExist(allSubCategoy, req.body.name,"name")
    if(isExist){
        removeImage("subCategory",req.file.filename)
        return next(new AppError("subCategory name already exsit",409))
    } 
    req.body.slug=slugify(req.body.name);
    req.body.image=req.file.filename;
    let subcat=new subCategoryModel(req.body);
    await subcat.save();
    res.status(201).json({message:"success"})
})




export const getAllSubCategories=catchAsyncError(async(req,res,next)=>{
    var filters={};
    if(req.params && req.params.id){
        filters={
            category:req.params.id
        }
    }
    let apiFeatures=new ApiFeatures(subCategoryModel.find(filters),req.query).pangination().fields().filter().search().sort();
    let data=await apiFeatures.Query.populate("category")
    res.json({message:"success",page:apiFeatures.page,data});
})
export const getAll=catchAsyncError(async(req,res,next)=>{
    let data=await subCategoryModel.find().populate("category");
    res.json({message:"success",data});
})

export const getSubCategoryById=catchAsyncError(async(req,res,next)=>{
    let{id}=req.params
    let data=await subCategoryModel.findById(id);
    !data && next(new AppError("Not Found subCategory",404))
    data && res.json({message:"success",data});
})


export const updateSubCategory = catchAsyncError(async (req, res, next) => {
    const { id } = req.params; 

    let subCategory = await subCategoryModel.findById(id); 
    if (!subCategory) {
        return next(new AppError("Sub-category not found", 404)); 
    }

    if (req.body.name) {
        let allSubCategories = await subCategoryModel.find();
        let isExist = checkIsExist(allSubCategories, req.body.name, "name", id);

        if (isExist) {
            return next(new AppError("Sub-category name already exists", 409)); 
        }

        req.body.slug = slugify(req.body.name);
    }

    if (req.body.categoryId) {
        req.body.category = req.body.categoryId;
        delete req.body.categoryId; 
    }

    if (req.file) {
        if (subCategory.image) {
            await removeImage("subcategory", subCategory.image); 
        }
        
        req.body.image = req.file.filename;
    }

    await subCategoryModel.findByIdAndUpdate(id, { ...req.body }, { new: true });

    res.status(200).json({ message: "Sub-category updated successfully" }); 
});
export const deleteSubCategory=deleteOne(subCategoryModel,"subCategory")

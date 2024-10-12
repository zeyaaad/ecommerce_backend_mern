import fs from 'fs';
import path from 'path';
import slugify from "slugify";
import AppError from "../../utils/services/AppError.js";
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import { productModel } from "../../../databases/models/product.model.js";
import { deleteOne } from '../../utils/handlers/refactor.handerl.js';
import ApiFeatures from '../../utils/services/apiFeaturs.js';
import { categoryModel } from '../../../databases/models/category.model.js';
import { subCategoryModel } from '../../../databases/models/subcategory.model.js';
import { brandModel } from '../../../databases/models/brand.model.js';
const deleteOldImages = (images) => {
    if (Array.isArray(images)) {
        images.forEach((image) => {
            const imagePath = path.join(process.cwd(), `uploads/product/${image.split("\\").pop()}`)
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error(`Error deleting image ${image}: `, err);
                }
            });
        });
    } else {
        const imagePath =  path.join(process.cwd(), `uploads/product/${images}`)
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error(`Error deleting image ${images}: `, err);
            }
        });
    }
};

export const addProduct = catchAsyncError(async(req, res, next) => {
    let { title } = req.body;
    if (title) {
        req.body.slug = slugify(title);
    } 
    if (!req.files.imgCover) {
        return next(new AppError("Product image is required", 400));
    }
    req.body.imgCover = req.files.imgCover[0].filename;
    if (req.files.images) req.body.images = req.files.images.map(ele => ele.filename);
    let product = new productModel(req.body);
    await product.save();
    res.status(201).json({ message: "Success" });
});
 
export const getAllProducts = catchAsyncError(async(req, res, next) => {
    let apiFeatures = new ApiFeatures(productModel.find(), req.query).pangination().sort().search().fields().filter();
    let data = await apiFeatures.Query.populate('category').populate('subCategory').populate('brand');
    res.json({ message: "Success", page: apiFeatures.page, pageCount: apiFeatures.numberPages, data });
});

export const getProductyById = catchAsyncError(async(req, res, next) => {
    let { id } = req.params;
    let data = await productModel.findById(id).populate("category").populate("subCategory").populate("brand");
    if (!data) return next(new AppError("Not Found Product", 404));
    res.json({ message: "Success", data });
});

export const updateProduct = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    if(req.files.imgCover)req.body.imgCover = req.files.imgCover[0].filename;
    if (req.files.images) req.body.images = req.files.images.map(ele => ele.filename);
    const existingProduct = await productModel.findById(id);
    if (!existingProduct){
        return next(new AppError("Product not found", 404));
    }
        
    if (req.body.title) {
        req.body.slug = slugify(req.body.title);
    }

    if (req.files.imgCover) {
        deleteOldImages(existingProduct.imgCover.split("\\").pop());
        req.body.imgCover = req.files.imgCover[0].filename;
    } else {
        delete req.body.imgCover;
    }
 
    if (req.files.images) {
        deleteOldImages(existingProduct.images);
        req.body.images = req.files.images.map(ele => ele.filename);
    }

    const updatedProduct = await productModel.findByIdAndUpdate(id, {...req.body}, { new: true });

    res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
});

export const deleteProduct =catchAsyncError(async(req,res,next)=>{
    let{id}=req.params
    let data=await productModel.findById(id) 
    !data && next(new AppError(`Not Found Product`,404))
    if (data.imgCover)deleteOldImages(data.imgCover);
    if(data.images) deleteOldImages(data.images);
    await productModel.findByIdAndDelete(id);
    data && res.json({message:"success"});
});



export const DeepSeacrh=catchAsyncError(async(req,res,next)=>{
    let value=req.params;
    let products=await productModel.find({
            $or: [
                { title: { $regex: value.value, $options: "i" } },
                { Description: { $regex: value.value, $options: "i" } },
            ]
    });
    let categories=await categoryModel.find({
            $or: [
                { name: { $regex: value.value, $options: "i" } },
            ]
    });
    let subCategories=await subCategoryModel.find({
            $or: [
                { name: { $regex: value.value, $options: "i" } },
            ]
    });
    let brands=await brandModel.find({
            $or: [
                { name: { $regex: value.value, $options: "i" } },
            ]
    });

    res.json({message:"success",data:{products,categories,subCategories,brands}});
})
import slugify from "slugify";
import AppError from "../../utils/services/AppError.js";
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import { brandModel } from './../../../databases/models/brand.model.js';
import { addOne, deleteOne, updateOne } from "../../utils/handlers/refactor.handerl.js";
import ApiFeatures from "../../utils/services/apiFeaturs.js";
import { checkIsExist } from "../../utils/services/checkIsExist.js";
import { removeImage } from "../../utils/services/removefile.js";

export const addBrand=catchAsyncError(async(req,res,next)=>{
    if (!req.file) {
        return next(new AppError('Logo is required', 400));  
    }
    
let allbrands=await brandModel.find();
   let isExist= checkIsExist(allbrands, req.body.name,"name")
    if(isExist){
        removeImage("brand",req.file.filename)
        return next(new AppError("brand name already exsit",409))
    } 
    req.body.slug=slugify(req.body.name);
    req.body.logo=req.file.filename;
    let brand=new brandModel(req.body);
    await brand.save();
    res.status(201).json({message:"success"})
})


export const getAllBrands=catchAsyncError(async(req,res,next)=>{
    let apiFeatures=new ApiFeatures(brandModel.find(),req.query).pangination().fields().filter().search().sort();
    let data=await apiFeatures.Query
    let all=await brandModel.find();
    let NumberOfpages=(all.length/apiFeatures.limit)
    res.json({message:"success",pagesCount:NumberOfpages,limit:apiFeatures.limit,page:apiFeatures.page,data});
})

export const getAll=catchAsyncError(async(req,res,next)=>{
    let data=await brandModel.find();
    res.json({message:"success",data});
})

export const getBrandById=catchAsyncError(async(req,res,next)=>{
    let{id}=req.params
    let data=await brandModel.findById(id);
    !data && next(new AppError("Not Found Brand",404))
    data && res.json({message:"success",data});
})


export const updateBrand = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    let brand = await brandModel.findById(id);
    if (!brand) {
        return next(new AppError("Brand not found", 404));
    }

    if (req.body.name) {
        let allBrands = await brandModel.find();
        let isExist = allBrands.some(b => b.name === req.body.name && b._id.toString() !== id);
        if (isExist) {
            return next(new AppError("Brand name already exists", 409));
        }
        req.body.slug = slugify(req.body.name);
    }

    if (req.file) {
        if (brand.logo) {
            await removeImage("brand", brand.logo);
        }
        req.body.logo = req.file.filename;
    }

    await brandModel.findByIdAndUpdate(id, { ...req.body }, { new: true });

    res.status(200).json({ message: "Brand updated successfully" });
});
export const deleteBrand=deleteOne(brandModel,"brand")



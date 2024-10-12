
import  express from 'express';
import { addSubCategory, deleteSubCategory,getAll, getAllSubCategories, getSubCategoryById, updateSubCategory } from './subCategory.controller.js';
import { valdation } from '../../utils/middleware/valdation.js';
import { addsubCategoryShcema, subCategoryIdSchema, updateSubCategorySchema } from './subCategory.valdation.js';
import { UploadFile } from '../../utils/middleware/fileUpload.js';
import { allowTo, protectRoute } from '../auth/auth.controller.js';



let subCategoryRouter=express.Router({mergeParams:true});


subCategoryRouter.route("/")
    .get(getAllSubCategories)
    .post(protectRoute,allowTo("admin"),UploadFile("subCategory","image"),valdation(addsubCategoryShcema),addSubCategory);
subCategoryRouter.get("/all",protectRoute,getAll)

subCategoryRouter.route("/:id")
    .get(valdation(subCategoryIdSchema),getSubCategoryById)
    .put(protectRoute,allowTo("admin"),UploadFile("subCategory","image"),updateSubCategory)
    .delete(protectRoute,allowTo("admin"),valdation(subCategoryIdSchema),deleteSubCategory);



export default subCategoryRouter
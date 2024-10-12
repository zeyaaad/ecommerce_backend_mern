
import  express from 'express'; 
import { addCategory, deleteCategory,getAll, getAllCategories, getCategoryById, updateCategory } from './category.controller.js';
import { getAllSubCategories } from '../subcategories/subCategory.controller.js';
import { valdation } from '../../utils/middleware/valdation.js';
import { CategoryIdSchema, addCategoryShcema, updateCategorySchema } from './category.valdation.js';
import { UploadFile } from '../../utils/middleware/fileUpload.js';
import { allowTo, protectRoute } from '../auth/auth.controller.js';

let categoryRouter=express.Router();

categoryRouter.get("/:id/subcategory",valdation(CategoryIdSchema),getAllSubCategories)


categoryRouter.route("/")
    .get(getAllCategories)
    .post(protectRoute,allowTo("admin"),UploadFile("category","image"),valdation(addCategoryShcema),addCategory);
categoryRouter.get("/all",protectRoute,getAll)

categoryRouter.route("/:id")
    .get(valdation(CategoryIdSchema),getCategoryById)
    .put(protectRoute,allowTo("admin"), UploadFile("category", "image"),updateCategory)
    .delete(protectRoute,allowTo("admin"),valdation(CategoryIdSchema),deleteCategory);




export default categoryRouter

import  express from 'express';
import { addBrand, deleteBrand, getAllBrands, getBrandById, updateBrand,getAll } from './brand.controller.js';
import { valdation } from '../../utils/middleware/valdation.js';
import { BrandIdSchema, addBrandShcema, updateBrandSchema } from './brand.valdation.js';
import { UploadFile } from '../../utils/middleware/fileUpload.js';
import { allowTo, protectRoute } from '../auth/auth.controller.js';

let brandRouter=express.Router();



brandRouter.route("/")
    .get(getAllBrands)
    .post(protectRoute,allowTo("admin"),UploadFile("brand","logo"),valdation(addBrandShcema),addBrand);
brandRouter.get("/all",protectRoute,getAll)
brandRouter.route("/:id")
    .get(valdation(BrandIdSchema),getBrandById)
    .put(protectRoute,allowTo("admin"),UploadFile("brand","logo"),updateBrand)
    .delete(protectRoute,allowTo("admin"),valdation(BrandIdSchema),deleteBrand);




export default brandRouter
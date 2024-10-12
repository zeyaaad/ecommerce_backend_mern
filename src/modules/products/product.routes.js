import express from 'express'; 
import { addProduct, deleteProduct, getAllProducts, getProductyById, updateProduct,DeepSeacrh } from './product.controller.js';
import { UploadFiles } from '../../utils/middleware/fileUpload.js';
import { allowTo, protectRoute } from '../auth/auth.controller.js';
import { valdation } from '../../utils/middleware/valdation.js';
import { addProductSchema } from './product.valdation.js';

let productRouter = express.Router();

productRouter.route("/")
    .get(getAllProducts)
    .post(
        protectRoute,
        allowTo("admin"),
        UploadFiles("product", [{ name: "imgCover", maxCount: 1 }, { name: "images", maxCount: 8 }]),
        valdation(addProductSchema),
        addProduct
    );

productRouter.get("/search/:value",protectRoute,DeepSeacrh) 

productRouter.route("/:id")
    .get(getProductyById)
    .put(
        protectRoute,
        allowTo("admin"),
        UploadFiles("product", [{ name: "imgCover", maxCount: 1 }, { name: "images", maxCount: 8 }]), 
        updateProduct
    )
    .delete(protectRoute, allowTo("admin"), deleteProduct);

export default productRouter;

import express from "express";
import { getByBrand, getByCategory, getBySubCategory } from "./filter.controller.js";

let filterRouter=express.Router();

filterRouter.get("/category/:slug",getByCategory)
filterRouter.get("/subCategory/:slug",getBySubCategory)
filterRouter.get("/brand/:slug",getByBrand)





export default filterRouter ;
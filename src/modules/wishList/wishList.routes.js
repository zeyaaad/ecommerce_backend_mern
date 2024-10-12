
import  express from 'express';

import { protectRoute } from '../auth/auth.controller.js';
import { addToWishList, clearWishList, deleteFromWishList, getAllWishList } from './wishList.controller.js';
import { valdation } from '../../utils/middleware/valdation.js';
import { addToWishListShcema, deleteFromWishListShcema } from './wishListvaldation.js';

let wishListRouter=express.Router();


wishListRouter.route("/")
    .get(protectRoute,getAllWishList)
    .post(protectRoute,addToWishList)
    .delete(protectRoute,clearWishList)

wishListRouter.route("/:id")
    .delete(protectRoute,valdation(deleteFromWishListShcema),deleteFromWishList);






export default wishListRouter
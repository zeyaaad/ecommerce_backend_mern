
import  express from 'express';
import {protectRoute } from '../auth/auth.controller.js';
import { valdation } from '../../utils/middleware/valdation.js';
import { addCart, applyCoupon, clearCart, deleteFromCart, getCart, updateCart } from './cart.controller.js';
import { addCartShcema, applyCouponSchema, deleteFromCartShcema, updateCartShcema } from './cart.valdation..js';

let cartRouter=express.Router();


cartRouter.route("/")
    .get(protectRoute,getCart)
    .post(protectRoute,valdation(addCartShcema),addCart)
    .delete(protectRoute,clearCart)


cartRouter.route("/:id")
    .put(protectRoute,valdation(updateCartShcema),updateCart)
    .delete(protectRoute,valdation(deleteFromCartShcema),deleteFromCart);

cartRouter.post("/applyCoupon/:code",protectRoute ,applyCoupon);


export default cartRouter

import  express from 'express';
import { allowTo, protectRoute } from '../auth/auth.controller.js';
import { addCoupon, deleteCoupon, getAllCoupons, getCouponById, updateCoupon } from './coupon.controller.js';

let couponRouter=express.Router();


couponRouter.route("/")
    .get(protectRoute,getAllCoupons)
    .post(protectRoute,allowTo("admin"),addCoupon);

couponRouter.route("/:id")
    .get(protectRoute,allowTo("admin"),getCouponById)
    .put(protectRoute,allowTo("admin"),updateCoupon)
    .delete(protectRoute,allowTo("admin"),deleteCoupon);



export default couponRouter
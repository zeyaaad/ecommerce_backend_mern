
import  express from 'express';
import { allowTo, protectRoute } from '../auth/auth.controller.js';
import { valdation } from '../../utils/middleware/valdation.js';
import { cachOrder, getAllOrders, getOwnOrders, onlinePayment, successPayment,getOrderDetilas } from './order.controller.js';

let orderRouter=express.Router();


orderRouter.route("/:id").post(protectRoute,cachOrder);
orderRouter.get("/",protectRoute,getOwnOrders);
orderRouter.get("/all",protectRoute,allowTo("admin"),getAllOrders);
orderRouter.route("/checkout/:id").post(protectRoute,onlinePayment);
orderRouter.route("/success/:id").get(successPayment);
orderRouter.get("/details/:id",getOrderDetilas)



export default orderRouter
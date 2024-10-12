
import  express from 'express';
import { addReview, deleteReview, getAllReviews,
     getReviewById, updateReview,isReviewed } from './review.controller.js';
import { protectRoute } from '../auth/auth.controller.js';
import { valdation } from '../../utils/middleware/valdation.js';
import { UpdateReviewSchema, addReviewSchema, deleteReviewSchema } from './review.valdation.js';

let reviewRouter=express.Router();



reviewRouter.route("/")
    .get(getAllReviews)
    .post(protectRoute,valdation(addReviewSchema),addReview);

reviewRouter.route("/:id")
    .get(getReviewById)
    .put(protectRoute,valdation(UpdateReviewSchema),updateReview)
    .delete(protectRoute,valdation(deleteReviewSchema),deleteReview);

reviewRouter.get("/isReviewed/:product",protectRoute,isReviewed)



export default reviewRouter
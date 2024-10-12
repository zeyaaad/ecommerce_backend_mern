
import  express from 'express';
import { allowTo, protectRoute } from '../auth/auth.controller.js';
import { valdation } from '../../utils/middleware/valdation.js';
import { addMessage, deleteMessage, getAllMessages } from './contact.controller.js';
import { addMessageSchema, deleteMessageSchema } from './contact.valdation.js';

let contactRouter=express.Router();



contactRouter.route("/")
    .get(protectRoute,allowTo("admin"),getAllMessages)
    .post(protectRoute,valdation(addMessageSchema),addMessage);

contactRouter.delete("/:id",protectRoute,allowTo("admin"),valdation(deleteMessageSchema),deleteMessage);




export default contactRouter
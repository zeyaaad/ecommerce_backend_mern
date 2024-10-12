
import  express from 'express';
import { valdation } from '../../utils/middleware/valdation.js';
import { addUser, changePassword, deleteUser, getAllUsers,getUserData, getUserById, updateUser } from './user.controller.js';
import { registerSchema } from '../auth/auth.valdation.js';
import { UserByIdSchema, chagePasswordSchema, updateUserSchema } from './user.valdation.js';
import { allowTo, protectRoute } from '../auth/auth.controller.js';

let userRouter=express.Router();


userRouter.get("/userData",protectRoute,getUserData)

userRouter.route("/")
    .get(protectRoute,allowTo("admin"),getAllUsers)
    .post(protectRoute,allowTo("admin"),valdation(registerSchema),addUser);

userRouter.route("/:id")
    .get(protectRoute,allowTo("admin"),valdation(UserByIdSchema),getUserById)
    .put(protectRoute,allowTo("admin"),valdation(updateUserSchema),updateUser)
    .delete(protectRoute,allowTo("admin"),valdation(UserByIdSchema),deleteUser);

userRouter.patch("/changePassword/:id",protectRoute,allowTo("admin"),valdation(chagePasswordSchema),changePassword)



export default userRouter
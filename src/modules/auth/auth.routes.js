
import express from "express";
import { Login, Register, adminLogin, changePasswrod,ChangeEmail,verifyChangeEmail, changeUserData, checkResetToken, forgetPassword, isAdmin, protectRoute, protectRouteFront, reSendVerfiyEmail, resetPassword, verify } from "./auth.controller.js";
import { valdation } from './../../utils/middleware/valdation.js';
import { cahangePasswordSchema, changeDataSchema, changeEmailSchema, loginSchema, registerSchema, resetPasswordSchema } from "./auth.valdation.js";

const authRouter=express.Router();

authRouter.post("/register",valdation(registerSchema),Register)
authRouter.post("/login",valdation(loginSchema),Login)
authRouter.post("/loginAdmin",valdation(loginSchema),adminLogin)

authRouter.patch("/changePassword",protectRoute,valdation(cahangePasswordSchema),changePasswrod)
authRouter.put("/changeData",protectRoute,valdation(changeDataSchema),changeUserData)
authRouter.get("/protecRoute/:token",protectRouteFront)
authRouter.get("/isAdmin/:token",isAdmin)

authRouter.get("/verfiy/:token",verify)
authRouter.post("/reSendEmail",reSendVerfiyEmail)

authRouter.post("/forgot-password",valdation(changeEmailSchema),forgetPassword)
authRouter.post("/reset-password",valdation(resetPasswordSchema),resetPassword)
authRouter.get("/check-reset-token",checkResetToken)


authRouter.patch("/changeEmail",protectRoute,valdation(changeEmailSchema),ChangeEmail)
authRouter.get("/verifyChangeEmail/:token",protectRoute,verifyChangeEmail)

export default authRouter;
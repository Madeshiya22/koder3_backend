import {Router} from "express";
import { registerValidation,loginValidation } from "../validator/auth.validator.js";
import { register,login,getMe } from "../controllers/auth.controller.js"; 
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerValidation, register);

authRouter.post("/login", loginValidation, login);

authRouter.get("/me", authUser, getMe);

export default authRouter;
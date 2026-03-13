import express from "express";
import { register, getMe } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", register); 
authRouter.get("/getme", getMe);


export default authRouter;
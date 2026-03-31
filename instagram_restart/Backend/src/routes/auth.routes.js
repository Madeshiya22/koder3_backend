import { Router } from "express";
import { registerValidation, loginValidation } from "../validator/auth.validator.js";
import { register, login, getMe, googleCallback } from "../controllers/auth.controller.js";
import passport from "passport";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerValidation, register);

authRouter.post("/login", loginValidation, login);

authRouter.get("/me", authUser, getMe);

// google authentication routes
// /api/auth/google
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// /api/auth/google/callback
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallback,
);

export default authRouter;

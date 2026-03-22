import express from "express";
import { registerValidation } from "../validator/auth.validator.js";
import passport from "passport";
import { register, googleCallback } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register",registerValidation, register);

// router.post("/login", login);
// router.post("/logout", logout);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/login",
  }),
  googleCallback,
);

export default router;

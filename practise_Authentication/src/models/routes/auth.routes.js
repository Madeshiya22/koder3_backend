const express = require("express");
const authRouter = express.Router();
const userModel = require("../models/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const isUserExists = await userModel.findOne({ email });

  if (isUserExists) {
    return res.status(400).json({ message: "email already exists" });
  }
  const user = await userModel.create({
    name,
    email,
    password: crypto.createHash("sha256").update(password).digest("hex"),
  });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  res.cookie("token", token);

  res.status(200).json({
    message: "user registered successfully",
    user: {
      name: user.name,
      email: user.email,
    },
    token,
  });
});

authRouter.get("/get-me", async (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //  console.log(decoded)
  const user = await userModel.findById(decoded.id);

  res.status(200).json({
    name: user.name,
    email: user.email,
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  // console.log(hashedPassword)
  const ispasswordValid = hashedPassword === user.password;
  if (!ispasswordValid) {
    return res.status(401).json({
      message: "invalid password",
    });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  res.cookie("token", token);
  res.json({
    message: "login successful",
    user: {
      name: user.name,
      email: user.email,
    },
  });
});

module.exports = authRouter;

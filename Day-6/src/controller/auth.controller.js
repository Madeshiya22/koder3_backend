import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export async function register(req, res) {
  const { email, password, userType } = req.body;
    const newUser = await userModel.create({
    email,
    password,
    userType,
  });
  const token = jwt.sign({ id: newUser._id,email:newUser.email,userType:newUser.userType }, config.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("mama", token)
  res.status(201).json({ token });
}

export async function getMe(req, res) {
  const { token } = req.cookies;
  const decoded = jwt.verify(token, config.JWT_SECRET);
  const userDetails = await userModel.findById(decoded.id);
  res.status(200).json({ user: userDetails });
}
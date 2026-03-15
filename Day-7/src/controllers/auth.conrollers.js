import userModel from "../models/user.models.js";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  const { email, password, userType } = req.body;

  const newUser = await userModel.create({
    email,
    password,
    userType,
  });
  const token = jwt.sign(
    { id: newUser._id, email: newUser.email, userType: newUser.userType },
    JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  res.cookie("user", token);
  res.status(200).json({
    message: "user registered successfully",
    token,
  });
}

export async function getme(req,res){
    const token = req.cookies;
    const decoded = jwt.verify(token,JWT_SECRET);
    const userDetails = await userModels.findById(decoded.id);
    res.status(201).json({
        message:"user details fetched successfully",
        user:userDetails
    })

}

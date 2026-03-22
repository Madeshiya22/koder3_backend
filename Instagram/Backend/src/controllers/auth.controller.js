import userModel from "../models/user.model";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import cookieparser from "cookie-parser";

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    // Hash the password
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    // Create new user
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id ,email:newUser.email}, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token);


    return res
      .status(201)
      .json({ message: "User registered successfully", success: true,
        user:{
            username: newUser.username,
            email: newUser.email,
            profileImage: newUser.profileImage,
            fullname: newUser.fullname,
            private: newUser.private,
        }
       });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Login user

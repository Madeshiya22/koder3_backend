import usermodel from "../models/user.models.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const register = async (req, res) => {
  const { username, email, password, fullname } = req.body;

  try {
    let existingUser = await usermodel.findOne({
      $or: [{ email }, { username }], // ye array ke andar email ya username dono me se koi bhi match ho to user exist karega isko bolte hai aarays of queries
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: "false" });
    }

    const hassedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const newUser = new usermodel({
      username,
      email,
      password: hassedPassword,
      fullname,
    });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token);

    return res.status(201).json({
      message: "User registered successfully",
      success: "true",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullname: newUser.fullname,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error checking user existence",
      success: "false",
      error: error.message,
    });
  }




};

export const login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  let existingUser
  try {
    existingUser = await usermodel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!existingUser) {
      return res.status(400).json({
        message: "Invalid username, email or password",
        success: "false",
      });
    }

  } catch (error) {
    return res.status(500).json({
      message: "Error checking user existence",
      success: "false",
      error: error.message,
    });

  }
  const hassedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");



  if (hassedPassword !== existingUser.password) {
    return res.status(400).json({
      message: "Invalid username, email or password",
      success: "false",
    });
  }

  const token = jwt.sign({ userId: existingUser._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully",
    success: "true",
    user: {
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
    },
  });
};

export const getMe = async (req, res) => {
  const user = await usermodel.findById(req.user._id);

  if (!user) {
    return res
      .status(404)
      .json({ message: "User not found", success: "false" });
  }

  res.status(200).json({
    message: "User fetched successfully",
    success: "true",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

export async function googleCallback(req, res) {
  const { id, displayName, emails: [{ value: email }] } = req.user;

  let user = await usermodel.findOne({
    $or: [{ email }, { googleId: id }],
  });

  //  If user exists → update googleId (important)
  if (user) {
    if (!user.googleId) {
      user.googleId = id;
      await user.save();
    }
  } else {
    // Create new user
    user = await usermodel.create({
      username: email.split("@")[0],
      email: email,
      fullname: displayName,
      googleId: id,
    });
  }

  // Same token logic
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
  });

  return res.status(200).json({
    message: "User logged in successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
    },
  });
}
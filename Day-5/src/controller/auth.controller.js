import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { config} from '../config/config.js'

export async function register(req, res) {
    const { name, email, password } = req.body;

    const newUser = await userModel.create({
        name,
        email,
        password
    });

    const token = jwt.sign({email: newUser.email, id: newUser._id },config.JWT_SECRET, {
        expiresIn: "1d"
    });

    res.status(201).json({ token });
}

export async function getMe(req, res) {
    const { token} = req.body;
    const decoded = jwt.verify(token,config.JWT_SECRET);
    const userDetails = await userModel.findById(decoded.id);

    res.status(200).json({
        message: "User details fetched successfully",
        user: userDetails
    });
}





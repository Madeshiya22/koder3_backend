import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { config } from "../../config/config.js";

export default function socketAuthMiddleware(socket, next) {
  try {
    const cookies = parse(socket.handshake.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      return next(new Error("No token provided"));
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    socket.user = decoded;

    next();
  } catch (err) {
    next(err);
  }
}
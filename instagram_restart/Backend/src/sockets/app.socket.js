import { Server } from "socket.io";
import app from "../app.js"; 
import http from "http"; 
import { parse } from "cookie"; 
import jwt from "jsonwebtoken"; 
import { config } from "../config/config.js"; 

export default function createSocketServer() {

  // 🔹 Express app ko HTTP server me wrap kiya
  const httpServer = http.createServer(app);

  // 🔹 Socket.IO server create kiya with CORS config
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173", // frontend URL allow
      methods: ["GET", "POST", "PATCH", "DELETE"], // allowed HTTP methods
      credentials: true, // cookies allow karne ke liye
    },
  });

  // Middleware: har socket connection pe authentication check hoga
  io.use((socket, next) => {
    try {
      // 🔹 Client ke cookies extract kiye
      const cookies = parse(socket.handshake.headers.cookie || "");

      // 🔹 Token cookie se nikala
      const token = cookies.token;

      // Agar token nahi hai → reject connection
      if (!token) {
        return next(new Error("Authentication error: No token"));
      }

      // 🔹 JWT verify kiya using secret key
      const decoded = jwt.verify(token, config.JWT_SECRET);

      // 🔹 Decoded user data socket me attach kiya
      socket.user = decoded;

      // Allow connection
      next();

    } catch (err) {
      // Invalid token
      next(new Error("Authentication failed"));
    }
  });

  // 🔌 Jab new client connect hota hai
  io.on("connection", (socket) => {

    // 🔹 Connection log
    console.log(`User connected: ${socket.id}`);

    // 🔹 User ko uske unique room me join karaya (private messaging ke liye)
    socket.join(socket.user.id);

    // Event: jab client message bhejta hai
    socket.on("send_message", ({ message, receiver }) => {

      // Invalid data ignore
      if (!message || !receiver) return;

      // 🔹 Specific user (room) ko message send kiya
      io.to(receiver).emit("receive_message", {
        message,
        sender: socket.user.id, // sender ka id
      });
    });

    // Jab user disconnect hota hai
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  // 🔹 HTTP server + Socket.IO return kiya (server start karne ke liye)
  return { httpServer, io };
}
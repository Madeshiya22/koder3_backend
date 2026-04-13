import { Server } from "socket.io";
import connectDB from "../config/database.js";
import app from "../app.js";
import http from "http";

export default function createSocketServer() {
    const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST","PATCH","DELETE"],
      credentials: true
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
    });

    socket.on("message", (data) => {
      console.log("Message received: " + data);
      io.emit("message", data);
    });

    socket.broadcast.emit("message", data);

  });

  return{ httpServer, io };
}

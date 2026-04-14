import { Server } from "socket.io";
import http from "http";
import socketAuthMiddleware from "./middleware/auth.js";
import messageHandler from "./handlers/message.js";

export default function createSocketServer(app) {
  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  // middleware
  io.use(socketAuthMiddleware);

  // connection
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    console.log(socket.user);

    socket.join(socket.user.id);

    // handlers
    messageHandler(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      socket.leave(socket.user.id);
    });
  });

  return { httpServer, io };
}
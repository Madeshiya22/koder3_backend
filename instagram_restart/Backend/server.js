import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import createSocketServer from "./src/sockets/app.socket.js";

const { httpServer, io } = createSocketServer();


const PORT = process.env.PORT || 3000;

connectDB();

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

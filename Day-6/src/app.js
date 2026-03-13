import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import songsRouter from "./routes/song.routes.js";  
// import imagekitRoutes from "./routes/imagekit.routes.js";

const app = express();


app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/songs", songsRouter);
// app.use("/api/imagekit", imagekitRoutes);


export default app; 
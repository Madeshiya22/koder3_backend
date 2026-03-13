import mongoose from "mongoose";
import { config } from "./config.js";

async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("connected to database");
  } catch (error) {
    console.log("Not connected to database", error);
  }
}

export default connectDB;
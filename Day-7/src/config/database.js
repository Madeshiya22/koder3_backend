import mongoose from "mongoose";
import { config } from "./config.js";

async function connectToDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("connect to DataBase");
  } catch (error) {
    console.error("error connecting to db", error);
  }
}

export default connectToDB;

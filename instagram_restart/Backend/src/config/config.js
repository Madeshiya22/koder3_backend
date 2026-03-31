import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

if (!process.env.CLIENT_ID) {
  throw new Error("CLIENT_ID is not defined in the environment variables");
}

if (!process.env.CLIENT_SECRET) {
  throw new Error("CLIENT_SECRET is not defined in the environment variables");
}

if (!process.env.CALLBACK_URL) {
  throw new Error("CALLBACK_URL is not defined in the environment variables");
}
if (!process.env.IMAGEKIT_PUBLIC_KEY) {
  throw new Error(
    "IMAGEKIT_PUBLIC_KEY is not defined in the environment variables",
  );
}
if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  throw new Error(
    "IMAGEKIT_PRIVATE_KEY is not defined in the environment variables",
  );
}
if (!process.env.IMAGEKIT_URL_ENDPOINT) {
  throw new Error(
    "IMAGEKIT_URL_ENDPOINT is not defined in the environment variables",
  );
}
if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL is not defined in the environment variables");
}

export default {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  CALLBACK_URL: process.env.CALLBACK_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
};

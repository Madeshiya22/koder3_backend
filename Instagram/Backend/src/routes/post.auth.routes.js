import { Router } from "express";
import { uploadImg } from "../controllers/post.controller.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });


const router = Router();

router.post("/upload", upload.array('images',3), uploadImg);

export default router;
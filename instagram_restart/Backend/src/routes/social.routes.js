import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { createStory, getStories, getHomeStories } from "../controllers/story.controller.js";
import { updateProfile } from "../controllers/profile.controller.js";

const router = Router();

router.get("/home", authUser, getHomeStories);
router.get("/stories", authUser, getStories);
router.post("/story", authUser, upload.single("storyImage"), createStory);
router.put("/profile", authUser, upload.single("profileImage"), updateProfile);

export default router;
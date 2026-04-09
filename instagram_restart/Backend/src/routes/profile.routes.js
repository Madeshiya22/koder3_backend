import express from "express";
import { authUser } from "../middleware/auth.middleware.js";
import {
    getUserProfile,
    getUserProfilePosts,
    getUserVideos,
    getBookmarkedPosts,
    bookmarkPost,
    removeBookmark,
    isPostBookmarked
} from "../controllers/profile.controller.js";

const router = express.Router();

// Profile endpoints
router.get("/:userId", authUser, getUserProfile);
router.get("/:userId/posts", authUser, getUserProfilePosts);
router.get("/:userId/videos", authUser, getUserVideos);

// Bookmark endpoints
router.get("/current/bookmarks", authUser, getBookmarkedPosts);
router.post("/:postId/bookmark", authUser, bookmarkPost);
router.delete("/:postId/bookmark", authUser, removeBookmark);
router.get("/:postId/is-bookmarked", authUser, isPostBookmarked);

export default router;

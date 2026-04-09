import express from "express";  
import {authUser} from "../middleware/auth.middleware.js"
import {createPost, getAllPosts, getPostById, deletePost, getUserPosts, likePost, unlikePost} from "../controllers/post.controller.js";
import upload from "../middleware/post.middleware.js";

const router = express.Router();

//POST/ api/posts   /create
router.post("/create", authUser, upload.array("media", 7), createPost);

//GET/ api/posts/user/me - get current user's posts
router.get("/user/me", authUser, getUserPosts);

//GET/ api/posts
router.get("/",authUser, getAllPosts);

//GET/ api/posts/:id
router.get("/:id",authUser, getPostById);

//POST/ api/posts/:id/like
router.post("/:id/like", authUser, likePost);

//POST/ api/posts/:id/unlike
router.post("/:id/unlike", authUser, unlikePost);

//DELETE/ api/posts/:id
router.delete("/:id",authUser, deletePost);


export default router;
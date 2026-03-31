import express from "express";  
import {authUser} from "../middleware/auth.middleware.js"
import {createPost, getAllPosts, getPostById, deletePost} from "../controllers/post.controller.js";
import upload from "../middleware/post.middleware.js";

const router = express.Router();

//POST/ api/posts   /create
router.post("/create", authUser, upload.array("media", 7), createPost);

//GET/ api/posts
router.get("/",authUser, getAllPosts);

//GET/ api/posts/:id
router.get("/:id",authUser, getPostById);

//DELETE/ api/posts/:id
router.delete("/:id",authUser, deletePost);


export default router;
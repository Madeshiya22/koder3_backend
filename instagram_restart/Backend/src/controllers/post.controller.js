import postModel from "../models/post.model.js";
import { uploadFile } from "../services/storage.services.js";

export async function createPost(req, res) {
  try {
    const author = req.user.id;
    const { caption } = req.body;

    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded"
      });
    }

    const media = await Promise.all(
      files.map(async (file) => {
        const result = await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname
        });

        const type = file.mimetype.startsWith("video") ? "video" : "image";

        return {
          url: result.url,
          media_type: type
        };
      })
    );

    const post = await postModel.create({
      caption,
      author,
      media:media.filter(m => m.media_type === "image" || m.media_type === "video")
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Post creation failed"
    });
  }
}

export const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find()
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch posts" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id)
      .populate("author", "username fullname profilePicture");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch post" });
  }
};

export const deletePost = async (req, res) => { 
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await postModel.findByIdAndDelete(req.params.id);

    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete post" });
  }
}
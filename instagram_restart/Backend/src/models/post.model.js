import mongoose from "mongoose";

// const mediaSchema = new mongoose.Schema({
//   url: {
//     type: String,
//     required: true,
//   },
//   type: {
//     type: String,
//     enum: ["image", "video"],
//     required: true,
//   },
// });

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
      maxlength: 2200,
    },
    media: [
      {
        url: {
          type: String,
        },
        media_type: {
          type: String,
          enum: ["image", "video"],
        },
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;

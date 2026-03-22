import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post",
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
	type: {
		type: String,
		enum: ["like", "dislike"],
		default: "like",
	},
});

// Ensure a user can only like or dislike a post once
likeSchema.index({ post: 1, user: 1 }, { unique: true });

const likeModel = mongoose.model("Like", likeSchema);

export default likeModel;

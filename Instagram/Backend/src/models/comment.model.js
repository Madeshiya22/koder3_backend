import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post",
		required: true,
	},
	content: {
		type: String,
		required: true,
		trim: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
	likeCount: {
		type: Number,
		default: 0,
		min: 0,
	},
	replyCount: {
		type: Number,
		default: 0,
		min: 0,
	},
});

commentSchema.add({
	replies: {
		type: [commentSchema],
		default: [],
	},
});

const commentModel = mongoose.model("Comment", commentSchema);

export default commentModel;

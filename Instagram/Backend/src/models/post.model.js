import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
	{
		url: {
			type: String,
			required: true,
			trim: true,
		},
		mediaType: {
			type: String,
			enum: ["image", "video"],
			required: true,
		},
	},
	{ _id: false }
);

const postSchema = new mongoose.Schema({
	caption: {
		type: String,
		trim: true,
		default: "",
	},
	likeCount: {
		type: Number,
		default: 0,
		min: 0,
	},
	commentCount: {
		type: Number,
		default: 0,
		min: 0,
	},
	media: {
		type: [mediaSchema],
		default: [],
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
});

const postModel = mongoose.model("Post", postSchema);

export default postModel;

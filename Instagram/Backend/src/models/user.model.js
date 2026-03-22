import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		profileImage: {
			type: String,
			default: "https://ik.imagekit.io/tsxqf16xv/default%20image.jpg",
			trim: true,
		},
		fullname: {
			type: String,
			required: true,
			trim: true,
		},
		private: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;

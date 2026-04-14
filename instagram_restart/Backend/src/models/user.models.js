import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
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
            required: function () {
                return !this.googleId;
            },
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        bio: {
            type: String,
            default: "",
            maxlength: 160,
        },
        profileImage: {
            type: String,
            default:
                "https://ik.imagekit.io/tsxqf16xv/default%20iage.jpg?updatedAt=1773987137370",
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.virtual("profilePicture").get(function () {
    return this.profileImage;
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

userSchema.index({ username: "text" });

const usermodel = mongoose.model("User", userSchema);

export default usermodel;
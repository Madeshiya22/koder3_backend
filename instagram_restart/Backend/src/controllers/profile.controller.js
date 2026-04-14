import userModel from "../models/user.models.js";
import followModel from "../models/follow.model.js";
import postModel from "../models/post.model.js";
import bookmarkModel from "../models/bookmark.model.js";
import { uploadFile } from "../services/storage.services.js";

/**
 * GET /api/profiles/:userId
 * Get detailed user profile with stats
 */
export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user?.userId || req.user?.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get counts
        const followersCount = await followModel.countDocuments({
            followee: userId,
            status: "accepted"
        });

        const followingCount = await followModel.countDocuments({
            follower: userId,
            status: "accepted"
        });

        const postsCount = await postModel.countDocuments({ author: userId });

        // Check follow status if user is viewing someone else's profile
        let followStatus = null;
        if (currentUserId && currentUserId.toString() !== userId) {
            const followDoc = await followModel.findOne({
                follower: currentUserId,
                followee: userId
            });
            followStatus = followDoc ? followDoc.status : null;
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            user: {
                _id: user._id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                profileImage: user.profileImage,
                profilePicture: user.profileImage,
                bio: user.bio || "",
                posts: postsCount,
                followers: followersCount,
                following: followingCount,
                followStatus: followStatus
            }
        });
    } catch (error) {
        console.error("Profile fetch error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching profile",
            error: error.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id || req.user._id;
        const { bio, fullname } = req.body;

        const update = {};

        if (typeof bio === "string") {
            update.bio = bio;
        }

        if (typeof fullname === "string" && fullname.trim()) {
            update.fullname = fullname.trim();
        }

        if (req.file) {
            const result = await uploadFile({
                buffer: req.file.buffer,
                fileName: req.file.originalname,
                folder: "profiles",
            });
            update.profileImage = result.url;
        }

        const user = await userModel.findByIdAndUpdate(userId, update, {
            new: true,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                profileImage: user.profileImage,
                profilePicture: user.profileImage,
                bio: user.bio || "",
            },
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: error.message,
        });
    }
};

/**
 * GET /api/profiles/:userId/posts
 * Get user's posts with pagination
 */
export const getUserProfilePosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 12 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const posts = await postModel
            .find({ author: userId })
            .populate("author", "username profilePicture")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await postModel.countDocuments({ author: userId });

        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            posts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error("Fetch posts error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching posts",
            error: error.message
        });
    }
};

/**
 * GET /api/profiles/:userId/videos
 * Get user's videos (posts with video media)
 */
export const getUserVideos = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 12 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const posts = await postModel
            .find({
                author: userId,
                "media.media_type": "video"
            })
            .populate("author", "username profilePicture")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await postModel.countDocuments({
            author: userId,
            "media.media_type": "video"
        });

        return res.status(200).json({
            success: true,
            message: "Videos fetched successfully",
            posts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error("Fetch videos error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching videos",
            error: error.message
        });
    }
};

/**
 * GET /api/profiles/current/bookmarks
 * Get current user's bookmarked posts
 */
export const getBookmarkedPosts = async (req, res) => {
    try {
        const currentUserId = req.user.userId || req.user.id;
        const { page = 1, limit = 12 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const bookmarks = await bookmarkModel
            .find({ user: currentUserId })
            .populate({
                path: "post",
                populate: {
                    path: "author",
                    select: "username profilePicture"
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await bookmarkModel.countDocuments({ user: currentUserId });

        const posts = bookmarks.map(b => b.post);

        return res.status(200).json({
            success: true,
            message: "Bookmarks fetched successfully",
            posts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error("Fetch bookmarks error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching bookmarks",
            error: error.message
        });
    }
};

/**
 * POST /api/posts/:postId/bookmark
 * Bookmark a post
 */
export const bookmarkPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId || req.user.id;

        // Check if post exists
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check if already bookmarked
        const existing = await bookmarkModel.findOne({
            user: userId,
            post: postId
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Post already bookmarked"
            });
        }

        // Create bookmark
        const bookmark = await bookmarkModel.create({
            user: userId,
            post: postId
        });

        return res.status(201).json({
            success: true,
            message: "Post bookmarked successfully",
            bookmark
        });
    } catch (error) {
        console.error("Bookmark error:", error);
        return res.status(500).json({
            success: false,
            message: "Error bookmarking post",
            error: error.message
        });
    }
};

/**
 * DELETE /api/posts/:postId/bookmark
 * Remove bookmark
 */
export const removeBookmark = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId || req.user.id;

        const result = await bookmarkModel.findOneAndDelete({
            user: userId,
            post: postId
        });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Bookmark not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Bookmark removed successfully"
        });
    } catch (error) {
        console.error("Remove bookmark error:", error);
        return res.status(500).json({
            success: false,
            message: "Error removing bookmark",
            error: error.message
        });
    }
};

/**
 * GET /api/posts/:postId/is-bookmarked
 * Check if post is bookmarked by current user
 */
export const isPostBookmarked = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId || req.user.id;

        const bookmark = await bookmarkModel.findOne({
            user: userId,
            post: postId
        });

        return res.status(200).json({
            success: true,
            isBookmarked: !!bookmark
        });
    } catch (error) {
        console.error("Check bookmark error:", error);
        return res.status(500).json({
            success: false,
            message: "Error checking bookmark",
            error: error.message
        });
    }
};

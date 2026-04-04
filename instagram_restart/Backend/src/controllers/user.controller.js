import userModel from "../models/user.models.js";
import followModel from "../models/follow.model.js";

/**
 * GET /api/users/search?q=abhi
 */

export const searchUser = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(200).json([]);
        }

        const users = await userModel.aggregate([
            {
                $search: {
                    index: "default",
                    autocomplete: {
                        query: q,
                        path: "username",
                    }
                }
            },
            {
                $project: {
                    username: 1,
                    fullname: 1,
                    profilePicture: 1,
                    score: { $meta: "searchScore" }
                }
            }
        ]);

        res.status(200).json(users);
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({
            message: "Users fetch failed",
            error: error.message
        });
    }
}


export const followUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const isUserExist = await userModel.findById(userId);

        if (!isUserExist) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            })
        }

        if (userId === currentUserId.toString()) {
            return res.status(400).json({
                message: "You cannot follow yourself",
                success: false,
            })
        }

        const alreadyFollowing = await followModel.findOne({
            follower: currentUserId,
            followee: userId
        })

        if (alreadyFollowing) {
            return res.status(400).json({
                message: "You are already following this user",
                success: false,
            })
        }

        const follow = await followModel.create({
            follower: currentUserId,
            followee: userId,
        })

        return res.status(200).json({
            message: "Follow request sent successfully",
            success: true,
            follow
        })
    } catch (error) {
        console.error("Follow Error:", error);
        res.status(500).json({
            message: "Failed to follow user",
            error: error.message,
            success: false
        });
    }
}
import mongoose from "mongoose";
import followModel from "../models/follow.model.js";
import messageModel from "../models/message.model.js";

export const getUsers = async (req, res) => {
  try {
        const loggedInUserId = req.user?.userId || req.user?.id || req.user?._id;

        if (!loggedInUserId) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false,
            });
        }

    const users = await followModel.aggregate(
      [
            {
                $match: {
                    $or: [
                        { followee: new mongoose.Types.ObjectId(loggedInUserId) },
                        { follower: new mongoose.Types.ObjectId(loggedInUserId) }
                    ],
                    status: 'accepted'
                }
            },
            {
                $addFields: {
                    user: {
                        $cond: {
                            if: {
                                $eq: [ '$follower', new mongoose.Types.ObjectId(loggedInUserId) ]
                            },
                            then: '$followee',
                            else: '$follower'
                        }
                    }
                }
            },
            { $project: { user: 1 } },
            {
                $group: {
                    _id: '$user',
                    user: { $first: '$$ROOT' }
                }
            },
            {
                $project: {
                    _id: '$user._id',
                    user: '$user.user'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: '$user._id',
                    username: '$user.username',
                    profilePicture: '$user.profilePicture'
                }
            }
                ]);

    res.status(200).json({
      message: "Users fetched successfully",
            success: true,
      users
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
    try {
        const senderId = req.user?.userId || req.user?.id || req.user?._id;
        const receiverId = req.params.userId;

        if (!senderId || !receiverId) {
            return res.status(400).json({
                success: false,
                message: "Sender and receiver are required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
            });
        }

        const [senderToReceiver, receiverToSender] = await Promise.all([
            followModel.findOne({
                follower: senderId,
                followee: receiverId,
                status: "accepted",
            }),
            followModel.findOne({
                follower: receiverId,
                followee: senderId,
                status: "accepted",
            }),
        ]);

        if (!senderToReceiver || !receiverToSender) {
            return res.status(403).json({
                success: false,
                message: "Only mutually accepted followers can chat",
            });
        }

        const messages = await messageModel
            .find({
                $or: [
                    { sender: senderId, receiver: receiverId },
                    { sender: receiverId, receiver: senderId },
                ],
            })
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            messages,
        });
    } catch (error) {
        console.error("Get messages error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching messages",
            error: error.message,
        });
    }
};


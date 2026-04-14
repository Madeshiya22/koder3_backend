import userModel from "../models/user.models.js";
import followModel from "../models/follow.model.js";
import mongoose from "mongoose";
import postModel from "../models/post.model.js";

function getCurrentUserId(req) {
  return req.user?.userId || req.user?.id || req.user?._id;
}

function serializeUser(user) {
  return {
    _id: user._id,
    username: user.username,
    fullname: user.fullname,
    email: user.email,
    profileImage: user.profileImage,
    profilePicture: user.profileImage,
    bio: user.bio || "",
    followers: user.followers?.length || 0,
    following: user.following?.length || 0,
  };
}

async function syncAcceptedRelation(followerId, followeeId) {
  await userModel.updateOne(
    { _id: followerId },
    { $addToSet: { following: followeeId } },
  );
  await userModel.updateOne(
    { _id: followeeId },
    { $addToSet: { followers: followerId } },
  );
}

async function removeAcceptedRelation(followerId, followeeId) {
  await userModel.updateOne(
    { _id: followerId },
    { $pull: { following: followeeId } },
  );
  await userModel.updateOne(
    { _id: followeeId },
    { $pull: { followers: followerId } },
  );
}

export const searchUser = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = getCurrentUserId(req);

    if (!q) {
      return res.status(400).json({
        message: "Search query is required",
        users: [],
      });
    }

    const users = await userModel
      .find({
        username: { $regex: q, $options: "i" },
        _id: { $ne: currentUserId },
      })
      .select("username fullname profileImage bio")
      .limit(20);

    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const followDoc = await followModel.findOne({
          follower: currentUserId,
          followee: user._id,
        });

        return {
          _id: user._id,
          username: user.username,
          fullname: user.fullname,
          profilePicture: user.profileImage,
          profileImage: user.profileImage,
          bio: user.bio || "",
          followStatus: followDoc ? followDoc.status : null,
        };
      }),
    );

    res.status(200).json({
      message: "Users fetched successfully",
      users: usersWithStatus,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      message: "Error searching users",
      error: error.message,
      users: [],
    });
  }
};

export const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = getCurrentUserId(req);

    const isUserExist = await userModel.findById(userId);

    if (!isUserExist) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (String(userId) === String(currentUserId)) {
      return res.status(400).json({
        message: "You cannot follow yourself",
        success: false,
      });
    }

    const alreadyFollowing = await followModel.findOne({
      follower: currentUserId,
      followee: userId,
    });

    if (alreadyFollowing) {
      return res.status(400).json({
        message: "You are already following this user",
        success: false,
      });
    }

    const reverseRelation = await followModel.findOne({
      follower: userId,
      followee: currentUserId,
      status: "accepted",
    });

    const follow = await followModel.create({
      follower: currentUserId,
      followee: userId,
      status: reverseRelation ? "accepted" : "pending",
    });

    if (follow.status === "accepted") {
      await syncAcceptedRelation(currentUserId, userId);
    }

    return res.status(200).json({
      message: follow.status === "accepted" ? "Followed successfully" : "Follow request sent successfully",
      success: true,
      follow,
    });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({
      message: "Error sending follow request",
      success: false,
      error: error.message,
    });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = getCurrentUserId(req);

    const followDoc = await followModel.findOneAndDelete({
      follower: currentUserId,
      followee: userId,
    });

    if (!followDoc) {
      return res.status(404).json({
        message: "Follow relationship not found",
        success: false,
      });
    }

    if (followDoc.status === "accepted") {
      await removeAcceptedRelation(currentUserId, userId);
    }

    return res.status(200).json({
      message: "Unfollowed successfully",
      success: true,
    });
  } catch (error) {
    console.error("Unfollow error:", error);
    return res.status(500).json({
      message: "Error unfollowing user",
      success: false,
      error: error.message,
    });
  }
};

export const getFollowRequests = async (req, res) => {
  const loggedInUserId = getCurrentUserId(req);

  const requests = await followModel
    .find({
      followee: loggedInUserId,
      status: "pending",
    })
    .populate("follower", "username profileImage bio");

  return res.status(200).json({
    message: "Follow requests fetched successfully",
    success: true,
    requests,
  });
};

export const acceptFollowRequest = async (req, res) => {
  const { requestId } = req.params;
  const loggedInUserId = getCurrentUserId(req);

  const followRequest = await followModel.findOne({
    _id: requestId,
    status: "pending",
    followee: loggedInUserId,
  });

  if (!followRequest) {
    return res.status(404).json({
      message: "Follow request not found",
      success: false,
    });
  }

  followRequest.status = "accepted";
  await followRequest.save();
  await syncAcceptedRelation(followRequest.follower, followRequest.followee);

  return res.status(200).json({
    message: "Follow request accepted successfully",
    success: true,
  });
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || getCurrentUserId(req);

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const followersCount = await followModel.countDocuments({
      followee: userId,
      status: "accepted",
    });

    const followingCount = await followModel.countDocuments({
      follower: userId,
      status: "accepted",
    });

    const postsCount = await postModel.countDocuments({
      author: userId,
    });

    const currentUserId = getCurrentUserId(req);
    let followStatus = null;

    if (currentUserId && String(currentUserId) !== String(userId)) {
      const followDoc = await followModel.findOne({
        follower: currentUserId,
        followee: userId,
      });
      followStatus = followDoc ? followDoc.status : null;
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      success: true,
      user: {
        ...serializeUser(user),
        posts: postsCount,
        followers: followersCount,
        following: followingCount,
        followStatus,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return res.status(500).json({
      message: "Error fetching profile",
      success: false,
      error: error.message,
    });
  }
};

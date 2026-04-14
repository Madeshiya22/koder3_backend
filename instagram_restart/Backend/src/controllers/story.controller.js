import storyModel from "../models/story.model.js";
import followModel from "../models/follow.model.js";
import userModel from "../models/user.models.js";
import { uploadFile } from "../services/storage.services.js";

function getCurrentUserId(req) {
  return req.user?.userId || req.user?.id || req.user?._id;
}

async function getMutualFollowerIds(currentUserId) {
  const following = await followModel.find({
    follower: currentUserId,
    status: "accepted",
  }).select("followee");

  const followingIds = following.map((item) => item.followee.toString());

  if (followingIds.length === 0) {
    return [];
  }

  const mutualRelations = await followModel.find({
    follower: { $in: followingIds },
    followee: currentUserId,
    status: "accepted",
  }).select("follower");

  return mutualRelations.map((item) => item.follower.toString());
}

function serializeStory(story) {
  return {
    _id: story._id,
    imageUrl: story.imageUrl,
    createdAt: story.createdAt,
    expiresAt: story.expiresAt,
    user: {
      _id: story.user?._id,
      username: story.user?.username,
      fullname: story.user?.fullname,
      profileImage: story.user?.profileImage,
      profilePicture: story.user?.profileImage,
    },
  };
}

function groupStoriesByUser(stories) {
  const grouped = new Map();

  stories.forEach((story) => {
    const userId = story.user?._id?.toString();
    if (!userId) {
      return;
    }

    if (!grouped.has(userId)) {
      grouped.set(userId, {
        user: {
          _id: story.user?._id,
          username: story.user?.username,
          fullname: story.user?.fullname,
          profileImage: story.user?.profileImage,
          profilePicture: story.user?.profileImage,
        },
        stories: [],
        latestCreatedAt: story.createdAt,
      });
    }

    const bucket = grouped.get(userId);
    bucket.stories.push(serializeStory(story));

    if (new Date(story.createdAt) > new Date(bucket.latestCreatedAt)) {
      bucket.latestCreatedAt = story.createdAt;
    }
  });

  return Array.from(grouped.values())
    .sort((a, b) => new Date(b.latestCreatedAt) - new Date(a.latestCreatedAt))
    .map(({ latestCreatedAt, ...payload }) => payload);
}

async function fetchStoriesByUsers(userIds) {
  return storyModel
    .find({
      user: { $in: userIds },
      expiresAt: { $gt: new Date() },
    })
    .populate("user", "username fullname profileImage")
    .sort({ createdAt: -1 });
}

export const createStory = async (req, res) => {
  try {
    const userId = getCurrentUserId(req);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Story image is required",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const result = await uploadFile({
      buffer: req.file.buffer,
      fileName: req.file.originalname,
      folder: "stories",
    });

    const story = await storyModel.create({
      user: userId,
      imageUrl: result.url,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const populatedStory = await story.populate("user", "username fullname profileImage");

    return res.status(201).json({
      success: true,
      message: "Story uploaded successfully",
      story: serializeStory(populatedStory),
    });
  } catch (error) {
    console.error("Story create error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating story",
      error: error.message,
    });
  }
};

export const getStories = async (req, res) => {
  try {
    const currentUserId = getCurrentUserId(req);
    const mutualIds = await getMutualFollowerIds(currentUserId);

    const stories = await fetchStoriesByUsers(mutualIds);
    const ownStories = await fetchStoriesByUsers([currentUserId]);

    return res.status(200).json({
      success: true,
      stories: groupStoriesByUser(stories),
      ownStories: ownStories.map(serializeStory),
    });
  } catch (error) {
    console.error("Get stories error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching stories",
      stories: [],
    });
  }
};

export const getHomeStories = async (req, res) => {
  return getStories(req, res);
};

export const getStoriesByUserId = async (req, res) => {
  try {
    const currentUserId = getCurrentUserId(req);
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    if (userId.toString() !== currentUserId.toString()) {
      const mutualIds = await getMutualFollowerIds(currentUserId);
      if (!mutualIds.includes(userId.toString())) {
        return res.status(403).json({
          success: false,
          message: "You cannot view stories for this user",
          stories: [],
        });
      }
    }

    const stories = await fetchStoriesByUsers([userId]);

    return res.status(200).json({
      success: true,
      stories: stories.map(serializeStory),
    });
  } catch (error) {
    console.error("Get user stories error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user stories",
      stories: [],
    });
  }
};
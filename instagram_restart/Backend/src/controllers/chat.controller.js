import followModel from "../models/follow.model.js";

export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const user = await followModel
      .find({
        $or: [{ follower: loggedInUserId },
             { followee: loggedInUserId }],
        status: "accepted",
      })
      .populate("follower followee", "username");

    const users = user.map((follow) => {
      if (follow.follower._id.toString() === loggedInUserId.toString()) {
        return follow.followee;
      } else {
        return follow.follower;
      }
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

import followModel from "../models/follow.model.js";

export const getUsers = async (req, res) => {
  try {
    const username = req.user.username; // 🔥 dynamic user

    const users = await followModel.aggregate([
      {
        $match: {
          status: "accepted",
          $or: [
            { followee: username },
            { follower: username }
          ]
        }
      },
      {
        $addFields: {
          user: {
            $cond: {
              if: { $eq: ['$follower', username] },
              then: '$followee',
              else: '$follower'
            }
          }
        }
      },
      {
        $group: {
          _id: "$user"
        }
      },
      {
        $project: {
          _id: 0,
          user: "$_id"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "username",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: "$user._id",
          username: "$user.username",
          profilePicture: "$user.profilePicture"
        }
      }
    ]);

    res.status(200).json(users);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

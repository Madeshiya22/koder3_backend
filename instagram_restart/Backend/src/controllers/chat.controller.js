import followModel from "../models/follow.model.js";

export const getUsers = async (req, res) => {
  try {
    const username = req.user.username; // dynamic user

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
      success: "true",
      users
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


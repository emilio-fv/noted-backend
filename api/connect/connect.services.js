// Imports
const { User } = require('../../models/user');

// Get users by search query
const getUsersByQuery = async (searchQuery) => {
    const regex = new RegExp(searchQuery, 'i');

    const foundUsers = await User.find({
        $or: [
            { username: { $regex: regex } },
            { email: { $regex: regex } },
        ]
    },
        'username'
    );

    return foundUsers;
};

// Get user's profile data by username
const getUsersProfileDataByUsername = async (username) => {
    const foundUser = await User.findOne({ username: username }, { password: 0, }).populate('favorites');

    return foundUser;
};

// Follow user
const followUser = async (loggedInUserId, userIdToFollow) => {
    console.log(loggedInUserId);
    console.log(userIdToFollow);

    const updatedLoggedInUser = await User.findOneAndUpdate(
        { _id: loggedInUserId }, 
        { $push: { following: userIdToFollow } },
        { new: true }
    );

    const updatedUserToFollow = await User.findOneAndUpdate(
        { _id: userIdToFollow }, 
        { $push: { followers: loggedInUserId }},
        { new: true }
    )

    return updatedLoggedInUser;
};

// Unfollow user
const unfollowUser = async (loggedInUserId, userIdToUnfollow) => {
    const updatedLoggedInUser = await User.findOneAndUpdate(
        { _id: loggedInUserId }, 
        { $pull: { following: userIdToUnfollow }},
        { new: true }
    )

    await User.findOneAndUpdate(
        { _id: userIdToUnfollow }, 
        { $pull: { followers: loggedInUserId }},
        { new: true }
    )

    return updatedLoggedInUser;
};

// Exports
module.exports = {
    getUsersByQuery,
    getUsersProfileDataByUsername,
    followUser,
    unfollowUser,
};
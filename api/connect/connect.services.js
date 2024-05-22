// Imports
const { User } = require('../../models/user');

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

const getUsersProfileDataByUsername = async (username) => {
    const foundUser = await User.findOne({ username: username }, { password: 0, }).populate('favorites');

    return foundUser;
};

const followUser = async (loggedInUserId, userIdToFollow) => {
    const updatedLoggedInUser = await User.findOneAndUpdate(
        { _id: loggedInUserId }, 
        { $push: { following: userIdToFollow }}
    )

    await User.findOneAndUpdate(
        { _id: userIdToFollow }, 
        { $push: { followers: loggedInUserId }}
    )

    return updatedLoggedInUser;
}

// Exports
module.exports = {
    getUsersByQuery,
    getUsersProfileDataByUsername,
    followUser,
};
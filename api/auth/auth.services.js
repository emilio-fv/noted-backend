// Imports
const { User } = require('../../models/user');

// Create user
const createUser = async (data) => {
    const newUser = await User.create(data);
    return newUser;
};

// Get user by email
const getUserByEmail = async (email) => {
    const foundUser = await User.find({ email: email });
    return foundUser;
};

// Get user by username
const getUserByUsername = async (username) => {
    const foundUser = await User.find({ username: username });
    return foundUser;
};

// Get user by id
const getUserById = async (userId) => {
    const foundUser = await User.findById(userId);
    return foundUser;
}

// Get all users
const getAllUsers = async () => {
    const allUsers = await User.find();
    return allUsers;
};

const addFavoriteToUserProfile = async (userId, reviewData) => {
    const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { favorites: reviewData }}
    )

    return updatedUser;
};

const removeFavoriteFromUserProfile = async (userId, reviewId) => {
    const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { favorites: { _id: reviewId } }}
    )

    return updatedUser;
};

// Exports
module.exports = {
    createUser,
    getUserByEmail,
    getUserByUsername,
    getUserById,
    getAllUsers,
    addFavoriteToUserProfile,
    removeFavoriteFromUserProfile
};
// Imports 
const { Review } = require('../../models/review');
const { User } = require('../../models/user');

// Create review
const createReview = async (reviewData) => {
    // Create review
    const newReview = await Review.create(reviewData);

    // Return new review
    return newReview;
};

// Get logged in user's reviews
const getLoggedInUsersReviews = async (userId) => {
    // Query database
    const reviews = await Review.find({ 'author.userId': userId }).sort({ createdAt: -1 });

    // Return reviews
    return reviews;
};

// Get following user's reviews
const getFollowingUsersReviews = async (userId) => {
    const foundUser = await User.findById(userId);

    const reviews = await Review.find({ 'author.userId': { $in: foundUser.following }});

    return reviews;
};

// Get review by review id
const getReviewById = async (reviewId) => {
    const foundReview = await Review.findById(reviewId);

    return foundReview;
};

// Get reviews by album id
const getReviewsByAlbumId = async (albumId) => {
    const foundReviews = await Review.find({ albumId: albumId });

    return foundReviews;
};

// Get reviews by artist id
const getReviewsByArtistId = async (artistId) => {
    const foundReviews = await Review.find({ artistId: artistId });

    return foundReviews;
};

// Get reviews by username
const getReviewsByUsername = async (username) => {
    const foundReviews = await Review.find({ 'author.username': username });

    return foundReviews;
};

// Update review by review id
const updateReviewById = async (reviewId, reviewData) => {
    const updatedReview = await Review.findByIdAndUpdate(reviewId, reviewData, { new: true });

    return updatedReview;
};

// Update user's review stats
const updateUsersReviewStats = async (userId, reviewStats) => {
    const foundUser = await User.findById(userId);

    await foundUser.updateReviewStats(reviewStats);

    await foundUser.save();

    return;
}

// Delete review by review id
const deleteReviewById = async (reviewId) => {
    const deletedReview = await Review.deleteOne({ _id: reviewId });

    return deletedReview
};

// Exports
module.exports = {
    createReview,
    getLoggedInUsersReviews,
    getFollowingUsersReviews,
    getReviewById,
    getReviewsByAlbumId,
    getReviewsByArtistId,
    getReviewsByUsername,
    updateReviewById,
    updateUsersReviewStats,
    deleteReviewById,
};
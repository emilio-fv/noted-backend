// Imports 
const { Review } = require('../../models/review');

const createReview = async (reviewData) => {
    // Create review
    const newReview = await Review.create(reviewData);

    // Return new review
    return newReview;
};

const getLoggedInUsersReviews = async (userId) => {
    // Query database
    const reviews = await Review.find({ 'author.userId': userId }).sort({ createdAt: -1 });

    // Return reviews
    return reviews;
};

const getReviewById = async (reviewId) => {
    const foundReview = await Review.findById(reviewId);

    return foundReview;
};

const deleteReviewById = async (reviewId) => {
    const deletedReview = await Review.deleteOne({ _id: reviewId });

    return deletedReview
}

// Exports
module.exports = {
    createReview,
    getLoggedInUsersReviews,
    getReviewById,
    deleteReviewById,
};
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

// Exports
module.exports = {
    createReview,
    getLoggedInUsersReviews,
};
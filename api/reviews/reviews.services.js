// Imports 
const { Review } = require('../../models/review');

const createReview = async (reviewData) => {
    // Create review
    const newReview = await Review.create({
        ...reviewData,
        albumImages: [
            { url: 'test', height: '300', width:'300' },
            { url: 'test', height: '300', width:'300' },
            { url: 'test', height: '300', width:'300' },
        ],
    });

    // Return new review
    return newReview;
};

const getLoggedInUsersReviews = async (userId) => {
    // Query database
    const reviews = await Review.find({ 'author.userId': userId });

    // Return reviews
    return reviews;
};

// Exports
module.exports = {
    createReview,
    getLoggedInUsersReviews,
};
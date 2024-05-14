// Imports 
const { Review } = require('../../models/review');
const { User } = require('../../models/user');

const createReview = async (reviewData) => {
    // Create review
    const newReview = await Review.create(reviewData);

    // Update user's reviews field
    await User.findByIdAndUpdate(reviewData.author, {
        $push: { reviews: newReview._id }}
    );

    // Return new review
    return newReview;
};

// Exports
module.exports = {
    createReview
};
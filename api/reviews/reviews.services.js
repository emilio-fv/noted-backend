// Imports 
const { Types } = require('mongoose');
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
const getLoggedInUsersReviews = async (userIdStr) => {
    const userId = Types.ObjectId.createFromHexString(userIdStr);

    // Configure aggregate pipeline
    const aggregatePipeline = [
        { 
            $match: { 'author.userId': userId },
        },
        {            
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'reviewId',
                as: 'comments'
            }
        }
    ];

    // Aggregate data from comments and reviews collection
    const reviews = await Review.aggregate(aggregatePipeline);

    // Return reviews
    return reviews;
};

// Get following user's reviews
const getFollowingUsersReviews = async (userIdStr) => {
    const userId = Types.ObjectId.createFromHexString(userIdStr);
    const foundUser = await User.findById(userId);

    // Configure aggregate pipeline
    const aggregatePipeline = [
        {
            $match: { 'author.userId': { $in: foundUser.following } }
        },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'reviewId',
                as: 'comments'
            }
        }
    ]

    // Aggregate data from comments and reviews collection
    const reviews = await Review.aggregate(aggregatePipeline);

    return reviews;
};

// Get review by review id
const getReviewById = async (reviewIdStr) => {
    const reviewId = Types.ObjectId.createFromHexString(reviewIdStr);

    // Configure aggregate pipeline
    const aggregatePipeline = [
        {
            $match: { '_id': reviewId }
        },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'reviewId',
                as: 'comments'
            }
        }
    ]

    const foundReview = await Review.aggregate(aggregatePipeline);

    return foundReview.length > 0 ? foundReview[0] : null;
};

// Get reviews by album id
const getReviewsByAlbumId = async (albumId) => {
    // Configure aggregate pipeline
    const aggregatePipeline = [
        { 
            $match: { 'albumId': albumId },
        },
        {            
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'reviewId',
                as: 'comments'
            }
        }
    ];

    const foundReviews = await Review.aggregate(aggregatePipeline);

    return foundReviews;
};

// Get reviews by artist id
const getReviewsByArtistId = async (artistId) => {
    // TODO aggregate
    const aggregatePipeline = [
        { 
            $match: { 'artistId': artistId },
        },
        {            
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'reviewId',
                as: 'comments'
            }
        }
    ];

    const foundReviews = await Review.aggregate(aggregatePipeline);

    return foundReviews;
};

// Get reviews by username
const getReviewsByUsername = async (username) => {
    // TODO aggregate
    const aggregatePipeline = [
        { 
            $match: { 'author.username': username },
        },
        {            
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'reviewId',
                as: 'comments'
            }
        }
    ];

    const foundReviews = await Review.aggregate(aggregatePipeline);

    return foundReviews;
};

// Update review by review id
const updateReviewById = async (reviewId, reviewData) => {
    const updatedReview = await Review.findByIdAndUpdate(reviewId, reviewData, { new: true });

    return updatedReview;
};

// Update user's review stats
const updateUsersReviewStats = async (userId, reviewStats) => {
    // Update review stats based on type
        // If add -> { type: 'add', year: 'year' }
        // If remove -> { type: 'remove', year: 'year' }
        // If update -> { type: 'update', old: 'year', new: 'year }
    const foundUser = await User.findById(userId);

    let updatedStats = {...foundUser.reviewStats};

    switch (reviewStats.type) {
        case 'add':
            // add 1 to lifetime, 
            updatedStats.lifetime++;
            // add 1 to the year -> check if year has been set & update
            if (updatedStats.byYear.get(reviewStats.year)) {
                updatedStats.byYear.set(reviewStats.year, updatedStats.byYear.get(reviewStats.year) + 1)
            } else {
                updatedStats.byYear.set(reviewStats.year, 1);
            }
            break;
        case 'remove':
            // remove 1 from lifetime 
            updatedStats.lifetime--;
            // remove 1 from the year
            updatedStats.byYear.set(reviewStats.year, updatedStats.byYear.get(reviewStats.year) - 1 );
            break;
        case 'update':
            // add 1 to the new year
            updatedStats.byYear.set(reviewStats.old, updatedStats.byYear.get(reviewStats.old) - 1 );
            // remove 1 from the old year
            updatedStats.byYear.set(reviewStats.new, updatedStats.byYear.get(reviewStats.new) + 1 );
            break;
        default:
            break;
    }

    await User.updateOne({ _id: userId }, {
        reviewStats: updatedStats
    });

    return;
};

// Like review
const likeReview = async (reviewId, username) => {
    const updatedReview = await Review.findByIdAndUpdate(reviewId, 
        { $addToSet: { likes: username } },
        { new: true }
    );

    return updatedReview;
};

// Unlike review
const unlikeReview = async (reviewId, username) => {
    const foundReview = await Review.findById(reviewId);

    const updatedLikes = foundReview.likes.filter((item) => item !== username);

    const updatedReview = await Review.findByIdAndUpdate(reviewId, 
        { likes: updatedLikes },
        { new: true }
    );

    return updatedReview;
};

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
    likeReview,
    unlikeReview,
    deleteReviewById,
};
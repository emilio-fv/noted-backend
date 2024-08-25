// Imports
const logger = require('../../utils/logger.util');
const { 
    getUserById,
    addFavoriteToUserProfile,
    removeFavoriteFromUserProfile
 } = require('../auth/auth.services');
const { deleteManyComments } = require('../comments/comments.services');
const { 
    createReview, 
    getLoggedInUsersReviews,
    getReviewById,
    deleteReviewById,
    updateReviewById,
    getReviewsByAlbumId,
    getReviewsByArtistId,
    getReviewsByUsername,
    updateUsersReviewStats,
    getFollowingUsersReviews,
    likeReview,
    unlikeReview,
} = require('./reviews.services');

// Create review
const handleCreateReview = async (req, res) => {
    logger.info('Creating review...');

    try {
        const decodedToken = req.decoded;

        const authorData = await getUserById(decodedToken.userId);

        const reviewData = {
            ...req.body,
            author: {
                userId: authorData._id,
                username: authorData.username,
            }
        };

        const response = await createReview(reviewData).then(async (response) => {
            // Update user's review stats
            const parsedDate = req.body.date.split('/');
            const year = parsedDate[2];
            await updateUsersReviewStats(decodedToken.userId, {
                type: 'add',
                year: year,
            })

            return response;
        });

        // Add to favorites if needed
        if (reviewData.favorite) {
            await addFavoriteToUserProfile(decodedToken.userId, { 
                artist: reviewData.artist,
                artistId: reviewData.artistId,
                album: reviewData.album,
                albumId: reviewData.albumId,
                rating: reviewData.rating,
                albumImages: reviewData.albumImages,
                reviewId: response._id,
            })
        }

        res.status(200)
            .json({
                message: 'Review successfully created',
                reviewData: response,
            })
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

// Logged in user's reviews
const handleGetLoggedInUsersReviews = async (req, res) => {
    logger.info("Getting logged in user's reviews");

    try {
        const decodedCookie = req.decoded;

        const response = await getLoggedInUsersReviews(decodedCookie.userId);

        res.status(200)
            .json({
                message: 'Reviews by logged in user successfully fetched',
                reviewsData: response,
            })
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

// Logged in user's reviews
const handleGetFollowingUsersReviews = async (req, res) => {
    logger.info("Getting following user's reviews");

    try {
        const decodedCookie = req.decoded;

        const response = await getFollowingUsersReviews(decodedCookie.userId);

        res.status(200)
            .json({
                message: 'Reviews by following user successfully fetched',
                reviewsData: response,
            })
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

// User profile's reviews
const handleGetReviewsByUsername = async (req, res) => {
    logger.info('Getting reviews by username');

    try {
        const { username } = req.params;

        const response = await getReviewsByUsername(username);

        res.status(200)
            .json({
                message: "Retrieved user's reviews",
                results: response
            })
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

// Album reviews
const handleGetReviewsByAlbumId = async (req, res) => {
    logger.info('Getting reviews by album id');

    try {
        const { albumId } = req.params;

        const response = await getReviewsByAlbumId(albumId);

        res.status(200)
            .json({
                message: 'Reviews by album id successfully fetched',
                reviewsData: response
            });
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

// Artist reviews
const handleGetReviewsByArtistId = async (req, res) => {
    logger.info('Getting reviews by artist id');

    try {
        const { artistId } = req.params;

        const response = await getReviewsByArtistId(artistId);

        res.status(200)
            .json({
                message: 'Reviews by artist id successfully fetched',
                reviewsData: response
            });
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

// Update review
const handleUpdateReview = async (req, res) => {
    logger.info('Updating review');

    try {
        const { reviewId } = req.params;
        const decodedCookie = req.decoded;
        const foundReview = await getReviewById(reviewId);

        // Check if logged in user and author of review are the same
        if (foundReview.author.userId != decodedCookie.userId) {
            res.status(401)
                .json({
                    message: 'User unauthorized to manage resource'
                })
        }

        // If no longer a favorite, remove from user profile
        if (foundReview.favorite == true && req.body?.favorite != false) {
            console.log('removing from favorites');

            await removeFavoriteFromUserProfile(decodedCookie.userId, reviewId);
        }

        // If favorited, add to user profile
        if (foundReview.favorite == false && req.body?.favorite == true) {
            console.log('adding to favorites');

            const favoriteData = {
                artist: foundReview.artist,
                artistId: foundReview.artistId,
                album: foundReview.album,
                albumId: foundReview.albumId,
                rating: foundReview.rating,
                albumImages: foundReview.albumImages,
                reviewId: foundReview._id,
            };

            await addFavoriteToUserProfile(decodedCookie.userId, favoriteData);
        }

        // If the year of the review date is different, then update review stats
        if (req.body?.date) {
            console.log('Updating review stats');
            const parsedOldDate = foundReview.date.split('/');
            const parsedNewDate = req.body.date.split('/');
            const oldYear = parsedOldDate[2];
            const newYear = parsedNewDate[2];

            // Check if date is a different year, if so update user review stats
            if (oldYear !== newYear) {
                await updateUsersReviewStats(decodedCookie.userId, {
                    type: 'update',
                    old: oldYear,
                    new: newYear,
                })
            } 
        }

        // Update review
        const updatedReview = await updateReviewById(reviewId, req.body);

        res.status(200)
            .json({
                message: 'Review successfully updated',
                updatedReview: updatedReview
            })
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

// Like review
const handleLikeReview = async (req, res) => {
    logger.info('Liking review...');
    try {
        const response = await likeReview(req.params.reviewId, req.decoded.username);

        res.status(200)
            .json(response);
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

// Unlike review
const handleUnlikeReview = async (req, res) => {
    logger.info('Unliking review...');
    try {
        const response = await unlikeReview(req.params.reviewId, req.decoded.username);

        res.status(200)
            .json(response);
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

// Delete review 
const handleDeleteReview = async (req, res) => {
    logger.info("Deleting review");

    try {
        const { reviewId } = req.params;
        const decodedCookie = req.decoded;

        const foundReview = await getReviewById(reviewId);

        // Check if logged in user matches author id of review
        if (foundReview.author.userId != decodedCookie.userId) {
            res.status(401)
                .json({
                    message: 'User unauthorized to manage resource'
                })
        } 

        // TODO Check if favorited 
        if (foundReview.favorite) {
            // remove from favorites
            await removeFavoriteFromUserProfile(decodedCookie.userId, reviewId);
        }

        // TODO Check if there are comments
        if (foundReview.comments.length > 0) {
            // Delete any comments
            await deleteManyComments(foundReview._id);
        }

        // TODO Delete review
        await deleteReviewById(reviewId).then(async () => {
            // format date
            const parsedDate = foundReview.date.split('/');
            const year = parsedDate[2];

            // update user's review stats
            await updateUsersReviewStats(decodedCookie.userId, {
                type: 'remove',
                year: year,
            })
        });

        res.status(200)
            .json({
                message: 'Review successfully deleted'
            })
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

// Exports
module.exports = {
    handleCreateReview,
    handleGetLoggedInUsersReviews,
    handleGetFollowingUsersReviews,
    handleGetReviewsByAlbumId,
    handleGetReviewsByArtistId,
    handleGetReviewsByUsername,
    handleUpdateReview,
    handleLikeReview,
    handleUnlikeReview,
    handleDeleteReview
}
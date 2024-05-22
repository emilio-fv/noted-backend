// Imports
const logger = require('../../utils/logger.util');
const { 
    getUserById,
    addFavoriteToUserProfile,
    removeFavoriteFromUserProfile
 } = require('../auth/auth.services');
const { 
    createReview, 
    getLoggedInUsersReviews,
    getReviewById,
    deleteReviewById,
    updateReviewById,
    getReviewsByAlbumId,
    getReviewsByArtistId
} = require('./reviews.services');

// Create review
const handleCreateReview = async (req, res) => {
    logger.info('Creating review...');

    try {
        console.log(req.body);

        const decodedToken = req.decoded;

        const authorData = await getUserById(decodedToken.userId);

        const reviewData = {
            ...req.body,
            author: {
                userId: authorData._id,
                username: authorData.username,
            }
        };

        // Add to favorites if needed
        if (reviewData.favorite) {
            await addFavoriteToUserProfile(decodedToken.userId, { 
                artist: reviewData.artist,
                artistId: reviewData.artistId,
                album: reviewData.album,
                albumId: reviewData.albumId,
                rating: reviewData.rating,
                albumImages: reviewData.albumImages
            })
        }

        const response = await createReview(reviewData);

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

// const handleGetReviewsByUserId = async (req res) => {

// };

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

        if (foundReview.author.userId != decodedCookie.userId) {
            res.status(401)
                .json({
                    message: 'User unauthorized to manage resource'
                })
        }

        // If no longer a favorite, remove from user profile
        if (foundReview.favorite && !req.body?.favorite) {
            await removeFavoriteFromUserProfile(decodedCookie.userId, reviewId);
        }

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

// Delete review
const handleDeleteReview = async (req, res) => {
    logger.info("Deleting review");

    try {
        const { reviewId } = req.params;
        const decodedCookie = req.decoded;

        const foundReview = await getReviewById(reviewId);

        if (foundReview.author.userId != decodedCookie.userId) {
            res.status(401)
                .json({
                    message: 'User unauthorized to manage resource'
                })
        } 

        await deleteReviewById(reviewId);

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
    handleGetReviewsByAlbumId,
    handleGetReviewsByArtistId,
    handleUpdateReview,
    handleDeleteReview
}
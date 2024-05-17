// Imports
const logger = require('../../utils/logger.util');
const { 
    getUserById
 } = require('../auth/auth.services');
const { 
    createReview, 
    getLoggedInUsersReviews,
    getReviewById,
    deleteReviewById,
    updateReviewById,
    getReviewsByAlbumId
} = require('./reviews.services');

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
    handleUpdateReview,
    handleDeleteReview
}
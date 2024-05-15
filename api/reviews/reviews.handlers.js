// Imports
const logger = require('../../utils/logger.util');
const { 
    getUserById
 } = require('../auth/auth.services');
const { 
    createReview, 
    getLoggedInUsersReviews
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
}
// Exports
module.exports = {
    handleCreateReview,
    handleGetLoggedInUsersReviews
}
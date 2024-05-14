// Imports
const logger = require('../../utils/logger.util');
const { 
    createReview 
} = require('./reviews.services');

const handleCreateReview = async (req, res) => {
    logger.info('Creating review...');

    try {
        const response = await createReview({
            ...req.body,
            author: req.decoded.userId
        });

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

// Exports
module.exports = {
    handleCreateReview
}
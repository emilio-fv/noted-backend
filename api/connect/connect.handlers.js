// Imports
const logger = require('../../utils/logger.util');
const { 
    getUsersByQuery
} = require('./connect.services');

const handleQueryUsers = async (req, res) => {
    logger.info("Querying users...");

    try {
        const { searchQuery } = req.query;

        const response = await getUsersByQuery(searchQuery);

        res.status(200)
            .json({
                message: 'User database queried',
                results: response
            })
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

// Exports
module.exports = {
    handleQueryUsers,
}
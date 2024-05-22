// Imports
const logger = require('../../utils/logger.util');
const { 
    getUsersByQuery,
    getUsersProfileDataByUsername,
    followUser
} = require('./connect.services');

const handleQueryUsers = async (req, res) => {
    logger.info("Querying users...");

    try {
        const { searchQuery } = req.query;

        const response = await getUsersByQuery(searchQuery);

        res.status(200)
            .json({
                message: 'User database queried',
                currentQuery: searchQuery,
                results: response
            })
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

const handleGetUsersProfileData = async (req, res) => {
    logger.info('Getting users profile data');

    try {
        const { username } = req.params;

        // Get users followers, following, and favorites
        const response = await getUsersProfileDataByUsername(username);

        res.status(200)
            .json({
                message: "User's profile data fetched",
                result: response
            })
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
}

const handleFollowUser = async (req, res) => {
    logger.info('Following user...');

    try {
        const decodedCookie = req.decoded;
        const { userId } = req.params;

        const response = await followUser(decodedCookie.userId, userId);

        res.status(200)
            .json({
                message: 'User followed',
                updatedUser: response, // TODO remove before push
            })
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
}

// Exports
module.exports = {
    handleQueryUsers,
    handleGetUsersProfileData,
    handleFollowUser,
}
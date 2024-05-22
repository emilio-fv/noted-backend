// Imports
const logger = require('../../utils/logger.util');
const { 
    getUsersByQuery,
    getUsersProfileDataByUsername,
    followUser,
    unfollowUser
} = require('./connect.services');

// Query users
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

// Users profile data 
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
};

// Follow user
const handleFollowUser = async (req, res) => {
    logger.info('Following user...');

    try {
        const decodedCookie = req.decoded;
        const { userId } = req.params;

        await followUser(decodedCookie.userId, userId);

        res.status(200)
            .json({
                message: 'User followed',
            })
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

// Unfollow user
const handleUnfollowUser = async (req, res) => {
    logger.info('Unfollowing user...');

    try {
        const decodedCookie = req.decoded;
        const { userId } = req.params;

        await unfollowUser(decodedCookie.userId, userId);

        res.status(200)
            .json({
                message: 'User unfollowed',
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
    handleGetUsersProfileData,
    handleFollowUser,
    handleUnfollowUser,
}
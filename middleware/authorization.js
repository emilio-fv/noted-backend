// Imports
const { verifyAccessToken } = require('../utils/jwt.utils');

const authorization = async (req, res, next) => {
    // TODO log middleware
    const { accessToken } = req.cookies;

    if (!accessToken) {
        return res.status(401).json('Unauthorized');
    }

    const decodedToken = await verifyAccessToken(accessToken);

    if (decodedToken?.name === 'TokenExpiredError') {
        return res.status(401).json('ExpiredAccessToken.');
    } else {
        req.decoded = decodedToken;
        next();
    }
}; 

// Exports
module.exports = {
    authorization,
};
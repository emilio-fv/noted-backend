// Imports
const jwt = require('jsonwebtoken');

const generateAccessToken = async (payload) => {
    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_EXPIRATION
        }
    );
    
    return accessToken;
};

const generateExpiredAccessToken = async (payload) => {
    const expiredAccessToken = jwt.sign(
        payload,
        process.env.ACCESS_SECRET_KEY,
        {
            expiresIn: 0
        }
    );
    
    return expiredAccessToken;
};

const generateRefreshToken = async (payload) => {
    const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_SECRET_KEY,
        {
            expiresIn: process.env.REFRESH_EXPIRATION
        },
    )

    return refreshToken;
};

const generateExpiredRefreshToken = async (payload) => {
    const expiredRefreshToken = jwt.sign(
        payload,
        process.env.REFRESH_SECRET_KEY,
        {
            expiresIn: 0
        },
    )
    
    return expiredRefreshToken;
};

const verifyAccessToken = async (accessToken) => {
    const res = jwt.verify(
        accessToken,
        process.env.ACCESS_SECRET_KEY,
        (error, decoded) => {
            if (error) {
                return error;
            } else {
                return decoded;
            }
        }
    )

    return res;
};

const verifyRefreshToken = async (refreshToken) => {
    const res = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_KEY,
        (error, decoded) => {
            if (error) {
                return error;
            } else {
                return decoded;
            }
        }
    )

    return res;
};

// Exports
module.exports = {
    generateAccessToken,
    generateExpiredAccessToken,
    generateRefreshToken,
    generateExpiredRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
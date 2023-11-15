// Imports
const bcrypt = require('bcrypt');
const { 
    generateAccessToken, 
    generateRefreshToken, 
    verifyRefreshToken
} = require('../../utils/jwt.utils');
const {
    createUser,
    getUserByEmail,
    getUserByUsername,
    getAllUsers,
    getUserById,
} = require('./auth.services');
const logger = require('../../utils/logger.util');

const handleRegister = async (req, res) => {
    logger.info('Registering user...')
    try {

        const userWithSameEmail = await getUserByEmail(req.body.email);
        const userWithSameUsername = await getUserByUsername(req.body.username);

        if (userWithSameEmail.length > 0 || userWithSameUsername.length > 0) {
            const errors = {
                email: userWithSameEmail ? { message: 'Email already registered.' } : null,
                username: userWithSameUsername ? { message: 'Username already registered.'} : nul
            }
            
            return res.status(400)
                .json(errors)
        }

        const newUser = await createUser(req.body);

        const payload = {
            userId: newUser._id,
        };

        const accessToken = await generateAccessToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        res.status(200)
            .cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            })
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            })
            .json({
                username: newUser.username,
            })
    } catch (error) {
        logger.error('An error occurred: ', error);

        let errors = {
            ...error.errors
        };

        if (req.body.confirmPassword.length === 0) {
            errors.confirmPassword = {
                message: 'Confirm password required.'
            }
        }

        res.status(400)
            .json(errors);
    }
};

const handleLogin = async (req, res) => {
    logger.info('Logging user in...');

    try {
        const formData = req.body;

        const existingUser = await getUserByEmail(formData.email);

        if (existingUser.length === 0) {
            return res.status(400)
                .json({
                    error: 'Invalid login'
                });
        }

        const correctPassword = await bcrypt.compare(formData.password, existingUser[0].password);

        if (!correctPassword) {
            return res.status(400)
                .json({
                    error: 'Invalid login'
                });
        }

        const payload = {
            userId: existingUser[0].id,
        };

        const accessToken = await generateAccessToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        res.status(200)
            .cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            })
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            })
            .json({
                username: existingUser[0].username,
                // firstName: existingUser.firstName,
                // lastName: existingUser.lastName,
                // reviews: existingUser.reviews,
                // favorites: existingUser.favorites,
                // following: existingUser.following,
                // followers: existingUser.followers,
            })
    } catch (error) {
        logger.error('An error occurred: ', error);
        res.status(400).json(error);
        // TODO: handle errors
    }
};

// Logout user
const handleLogout = async (req, res) => {
    logger.info('Logging user out...');

    res.status(200)
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .json({
            message: 'User successfully logged out.'
        })
};

// Refresh access token
const handleRefreshAccessToken = async (req, res) => {
    logger.info('Refreshing access token...');

    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401)
                .json('Unauthorized.');
        }

        const decodedToken = await verifyRefreshToken(refreshToken);

        if (decodedToken?.name === 'TokenExpiredError') {
            return res.status(401)
                .json('ExpiredRefreshToken.');
        }

        const newAccessToken = await generateAccessToken({
            userId: decodedToken.userId
        });

        res.status(200)
            .cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            })
            .json('Access token refreshed successfully.');
    } catch (error) {
        logger.error('An error occurred: ', error);

        res.status(400)
            .json(error);
    }
};

const handleGetLoggedInUsersData = async (req, res) => {
    logger.info("Getting logged in user's data");

    try {
        const decodedToken = req.decoded;

        const loggedInUser = await getUserById(decodedToken.userId);

        res.status(200)
            .json({
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                username: loggedInUser.username,
                email: loggedInUser.email
            })
    } catch (error) {
        logger.error('An error occurred: ', error);

        res.status(400)
            .json(error)
    }
    const allUsers = await getAllUsers();
}

// Exports
module.exports = {
    handleRegister,
    handleLogin,
    handleLogout,
    handleRefreshAccessToken,
    handleGetLoggedInUsersData
};
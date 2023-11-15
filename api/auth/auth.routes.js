// Imports
const express = require('express');
const { 
    handleRegister, 
    handleLogin, 
    handleLogout, 
    handleRefreshAccessToken, 
    handleGetLoggedInUsersData
} = require('./auth.handlers');
const { authorization } = require('../../middleware/authorization');

const router = express.Router();

// API endpoints
router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/logout', handleLogout);
router.get('/refresh', handleRefreshAccessToken);
router.get('/', authorization, handleGetLoggedInUsersData);

// Exports
module.exports = {
    authRouter: router
};
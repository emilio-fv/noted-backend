// Imports
const express = require('express');
const { 
    handleRegister, 
    handleLogin, 
    handleLogout, 
    handleRefreshAccessToken, 
    handleTestRoute
} = require('./auth.handlers');
const { authorization } = require('../../middleware/authorization');

const router = express.Router();

// Auth API endpoints
router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/logout', handleLogout);
router.get('/refresh', handleRefreshAccessToken);
router.get('/', handleTestRoute);

// Exports
module.exports = {
    authRouter: router
};
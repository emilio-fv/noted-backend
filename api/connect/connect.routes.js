// Imports
const express = require('express');
const { authorization } = require('../../middleware/authorization');
const { 
    handleQueryUsers, 
    handleGetUsersProfileData, 
    handleFollowUser
} = require('./connect.handlers');

const router = express.Router();

// Connect API endpoints
router.get('/queryUsers', authorization, handleQueryUsers);
router.get('/:username/profile', authorization, handleGetUsersProfileData);
router.put('/:userId/follow', authorization, handleFollowUser);

// Exports
module.exports = {
    connectRouter: router
}
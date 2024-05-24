// Imports
const express = require('express');
const { authorization } = require('../../middleware/authorization');
const { 
    handleQueryUsers, 
    handleGetUsersProfileData, 
    handleFollowUser,
    handleUnfollowUser
} = require('./connect.handlers');

const router = express.Router();

// Connect API endpoints
router.get('/queryUsers', authorization, handleQueryUsers);
router.get('/:username/profile', authorization, handleGetUsersProfileData);
router.put('/:userId/follow', authorization, handleFollowUser);
router.put('/:userId/unfollow', authorization, handleUnfollowUser);

// Exports
module.exports = {
    connectRouter: router
}
// Imports
const express = require('express');
const { authorization } = require('../../middleware/authorization');
const { 
    handleQueryUsers, 
    handleGetUsersProfileData 
} = require('./connect.handlers');

const router = express.Router();

// Connect API endpoints
router.get('/queryUsers', authorization, handleQueryUsers);
router.get('/:username/profile', authorization, handleGetUsersProfileData);

// Exports
module.exports = {
    connectRouter: router
}
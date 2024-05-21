// Imports
const express = require('express');
const { authorization } = require('../../middleware/authorization');
const { handleQueryUsers } = require('./connect.handlers');

const router = express.Router();

// Connect API endpoints
router.get('/queryUsers', authorization, handleQueryUsers);

// Exports
module.exports = {
    connectRouter: router
}
// Imports 
const express = require('express');
const { authorization } = require('../../middleware/authorization');
const { 
    handleCreateReview, 
    handleGetLoggedInUsersReviews,
    handleDeleteReview
} = require('./reviews.handlers');

const router = express.Router();

// Reviews API endpoints
router.post('/createReview', authorization, handleCreateReview);
router.get('/loggedInUser', authorization, handleGetLoggedInUsersReviews);
router.delete('/:reviewId/delete', authorization, handleDeleteReview);

// Exports
module.exports = {
    reviewsRouter: router
}
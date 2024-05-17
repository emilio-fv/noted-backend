// Imports 
const express = require('express');
const { authorization } = require('../../middleware/authorization');
const { 
    handleCreateReview, 
    handleGetLoggedInUsersReviews,
    handleDeleteReview,
    handleUpdateReview,
    handleGetReviewsByAlbumId
} = require('./reviews.handlers');

const router = express.Router();

// Reviews API endpoints
router.post('/createReview', authorization, handleCreateReview);
router.get('/loggedInUser', authorization, handleGetLoggedInUsersReviews);
router.get('/:albumId/album', authorization, handleGetReviewsByAlbumId);
router.put('/:reviewId/update', authorization, handleUpdateReview);
router.delete('/:reviewId/delete', authorization, handleDeleteReview);

// Exports
module.exports = {
    reviewsRouter: router
}
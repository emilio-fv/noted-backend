// Imports 
const express = require('express');
const { authorization } = require('../../middleware/authorization');
const { 
    handleCreateReview, 
    handleGetLoggedInUsersReviews,
    handleDeleteReview,
    handleUpdateReview,
    handleGetReviewsByAlbumId,
    handleGetReviewsByArtistId,
    handleGetReviewsByUsername,
    handleGetFollowingUsersReviews,
    handleLikeReview,
    handleUnlikeReview
} = require('./reviews.handlers');

const router = express.Router();

// Reviews API endpoints
router.post('/createReview', authorization, handleCreateReview);
router.get('/loggedInUser', authorization, handleGetLoggedInUsersReviews);
router.get('/following', authorization, handleGetFollowingUsersReviews);
router.get('/:albumId/album', authorization, handleGetReviewsByAlbumId);
router.get('/:artistId/artist', authorization, handleGetReviewsByArtistId);
router.get('/:username/profile', authorization, handleGetReviewsByUsername);
router.put('/:reviewId/update', authorization, handleUpdateReview);
router.put('/:reviewId/like', authorization, handleLikeReview);
router.put('/:reviewId/unlike', authorization, handleUnlikeReview);
router.delete('/:reviewId/delete', authorization, handleDeleteReview);

// Exports
module.exports = {
    reviewsRouter: router
}
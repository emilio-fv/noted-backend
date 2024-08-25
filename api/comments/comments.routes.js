// Imports
const express = require('express');
const { authorization } = require('../../middleware/authorization');
const { 
    handleCreateComment,
    handleUpdateComment,
    handleLikeComment,
    handleUnlikeComment,
    handleDeleteComment,
    handleTestCommentRoute,
} = require('./comments.handlers');

const router = express.Router();

// Comments API endpoints
router.post('/createComment', authorization, handleCreateComment);
router.put('/:commentId/updateComment', authorization, handleUpdateComment);
router.put('/:commentId/likeComment', authorization, handleLikeComment);
router.put('/:commentId/unlikeComment', authorization, handleUnlikeComment);
router.delete('/:commentId/deleteComment', authorization, handleDeleteComment);
// router.get('/', handleTestCommentRoute);

// Exports
module.exports = {
    commentsRouter: router
};
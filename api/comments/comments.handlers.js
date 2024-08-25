// Imports 
const logger = require('../../utils/logger.util');
const { createComment, getCommentById, updateComment, likeComment, unlikeComment, deleteComment, getAllComments } = require('./comments.services');

// Create comment
const handleCreateComment = async (req, res) => {
    logger.info('Creating comment');

    try {
        const commentData = {
            reviewId: req.body.reviewId,
            text: req.body.text,
            author: req.decoded.username
        };

        const response = await createComment(commentData);

        return res.status(200)
            .json({
                message: 'Comment successfully created.',
                response: response
            });
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

// Get comments by review id
const handleTestCommentRoute = async (req, res) => {
    try {
        logger.info('Test comment route');
        const foundComments = await getAllComments();

        res.status(200)
            .json(foundComments);
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
}

// Update comment
const handleUpdateComment = async (req, res) => {
    logger.info('Updating comment');

    try {
        // Check if the logged in user matches the author
        const foundComment = await getCommentById(req.params.commentId);

        const cookie = req.decoded;

        // If not return error message
        if (cookie.username !== foundComment.author) {
            res.status(401)
                .json('Unauthorized');
        }

        // If so update comment accordingly (only text can be updated)
        const updatedComment = await updateComment(req.params.commentId, {
            text: req.body?.text
        });

        res.status(200)
            .json(updatedComment);
    } catch (errors) {
        logger.error(errors);
        res.status(400)
            .json(errors);
    }
};

// Like comment
const handleLikeComment = async (req, res) => {
    logger.info('Liking comment');

    try {
        const cookie = req.decoded;

        // Like comment
        const updatedComment = await likeComment(req.params.commentId, cookie.username);

        // Return success message
        res.status(200)
            .json(updatedComment);
    } catch (errors) {
        logger.error(errors);
        res.status(400)
            .json(errors);
    }
};

// Unlike comment
const handleUnlikeComment = async (req, res) => {
    logger.info('Unliking comment');

    try {
        const cookie = req.decoded;

        // Unlike comment
        const updatedComment = await unlikeComment(req.params.commentId, cookie.username);

        // Return success message
        res.status(200)
            .json(updatedComment);
    } catch (errors) {
        logger.error(errors);
        res.status(400)
            .json(errors);
    }
};

// Delete comment
const handleDeleteComment = async (req, res) => {
    logger.info('Deleting comment');

    try {
        // Verify the logged in user is the author
        const cookie = req.decoded;

        const foundComment = await getCommentById(req.params.commentId);

        // If not, return error message
        if (foundComment.author !== cookie.username) {
            res.status(401)
                .json('Unauthorized');
        }

        // If so, delete comment 
        const deletedComment = await deleteComment(req.params.commentId);

        // Return success message
        res.status(200)
            .json(deletedComment);
    } catch (errors) {
        logger.error(errors);
        res.status(400)
            .json(errors);
    }
};

// Exports
module.exports = {
    handleCreateComment,
    handleTestCommentRoute,
    handleUpdateComment,
    handleLikeComment,
    handleUnlikeComment,
    handleDeleteComment,
}
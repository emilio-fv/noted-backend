// Imports
const { Comment } = require('../../models/comment');

// Create comment
const createComment = async (commentData) => {
    const newComment = await Comment.create(commentData);

    return newComment;
};

// Get all comments
const getAllComments = async () => {
    const comments = await Comment.find();

    return comments;
};

// Get comment
const getCommentById = async (commendId) => {
    const foundComment = await Comment.findById(commendId);

    return foundComment;
};

// Update comment
const updateComment = async (commentId, commentData) => {
    const updatedComment = await Comment.findByIdAndUpdate(commentId, commentData, { new: true });

    return updatedComment;
}

// Like comment
const likeComment = async (commentId, username) => {
    const updatedComment = await Comment.findByIdAndUpdate(commentId,
        { $addToSet: { likes: username } },
        { new: true }
    );

    return updatedComment;
}

// Unlike comment
const unlikeComment = async (commentId, username) => {
    const updatedComment = await Comment.findByIdAndUpdate(commentId,
        { $pull: { likes: username } },
        { new: true }
    );

    return updatedComment;
}

// Delete comment
const deleteComment = async (commentId) => {
    const deletedReview = await Comment.findByIdAndDelete(commentId);

    return deletedReview;
}

// Delete multiple comments
const deleteManyComments = async (reviewId) => {
    const deletedComments = await Comment.deleteMany({ reviewId: reviewId });

    return deletedComments;
}

// Exports
module.exports = {
    createComment,
    getAllComments, 
    getCommentById,
    updateComment,
    likeComment,
    unlikeComment,
    deleteComment,
    deleteManyComments,
};

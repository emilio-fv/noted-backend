// Imports
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Comment schema
const commentSchema = new Schema({
    reviewId: {
        type: Schema.ObjectId,
        immutable: true, 
    },
    text: {
        type: String,
    },
    author: {
        type: String,
        immutable: true, 
    },
    likes: {
      type: [String],
    },
}, { timestamps: true, collection: 'comments' });

// Generate comment model
const Comment = mongoose.model('Comment', commentSchema);

// Exports
module.exports = {
    Comment
}
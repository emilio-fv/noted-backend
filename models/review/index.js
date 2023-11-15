// Imports
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Review schema
const reviewSchema = new Schema({
    artist: {
      type: String,
      required: true,
    },
    artistId: {
      type: String,
      required: true
    },
    album: {
      type: String, 
      required: true
    },
    albumId: {
      type: String,
      required: true
    },
    src: {
      type: String,
      required: true
    }, 
    rating: {
      type: Number,
    },
    text: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likes: [{
      types: Schema.Types.ObjectId,
      ref: 'User'
    }],
}, { timestamps: true, collection: 'reviews' });

// Generate review model
const Review = mongoose.model("Review", reviewSchema);

// Exports
module.exports = {
    Review
};
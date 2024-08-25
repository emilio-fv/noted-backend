// Imports
const mongoose = require('mongoose');
const { spotifyImageSchema } = require('../spotifyImage');
const { authorDataSchema } = require('../authorData');
const { Schema } = mongoose;

// Review schema
const reviewSchema = new Schema({
    date: {
      type: String,
      required: true,
    },
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
    albumImages: {
      type: [spotifyImageSchema],
      required: true
    }, 
    rating: {
      type: Number,
    },
    reviewText: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false
    },
    author: {
      type: authorDataSchema,
      required: true
    },
    likes: {
      type: [String],
    },
}, { timestamps: true, collection: 'reviews' });

// Generate review model
const Review = mongoose.model('Review', reviewSchema);

// Exports
module.exports = {
    Review
};
// Imports
const mongoose = require('mongoose');
const { Schema } = mongoose;

const spotifyImageSchema = new Schema({
    url: {
      type: String,
    },
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
});

const authorDataSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        required: true 
    },
    username: { 
        type: String, 
        required: true 
    }
}, { _id: false });

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
}, { timestamps: true, collection: 'reviews' });

// Generate review model
const Review = mongoose.model('Review', reviewSchema);

// Exports
module.exports = {
    Review
};
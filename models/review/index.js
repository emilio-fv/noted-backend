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
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // likes: [{
    //   types: Schema.Types.ObjectId,
    //   ref: 'User'
    // }],
}, { timestamps: true, collection: 'reviews' });

// Generate review model
const Review = mongoose.model("Review", reviewSchema);

// Exports
module.exports = {
    Review
};
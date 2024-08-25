// Imports
const mongoose = require('mongoose');
const { spotifyImageSchema } = require('../spotifyImage');
const { Schema } = mongoose;

// Favorite schema
const favoriteSchema = Schema({
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
      rating: {
        type: Number,
      },
      albumImages: {
        type: [spotifyImageSchema],
      },
      reviewId: {
        type: Schema.Types.ObjectId,
      }
});

// Exports
module.exports = {
    favoriteSchema
}
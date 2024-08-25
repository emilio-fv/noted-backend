// Imports
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Spotify image schema
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

// Exports
module.exports = {
    spotifyImageSchema
}
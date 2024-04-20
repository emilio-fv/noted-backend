// Imports
const express = require('express');
const {
    verifySpotifyToken
} = require('../../middleware/verifySpotifyToken');
const {
    handleGetSpotifyAccessToken,
    handleGetSpotifyFeaturedAlbums,
} = require('./music.handlers');

// TODO: instantiate router
const router = express.Router();

// Music API endpoints
router.get('/getSpotifyAccessToken', handleGetSpotifyAccessToken);
router.get('/getFeaturedAlbums', verifySpotifyToken, handleGetSpotifyFeaturedAlbums);
// TODO: route POST /querySpotify
// TODO: route GET /:artistId/getArtistData
// TODO: route GET /:albumId/getAlbumData

// Exports
module.exports = {
    musicRouter: router
};
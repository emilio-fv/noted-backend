// Imports
const express = require('express');
const {
    verifySpotifyToken
} = require('../../middleware/verifySpotifyToken');
const {
    handleGetSpotifyAccessToken,
    handleGetSpotifyFeaturedAlbums,
    handleQuerySpotify,
    handleGetArtistsData,
} = require('./music.handlers');

const router = express.Router();

// Music API endpoints
router.get('/getSpotifyAccessToken', handleGetSpotifyAccessToken);
router.get('/getFeaturedAlbums', verifySpotifyToken, handleGetSpotifyFeaturedAlbums);
router.get('/querySpotify', verifySpotifyToken, handleQuerySpotify);
router.get('/:artistId/getArtistData', verifySpotifyToken, handleGetArtistsData);
// TODO: route GET /:albumId/getAlbumData

// Exports
module.exports = {
    musicRouter: router
};
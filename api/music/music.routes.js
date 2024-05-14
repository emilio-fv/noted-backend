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
    handleGetAlbumsData,
} = require('./music.handlers');

const router = express.Router();

// Music API endpoints
router.get('/getSpotifyAccessToken', handleGetSpotifyAccessToken);
router.get('/getFeaturedAlbums', verifySpotifyToken, handleGetSpotifyFeaturedAlbums);
router.get('/querySpotify', verifySpotifyToken, handleQuerySpotify);
router.get('/:artistId/getArtistsData', verifySpotifyToken, handleGetArtistsData);
router.get('/:albumId/getAlbumsData', verifySpotifyToken, handleGetAlbumsData);

// Exports
module.exports = {
    musicRouter: router
};
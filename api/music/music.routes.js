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
const { authorization } = require('../../middleware/authorization');

const router = express.Router();

// Music API endpoints
router.get('/getSpotifyAccessToken', handleGetSpotifyAccessToken);
router.get('/getFeaturedAlbums', verifySpotifyToken, handleGetSpotifyFeaturedAlbums);
router.get('/querySpotify', [authorization, verifySpotifyToken], handleQuerySpotify);
router.get('/:artistId/getArtistsData', [authorization, verifySpotifyToken], handleGetArtistsData);
router.get('/:albumId/getAlbumsData', [authorization, verifySpotifyToken], handleGetAlbumsData);

// Exports
module.exports = {
    musicRouter: router
};
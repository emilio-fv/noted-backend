// Imports
const {
    getSpotifyAccessToken,
    getSpotifyFeaturedAlbums,
    querySpotify,
} = require('./music.services');
const logger = require('../../utils/logger.util');
const { generateAccessToken } = require('../../utils/jwt.utils');

const handleGetSpotifyAccessToken = async (req, res) => {
    logger.info('Requesting Spotify access token...');

    try {
        const response = await getSpotifyAccessToken();

        const spotifyToken = await generateAccessToken(response.data);

        res.status(200)
            .cookie('spotifyToken', {
                spotifyToken,
                expiration: Date.now(),
            }, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })
            .json('Spotify access token acquired...')
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

const handleGetSpotifyFeaturedAlbums = async (req, res) => {
    logger.info('Requesting featured albums from Spotify API...');

    try {
        const response = await getSpotifyFeaturedAlbums(req.decodedSpotifyToken);

        res.status(200)
            .json({
                message: 'New album releases from Spotify API acquired...',
                featuredAlbums: response.data,
            });
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

const handleQuerySpotify = async (req, res) => {
    logger.info('Querying Spotify database...');

    try {
        const response = await querySpotify(req.decodedSpotifyToken, req.query.spotifyQuery);

        res.status(200)
            .json({
                message: 'Spotify query results acquired...',
                results: response.data,
            })
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

// TODO: handleGetArtistsData
// TODO: handleGetAlbumsData

// Exports
module.exports = {
    handleGetSpotifyAccessToken,
    handleGetSpotifyFeaturedAlbums,
    handleQuerySpotify
};
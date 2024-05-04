// Imports
const {
    getSpotifyAccessToken,
    getSpotifyFeaturedAlbums,
    querySpotify,
    getArtistData,
} = require('./music.services');
const logger = require('../../utils/logger.util');
const { generateAccessToken } = require('../../utils/jwt.utils');

const handleGetSpotifyAccessToken = async (req, res) => {
    logger.info('Requesting Spotify access token...');

    try {
        const spotifyResponse = await getSpotifyAccessToken();

        const spotifyToken = await generateAccessToken(spotifyResponse.data);

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
        const spotifyResponse = await getSpotifyFeaturedAlbums(req.decodedSpotifyToken);

        res.status(200)
            .json({
                message: 'New album releases from Spotify API acquired...',
                featuredAlbums: spotifyResponse.data,
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
        const spotifyResponse = await querySpotify(req.decodedSpotifyToken, req.query.spotifyQuery);

        res.status(200)
            .json({
                message: 'Spotify query results acquired...',
                results: spotifyResponse.data,
            })
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

const handleGetArtistsData = async (req, res) => {
    logger.info("Getting artist's data ...");

    try {
        const spotifyResponse = await getArtistData(req.decodedSpotifyToken, req.params.artistId);

        // TODO: get review data

        res.status(200)
            .json({
                message: 'Artist data acquired...',
                artistData: spotifyResponse.data,
            })
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
}

// TODO: handleGetAlbumsData

// Exports
module.exports = {
    handleGetSpotifyAccessToken,
    handleGetSpotifyFeaturedAlbums,
    handleQuerySpotify,
    handleGetArtistsData,
};
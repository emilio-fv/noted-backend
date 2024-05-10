// Imports
const {
    getSpotifyAccessToken,
    getSpotifyFeaturedAlbums,
    querySpotify,
    getArtistData,
    getAlbumData,
} = require('./music.services');
const logger = require('../../utils/logger.util');
const { generateAccessToken } = require('../../utils/jwt.utils');
const { parseSpotifyQueryResults } = require('../../utils/spotifyParsers.utils');

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
        const spotifyResponse = await querySpotify(req.decodedSpotifyToken, req.query);

        const parsedSpotifyResults = await parseSpotifyQueryResults(spotifyResponse.data);

        res.status(200)
            .json({
                message: 'Spotify query results acquired...',
                results: parsedSpotifyResults,
                offset: req.query.offset,
                currentQuery: req.query.spotifyQuery,
                type: req.query?.type,
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
        // TODO: parse through data

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
};

const handleGetAlbumsData = async (req, res) => {
    logger.info("Getting album's data ...");

    try {
        const spotifyResponse = await getAlbumData(req.decodedSpotifyToken, req.params.albumId);

        // TODO: get review data
        // TODO: parse through data

        res.status(200)
            .json({
                message: 'Album data acquired...',
                albumData: spotifyResponse.data,
            })
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors);
    }
};

// Exports
module.exports = {
    handleGetSpotifyAccessToken,
    handleGetSpotifyFeaturedAlbums,
    handleQuerySpotify,
    handleGetArtistsData,
    handleGetAlbumsData
};
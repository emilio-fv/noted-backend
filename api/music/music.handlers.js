// TODO: imports 
const {
    getSpotifyAccessToken
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
                sameSite: 'none'
            })
            .json('Spotify access token acquired...')
    } catch (errors) {
        logger.error(errors);

        res.status(400)
            .json(errors)
    }
};


// TODO: handleQuerySpotify
    // Logger

// TODO: handleGetArtistsData
    // Logger

// TODO: handleGetAlbumsData
    // Logger


// TODO: exports
module.exports = {
    handleGetSpotifyAccessToken,
}
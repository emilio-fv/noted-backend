// Imports
const { getSpotifyAccessToken } = require('../api/music/music.services');
const { verifyAccessToken, generateAccessToken } = require('../utils/jwt.utils');
const logger = require('../utils/logger.util');

/**
 * Middleware intended to verify if a cookie with a valid Spotify access token
 * is attached to a request that will request resources form the Spotify API. 
 * If the token is expired or missing, an updated token will be requested 
 * and attached as a cookie along with the decoded token to the original request. 
 * Otherwise the cookie is decoded and the token data is attached to the original request.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const verifySpotifyToken = async (req, res, next) => {
    logger.info('Verifying Spotify access token...');

    let spotifyCookie = req.cookies?.spotifyAccessToken;
    let decodedSpotifyCookie;

    if (spotifyCookie) {
        decodedSpotifyCookie = await verifyAccessToken(spotifyCookie);

        if (decodedSpotifyCookie.expiration > decodedSpotifyCookie.expiration + decodedSpotifyCookie.spotifyToken.expires_in) {
            const newSpotifyToken = await getSpotifyAccessToken();
            decodedSpotifyCookie = newSpotifyToken.data;
            spotifyCookie = await generateAccessToken(decodedSpotifyCookie);
        }
    } else {
        const newSpotifyToken = await getSpotifyAccessToken();
        decodedSpotifyCookie = newSpotifyToken.data;
        spotifyCookie = await generateAccessToken(decodedSpotifyCookie);
    }

    res.cookie('spotifyToken', {
        spotifyCookie,
        expiration: Date.now(),
    }, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })

    res.decodedSpotifyToken = decodedSpotifyCookie;

    next()
};

// Exports
module.exports = {
    verifySpotifyToken
}
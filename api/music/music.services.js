// Imports
const axios = require('axios');

const getSpotifyAccessToken = async () => {
    const response = axios.post('https://accounts.spotify.com/api/token', {
        'grant_type': 'client_credentials',
    }, {
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

    return response;
};

/**
 * Requests top 5 newly released albums from Spotify API
 * @param {object} spotifyToken 
 * @returns 
 */
const getSpotifyFeaturedAlbums = async (spotifyToken) => {
    const numOfRequestedAlbums = 5;

    const response = axios.get('https://api.spotify.com/v1/browse/new-releases', {
        headers: {
            'Authorization': 'Bearer ' + spotifyToken.access_token
        },
        params: {
            limit: numOfRequestedAlbums
        },
    });

    return response;
};

// TODO: querySpotify
// TODO: getArtistData
// TODO: getAlbumData

// TODO: exports
module.exports = {
    getSpotifyAccessToken,
    getSpotifyFeaturedAlbums,
}
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

const getSpotifyFeaturedAlbums = async (spotifyToken) => {
    const numOfRequestedAlbums = 5;

    const response = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
        headers: {
            'Authorization': 'Bearer ' + spotifyToken.access_token
        },
        params: {
            limit: numOfRequestedAlbums
        },
    });

    return response;
};

const querySpotify = async (spotifyToken, query) => {
    const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
            'Authorization': 'Bearer ' + spotifyToken.access_token
        },
        params: {
            q: query,
            type: 'artist,album,track',
            limit: 12
        }
    });

    return response;
};

// TODO: getArtistData
// TODO: getAlbumData

// Exports
module.exports = {
    getSpotifyAccessToken,
    getSpotifyFeaturedAlbums,
    querySpotify,
}
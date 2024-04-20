// Imports
const axios = require('axios');

const getSpotifyAccessToken = async () => {
    // make axios request
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

// TODO: querySpotify
// TODO: getArtistData
// TODO: getAlbumData

// TODO: exports
module.exports = {
    getSpotifyAccessToken,
}
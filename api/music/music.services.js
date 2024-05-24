// Imports
const axios = require('axios');

// Get Spotify access token from API
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

// Get featured albums
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

// Query Spotify
const querySpotify = async (spotifyToken, query) => {
    const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
            'Authorization': 'Bearer ' + spotifyToken.access_token
        },
        params: {
            q: query.spotifyQuery,
            type: query?.type ? query?.type : 'artist,album,track',
            limit: 6,
            offset: Number(query.offset),
        }
    });

    return response;
};

// Get artist's data
const getArtistData = async (spotifyToken, artistId) => {
    const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
            'Authorization': 'Bearer ' + spotifyToken.access_token
        },
    });

    return response;
};

// Get artist's discography
const getArtistsDiscographyData = async (spotifyToken, artistId) => {
    const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
        headers: {
            'Authorization': 'Bearer ' + spotifyToken.access_token
        },
        params: {
            include_groups: 'album'
        }
    });

    return response;
}

// Get album data
const getAlbumData = async (spotifyToken, albumId) => {
    const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: {
            'Authorization': 'Bearer ' + spotifyToken.access_token
        },
    });

    return response;
}

// Get album track list
const getAlbumTracklistData = async (spotifyToken, albumId) => {
    const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
        headers: {
            'Authorization': 'Bearer ' + spotifyToken.access_token
        },
    });

    return response;
}

// Exports
module.exports = {
    getSpotifyAccessToken,
    getSpotifyFeaturedAlbums,
    querySpotify,
    getArtistData,
    getArtistsDiscographyData,
    getAlbumData,
    getAlbumTracklistData
}
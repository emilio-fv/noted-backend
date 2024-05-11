// Imports

const parseSpotifyQueryResults = async (payload) => {
    let parsedPayload = {
        artists: [],
        albums: [],
        tracks: [],
    };

    // Parse artists
    if (payload?.artists) {
        for (let item of payload.artists.items) {
            parsedPayload.artists.push({
                id: item.id,
                name: item.name,
                images: item.images,
            })
        }
    }

    // Parse albums
    if (payload?.albums) {
        for (let item of payload.albums.items) {
            parsedPayload.albums.push({
                id: item.id,
                name: item.name,
                images: item.images,
                artist: {
                    id: item.artists[0].id,
                    name: item.artists[0].name
                }
            })
        }
    }

    // Parse tracks
    if (payload?.tracks) {
        for (let item of payload.tracks.items) {
            parsedPayload.tracks.push({
                name: item.name,
                duration: item.duration_ms,
                images: item.album.images,
                album: {
                    id: item.album.id,
                    name: item.album.name,
                },
                artist: {
                    id: item.artists[0].id,
                    name: item.artists[0].name,
                },
            })
        }
    }

    return parsedPayload;
};


const parseArtistsData = async (artistData, discography) => {
    let parsedArtistData = {
        id: null,
        name: null,
        images: null,
        discography: []
    };

    parsedArtistData.name = artistData.name;
    parsedArtistData.id = artistData.id;
    parsedArtistData.images = artistData.images;

    for (let album of discography.items) {
        parsedArtistData.discography.push({
            id: album.id,
            name: album.name,
            images: album.images,
        })
    }

    return parsedArtistData;
}

// Exports
module.exports = {
    parseSpotifyQueryResults,
    parseArtistsData
}
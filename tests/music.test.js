// Imports
const request = require("supertest");
const app = require("../index");

let testServer;

beforeAll(async () => {
    testServer = app.listen(1000, () => console.log('Test server listening on port 1000'));
});

afterAll(() => {
    testServer.close();
});

describe("GET /api/music/getSpotifyAccessToken", () => {
    it("Should return success code 200, cookie with Spotify token, and success message", async () => {
        const res = await request(testServer)
            .get("/api/music/getSpotifyAccessToken");

        const cookies = res.header['set-cookie'];

        expect(res.statusCode).toBe(200);
        expect(cookies[0]).not.toBeNull();
        expect(res.body).toBe('Spotify access token acquired...');
    })
});

describe("GET /api/music/getFeaturedAlbums", () => {
    it("Should return success code 200, and data object with 5 new album releases", async () => {
        await request(testServer)
            .get("/api/music/getSpotifyAccessToken");

        const res = await request(testServer)
            .get("/api/music/getFeaturedAlbums");

        const featuredAlbums = res.body.featuredAlbums;

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('New album releases from Spotify API acquired...');
        expect(featuredAlbums.albums.items.length).toBe(5);
    })
});

describe("GET /api/music/querySpotify", () => {
    it("Should return success code 200, and data object with 12 results for artists, albums, and tracks", async () => {
        await request(testServer)
            .get("/api/music/getSpotifyAccessToken");

        const res = await request(testServer)
            .get("/api/music/querySpotify?spotifyQuery=test");

        const searchResults = res.body.results;

        expect(res.statusCode).toBe(200);
        expect(searchResults.artists.items.length).toBe(12);
        expect(searchResults.albums.items.length).toBe(12);
        expect(searchResults.tracks.items.length).toBe(12);
    })
});

// TODO: test GET /api/music/:artistId/getArtistData
    // Failure
        // invalid or missing artist id
    // Success
        // valid artist id returns response

// TODO: test GET /api/music/:albumId/getAlbumData
    // Failure
        // invalid or missing album id
    // Success
        // valid album id returns response

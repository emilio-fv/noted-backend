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
})

describe("GET /api/music/getFeaturedAlbums", () => {
    // SUCCESS
    it("Should return success code 200, and data object with 5 new album releases", async () => {
        await request(testServer)
            .get("/api/music/getSpotifyAccessToken");

        const res = await request(testServer)
            .get("/api/music/getFeaturedAlbums");

        const featuredAlbums = res.body.featuredAlbums;
        console.log(featuredAlbums.albums.items);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('New album releases from Spotify API acquired...');
        expect(featuredAlbums.albums.items.length).toBe(5);
    })
})

// TODO: test POST /api/music/querySpotify
    // Failure
        // Invalid query
    // Success
        // Valid query returns response

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

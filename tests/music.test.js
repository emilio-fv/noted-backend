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
            .get("/api/music/querySpotify?spotifyQuery=test&offset=0");

        const searchResults = res.body.results;

        expect(res.statusCode).toBe(200);
        expect(searchResults.artists.length).toBe(6);
        expect(searchResults.albums.length).toBe(6);
        expect(searchResults.tracks.length).toBe(6);
    })
});

describe("GET /api/music/:artistId/getArtistData", () => {
    it("Should return success code 200, and data object with 1 new artist", async () => {
        await request(testServer)
            .get("/api/music/getSpotifyAccessToken");

        const res = await request(testServer)
            .get("/api/music/0TnOYISbd1XYRBk9myaseg/getArtistData");

        // const artistData = res.body.artistData;

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Artist data acquired...");
        expect(res.body.artistData).not.toBeNull();
    })
});

describe("GET /api/music/:albumId/getAlbumData", () => {
    it("Should return success code 200, and data object with 1 new album", async () => {
        await request(testServer)
            .get("/api/music/getSpotifyAccessToken");

        const res = await request(testServer)
            .get("/api/music/4aawyAB9vmqN3uQ7FjRGTy/getAlbumData");

        // const albumData = res.body.albumData;

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Album data acquired...");
        expect(res.body.albumData).not.toBeNull();
    })
});

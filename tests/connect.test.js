// Imports
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const { seedDb } = require('../seed');

let testServer;

beforeAll(async () => {
    testServer = app.listen(1000, () => console.log('Test server listening on port 1000'));

    await mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log('Test db connected')
    });

    await seedDb();
})

afterAll(() => {
    mongoose.disconnect();
    testServer.close();
});

describe("GET /api/connect/queryUser", () => {
    it("Should return status code 200, message 'User database queried', and array of found users", async () => {
        const loginRes = await request(testServer)
            .post("/api/auth/login")
            .send({
                email: 'test@test.com',
                password: 'Password1$'
            });

        const cookies = loginRes.header['set-cookie'];

        const res = await request(testServer)
            .get("/api/connect/queryUsers?searchQuery=test")
            .set('Cookie', cookies)

        const searchResults = res.body.results;

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('User database queried')
        expect(searchResults.length).toBeGreaterThan(0);
    })
});

describe("GET /api/connect/:username/profile", () => {
    it("Should return status code 200, message 'User's profile data fetched', and array of found users", async () => {
        const loginRes = await request(testServer)
            .post("/api/auth/login")
            .send({
                email: 'test@test.com',
                password: 'Password1$'
            });

        const cookies = loginRes.header['set-cookie'];

        const res = await request(testServer)
            .get("/api/connect/test/profile")
            .set('Cookie', cookies)

        const userProfileData = res.body.results;

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("User's profile data fetched")
        expect(userProfileData).not.toBe(null);
    })
});

describe("PUT /api/connect/:userId/follow", () => {
    it("Should return status code 200, and message 'User followed'", async () => {
        // Login
        const loginRes = await request(testServer)
            .post("/api/auth/login")
            .send({
                email: 'test@test.com',
                password: 'Password1$'
            });

        const cookies = loginRes.header['set-cookie'];

        // Search for user to obtain userId
        const searchRes = await request(testServer)
            .get("/api/connect/test2/profile")
            .set('Cookie', cookies) 

        // Follow user
        const userIdToFollow = searchRes.body.result._id;

        const followRes = await request(testServer)
            .put(`/api/connect/${userIdToFollow}/follow`)
            .set('Cookie', cookies)

        // Check follow response
        expect(followRes.statusCode).toBe(200)
        expect(followRes.body.message).toBe('User followed')

        // Check user's profile data is updated
        const userProfileRes = await request(testServer)
            .get("/api/connect/test/profile")
            .set('Cookie', cookies)

        expect(userProfileRes.statusCode).toBe(200);
        expect(userProfileRes.body.result.following.length).toBe(1);
    })
})

describe("PUT /api/connect/:userId/unfollow", () => {
    it("Should return status code 200, and message 'User unfollowed'", async () => {
        // Login
        const loginRes = await request(testServer)
            .post("/api/auth/login")
            .send({
                email: 'test@test.com',
                password: 'Password1$'
            });

        const cookies = loginRes.header['set-cookie'];

        // Search for user to obtain userId
        const searchRes = await request(testServer)
            .get("/api/connect/test2/profile")
            .set('Cookie', cookies) 

        // Follow user
        const userIdToFollow = searchRes.body.result._id;

        await request(testServer)
            .put(`/api/connect/${userIdToFollow}/follow`)
            .set('Cookie', cookies)

        // Unfollow user
        const unfollowRes = await request(testServer)
        .put(`/api/connect/${userIdToFollow}/unfollow`)
        .set('Cookie', cookies)

        // Check user's profile data is updated
        const userProfileRes = await request(testServer)
            .get("/api/connect/test/profile")
            .set('Cookie', cookies)

        expect(userProfileRes.statusCode).toBe(200);
        expect(userProfileRes.body.result.following.length).toBe(0);
    })
})
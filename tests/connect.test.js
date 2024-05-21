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
                password: 'password'
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
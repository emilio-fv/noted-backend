// Imports
const mongoose = require("mongoose");
const request = require("supertest");
const { seedDb } = require("../seed");
const app = require("../index");

let testServer;

beforeAll(async () => {
    testServer = app.listen(1000, () => console.log('Test server listening on port 1000'));
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log('Test db connected')
    })
    await seedDb();
});

afterAll(() => {
    mongoose.disconnect();
    testServer.close();
});

describe("POST /api/reviews/createReview", () => {
    it("Should return success code 200, the message 'Review successfully created', and the new review's data", async () => {
        const loginRes = await request(testServer)
        .post("/api/auth/login")
        .send({
            email: 'test@test.com',
            password: 'password'
        });

        const cookies = loginRes.header['set-cookie'];

        const res = await request(testServer)
        .post("/api/reviews/createReview")
        .set("Cookie", cookies)
        .send({
            artist: 'Pitbull',
            artistId: '0TnOYISbd1XYRBk9myaseg',
            album: 'Global Warming',
            albumId: '4aawyAB9vmqN3uQ7FjRGTy',
            albumImages: [
                {
                    "url": "https://i.scdn.co/image/ab67616d0000b2732c5b24ecfa39523a75c993c4",
                    "height": 640,
                    "width": 640
                    },
                    {
                    "url": "https://i.scdn.co/image/ab67616d00001e022c5b24ecfa39523a75c993c4",
                    "height": 300,
                    "width": 300
                    },
                    {
                    "url": "https://i.scdn.co/image/ab67616d000048512c5b24ecfa39523a75c993c4",
                    "height": 64,
                    "width": 64
                    }
            ],
            rating: 1,
            reviewText: "I've never listened to this album. This is a test",
            favorite: true,
            date: 'Mon, 13 May 2024 20:20:10 +0000',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Review successfully created');
        expect(res.body.reviewData).not.toBe(null);
    })
})

describe("GET /api/reviews/loggedInUser", () => {
    it("Should return status code 200, the message 'Reviews by logged in user successfully fetched', and an array of reviews", async () => {
        const loginRes = await request(testServer)
        .post("/api/auth/login")
        .send({
            email: 'test@test.com',
            password: 'password'
        });

        const cookies = loginRes.header['set-cookie'];

        const createReviewRes = await request(testServer)
        .post("/api/reviews/createReview")
        .set("Cookie", cookies)
        .send({
            artist: 'Pitbull',
            artistId: '0TnOYISbd1XYRBk9myaseg',
            album: 'Global Warming',
            albumId: '4aawyAB9vmqN3uQ7FjRGTy',
            albumImages: [
                {
                    "url": "https://i.scdn.co/image/ab67616d0000b2732c5b24ecfa39523a75c993c4",
                    "height": 640,
                    "width": 640
                    },
                    {
                    "url": "https://i.scdn.co/image/ab67616d00001e022c5b24ecfa39523a75c993c4",
                    "height": 300,
                    "width": 300
                    },
                    {
                    "url": "https://i.scdn.co/image/ab67616d000048512c5b24ecfa39523a75c993c4",
                    "height": 64,
                    "width": 64
                    }
            ],
            rating: 1,
            reviewText: "I've never listened to this album. This is a test",
            favorite: true,
            date: 'Mon, 13 May 2024 20:20:10 +0000',
        });

        const res = await request(testServer)
        .get("/api/reviews/loggedInUser")
        .set("Cookie", cookies)

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Reviews by logged in user successfully fetched');
        expect(res.body.reviewsData).not.toBe(null);
    })
})
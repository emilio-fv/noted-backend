// Imports
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const { seedDb } = require("../seed");
const { 
    verifyAccessToken, 
    verifyRefreshToken, 
    generateExpiredAccessToken, 
    generateExpiredRefreshToken, 
    generateRefreshToken 
} = require("../utils/jwt.utils");

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

describe("POST /api/auth/register", () => {
    it("Should return error code 400 & messages for missing required fields", async () => {
        const res = await request(testServer)
            .post("/api/auth/register")
            .send({
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.firstName).toHaveProperty('message', 'First name required.');
        expect(res.body.lastName).toHaveProperty('message', 'Last name required.');
        expect(res.body.username).toHaveProperty('message', 'Username required.');
        expect(res.body.email).toHaveProperty('message', 'Email required.');
        expect(res.body.password).toHaveProperty('message', 'Password required.');
        expect(res.body.confirmPassword).toHaveProperty('message', 'Confirm password required.');
    })

    it("Should return error code 400 & message if email is invalid.", async () => {
        const res = await request(testServer)
            .post("/api/auth/register")
            .send({
                firstName: 'Test',
                lastName: 'Test',
                username: 'test7',
                email: 'test',
                password: 'password',
                confirmPassword: 'password'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.email).toHaveProperty('message', 'Invalid email.');
    });

    it("Should return error code 400 & messages if username and email are already registered", async () => {
        const res = await request(testServer)
            .post("/api/auth/register")
            .send({
                firstName: 'Test',
                lastName: 'Test',
                username: 'test',
                email: 'test@test.com',
                password: 'password',
                confirmPassword: 'password'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.username).toHaveProperty('message', 'Username already registered.');
        expect(res.body.email).toHaveProperty('message', 'Email already registered.');
    })

    it("Should return error code 400 & messages if password does not meet security requirements", async () => {
        const res = await request(testServer)
            .post("/api/auth/register")
            .send({
                firstName: 'Test',
                lastName: 'Test',
                username: 'example',
                email: 'example@example.com',
                password: 'passwor',
                confirmPassword: 'passwor'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.password).toHaveProperty('message', 'Password must be at least 8 characters.');
    })

    it("Should return error code 400 & messages if confirm password and password do not match", async () => {
        const res = await request(testServer)
            .post("/api/auth/register")
            .send({
                firstName: 'Test',
                lastName: 'Test',
                username: 'example',
                email: 'example@example.com',
                password: 'password',
                confirmPassword: 'passwor7'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.confirmPassword).toHaveProperty('message', 'Passwords must match.');
    })

    it("Should return success code 200, cookies with access & refresh tokens, and the user's username when valid form data is provided", async () => {
        const res = await request(testServer)
            .post("/api/auth/register")
            .send({
                firstName: 'Emilio',
                lastName: 'Vazquez',
                username: 'milz6525',
                email: 'email@email.com',
                password: 'password',
                confirmPassword: 'password'
            });

        const cookies = res.header['set-cookie'];

        expect(res.statusCode).toBe(200);
        expect(cookies[0]).not.toBeNull(); // access token
        expect(cookies[1]).not.toBeNull(); // refresh token
        expect(res.body).toHaveProperty('username', 'milz6525');
    });
});

describe("POST /api/auth/login", () => {
    it("Should return error code 400 & message for unregistered email.", async () => {
        const res = await request(testServer)
            .post("/api/auth/login")
            .send({
                email: 'random@random.com',
                password: 'password'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid login.');
    });

    it("Should return error code 400 & message for incorrect password.", async () => {
        const res = await request(testServer)
            .post("/api/auth/login")
            .send({
                email: 'test@test.com',
                password: 'wrong-password'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid login.');
    });

    it("Should return success code 200, cookies with access & refresh tokens, and the user's username when valid form data is provided", async () => {
        const res = await request(testServer)
            .post("/api/auth/login")
            .send({
                email: 'test@test.com',
                password: 'password'
            });

        const cookies = res.header['set-cookie'];

        const accessTokenCookie = cookies.find((cookie) => cookie.startsWith('accessToken='));
        const refreshTokenCookie = cookies.find((cookie) => cookie.startsWith('refreshToken='));

        const accessToken = accessTokenCookie.split('accessToken=')[1].split(';')[0];
        const refreshToken = refreshTokenCookie.split('refreshToken=')[1].split(';')[0];

        const decodedAccessToken = await verifyAccessToken(accessToken);
        const decodedRefreshToken = await verifyRefreshToken(refreshToken);

        expect(res.statusCode).toBe(200);
        expect(accessTokenCookie).toBeDefined();
        expect(refreshTokenCookie).toBeDefined();
        expect(decodedAccessToken).toHaveProperty('userId');
        expect(decodedRefreshToken).toHaveProperty('userId');
        expect(res.body).toHaveProperty('username', 'test');
    });
});

describe("POST /api/auth/logout", () => {
    it("Should return success code 200, clear both access and refresh tokens from cookies, and return success message: 'User successfully logged out.'", async () => {
        const loginRes = await request(testServer)
            .post("/api/auth/login")
            .send({
                email: 'test@test.com',
                password: 'password'
            });

        const loginCookies = loginRes.header['set-cookie'];

        let accessTokenCookie = loginCookies.find((cookie) => cookie.startsWith('accessToken='));
        let refreshTokenCookie = loginCookies.find((cookie) => cookie.startsWith('refreshToken='));

        let accessToken = accessTokenCookie.split('accessToken=')[1].split(';')[0];
        let refreshToken = refreshTokenCookie.split('refreshToken=')[1].split(';')[0];

        let decodedAccessToken = await verifyAccessToken(accessToken);
        let decodedRefreshToken = await verifyRefreshToken(refreshToken);

        expect(loginRes.statusCode).toBe(200);
        expect(accessTokenCookie).toBeDefined();
        expect(refreshTokenCookie).toBeDefined();
        expect(decodedAccessToken).toHaveProperty('userId');
        expect(decodedRefreshToken).toHaveProperty('userId');
        expect(loginRes.body).toHaveProperty('username', 'test');

        const logoutRes = await request(testServer).post("/api/auth/logout");

        const logoutCookies = logoutRes.header['set-cookie'];

        accessTokenCookie = logoutCookies.find((cookie) => cookie.startsWith('accessToken='));
        refreshTokenCookie = logoutCookies.find((cookie) => cookie.startsWith('refreshToken='));

        accessToken = accessTokenCookie.split('accessToken=')[1].split(';')[0];
        refreshToken = refreshTokenCookie.split('refreshToken=')[1].split(';')[0];

        expect(logoutRes.statusCode).toBe(200);
        expect(accessToken).toBe("");
        expect(refreshToken).toBe("");
        expect(logoutRes.body).toHaveProperty('message', 'User successfully logged out.');
    });
});

describe("GET /api/auth/refresh", () => {
    it("Should return 401 status code and error message 'Unauthorized' when no refresh token is provided.", async () => {
        const res = await request(testServer).get("/api/auth/refresh");

        expect(res.statusCode).toBe(401);
        expect(res.body).toBe('Unauthorized.');
    });

    it("Should return 401 status code and error message 'ExpiredRefreshToken.' when an expired refresh token is provided.", async () => {
        const payload = {
            userId: 'test'
        };

        const expiredRefreshToken = await generateExpiredRefreshToken(payload);

        const res = await request(testServer)
            .get("/api/auth/refresh")
            .set('Cookie', [`refreshToken=${expiredRefreshToken};`]);

        expect(res.statusCode).toBe(401);
        expect(res.body).toBe('ExpiredRefreshToken.');
    });

    it("Should return 200 status code and message 'Access token refreshed successfully.' when expired access and valid refresh tokens are provided.", async () => {
        const payload = {
            userId: 'test'
        };

        const refreshToken = await generateRefreshToken(payload);

        const res = await request(testServer)
            .get("/api/auth/refresh")
            .set('Cookie', [`refreshToken=${refreshToken}`]);

        const cookies = res.header['set-cookie'];

        const accessTokenCookie = cookies.find((cookie) => cookie.startsWith('accessToken='));

        const accessToken = accessTokenCookie.split('accessToken=')[1].split(';')[0];

        const decodedAccessToken = await verifyAccessToken(accessToken);

        expect(res.statusCode).toBe(200);
        expect(accessTokenCookie).toBeDefined();
        expect(decodedAccessToken).toHaveProperty('userId', 'test');
        expect(res.body).toBe('Access token refreshed successfully.');
    });
});

describe("Authorization middleware", () => {
    xit("Should return 401 status code and message 'Unauthorized.' when no access token is provided", async () => {
        const res = await request(testServer).get('/api/auth');

        expect(res.statusCode).toBe(401);
        expect(res.body).toBe('Unauthorized');
    });

    xit("Should return 401 status code and error message 'ExpiredAccessToken.' when expired access token is provided.", async () => {
        const payload = {
            userId: 'test'
        };

        const expiredAccessToken = await generateExpiredAccessToken(payload);

        const res = await request(testServer)
            .get('/api/auth')
            .set('Cookie', [`accessToken=${expiredAccessToken}`]);

        expect(res.statusCode).toBe(401);
        expect(res.body).toBe('ExpiredAccessToken.');
    });

    xit("Should return 200 and logged in user's data (firstName, lastName, username, and email)", async () => {
        let res = await request(testServer)
            .post("/api/auth/login")
            .send({
                email: 'test@test.com',
                password: 'password'
            });

        const cookies = res.header['set-cookie'];

        const accessTokenCookie = cookies.find((cookie) => cookie.startsWith('accessToken='));
        const refreshTokenCookie = cookies.find((cookie) => cookie.startsWith('refreshToken='));

        const accessToken = accessTokenCookie.split('accessToken=')[1].split(';')[0];
        const refreshToken = refreshTokenCookie.split('refreshToken=')[1].split(';')[0];

        const decodedAccessToken = await verifyAccessToken(accessToken);
        const decodedRefreshToken = await verifyRefreshToken(refreshToken);

        expect(res.statusCode).toBe(200);
        expect(accessTokenCookie).toBeDefined();
        expect(refreshTokenCookie).toBeDefined();
        expect(decodedAccessToken).toHaveProperty('userId');
        expect(decodedRefreshToken).toHaveProperty('userId');
        expect(res.body).toHaveProperty('username', 'test');

        res = await request(testServer)
            .get("/api/auth")
            .set('Cookie', [`accessToken=${accessToken};`]);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('firstName', 'Test');
        expect(res.body).toHaveProperty('lastName', 'Test');
        expect(res.body).toHaveProperty('username', 'test');
        expect(res.body).toHaveProperty('email', 'test@test.com');
    })

})
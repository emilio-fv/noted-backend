// Imports
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3030;
const { connectDb } = require('./config/mongoose.config');
const { seedDb } = require('./seed');
const { authRouter } = require('./api/auth/auth.routes');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// TODO Setup API endpoints
app.use('/api/auth', authRouter);

// Test API endpoint
app.get('/', async (req, res) => 
    res.send('Noted Backend Server')
);

// Initialize server
const main = async () => {
    try {
        await connectDb();

        if (process.env.NODE_ENV !== 'production') {
            await seedDb();
        }

        app.listen(PORT, () => 
            console.log('Noted Backend Server listening on port: ' + PORT)
        );
    } catch (error) {
        console.log(error);
    }
}

if (process.env.NODE_ENV !== 'test') {
    main();
}

module.exports = app;
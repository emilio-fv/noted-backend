// Imports
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const PORT = process.env.PORT || 3000;
const { connectDb } = require('./config/mongoose.config');
const { seedDb } = require('./seed');
const { authRouter } = require('./api/auth/auth.routes');

const origins = [
    // TODO
    '*'
]

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        if(!origin || origins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Origin not allowed by CORS'))
        }
    },
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    methods: ['POST', 'PUT', 'GET'],
    credentials: true

}))
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());

// API endpoints
// app.use('/api/auth', authRouter);

// Entry API endpoint
app.get('/', async (req, res) => {
        try {
            res.send('Noted Backend Server')
        } catch (error) {
            res.send(error);
        }
    }
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
// Imports
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const process = require('node:process');
const { connectDb } = require('./config/mongoose.config');
const { seedDb } = require('./seed');
const { authRouter } = require('./api/auth/auth.routes');
const { musicRouter } = require('./api/music/music.routes');
const { reviewsRouter } = require('./api/reviews/reviews.routes');
const { connectRouter } = require('./api/connect/connect.routes');

// Instantiate & configure server
const app = express();
const PORT = process.env.PORT || 3000;

// Define CORS origins
const allowedOrigins = [
    'http://localhost:8000', // dev domain
    'https://noted-frontend-emilio-fv.vercel.app', // prod domain
    'https://noted-frontend.vercel.app', // prod domain
];

// Middleware
app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
          var msg = 'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    methods: ['POST', 'PUT', 'GET', 'DELETE'],
    credentials: true,
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());

// API endpoints
app.use('/api/auth', authRouter);
app.use('/api/music', musicRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/connect', connectRouter);

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

        app.listen(PORT, () => {            
            console.log('Noted Backend Server listening on port: ' + PORT);
            console.log(process.env.MONGODB_URI);
        });
    } catch (error) {
        console.log(error);
    }
}

if (process.env.NODE_ENV !== 'test') {
    main();
}

module.exports = app;
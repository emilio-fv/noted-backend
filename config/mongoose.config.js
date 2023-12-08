// Imports
const mongoose = require('mongoose');
const process = require('node:process');
const MONGODB_URI = encodeURIComponent(process.env.MONGODB_URI);

// Connect to mongodb 
const connectDb = async () => {
    try {
        await mongoose.connect(MONGODB_URI).then(() => {
            console.log('Connected to db successfully');
        })
    } catch (error) {
        // TODO: handle error
        console.log(error);
    }
}

// Exports
module.exports = {
    connectDb,
}
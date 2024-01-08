// Imports
const mongoose = require('mongoose');

// Connect to mongodb 
const connectDb = async () => {
    try {
        const mongodbConnection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Mongo db connected: ${mongodbConnection.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

// Exports
module.exports = {
    connectDb,
}

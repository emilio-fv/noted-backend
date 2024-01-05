// Imports
const mongoose = require('mongoose');

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@cluster0.phxrehb.mongodb.net/?retryWrites=true&w=majority`;


// Connect to mongodb 
const connectDb = async () => {
    console.log(MONGODB_URI);

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

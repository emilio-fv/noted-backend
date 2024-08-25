// Imports
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Author data schema
const authorDataSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        required: true 
    },
    username: { 
        type: String, 
        required: true 
    }
}, { _id: false });

// Exports
module.exports = {
    authorDataSchema
}
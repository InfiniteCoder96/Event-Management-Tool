const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

// create collection and add schema
const Message = mongoose.model('messages', MessageSchema);

module.exports = Message;
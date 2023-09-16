const mongoose = require("mongoose");

const User = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    status:{
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('user', User);
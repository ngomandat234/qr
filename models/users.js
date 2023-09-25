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
        default: ''
    },
    qrCode: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    status:{
        type: Number,
        default: 1
    },
    trackings: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'qr_tracking'
    }]
});

module.exports = mongoose.model('user', User);
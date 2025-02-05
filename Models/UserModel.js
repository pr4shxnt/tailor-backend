const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    number: {
        type: Number,
        required: true,
        min: 8,
        max: 10
    },
    Address: {
        type: String,
        required: true
    }

}, { timestamps: true });
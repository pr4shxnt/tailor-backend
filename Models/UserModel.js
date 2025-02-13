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
    role: {
        type: String,
        default: 'user'
    },
    number: {
        type: Number,
        required: true,
        min: 10000000,
        max: 99999999999,
    },
    Address: {
        type: String,
        required: true
    }

}, { timestamps: true });


const User = mongoose.model('User', userSchema);
module.exports = User;
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    masterCategory: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    avgRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    feedback: [
        {
            userName: {
                type: String,
                // Removed 'required: true'
            },
            content: {
                type: String,
                // Removed 'required: true'
            },
            rating: {
                type: Number,
                min: 0,
                max: 5
                // Removed 'required: true'
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    stock: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            required: true
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

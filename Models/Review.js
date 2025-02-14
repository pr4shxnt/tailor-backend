const mongoose = require('mongoose');


const reviewComments = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
})


const reviewSchema = new mongoose.Schema({  
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    reviews: [reviewComments]
    
}, { timestamps: true });


module.exports = mongoose.model('Review', reviewSchema);
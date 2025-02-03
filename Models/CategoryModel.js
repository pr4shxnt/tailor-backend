const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    masterCategoryName: {
        type: String,
        index: true,
        required: true
    },
    
},
 { timestamps: true 
});

module.exports = mongoose.model('Category', categorySchema);
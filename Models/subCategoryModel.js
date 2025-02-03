const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    masterCategoryName: {
        type: String,
        required: true,
    },
    categoryName:{
        type: String,
        required: true,
    }
},
 { timestamps: true 
});

module.exports = mongoose.model('SubCategory', categorySchema);
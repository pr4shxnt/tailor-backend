const mongoose = require('mongoose');

// Define the schema
const masterCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

// Check if the model is already compiled
const MasterCategory = mongoose.models.MasterCategory || mongoose.model('MasterCategory', masterCategorySchema);

module.exports = MasterCategory;

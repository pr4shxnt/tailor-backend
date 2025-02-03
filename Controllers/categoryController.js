const Category = require('../Models/CategoryModel');
const MasterCategory = require('../Models/masterCategoryModel'); // Import the MasterCategory model

// Create a new category
// In categoryController.js

exports.createCategory = async (req, res) => {
    try {
      const { name, masterCategoryId } = req.body;  // Ensure you receive masterCategoryId
      
      // Validate input
      if (!name || !masterCategoryId) {
        return res.status(400).json({ message: 'Name and masterCategory are required' });
      }
  
      // Find the master category by ID
      const masterCategory = await MasterCategory.findById(masterCategoryId);
      if (!masterCategory) {
        return res.status(404).json({ message: 'Master category not found' });
      }
  
      // Create the new category
      const newCategory = new Category({
        name,
        masterCategoryName: masterCategory.name, // Store the master category name
      });
  
      const savedCategory = await newCategory.save();
      res.status(201).json(savedCategory);
    } catch (error) {
        console.error('Error creating category:', error);  // Log the error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
  

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
    try {
        const { name, masterCategoryId } = req.body; // Expect masterCategoryId (the ID) as well

        // Check if the category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        // Find the master category by ID to get the name
        const masterCategory = await MasterCategory.findById(masterCategoryId);
        if (!masterCategory) {
            return res.status(404).json({ message: 'Master category not found' });
        }

        // Update the category
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, masterCategoryName: masterCategory.name }, // Update both name and masterCategoryName
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

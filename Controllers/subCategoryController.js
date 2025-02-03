const Category = require('../Models/CategoryModel');
const MasterCategory = require('../Models/masterCategoryModel'); // Import the MasterCategory model
const SubCategory = require('../Models/CategoryModel');


exports.createSubCategory = async (req, res) => {
    try {
      const { name, masterCategoryId, categoryId } = req.body;  // Ensure you receive masterCategoryId
      
      // Validate input
      if (!name || !masterCategoryId || !categoryId) {
        return res.status(400).json({ message: 'Name , category or masterCategory are required' });
      }
  
      // Find the master category by ID
      const masterCategory = await MasterCategory.findById(masterCategoryId);
      if (!masterCategory) {
        return res.status(404).json({ message: 'Master category not found' });
      }

      const category = await category.findById(categoryId);
      if (!masterCategory) {
        return res.status(404).json({ message: 'category not found' });
      }
  
      // Create the new category
      const newSubCategory = new SubCategory({
        name,
        masterCategoryName: masterCategory.name, // Store the master category name
        categoryName: category.name
      });
  
      const savedCategory = await newSubCategory.save();
      res.status(201).json(savedCategory);
    } catch (error) {
        console.error('Error creating category:', error);  // Log the error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
  

// Get all categories
exports.getAllSubCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



// Delete a category by ID
exports.deleteSubCategory = async (req, res) => {
    try {
        const category = await SubCategory.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

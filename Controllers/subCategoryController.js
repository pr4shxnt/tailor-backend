const Category = require('../Models/CategoryModel');
const MasterCategory = require('../Models/masterCategoryModel');
const SubCategory = require('../Models/subCategoryModel'); // Correct import

// Create a new SubCategory
exports.createSubCategory = async (req, res) => {
    try {
        const { name, masterCategoryId, categoryId } = req.body;

        // Validate input
        if (!name || !masterCategoryId || !categoryId) {
            return res.status(400).json({ message: 'Name, category, or master category are required' });
        }

        // Find the master category by ID
        const masterCategory = await MasterCategory.findById(masterCategoryId);
        if (!masterCategory) {
            return res.status(404).json({ message: 'Master category not found' });
        }

        // Find the category by ID
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Create the new subcategory
        const newSubCategory = new SubCategory({
            name,
            masterCategoryName: masterCategory.name, // Store master category name
            categoryName: category.name // Store category name
        });

        const savedSubCategory = await newSubCategory.save();
        res.status(201).json(savedSubCategory);
    } catch (error) {
        console.error('Error creating subcategory:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Get all subcategories
exports.getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find();
        res.status(200).json(subCategories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get subcategories by master category name
exports.getCategoriesByMasterCategory = async (req, res) => {
  try {
      const { masterCategoryName } = req.params;
      const Categories = await Category.find({ masterCategoryName });
      
      if (!Categories.length) {
          return res.status(404).json({ message: 'No subcategories found for this master category.' });
      }

      res.status(200).json(Categories);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Delete a subcategory by ID
exports.deleteSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
        if (!subCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.status(200).json({ message: 'Subcategory deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

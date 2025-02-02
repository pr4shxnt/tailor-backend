const  Category = require('../Models/CategoryModel');

// Create a new  category
exports.createCategory = async (req, res) => {
    try {
        const { name, Category  } = req.body;

        // Check if the  category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Master category already exists' });
        }

        const newCategory = new  Category({ name, Category });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all  categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a single  category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Master category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a  category by ID
exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if the  category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Master category already exists' });
        }

        const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Master category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a  category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Master category not found' });
        }
        res.status(200).json({ message: 'Master category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
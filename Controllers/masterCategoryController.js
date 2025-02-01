const MasterCategory = require('../Models/masterCategoryModel');

// Create a new master category
exports.createMasterCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if the master category already exists
        const existingCategory = await MasterCategory.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Master category already exists' });
        }

        const newCategory = new MasterCategory({ name });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all master categories
exports.getAllMasterCategories = async (req, res) => {
    try {
        const categories = await MasterCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a single master category by ID
exports.getMasterCategoryById = async (req, res) => {
    try {
        const category = await MasterCategory.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Master category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a master category by ID
exports.updateMasterCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if the master category already exists
        const existingCategory = await MasterCategory.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Master category already exists' });
        }

        const category = await MasterCategory.findByIdAndUpdate(req.params.id, { name }, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Master category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a master category by ID
exports.deleteMasterCategory = async (req, res) => {
    try {
        const category = await MasterCategory.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Master category not found' });
        }
        res.status(200).json({ message: 'Master category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
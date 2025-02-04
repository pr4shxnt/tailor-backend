const Product = require('../models/productModel');
const multer = require('multer');
const path = require('path');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure 'uploads' directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const images = req.files.map(file => file.path);
        const productData = { ...req.body, images };
        const product = new Product(productData);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        let updateData = req.body;
        if (req.files && req.files.length > 0) {
            const images = req.files.map(file => file.path);
            updateData.images = images;
        }
        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error updating product', error });
    }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
};

// Add feedback to a product
exports.addFeedback = async (req, res) => {
    const { userName, content, rating } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.feedback.push({ userName, content, rating });

        // Update average rating
        const totalRatings = product.feedback.reduce((sum, fb) => sum + fb.rating, 0);
        product.rating = totalRatings / product.feedback.length;

        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error adding feedback', error });
    }
};

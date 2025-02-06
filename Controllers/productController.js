const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../Models/ProductsModel');

const router = express.Router();

// Get file extension from MIME type
const getFileExtension = (mimeType) => {
    switch (mimeType) {
        case 'image/jpeg':
            return '.jpg';
        case 'image/png':
            return '.png';
        case 'image/webp':
            return '.webp';
        default:
            return ''; // If file type is not supported, return empty extension
    }
};

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Get the correct file extension from MIME type
        const fileExtension = getFileExtension(file.mimetype);
        if (!fileExtension) {
            return cb(new Error('Unsupported file type'));
        }
        cb(null, file.fieldname + '-' + Date.now() + fileExtension);
    }
});

// Multer configuration
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /webp|jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Controller to create a new product
exports.createNewProduct = async (req, res) => {
    const { name, masterCategory, category, subCategory, price, size, brand, stock, description } = req.body;
    // Map the filenames of the uploaded images
    const images = req.files.map(file => file.filename);
    try {
        const newProduct = new Product({
            name,
            masterCategory,
            category,
            subCategory,
            price,
            size,
            brand,
            stock,
            description,
            images
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

// Controller to get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

// Controller to update a product
exports.updateProduct = async (req, res) => {
    const { name, masterCategory, category, subCategory, price, size, brand, stock, description } = req.body;
    // Map the filenames of the uploaded images
    const images = req.files.map(file => file.filename);
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, {
            name,
            masterCategory,
            category,
            subCategory,
            price,
            size,
            brand,
            stock,
            description,
            images
        }, { new: true });
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Controller to delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete images from server
        product.images.forEach(image => {
            const imagePath = path.join(__dirname, '../uploads', image);
            fs.unlinkSync(imagePath);
        });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../Models/ProductsModel');

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Fetch all products
exports.createNewProduct = async (req, res) => {
    const { name, masterCategory, category, subCategory, price, size, brand, stock, description } = req.body;
    const images = req.files.map(file => file.filename);
    try {
        const newProduct = new Product({ name, masterCategory, category, subCategory, price, size, brand, stock, description, images });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};


exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
}



const express = require("express");
const Product = require("../Models/ProductsModel");
const User = require("../Models/UserModel");
const Review = require("../Models/Review");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")

exports.addReview = async (req, res) => {
    try {
        const { product, user, rating, comment, token } = req.body;

        if (!token) {
            return res.status(401).json({ message: "No session ID provided" });
        }

        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;

            if (userId !== user) {
                return res.status(403).json({ message: "User ID is tampered" });
            }
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }

        const productDetails = await Product.findById(product);
        if (!productDetails) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if a review already exists for the product
        let reviewDoc = await Review.findOne({ product });

        if (reviewDoc) {
            // Append a new review to the existing product review
            reviewDoc.reviews.push({ user, rating, comment });
        } else {
            // Create a new review document
            reviewDoc = new Review({
                product,
                reviews: [{ user, rating, comment }]
            });
        }

        await reviewDoc.save();

        res.status(201).json({ message: "Review added successfully", review: reviewDoc });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getReviewByProductId = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate productId before querying
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const reviews = await Review.findOne({ product: productId }).populate("reviews.user", "name");

        if (!reviews) {
            return res.status(404).json({ message: "No reviews found for this product" });
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.deleteReviewByUserId = async (req, res) => {
    try {
        const { productId, userId, token } = req.body;

        if (!token) {
            return res.status(401).json({ message: "No session ID provided" });
        }

        let decodedUserId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            decodedUserId = decoded.id;

            if (decodedUserId !== userId) {
                return res.status(403).json({ message: "User ID is tampered" });
            }
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const reviewDoc = await Review.findOne({ product: productId });
        if (!reviewDoc) {
            return res.status(404).json({ message: "No reviews found for this product" });
        }

        // Find the review by user
        const reviewIndex = reviewDoc.reviews.findIndex(r => r.user.toString() === userId);
        if (reviewIndex === -1) {
            return res.status(404).json({ message: "Review not found for this user" });
        }

        // Remove the review from the array
        reviewDoc.reviews.splice(reviewIndex, 1);

        // Save the updated review document
        await reviewDoc.save();

        res.status(200).json({ message: "Review deleted successfully", review: reviewDoc });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

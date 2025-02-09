const Cart = require('../Models/Cart');
const Product = require('../Models/ProductsModel'); // Assuming you have a Product model to check prices
const jwt = require('jsonwebtoken'); // Import the JWT package for decoding

// Add an item to the cart
exports.addToCart = async (req, res) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers.authorization?.split(" ")[1];  // Extract token from "Bearer <token>"
        console.log(token);
        
        if (!token) {
            return res.status(401).json({ message: 'No session or user ID, authorization denied' });
        }

        // Decode the token to get the user ID
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;  // Extract user ID from the decoded token
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const { productId, quantity } = req.body;

        // Get the product details to get the price
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        const price = product.price;  // Assuming product has a price field

        // Check if the user already has a cart
        let cart = await Cart.findOne({ userId });

        // If cart doesn't exist, create a new one
        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity, price }],
                totalPrice: quantity * price
            });
        } else {
            // Add the item to the existing cart or update its quantity if it exists
            const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (existingItemIndex > -1) {
                // Update the quantity of the existing item
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item to cart
                cart.items.push({ productId, quantity, price });
            }

            // Recalculate total price
            cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding to cart' });
    }
};

// Get the user's cart
exports.getCart = async (req, res) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers.authorization?.split(" ")[1];  // Extract token from "Bearer <token>"
        if (!token) {
            return res.status(401).json({ message: 'No session or user ID, authorization denied' });
        }

        // Decode the token to get the user ID
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;  // Extract user ID from the decoded token
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const cart = await Cart.findOne({ userId }).populate('items.productId'); // Ensure populate works correctly

        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cart' });
    }
};


exports.getCartByUserID = async (req, res) => {

    const token = req.params.sessionid;  // Extract token from "Bearer <token>"
        if (!token) {
            return res.status(401).json({ message: 'No session or user ID, authorization denied' });
        }

        console.log(token);
        

        // Decode the token to get the user ID
        let userId;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;

        console.log(userId);
        
        try {
          
            
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cart' });
    }
};


// Remove an item from the cart
exports.removeFromCart = async (req, res) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: 'Authorization denied, token missing' });
        }
        const token = authHeader.split(" ")[1];

        // Decode token
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const { productId } = req.params;

        // Find and update the cart efficiently
        const updatedCart = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId } } }, // Remove item from cart
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Recalculate total price dynamically
        updatedCart.totalPrice = updatedCart.items.reduce((total, item) => total + item.quantity * item.price, 0);
        await updatedCart.save();

        res.status(200).json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing item from cart' });
    }
};
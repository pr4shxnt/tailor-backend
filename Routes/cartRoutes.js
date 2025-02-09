const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart,getCartByUserID } = require('../Controllers/cartContoller');

// Add item to cart (protected route)
router.post('/add', addToCart);

// Get cart details (protected route)
router.get('/', getCart);

router.get('/:sessionid', getCartByUserID)

// Remove item from cart (protected route)
router.delete('/remove/:productId', removeFromCart);

module.exports = router;

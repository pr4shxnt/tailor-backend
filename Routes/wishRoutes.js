const express = require('express');
const router = express.Router();
const wishlistController = require('../Controllers/wishlistController');

console.log("Wishlist Controller:", wishlistController); // Debugging

const { addToWishList,checkProductWishList , getWishListbyID, removeFromWishList, clearWishList } = wishlistController;





// Route to add an item to the wishlist
router.post('/add', addToWishList);

router.get('/:userId', getWishListbyID)

// Route to remove an item from the wishlist
router.delete('/remove', removeFromWishList);

router.get("/check/:userId/:productId", checkProductWishList);

// Route to clear the entire wishlist for a user
router.delete('/:userId', clearWishList);

module.exports = router;

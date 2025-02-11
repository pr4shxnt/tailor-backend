
const WishList = require('../Models/wishListModel');

// Add item to wishlist
exports.addToWishList = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Validate input
        if (!userId || !productId) {
            return res.status(400).json({ message: "userId and productId are required." });
        }

        // Check if wishlist exists
        let wishlist = await WishList.findOne({ userId });

        if (!wishlist) {
            wishlist = new WishList({ userId, items: [{ productId }] });
        } else {
            const itemExists = wishlist.items.some(item => item.productId.toString() === productId);
            if (itemExists) {
                return res.status(400).json({ message: "Item already in wishlist" });
            }
            wishlist.items.push({ productId });
        }

        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (error) {
        console.error("Error adding to wishlist:", error); // Log full error
        res.status(500).json({ message: "Error adding to wishlist", error: error.message });
    }
};

exports.getWishListbyID = async (req, res) => {
    try {
        const { userId } = req.params;
        let wishlist = await WishList.findOne({ userId }).populate('items.productId'); // Populate product details

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        console.error("Error fetching wishlist:", error.message);
        res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
    }
};

// Remove item from wishlist
exports.removeFromWishList = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        let wishlist = await WishList.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
        await wishlist.save();

        res.status(200).json({ message: 'Item removed from wishlist', wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item', error: error.message });
    }
};

// Clear wishlist
exports.clearWishList = async (req, res) => {
    try {
        const { userId } = req.params;
        let wishlist = await WishList.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.items = [];
        await wishlist.save();

        res.status(200).json({ message: 'Wishlist cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing wishlist', error: error.message });
    }
};

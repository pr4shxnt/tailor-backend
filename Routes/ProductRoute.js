const express = require('express');
const productController = require('../Controllers/productController');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Custom multer storage to handle file extensions properly
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname).toLowerCase();
        cb(null, file.fieldname + '-' + Date.now() + fileExtension);
    }
});

// Multer setup with the storage configuration
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (jpeg, jpg, png, webp) are allowed'));
        }
    }
});

// Route for creating a product with image upload (handles up to 10 images)
router.post('/create', upload.array('images', 10), productController.createNewProduct);

// Other product routes
router.get('/', productController.getAllProducts);
router.put('/update/:id', upload.array('images', 10), productController.updateProduct);  // Added file upload support for update
router.delete('/:id', productController.deleteProduct);
router.get('/:id', productController.getProductById);




module.exports = router;

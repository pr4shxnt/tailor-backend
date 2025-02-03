const express = require('express');
const  categoryController = require('../Controllers/categoryController');

const router = express.Router();

router.post('/create',  categoryController.createCategory);
router.get('/',  categoryController.getAllCategories);
router.get('/:id',  categoryController.getCategoryById);
router.put('/:id',  categoryController.updateCategory);
router.delete('/:id',  categoryController.deleteCategory);

module.exports = router;  // Make sure you are exporting the router itself

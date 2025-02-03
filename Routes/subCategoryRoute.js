const express = require('express');
const subCategoryController = require('../Controllers/subCategoryController');


const router = express.Router();

router.post('/create', subCategoryController.createSubCategory);
router.get('/', subCategoryController.getAllSubCategories);
router.delete('/:id', subCategoryController.deleteSubCategory);

module.exports = router;  // Make sure you are exporting the router itself
const express = require('express');
const masterCategoryController = require('../Controllers/masterCategoryController');

const router = express.Router();

router.post('/create', masterCategoryController.createMasterCategory);
router.get('/', masterCategoryController.getAllMasterCategories);
router.get(' /:id', masterCategoryController.getMasterCategoryById);
router.put('/:id', masterCategoryController.updateMasterCategory);
router.delete('/delete/:id', masterCategoryController.deleteMasterCategory);

module.exports = router;  // Make sure you are exporting the router itself

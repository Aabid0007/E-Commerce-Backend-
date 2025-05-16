const express = require('express');
const { getAllSubCategories, createSubCategory, setSubCategoryStatus, getSubCategoryById, updateSubCategory, deleteSubCategory, getActiveSubCategories } = require('../controllers/subCategory.Controller');
const router = express.Router();

router.route('/').get(getAllSubCategories);
router.route('/active').get(getActiveSubCategories);
router.route('/').post(createSubCategory);
router.route('/:id').get(getSubCategoryById);
router.route('/:id').put(updateSubCategory);
router.route('/:id/status').put(setSubCategoryStatus);
router.route('/:id').delete(deleteSubCategory);

module.exports = router;
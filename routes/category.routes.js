const express = require('express');
const multer = require('multer');
const { getAllCategories, getActiveCategories, createCategory, getCategory, updateCategory, deleteCategory, } = require('../controllers/category.Controllers');
const upload  = require('../config/multer');
const { validateToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getAllCategories);
router.route('/active').get(getActiveCategories);
router.route('/:id').get(getCategory);
router.route('/').post( multer({ storage:upload }).single('image'),createCategory);
router.route('/:id').put( multer({ storage:upload }).single('image'),updateCategory);
router.route('/:id').delete(validateToken, isAdmin, deleteCategory);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getCategorys, createCategory, getCategory, updateCategory, deleteCategory, } = require('../controllers/category.Controllers');
const upload  = require('../config/multer');
const multer = require('multer');

router.route('/').get(getCategorys);
router.route('/').post(multer({ storage:upload }).single('images'),createCategory);
router.route('/:id').get(getCategory);
router.route('/:id').put(multer({ storage:upload }).single('images'),updateCategory);
router.route('/:id').delete(deleteCategory);

module.exports = router;
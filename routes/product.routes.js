const express = require('express');
const router = express.Router();
const {
    createProduct, 
    getAllProducts, 
    getProduct, 
    updateProduct, 
    deleteProduct, 
    getActiveProducts
} = require('../controllers/product.controller');
const upload  = require('../config/multer');
const multer = require('multer');
const { validateToken, isAdmin } = require('../middleware/authMiddleware');

router.route('/').get(getAllProducts);
router.route('/active').get(getActiveProducts);
router.route('/:id').get(getProduct);
router.route('/').post(validateToken, isAdmin, multer({ storage:upload }).array('images', 5),createProduct);
router.route('/:id').put(validateToken,isAdmin, multer({ storage:upload }).array('images', 5),updateProduct)
router.route('/:id').delete(validateToken, isAdmin, deleteProduct);

module.exports = router;
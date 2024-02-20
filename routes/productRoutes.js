const express = require('express');
const router = express.Router();
const {createProduct, getProductsEndpoint, getProduct, updateProduct, deleteProduct} = require('../controllers/product.Controllers');
const upload  = require('../config/multer');
const multer = require('multer');

router.route('/').get(getProductsEndpoint);
router.route('/').post(multer({ storage:upload }).array('images', 5),createProduct);
router.route('/:id').get(getProduct);
router.route('/:id').put(multer({ storage:upload }).array('images', 5),updateProduct)
router.route('/:id').delete(deleteProduct)

module.exports = router;
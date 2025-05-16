const express = require('express');
const { addToCart, removeFromCart, getUserBuyingCarts, updateQuantity } = require('../controllers/cart.controller');
const { validateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(validateToken, addToCart);
router.route('/:productId').delete(validateToken, removeFromCart);
router.route('/').get(validateToken, getUserBuyingCarts);
router.route("/:productId").put(validateToken, updateQuantity);

module.exports = router;
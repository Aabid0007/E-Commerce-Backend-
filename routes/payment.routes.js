const express = require('express');
const { createCheckoutSession, retrieveCheckoutSession } = require('../controllers/payment.Controller');
const { validateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/checkout-session').post(validateToken ,createCheckoutSession);
router.route('/retrieve-checkout-session/:id').get(validateToken ,retrieveCheckoutSession);

module.exports = router;
const express = require('express');
const { bestSellerProducts } = require('../controllers/bestSeller.controller');
const router = express.Router();

router.route('/').get(bestSellerProducts);

module.exports =router;
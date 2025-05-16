const express = require('express');
const { loginAdmin } = require('../controllers/admin.controller');
const router = express.Router();

router.route('/login').post(loginAdmin);

module.exports = router;
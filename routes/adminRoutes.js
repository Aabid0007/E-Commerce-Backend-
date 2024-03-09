const express = require('express');
const { loginAdmin } = require('../controllers/admin.Controller');
const router = express.Router();

router.route('/login').post(loginAdmin);

module.exports = router;
const express = require('express');
const { createUser, loginUser, getAllUser, getUserProfile, logoutUser } = require('../controllers/user.Controllers');
const { validateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route("/profile").get(validateToken, getUserProfile);
router.route("/all-users").get(validateToken, getAllUser);

module.exports = router;
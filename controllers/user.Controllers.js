const asyncHandler = require('express-async-handler');
const User = require('../models/user.Model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const getUser = asyncHandler(async (req, res) => {
    const user = await User.find({ role: "user" });
    res.status(200).json({user}); 
})


// users register
const usersRegister = asyncHandler(async (req, res) => {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
        return res.status(400).json({ status: 'error', error: 'All fields are mandatory!' });
    }
    const userAvailable = await User.findOne({ email });
    
    if (userAvailable) {
        return res.status(400).json({ status: 'error', error: "User already exists. Please choose a different email" })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        phone,
    });

    res.status(201).json({user})
});



// login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ status: 'error', error: "Please provide both email and password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ status: 'error', error: "user not found" });
    }
    if (user.role !== "user") {
        return res.status(403).json({ status: 'error', error: "Unauthorized. user access required." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ status: 'error', error: "Wrong password" })
    }
    const Token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie('userToken', Token, { httpOnly: false, maxAge: 60 * 60 * 1000  , withCredentials: true, });

    res.status(200).json({ userId:user._id });
});



module.exports = {
    usersRegister,
    loginUser,
    getUser
}
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/generateToken');


const getAllUser = asyncHandler(async (req, res) => {
    const user = await User.find({ role: "user" });
    res.status(200).json({ user });
})


// users register
const createUser = asyncHandler(async (req, res) => {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
        return res.status(400).json({
            status: 'error',
            error: 'All fields are mandatory!'
        });
    }
    const userExist = await User.findOne({ email });

    if (userExist) {
        return res.status(400).json({
            status: 'error',
            error: "User already exists. Please choose a different email"
        });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        phone,
    });
    generateToken(res, user._id, user.role);

    return res.status(200).json({
        status: 'success',
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        message: 'user registered successfully'
    });
});



// login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: 'error',
            error: "Please provide both email and password"
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                status: 'error',
                error: "user not found"
            });
        }

        if (user.role !== "user") {
            return res.status(403).json({
                status: 'error',
                error: "Unauthorized. Only users can log in."
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 'error', error: "Wrong password" })
        }
        generateToken(res, user._id, user.role);

        return res.status(200).json({
            status: 'success',
            user: {
                userId: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            message: 'user logged in successfully'
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });

    }
});


// logout user
const logoutUser = asyncHandler(async (req, res) => {
    console.log('Clearing authJWT cookie...');

    res.clearCookie("authJWT", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict"
    });

    res.status(200).json({
        status: 'success',
        message: "Logged out successfully"
    });
});


const getUserProfile = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ status: 'error', error: "Unauthorized. User not found." });
    }

    const user = await User.findById(req.user._id).select("username email");

    if (!user) {
        return res.status(404).json({ status: 'error', error: "User not found" });
    }

    return res.status(200).json({
        status: 'success',
        user: {
            userId: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
        },
        message: 'User retrieved successfully'
    });

});


module.exports = {
    createUser,
    loginUser,
    getAllUser,
    logoutUser,
    getUserProfile
}
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user.Model");

const validateToken = asyncHandler(async (req, res, next) => {
    let token = req.cookies.authJWT;

    if (!token) {
        return res.status(401).json({
            status: 'error', 
            error: "Unauthorized. Token expired ."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized. User not found." });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized. Invalid token."
        });
        console.log("error");
        
    }
});

// Middleware to verify admin authentication 
const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden. Admin access required." });
    }
    next();
};

// Middleware to verify user authentication
const isUser = (req, res, next) => {
    if (req.user.role !== "user") {
        return res.status(403).json({ message: "Forbidden. User access required." });
    }
    next();
};


module.exports = {
    validateToken,
    isAdmin,
    isUser
};

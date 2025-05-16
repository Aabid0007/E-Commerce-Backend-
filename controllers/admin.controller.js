const asyncHandler = require('express-async-handler');
const Admin = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken');


const getAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.find({ role: "admin" });
    res.status(200).json(admin);
})


// admin login 
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: 'error',
            error: "Please provide both email and password"
        });
    }

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ status: 'error', error: "Admin not found" });
        }

        if (admin.role !== "admin") {
            return res.status(403).json({
                status: 'error',
                error: "Unauthorized. Admin access required"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 'error', error: "Wrong password" });
        }

        generateToken(res, admin._id, admin.role);

        res.status(200).json({
            status: 'success',
            _id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
            message: 'Admin logged in successfully'
        });
    } catch (error) {
        
        res.status(500).json({ 
            error: ' failed',
            message: error.message,
        });
    }
});



module.exports = {
    loginAdmin,
    getAdmin,
}
const asyncHandler = require('express-async-handler');
const Admin = require('../models/user.Model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const getAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.find({ role: "admin" });
    res.status(200).json(admin);
})


// admin login 
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!email || !password) {
            return res.status(400).json({ status: 'error', error: "Please provide both email and password" });
        }
        if (!admin) {
            return res.status(401).json({ status: 'error', error: "Admin not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ status: 'error', error: "Wrong password" });
        }
        if (admin.role !== "admin") {
            return res.status(403).json({ status: 'error', error: "Unauthorized. Admin access required" });
        }
        const token = jwt.sign({ adminId: admin._id, role: admin.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).cookie('adminToken', token, {
            httpOnly: false,
            maxAge: 60 * 60 * 1000,
            secure: true,
            sameSite: 'Strict',
            withCredentials: true,
        });

        res.status(200).json({ status: 'success', data: token, message: 'Admin logged in successfully' });
    } catch (error) {
        res.status(500).json({ error: ' failed' });
    }
});



module.exports = {
    loginAdmin,
    getAdmin,
}
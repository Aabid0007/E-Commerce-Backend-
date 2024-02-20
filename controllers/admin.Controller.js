const asyncHandler = require('express-async-handler');
const Admin = require('../models/user.Model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const getAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.find({ role: "admin" });
    res.status(200).json(admin);
})

// Admin register
const adminRegister = asyncHandler(async (req, res) => {
    console.log(" The request body is :", req.body);
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
        return res.status(400).json({ message: 'All fields are mandatory!' });
    }
    const adminAvailable = await Admin.findOne({ email });

    if (adminAvailable) {
        return res.status(400).json({ message: "email already exists. Please choose a different email." })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
        username,
        email,
        password: hashedPassword,
        phone,
        role: 'admin'
    });

    res.status(201).json(admin)
});


// admin login 
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
    if (!email || !password) {
        return res.status(400).json({ error: "Please provide both email and password" });
    }
    if (!admin) {
        return res.status(401).json({ error: "Admin not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
        return res.status(401).json({ error: "Wrong password" });
    }
    if (admin.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized. Admin access required." });
    }
    const token = jwt.sign({adminId:admin._id, role: admin.role},process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    res.status(200).cookie('authcookie', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, 
        secure: true, 
        sameSite: 'Strict', 
    });
    
    res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: ' failed'});
    }
});  



// const authenticateAdmin = (req, res, next) => {
//     const token = req.header('x-auth-token');

//     if (!token) {
//         return res.status(401).json({ error: "Access denied. No token provided." });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.admin = decoded;
//         next();
//     } catch (error) {
//         console.error("Error verifying token:", error);
//         res.status(401).json({ error: "Invalid token." });
//     }
// };




module.exports = {
    adminRegister,
    loginAdmin,
    getAdmin,
}
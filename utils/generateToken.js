const jwt = require("jsonwebtoken");

const generateToken = (res, userId, role) => {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.cookie("authJWT", token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 2 * 60 * 60 * 1000, 
    });
};

module.exports = { generateToken };

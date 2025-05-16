const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "please add the user name"],
    },
    email: {
        type: String,
        required: [true, "please add the user email"],
        unique: [true, "Email address already taken"],
    },
    password: {
        type: String,
        required: [true, "please add the user password"],
    },
    phone: {
        type: Number,
        required: [true, "please add the user phone number"],
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
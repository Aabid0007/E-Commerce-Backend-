const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    image: {
        type: String,
        required: [true, "please add the category image"],
    },
    name: {
        type: String,
        required: [true, "Please add the category name"],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please add the category description"],
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
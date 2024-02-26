const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    images: {
        type: String,
        required: [true, "please add the category image"],
    },
    name: {
        type: String,
        required: [true, "Please add the category name"],
    },
    description: {
        type: String,
        required: [true, "Please add the category description"],
    },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
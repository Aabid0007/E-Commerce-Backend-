const mongoose = require("mongoose");

const specificationSchema = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: String, required: true }
}, { _id: false });


const productSchema = mongoose.Schema({
    product_name: {
        type: String,
        required: [true, "please add the product name"],
        trim: true,
        unique: true
    },
    image: { 
        type: String,
        required: true
    },
    product_description: {
        type: String,
        required: [true, "please add the product description"],
        trim: true
    },
    brand: {
        type: String
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true
    },
    specifications: [specificationSchema],
    isFeatured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    salesCount: {
        type: Number,
        default: 0
    },
    metaTitle: {
        type: String,
        trim: true
    },
    metaDescription: {
        type: String,
        trim: true
    },
},
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
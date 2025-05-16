const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", required: true
    },
    sku: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    original_price: { 
        type: Number, 
        required: true 
    },
    sale_price: { 
        type: Number, 
        required: true 
    },
    stock: { 
        type: Number, 
        required: true 
    },
    images: [{
        type: String,
        required: true
    }],
    attributes: [{
        key: { 
            type: String, 
            required: true 
        },
        value: { 
            type: String, 
            required: true 
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
});

const Variant = mongoose.model('Variant', variantSchema);
module.exports = Variant;
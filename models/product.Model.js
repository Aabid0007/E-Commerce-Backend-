const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    images: [{
        type: String,
        required: [true, "please add the product profilePicture"],
    }],
    name: {
        type: String,
        required: [true, "please add the product name"],
    },
    description: {
        type: String,
        required: [true, "please add the product description"],
    },
    price: {
        type: Number,
        required: [true, "please add the product price"],
    },
    quantity: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },

  },
     {
        timestamps: true,
     }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
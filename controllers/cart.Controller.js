const asyncHandler = require('express-async-handler');
const Cart = require('../models/cart.model');


// Get user's buying carts
const getUserBuyingCarts = async (req, res) => {
    try {
        const id = req.user._id;   
        const userCartsAggregate = await Cart.aggregate([
            {
                $match: { userId: id }
            },
            {
                $unwind: "$items"
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $group: {
                    _id: "$_id",
                    cartQuantity: { $sum: "$items.quantity" },
                    items: {
                        $push: {
                            _id: "$items._id",
                            quantity: "$items.quantity",
                            productDetails: { $arrayElemAt: ["$productDetails", 0] }
                        }
                    }
                }
            }
        ]);
        if (userCartsAggregate.length === 0) {
            return res.status(200).json({ userCarts: [], cartQuantity: 0 });
        }
        const { cartQuantity } = userCartsAggregate[0];
        
        res.status(200).json({ 
            status: 'success', 
            userCarts: userCartsAggregate, 
            cartQuantity, 
            message: 'Carts retrieved successfully' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: "Internal server error" });
    }
};


// create new cart
const addToCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart && userId) {
            const newCart = await Cart.create({ userId, items: [{ product: productId, quantity }], });
            return res.status(201).json({
                status: 'success',
                data: newCart,
                message: 'New cart created successfully',
            });
        }
       const existingProduct = cart.items.find(item => item.product.toString() === productId);
       if (existingProduct) {
          existingProduct.quantity += quantity;
       } else{
         cart.items.push({ product: productId, quantity });
       }
       
       const updatedCart = await cart.save();

        res.status(200).json({
            status: 'success',
            data: updatedCart,
            message: 'Product added to cart successfully',
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: "Internal server error" });
    }
});


// update quantity
const updateQuantity = asyncHandler(async (req, res) => {
    const userId = req.user._id;     
    const { productId } = req.params;
    const { action } = req.body;

    try {
        let quantityChange = 0;

        if (action === 'increment') {
            quantityChange = 1;
        } else if (action === 'decrement' ) {
            quantityChange = -1;
        } else {
            return res.status(400).json({ error: "Invalid action" });
        }
        
        const updatedCart = await Cart.findOneAndUpdate(
            { userId, 'items.product': productId },
            { $inc: { 'items.$.quantity': quantityChange } },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).json({ status: 'error', error: "Product not found in cart" });
        }

        res.status(200).json({ 
            status: 'success', 
            data: updatedCart, 
            message: 'Cart Updated successfully' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: "Internal server error" });
    }
});


// Remove a product from the cart
const removeFromCart = async (req, res) => {
    const userId = req.user._id;    
    const { productId } = req.params;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        const cartItem = await Cart.findOneAndUpdate(
            { userId, 'items.product': productId },
            { $pull: { items: { product: productId } } },
            { new: true }
        );
        if (!cartItem) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        res.status(200).json({ status: 'success', data: cartItem, message: 'Cart Deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: "Internal server error" });
    }
};



module.exports = {
    addToCart,
    removeFromCart,
    getUserBuyingCarts,
    updateQuantity
}
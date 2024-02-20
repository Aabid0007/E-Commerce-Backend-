
const Cart = require('../models/cart.Model');

const addToCartService = async (userId, productId, quantity) => {
    try {
        const addToCart = await Cart.create({ userId, productId, quantity });
        return addToCart;
    } catch (error) {
        console.error('Error creating cart:', error);
        throw error;
    }
};

const removeFromCartService = async (userId, productId) => {

};

const getUserBuyingCartsService = async (userId) => {

};

module.exports = {
    addToCartService,
    removeFromCartService,
    getUserBuyingCartsService
};

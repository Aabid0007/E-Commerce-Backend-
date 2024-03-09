const asyncHandler = require('express-async-handler');
const Order = require('../models/order.Model');
const orderService = require('../services/orderService');


// get all orders
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.getAllOrdersService();
    if (!orders) {

        res.status(404).json({ status: 'error', message: "Order not found " });
    }

    res.status(200).json({ status: 'success', data: orders, message: 'orders retrieved successfully' });
})


// getOrderById
const getOrderById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const orderById = await orderService.getOrderByIdService(id)
        if (!orderById) {

            res.status(404).json({ status: 'error', message: "Order not found" });
        }

        res.status(200).json({ status: 'success', data: orderById, message: 'Order fetched successfully' });
    } catch (error) {
        console.error(error);

        res.status(500).json({ error: "Internal server error" });
    }
});


// get user order
const getUserOrder = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const UserOrders = await orderService.getUserOrderService(userId);
    if (!UserOrders) {

        res.status(404).json({ status: 'error', message: "Order not found for the user" });
    }

    res.status(200).json({ status: 'success', data: UserOrders, message: 'User orders retrieved successfully' });
});


module.exports = {
    getOrderById,
    getAllOrders,
    getUserOrder,
};
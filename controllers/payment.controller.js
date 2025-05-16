const asyncHandler = require('express-async-handler');
const Stripe = require('stripe');
const dotenv = require('dotenv');
dotenv.config();
const Payment = require('../models/payment.model');
const Order = require("../models/order.model");
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const stripe = Stripe(process.env.STRIPE_KEY);



const formatLineItems = (cartItems) => {
    return cartItems[0]?.items.map(item => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.productDetails.name,
                description: item.productDetails.description,
            },
            unit_amount: item.productDetails.price * 100,
        },
        quantity: item.quantity,
    }));
};


const createCheckoutSession = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { cartItems, totalPrice } = req.body;
    
    try {
        // Create order
        const orderProducts = cartItems[0]?.items.map(item => ({
            product: item.productDetails,
            quantity: item.quantity,
        }));

        const order = await Order.create({
            userId,
            products: orderProducts,
            totalAmount: totalPrice,
        });

        const line_items = formatLineItems(cartItems);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            shipping_address_collection: {
                allowed_countries: ["US", "CA", "KE"],
            },
            billing_address_collection: "required",
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: 0,
                            currency: "usd",
                        },
                        display_name: "Free shipping",
                        delivery_estimate: {
                            minimum: { unit: "business_day", value: 5 },
                            maximum: { unit: "business_day", value: 7 },
                        },
                    },
                },
                {
                    shipping_rate_data: {
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: 1500,
                            currency: "usd",
                        },
                        display_name: "Next day air",
                        delivery_estimate: {
                            minimum: { unit: "business_day", value: 1 },
                            maximum: { unit: "business_day", value: 1 },
                        },
                    },
                },
            ],
            phone_number_collection: { enabled: true },
            line_items,
            mode: "payment",
            success_url: `http://localhost:3000/user/category/product/checkout-success/?id=${order._id}&cartItems=${JSON.stringify(cartItems)}`,
            cancel_url: 'http://localhost:3000/user/category/product/cart',
        });

        await Payment.create({
            amount: totalPrice,
            orderId: order._id,
            userId: userId,
            sessionId: session.id,
            paymentStatus: session.payment_status,
        })

        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//Update Product Sales Count
const updateSalesCount = async (products) => {
    const updatePromises = products.map(item =>
        Product.findByIdAndUpdate(item.product, { $inc: { salesCount: item.quantity } })
    );
    await Promise.all(updatePromises);
};


const retrieveCheckoutSession = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;
    try {
        const payment = await Payment.findOne({ orderId: id });
        const session = await stripe.checkout.sessions.retrieve(payment.sessionId);

        const paymentStatus = session.payment_status === 'paid' ? 'complete' : 'pending';
        await Payment.findByIdAndUpdate(payment._id, { paymentStatus });

        const updatedOrder = await Order.findByIdAndUpdate(id, {
            orderStatus: paymentStatus,
            shippingAddress: session.shipping_details.address,
            billingAddress: session.shipping_details.address,
            customerEmail: session.customer_details.email,
        },
            { new: true }
        );

        if (!updatedOrder?.saleCountUpdated) {
            await updateSalesCount(updatedOrder.products);
            await Order.findByIdAndUpdate(id, { saleCountUpdated: true });
        }

        await Cart.deleteMany({ userId });

        res.send({ session });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



const ensureFields = async () => {
    await Product.updateMany(
        { salesCount: { $exists: true } },
        { $set: { salesCount: 0 } }

    );
    console.log("set zero count");
};


// ensureFields();
const deleteAllPaymentsAndOrders = async () => {
    try {
        await Payment.deleteMany({});

        await Order.deleteMany({});

        console.log("All payments and orders have been deleted.");
    } catch (error) {
        console.error("Error deleting payments and orders:", error);
    }
};
// deleteAllPaymentsAndOrders()


module.exports = {
    createCheckoutSession,
    retrieveCheckoutSession,
};
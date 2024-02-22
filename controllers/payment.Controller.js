const asyncHandler = require('express-async-handler');
const Stripe = require('stripe');
const dotenv = require('dotenv');
dotenv.config();
const Payment = require('../models/payment.Model');
const Order = require("../models/order.Model");
const Cart = require('../models/cart.Model');
const stripe = Stripe(process.env.STRIPE_KEY);

const createCheckoutSession = asyncHandler(async (req, res) => {
    const { cartItems, userId, totalPrice } = req.body;
   
    try {
        // order create
        const order = await Order.create({
            userId: userId,
            products: cartItems[0]?.items.map(item => ({
                product: item.productDetails, 
                quantity: item.quantity,
            })),
            totalAmount:totalPrice,
        });
        
        const line_items = cartItems[0] && cartItems[0].items.map(item => ({
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
            sessionId: session.id,
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



const retrieveCheckoutSession = asyncHandler(async (req, res) => {
    try {
        const orderId = req.params.id;
        const payment = await Payment.findOne({ orderId }); 
        const session = await stripe.checkout.sessions.retrieve(payment.sessionId); 
    
        await Payment.findByIdAndUpdate(payment._id, { paymentStatus: session.payment_status }); 

        await Order.findByIdAndUpdate(orderId, { 
            orderStatus: session.status, 
            shippingAddress: session.shipping_details.address, 
            billingAddress:session.shipping_details.address,
            customerEmail: session.customer_details.email
        });

        const userId = req.params.userId;
        await Cart.deleteMany({ userId });
        
       
        res.send({ session }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = {
    createCheckoutSession,
    retrieveCheckoutSession,
};
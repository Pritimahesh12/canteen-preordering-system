import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const getUserOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5174";
    try {
        const { items, amount, address } = req.body;

        if (!items || items.length === 0) {
            return res.json({ success: false, message: "Cart is empty" });
        }
        if (amount < 50) {
            return res.json({ success: false, message: "Minimum order amount is ₹50" });
        }

        const newOrder = new orderModel({
            userId: req.userId,
            items,
            amount,
            address
        });
        await newOrder.save();

        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

        const line_items = items.map((item) => {
            if (item.price <= 0 || item.quantity <= 0) {
                throw new Error("Invalid item price or quantity");
            }
            return {
                price_data: {
                    currency: "inr",
                    product_data: { name: item.name },
                    unit_amount: Math.round(item.price * 100)
                },
                quantity: item.quantity
            };
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log("FULL ERROR:", error);
        res.json({ success: false, message: error.message });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment successful" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment cancelled" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }
};

//  New: update order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating status" });
    }
};

export { placeOrder, getUserOrders, verifyOrder, listOrders, updateStatus };
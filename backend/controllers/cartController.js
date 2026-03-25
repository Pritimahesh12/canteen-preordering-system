import userModel from "../models/userModel.js";

// ➕ ADD TO CART
const addToCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId);

        let cartData = userData.cartData || {};

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        userData.cartData = cartData;
        userData.markModified("cartData");

        await userData.save();

        res.json({ success: true, message: "Added to cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding to cart" });
    }
};

// ➖ REMOVE FROM CART
const removeFromCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId);

        let cartData = userData.cartData || {};

        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;

            if (cartData[req.body.itemId] === 0) {
                delete cartData[req.body.itemId];
            }
        }

        userData.cartData = cartData;
        userData.markModified("cartData");

        await userData.save();

        res.json({ success: true, message: "Removed from cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing from cart" });
    }
};

// 📦 GET CART DATA
const getCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId);

        const cartData = userData.cartData || {};

        res.json({ success: true, cartData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching cart" });
    }
};

export { addToCart, removeFromCart, getCart };
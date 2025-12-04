import User from "../models/user.js";

//Update Cart : POST api/cart/updatecart
export const updateCart = async (req, res) => {
    try {
        const { id,cartItems } = req.body;
        const user = await User.findbyIdAndUpdate(id, { CartItems: cartItems }, { new: true });
        return  res.json({ success: true, message: "Cart updated successfully", cartItems: user.CartItems });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};


import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("STRIPE_SECRET_KEY is not defined in environment variables");
}

// Place Order COD : POST /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId; // Get from JWT middleware

    // Validate data
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // Calculate Total Amount Using Items
     let amount = await items.reduce(async (acc, item) => {
      const accumulated = await acc;
      const product = await Product.findById(item.product);
      
      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }

      const productPrice = product.offerPrice || product.price;
      return accumulated + productPrice * item.quantity;
    }, 0);

    // Tax Charge (2%)
    amount += Math.floor(amount * 0.02);

    // Create Order Entry in Database
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
      isPaid: false
    });

    return res.json({
      success: true,
      message: "Order placed successfully"
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: error.message
    });
  }
};


// Place Order Stripe : POST /api/order/stripe (DEMO MODE ONLY)
export const placeOrderStripe = async (req, res) => {
  try {
    // DEMO MODE: Return mock success without creating order or charging payment
    return res.json({ 
      success: true, 
      demo: true,
      message: "Online payment is in demo mode. No real transaction will occur.",
      url: null // No Stripe session created
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


//Stripe Webhooks : POST /api/order/stripe_webhooks
export const stripeWebhooks = async (request, response) => {
  // Stripe Gateway Initialize
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.headers["stripe-signature"];
  let event;

  // Verify webhook signature
  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return response
      .status(400)
      .send(`Webhook Error: ${error.message}`);
  }

  // Handle Stripe Events
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // Get Stripe session using payment_intent ID
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderId, userId } = session.data[0].metadata;

      // Mark order as paid
      await Order.findByIdAndUpdate(orderId, { isPaid: true });

      // Clear user cart
      await User.findByIdAndUpdate(userId, { cartItems: {} });

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // Get Stripe session for metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderId } = session.data[0].metadata;

      // Delete failed order
      await Order.findByIdAndDelete(orderId);

      break;
    }

    default:
      break;
  }

  response.json({ received: true });
};

// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId; // Get from JWT middleware
    const orders = await Order.find({
      userId,
      $or: [
        { paymentType: "COD" },
        { isPaid: true }
      ]
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { paymentType: "COD" },
        { isPaid: true }]
      })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  }catch(error){
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
  
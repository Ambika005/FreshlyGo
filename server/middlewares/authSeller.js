import jwt from "jsonwebtoken";

export const authSeller = async (req, res, next) => {
  try {
    const { sellerToken } = req.cookies;

    // If no token → seller is not logged in
    if (!sellerToken) {
      return res.json({ success: false, message: "Not Authorized. No token found." });
    }

    // Verify JWT
    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);

    // Check if token email matches the seller email stored in .env
    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      req.sellerEmail = tokenDecode.email;   // attach seller's email to request
      req.sellerData = { email: tokenDecode.email };
    } else {
      return res.json({ success: false, message: "Not Authorized. Invalid seller." });
    }

    next();  

  } catch (error) {
    console.log("Auth Seller Error:", error.message);
    return res.json({ success: false, message: "Invalid or expired token." });
  }
};

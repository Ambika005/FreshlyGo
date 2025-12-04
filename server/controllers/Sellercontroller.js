import jwt from "jsonwebtoken";

// Seller login : POST /api/seller/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Missing Fields" });
    }
    // Check credentials against .env values
    if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {
      // Create JWT
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        // Set cookie
        res.cookie("sellerToken", token, {
            httpOnly: true, // prevent javascript to access cookie
            secure: process.env.NODE_ENV === "production", // use secure cookies in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF Protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days cookie expiration time
        });
      return res.json({ success: true, message: "Seller logged in successfully", token });
    } else {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Seller logout : GET /api/seller/logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Seller logged out successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Check Seller Auth: GET /api/seller/is_auth
export const is_auth = async (req, res) => {
  try {
    // This function is called after authSeller middleware
    // The middleware has already validated the JWT from cookie
    
    // Get seller data from the middleware
    const sellerData = {
      email: req.sellerEmail,
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    };
    
    return res.json({ 
      success: true, 
      seller: sellerData,
      message: "Seller authenticated successfully"
    });
  } catch (error) {
    console.log("Seller is_auth error:", error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
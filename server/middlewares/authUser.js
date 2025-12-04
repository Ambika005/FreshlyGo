import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // No token found
    if (!token) {
      return res.json({ success: false, message: "Not Authorized" });
    }

    // Verify token
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      // Ensure req.body exists before setting properties
      if (!req.body) {
        req.body = {};
      }
      req.body.userId = tokenDecode.id;   // attach userId to request body
      req.userId = tokenDecode.id;        // also attach to req object for flexibility
    } else {
      return res.json({ success: false, message: "Not Authorized" });
    }

    next(); // continue to next middleware/controller

  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//register user : POST /api/users/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if(!name || !email || !password){
            return res.status(400).json({ success: false, message: 'Missing Fields' });
        }
        if (existingUser) {
            return res.status(404).json({ success: false, message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log(newUser);
        
        res.cookie('token', token,{
            httpOnly: true,//prevent javascript to access cookie
            secure: process.env.NODE_ENV === 'production',//use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF Protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days cookie expiration time
        });
        return res.json({ success: true, user: {email:newUser.email, name:newUser.name, _id: newUser._id}, message: 'User registered successfully', token });
    } 
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

//user login : POST /api/users/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ success: false, message: 'Missing Fields' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token,{
            httpOnly: true,//prevent javascript to access cookie
            secure: process.env.NODE_ENV === 'production',//use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF Protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days cookie expiration time
        });
        return res.json({ success: true, user: { email: user.email, name: user.name }, message: 'User logged in successfully', token });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Check Auth: GET /api/user/is-auth
export const is_auth = async (req, res) => {
  try {
    const userId = req.userId; // Get from JWT middleware

    if (!userId) {
      return res.json({ success: false, message: 'Not authenticated' });
    }

    // Find the user without returning the password
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, user});

  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: error.message
    });
  }
};


//Logout user : api/users/logout

export const logout = async (req, res) => {
    try {
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: 'User logged out successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Update user cart : POST /api/user/update_cart
export const updateCart = async (req, res) => {
    try {
        const userId = req.userId; // Get from JWT middleware
        const { cartItems } = req.body;

        if (!userId) {
            return res.json({ success: false, message: 'Not authenticated' });
        }

        // Validate cartItems structure
        if (!cartItems || typeof cartItems !== 'object') {
            return res.json({ success: false, message: 'Invalid cart data' });
        }

        // Update user's cart items in database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { cartItems: cartItems },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.json({ success: false, message: 'User not found' });
        }

        return res.json({ 
            success: true, 
            message: 'Cart updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}
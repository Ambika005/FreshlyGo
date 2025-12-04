import express from 'express';
import { authUser } from '../middlewares/authUser.js';
import { register,login,is_auth,logout,updateCart } from '../controllers/Usercontroller.js';

const Userrouter = express.Router();

// Sample route
Userrouter.post('/register', register);
Userrouter.post('/login', login);
Userrouter.get('/is_auth', authUser,is_auth); //use auth middleware to protect route                
Userrouter.post('/logout', logout);
Userrouter.post('/update_cart', authUser, updateCart); //update user cart
export default Userrouter;
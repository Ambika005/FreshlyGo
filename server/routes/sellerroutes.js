import express from 'express';
import { logout,is_auth, login } from '../controllers/Sellercontroller.js';
import { authSeller } from '../middlewares/authSeller.js';
const sellerRouter = express.Router();

// Define seller-specific routes here 
sellerRouter.post('/login',login);
sellerRouter.get('/logout',logout);
sellerRouter.get('/is_auth',authSeller, is_auth);

export default sellerRouter;
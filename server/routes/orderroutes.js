import express from 'express';
import { authUser } from '../middlewares/authUser.js';
import { placeOrderCOD, placeOrderStripe, getUserOrders ,getAllOrders} from '../controllers/Ordercontroller.js';
import { authSeller } from '../middlewares/authSeller.js';

const Orderrouter = express.Router();

Orderrouter.post('/cod', authUser, placeOrderCOD);
Orderrouter.post('/stripe', authUser, placeOrderStripe);
Orderrouter.get('/user', authUser, getUserOrders);
Orderrouter.get('/seller', authSeller, getAllOrders);

export default Orderrouter;
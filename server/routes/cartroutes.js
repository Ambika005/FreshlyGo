import express from 'express';
import { updateCart } from '../controllers/Cartcontroller.js';
import { authUser } from '../middlewares/authUser.js';

const Cartrouter = express.Router();

Cartrouter.post('/updatecart', authUser, updateCart);

export default Cartrouter;
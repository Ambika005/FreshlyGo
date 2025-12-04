import express from 'express';
import { authUser } from '../middlewares/authUser.js';
import { addAddress,getAddress } from '../controllers/Addresscontroller.js';

import { get } from 'mongoose';

const Addressrouter = express.Router();

Addressrouter.post('/add', authUser, addAddress);
Addressrouter.get('/get', authUser, getAddress);
export default Addressrouter;
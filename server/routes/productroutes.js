import express from 'express';
import { authSeller } from '../middlewares/authSeller.js';
import {ChangeStock,ProductList,addProduct,ProductById } from '../controllers/Productcontroller.js';
import { upload } from '../configs/multer.js';

const Productrouter = express.Router();

// Sample product route
Productrouter.post('/stock',authSeller,ChangeStock);
Productrouter.post('/add',authSeller,upload.array('images'),addProduct);
Productrouter.get('/list',authSeller,ProductList);
Productrouter.get('/:id',authSeller,ProductById);

export default Productrouter;
import 'dotenv/config';  
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';    
import connectDB from './configs/db.js';     
import Userrouter from './routes/routes.js';
import sellerRouter from './routes/sellerroutes.js';
import connectCloudinary from './configs/cloudinary.js';
import Productrouter from './routes/productroutes.js';
import Cartrouter from './routes/cartroutes.js';
import Addressrouter from './routes/addressroutes.js';
import Orderrouter from './routes/orderroutes.js';
import { stripeWebhooks } from './controllers/Ordercontroller.js';
const app = express();
const port  = process.env.PORT || 4000;
const allowedOrigins = ['http://localhost:5173'];

await connectDB();
await connectCloudinary();
//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use('/api/user',Userrouter);
app.use('/api/seller',sellerRouter);
app.use('/api/product',Productrouter);
app.use('/api/cart',Cartrouter);
app.use('/api/address',Addressrouter);
app.use('/api/order',Orderrouter);
//Routes
app.use('/stripe',express.raw({type : 'application/json'}),stripeWebhooks);
app.get('/',(req,res)=>{
     res.send('Api is working!');
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
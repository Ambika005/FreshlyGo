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

// CORS configuration - allow both local and Vercel deployments
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://freshlygo-frontend-o5le93dje-ambikas-projects-03aef067.vercel.app',
    'https://freshlygo-frontend.vercel.app'
];

await connectDB();
await connectCloudinary();

//Middleware
app.use(express.json());
app.use(cookieParser());

// CORS middleware
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    maxAge: 86400
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

export default app;
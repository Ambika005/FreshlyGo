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

// CORS configuration - allow both local and production domains
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
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
        // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
        if (!origin) {
            return callback(null, true);
        }
        
        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // Allow all Vercel preview deployments for frontend
        if (origin.includes('freshlygo-frontend') && origin.includes('vercel.app')) {
            return callback(null, true);
        }
        
        console.log('CORS blocked origin:', origin);
        callback(new Error('CORS not allowed for origin: ' + origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204
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
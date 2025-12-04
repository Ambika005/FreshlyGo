import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts, dummyOrders } from "../assets/assets";
import { toast } from 'react-hot-toast';
import axios from "axios";


export const AppContext = createContext();

// Configure axios defaults
const configureAxios = () => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
};

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    
    // Configure axios on component mount
    useEffect(() => {
        configureAxios();
    }, []);

    // USER AUTH
    const [user, setUser] = useState(null);
    const [showuserlogin, setShowuserlogin] = useState(false);

    // SELLER AUTH
    const [isseller, setIsseller] = useState(false);
    const [seller, setSeller] = useState(null);
    const [loadingSeller, setLoadingSeller] = useState(true);
    const fetchSeller = async () => {
        try {
            console.log(" Fetching seller auth status...");
           
            
            const res = await axios.get("/api/seller/is_auth");
            console.log("Seller auth response:", res.data);
            
            if (res.data.success && res.data.seller) {
                setIsseller(true);
                setSeller(res.data.seller);
                console.log("✅ Seller authenticated:", res.data.seller);
            } else {
                setIsseller(false);
                setSeller(null);
                console.log("❌ Seller not authenticated:", res.data.message);
            }
        } catch (err) {
            console.log("Seller auth error:"    || err.message);
            setIsseller(false);
            setSeller(null);
        } finally {
            setLoadingSeller(false);
        }
    };
   
    // PRODUCTS
    const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
        try{
            const res = await axios.get("/api/product/list");
            if(res.data.success){
                setProducts(res.data.products);
            }
            else{
                toast.error(res.data.message || "Failed to fetch products");
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        }
    }

    //fetch user

    const fetchUser = async () => {
        try {
            const res = await axios.get("/api/user/is_auth");
            if (res.data.success && res.data.user) {
                setUser(res.data.user);
                setCartItems(res.data.user.cartItems || {});
                console.log("✅ User authenticated:", res.data.user);
            } 
            else{
                setUser(null);
                setCartItems({});
                console.log("❌ User not authenticated:", res.data.message);
            }
        } catch (err) {
            console.log("🚨 User fetch error:", err.response?.data || err.message);
            setUser(null);
            setCartItems({});
        }
    };

    // CART
    const [cartItems, setCartItems] = useState({});
    
    useEffect(() => {
        fetchSeller();
        fetchProducts();
        fetchUser();
    }, []);

    useEffect(()=>{
        const updateCart = async() => {
            try{
                const res = await axios.post("/api/user/update_cart", { cartItems });
            } catch (err) {
                console.log( err.message);
            }
        }
        if (user) updateCart();
    }, [cartItems, user]);
    
    // ORDERS
    const [orders, setOrders] = useState([]);
    const cartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

    const addToCart = (id) => {
        const data = { ...cartItems };
        data[id] = (data[id] || 0) + 1;
        setCartItems(data);
        toast.success("Added to Cart");
    };

    const updateCartItem = (id, quantity) => {
        const data = { ...cartItems };
        data[id] = quantity;
        setCartItems(data);
        toast.success("Cart Updated");
    };

    const removeFromCart = (id) => {
        const data = { ...cartItems };
        if (data[id]) {
            data[id]--;
            if (data[id] === 0) delete data[id];
        }
        setCartItems(data);
        toast.success("Removed");
    };

    const clearCart = () => {
        setCartItems({});
        toast.success("Cart cleared");
    };

    const currency = "$";

    // Load Products and Orders
    useEffect(() => {
        setProducts(dummyProducts);
        setOrders(dummyOrders);
    }, []);

    //  Prevent user login popup on seller auth
    useEffect(() => {
        if (isseller) {
            setShowuserlogin(false);
        }
    }, [isseller]);

    const value = {
        navigate,
        axios,

        user, setUser,
        seller, setSeller,
        isseller, setIsseller,
        loadingSeller,
        fetchSeller,
        fetchProducts,
        fetchUser,
        showuserlogin, setShowuserlogin,

        products, currency,
        orders,

        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,

        cartItems,
        cartCount
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

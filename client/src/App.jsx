import React from 'react'
import Navbar from './components/Navbar'
import Login from './components/Login'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ProductGrid from './components/ProductGrid.jsx'
import ProductSearch from './components/ProductSearch.jsx'
import Products from './pages/Products.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Cart from './pages/Cart.jsx'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext.jsx'
import AddAddress from './pages/AddAddress.jsx'
import MyOrders from './pages/MyOrders.jsx'
import PaymentSuccess from './pages/PaymentSuccess.jsx'
import Loading from './components/Loading.jsx'

// Seller Imports
import SellerLayout from './pages/Seller/SellerLayout.jsx'
import SellerLogin from './pages/Seller/SellerLogin.jsx'
import Orders from './pages/Seller/Orders.jsx'
import ProductList from './pages/Seller/ProductList.jsx'
import AddProduct from './pages/Seller/AddProduct.jsx'
import ProtectedSellerRoute from './components/ProtectedSellerRoute.jsx'

const App = () => {

  const location = useLocation();
  const isCartPath = location.pathname === "/cart";
  const isSellerRoute = location.pathname.startsWith("/seller");

  const { showuserlogin, isseller, loadingSeller } = useAppContext();

  return (
    <div>
      <Toaster />

      {/* Hide main navbar for seller pages */}
      {!isSellerRoute && <Navbar />}

      {showuserlogin && <Login />}

      <div className={`${isCartPath || isSellerRoute ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
       {!isSellerRoute && showuserlogin && <Login />}

<Routes>

  {/* Normal Pages */}
  <Route path="/" element={<Home />} />
  <Route path="/products" element={<ProductGrid />} />
  <Route path="/products/:category" element={<Products />} />
  <Route path="/products/:category/:id" element={<ProductDetails />} />
  <Route path="/search" element={<ProductSearch />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/add_address" element={<AddAddress />} />
  <Route path="/my-orders" element={<MyOrders />} />
  <Route path="/payment-success" element={<PaymentSuccess />} />
  <Route path= "/loader" element={<Loading />} />
  {/* Seller Login Route */}
  <Route path="/seller/login" element={<SellerLogin />} />
  
  {/* Protected Seller Routes */}
  <Route path="/seller/*" element={
    <ProtectedSellerRoute>
      <SellerLayout />
    </ProtectedSellerRoute>
  }>
    <Route index element={<AddProduct />} />
    <Route path="add-product" element={<AddProduct />} />
    <Route path="product-list" element={<ProductList />} />
    <Route path="orders" element={<Orders />} />
  </Route>

</Routes>

      </div>
    </div>
  );
};

export default App;

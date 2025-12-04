import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Cart = () => {

  const { cartItems, products, updateCartItem, removeFromCart, clearCart, navigate, axios, user } = useAppContext();
  const [showAddressBox, setShowAddressBox] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const cartItemsArray = Object.entries(cartItems).filter(([id, quantity]) => quantity > 0);
  const totalItems = cartItemsArray.reduce((sum, [id, quantity]) => sum + quantity, 0);

  // Calculate totals
  const subtotalPrice = cartItemsArray.reduce((sum, [productId, quantity]) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      return sum + (product.offerPrice || product.price) * quantity;
    }
    return sum;
  }, 0);

  const taxAmount = Math.round(subtotalPrice * 0.02);
  const totalAmount = subtotalPrice + taxAmount;

  const getUserAddress = async() => {
    try{
      const res = await axios.get("/api/address/get");
      if(res.data.success){
        setAddresses(res.data.addresses);
        if(res.data.addresses.length > 0 && !selectedAddress){
          setSelectedAddress(res.data.addresses[0]);
        }
      }
    } catch (err) {
        console.log(err.message);
        return [];    
    }
  }

  useEffect(() => {
    getUserAddress();
  }, []);

  const placeOrder = async () => {
  try {
    setIsPlacingOrder(true);

    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (totalItems === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!user) {
      toast.error("Please login to place order");
      navigate("/login");
      return;
    }

    const orderData = {
      userId: user._id,
      items: cartItemsArray.map(([productId, quantity]) => ({
        product: productId,
        quantity
      })),
      address: selectedAddress._id
    };

    // choose endpoint
    const endpoint =
      paymentMethod === "Cash On Delivery"
        ? "/api/order/cod"
        : "/api/order/stripe";

    const { data } = await axios.post(endpoint, orderData);

    // COD FLOW
    if (paymentMethod === "Cash On Delivery") {
      if (data.success) {
        clearCart(); // Clear cart on successful COD order
        toast.success("Order placed successfully!");
        navigate("/my-orders");
      } else {
        toast.error(data.message);
      }
      return;
    }

    // STRIPE FLOW
    if (data.success) {
      window.location.replace(data.url); // redirects to stripe checkout
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong");
  } finally {
    setIsPlacingOrder(false);
  }
};


  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] pt-10 px-6 md:px-16">

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
          Shopping Cart
          <span className="text-green-600 text-lg">{totalItems} Items</span>
        </h1>
      </div>

      <div className="relative">

        {/* Left - Items */}
        <div className="md:pr-[400px]">

          {/* Table Header */}
          <div className="grid grid-cols-12 text-gray-700 font-medium mt-10">
            <div className="col-span-6">Product Details</div>
            <div className="col-span-3 text-center">Subtotal</div>
            <div className="col-span-3 text-center">Action</div>
          </div>

          {/* Empty Cart */}
          {totalItems === 0 && (
            <div className="mt-6">
              <button 
                onClick={() => window.location.href = '/products'}
                className="flex items-center gap-1 text-black hover:underline"
              >
                <span className="text-green-600 text-xl">←</span>
                Continue Shopping
              </button>
            </div>
          )}

          {/* Cart Items */}
          {totalItems > 0 && (
            <div className="mt-6 space-y-4">
              {cartItemsArray.map(([productId, quantity]) => {
                const product = products.find(p => p._id === productId);
                if (!product) return null;

                const subtotal = (product.offerPrice || product.price) * quantity;

                return (
                  <div key={productId} className="grid grid-cols-12 items-center bg-white p-4 rounded-lg shadow-sm">

                    {/* Product Info */}
                    <div className="col-span-6 flex items-center gap-4">
                      <img
                        src={product.image?.[0]}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => { e.target.src = '/api/placeholder/64/64'; }}
                      />

                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-sm font-medium text-green-600">
                          ${product.offerPrice || product.price} × {quantity}
                        </p>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-3 text-center">
                      <span className="font-medium text-gray-900">${subtotal}</span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-3 text-center">
                      <div className="flex items-center justify-center gap-2">

                        <button
                          onClick={() => updateCartItem(productId, quantity - 1)}
                          className="px-2 py-1 bg-gray-100 rounded text-gray-600"
                        >
                          −
                        </button>

                        <span className="px-3 py-1 border rounded">
                          {quantity}
                        </span>

                        <button
                          onClick={() => updateCartItem(productId, quantity + 1)}
                          className="px-2 py-1 bg-gray-100 rounded text-gray-600"
                        >
                          +
                        </button>

                        <button
                          onClick={() => removeFromCart(productId)}
                          className="px-2 py-1 bg-red-50 text-red-600 rounded"
                        >
                          🗑️
                        </button>

                      </div>
                    </div>

                  </div>
                );
              })}

              {/* Continue Shopping */}
              <button 
                onClick={() => window.location.href = '/products'}
                className="flex items-center gap-1 text-black hover:underline mt-8"
              >
                <span className="text-green-600 text-xl">←</span>
                Continue Shopping
              </button>

            </div>
          )}

        </div>

        {/* Right Panel */}
        <div className="w-full md:w-[380px] bg-white shadow rounded-lg p-6 
        md:absolute md:right-10 md:top-1">

          <h2 className="text-2xl font-semibold">Order Summary</h2>
          <hr className="my-4" />

          {/* Delivery Address */}
          <div className="mb-6">
            <p className="text-sm text-gray-700 font-medium">DELIVERY ADDRESS</p>

            <div className="flex justify-between items-center mt-1">
              {selectedAddress ? (
                <div className="text-gray-600 text-sm">
                  <p className="font-medium">{selectedAddress.firstName} {selectedAddress.lastName}</p>
                  <p>{selectedAddress.street}, {selectedAddress.city},</p>
                  <p>{selectedAddress.state}, {selectedAddress.country}</p>
                </div>
              ) : (
                <p className="text-gray-600">No address found</p>
              )}

              <button
                onClick={() => setShowAddressBox(!showAddressBox)}
                className="text-green-600 text-sm hover:underline"
              >
                Change
              </button>
            </div>

            {/* Address Selection Box */}
            {showAddressBox && (
              <div className="mt-3 bg-[#FFFFFF] border rounded-lg p-4 space-y-3">
                {/* Existing Addresses */}
                {addresses.length > 0 && (
                  <div className="space-y-2">
                    {addresses.map((address) => (
                      <div 
                        key={address._id}
                        className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                          selectedAddress?._id === address._id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                        }`}
                        onClick={() => {
                          setSelectedAddress(address);
                          setShowAddressBox(false);
                        }}
                      >
                        <p className="font-medium text-sm">{address.firstName} {address.lastName}</p>
                        <p className="text-gray-600 text-xs">
                          {address.street}, {address.city}, {address.state}, {address.country}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add New Address Button */}
                <button
                  className="text-green-600 font-medium text-sm hover:underline block w-full text-center py-2 border border-dashed border-green-600 rounded"
                  onClick={() => navigate('/add_address')}
                >
                  + Add address
                </button>
              </div>
            )}

          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 block">PAYMENT METHOD</label>
            <select 
              className="w-full mt-2 px-4 py-3 rounded bg-black text-white"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash On Delivery">Cash On Delivery</option>
              <option value="Online Payment">Online Payment</option>
            </select>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 mt-6 text-gray-700">
            <div className="flex justify-between">
              <span>Price</span>
              <span>${subtotalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (2%)</span>
              <span>${taxAmount}</span>
            </div>
          </div>

          {/* Total */}
          <p className="text-lg font-semibold mt-6 flex justify-between">
            <span>Total Amount:</span>
            <span>${totalAmount}</span>
          </p>

          <button 
            onClick={placeOrder}
            disabled={isPlacingOrder || totalItems === 0}
            className={`w-full py-3 rounded mt-5 text-lg font-medium transition ${
              paymentMethod === 'Cash On Delivery' 
                ? 'bg-black text-white hover:bg-gray-800' 
                : 'bg-green-600 text-white hover:bg-green-700'
            } ${(isPlacingOrder || totalItems === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPlacingOrder ? (
              paymentMethod === 'Cash On Delivery' ? 'Placing Order...' : 'Processing...'
            ) : (
              paymentMethod === 'Cash On Delivery' ? 'Place Order' : 'Proceed to Checkout'
            )}
          </button>

        </div>

      </div>

    </div>
  );
};

export default Cart;

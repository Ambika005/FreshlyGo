import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";


const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currency,user,axios } = useAppContext();

  const fetchMyOrders = async () => {
    try{
      setLoading(true);
      const res = await axios.get("/api/order/user");
      console.log("Orders API Response:", res.data); // Debug log
      if(res.data.success){
        setMyOrders(res.data.orders || []);
      }
      else{
        console.error("Orders API Error:", res.data.message);
        toast.error(res.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      console.error("Error details:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    } else {
      console.log("User not authenticated, cannot fetch orders");
    }
  }, [user]);
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white py-10 px-6 md:px-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          MY <span className="text-green-600 underline">ORDERS</span>
        </h1>
        <div className="flex justify-center items-center py-20">
          <div className="text-gray-600">Loading your orders...</div>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen w-full bg-white py-10 px-6 md:px-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          MY <span className="text-green-600 underline">ORDERS</span>
        </h1>
        <div className="flex justify-center items-center py-20">
          <div className="text-gray-600">Please login to view your orders</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white py-10 px-6 md:px-16">
      
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        MY <span className="text-green-600 underline">ORDERS</span>
      </h1>

      {/* Empty state */}
      {myOrders.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="text-gray-600 text-lg mb-4">No orders found</div>
            <p className="text-gray-500">You haven't placed any orders yet.</p>
          </div>
        </div>
      ) : (
        /* ORDERS LIST */
        <div className="space-y-8">
        {myOrders.map((order, index) => (
          <div
            key={index}
            className="border border-gray-200 bg-white rounded-xl p-6 shadow-sm"
          >
            {/* Top Info Row */}
            <div className="flex justify-between md:items-center text-gray-700 md:flex-row flex-col gap-2">
              <span>
                <b>OrderId :</b> {order._id}
              </span>
              <span>
                <b>Payment :</b> {order.paymentType}
              </span>
              <span>
                <b>Total Amount :</b> {currency}
                {order.amount}
              </span>
            </div>

            {/* Each Ordered Item */}
            {order.items && order.items.map((item, idx) => (
              <div
                key={idx}
                className="mt-4 border border-gray-300 rounded-lg p-5 flex items-center justify-between hover:shadow transition"
              >
                {/* Product Section */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.product?.image?.[0] || '/api/placeholder/64/64'}
                    alt={item.product?.name || 'Product'}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => { e.target.src = '/api/placeholder/64/64'; }}
                  />

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.product?.name || 'Product Not Available'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Category: {Array.isArray(item.product?.category) 
                        ? item.product.category[0] 
                        : item.product?.category || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Middle Column: Quantity/Status/Date */}
                <div className="text-gray-700 text-sm text-right">
                  <p>Quantity: {item.quantity}</p>
                  <p>Status: {order.status}</p>
                  <p>
                    Date:{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US")}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-green-600 font-semibold text-lg min-w-[90px] text-right">
                  Amount: {currency}
                  {item.product?.offerPrice || item.product?.price || item.price || 0}
                </div>
              </div>
            ))}
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

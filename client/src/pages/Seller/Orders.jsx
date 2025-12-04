import { useAppContext } from '../../context/AppContext.jsx';
import { assets } from '../../assets/assets.js';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Orders = () => {
    const { axios, user } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/order/seller');
            console.log("Seller Orders API Response:", res.data); // Debug log
            if (res.data.success) {
                setOrders(res.data.orders || []);
            } else {
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
            fetchOrders();
        }
    }, [user]);

    // Show loading state
    if (loading) {
        return (
            <div className="md:p-10 p-4">
                <h2 className="text-lg font-medium mb-4">Orders List</h2>
                <div className="flex justify-center items-center py-20">
                    <div className="text-gray-600">Loading orders...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="md:p-10 p-4 space-y-4">
            <h2 className="text-lg font-medium">Orders List</h2>
            
            {/* Empty state */}
            {orders.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                    <div className="text-center">
                        <div className="text-gray-600 text-lg mb-4">No orders found</div>
                        <p className="text-gray-500">No customers have placed orders yet.</p>
                    </div>
                </div>
            ) : (
                /* Orders List */
                orders.map((order, index) => (
                <div key={index} className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800">
                    <div className="flex gap-5">
                        <img className="w-12 h-12 object-cover opacity-60" src={assets.box_icon} alt="boxIcon" />
                        <>
                            {order.items && order.items.map((item, index) => (
                                <div key={index} className="flex flex-col justify-center">
                                    <p className="font-medium">
                                        {item.product?.name || 'Product Not Available'} 
                                        <span className={`text-green-500 ${item.quantity < 2 && "hidden"}`}>
                                            x {item.quantity}
                                        </span>
                                    </p>
                                </div>
                            ))}
                        </>
                    </div>

                    <div className="text-sm">
                        <p className='font-medium mb-1'>
                            {order.address?.firstName || 'N/A'} {order.address?.lastName || ''}
                        </p>
                        <p>
                            {order.address?.street || 'N/A'}, {order.address?.city || 'N/A'}, 
                            {order.address?.state || 'N/A'}, {order.address?.zipcode || 'N/A'}, 
                            {order.address?.country || 'N/A'}
                        </p>
                    </div>

                    <p className="font-medium text-base my-auto text-black/70">${order.amount}</p>

                    <div className="flex flex-col text-sm">
                        <p>Method: {order.paymentType}</p>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                    </div>
                </div>
                ))
            )}
        </div>
    );
};

export default Orders;
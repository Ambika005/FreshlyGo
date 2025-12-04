import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { clearCart, fetchUser } = useAppContext();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const handlePaymentSuccess = async () => {
            // Get session_id from URL params
            const sessionId = searchParams.get('session_id');
            
            if (sessionId) {
                try {
                    // Clear cart locally
                    clearCart();
                    
                    // Fetch updated user data to sync cart from backend
                    await fetchUser();
                    
                    toast.success('Payment successful! Your order has been placed.');
                    setIsProcessing(false);
                } catch (error) {
                    console.error('Error processing payment success:', error);
                    toast.error('Payment successful but there was an issue syncing data');
                    setIsProcessing(false);
                }
            } else {
                // If no session_id, redirect to cart
                navigate('/cart');
            }
        };
        
        handlePaymentSuccess();
    }, [searchParams, clearCart, fetchUser, navigate]);

    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <div className="mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                    <p className="text-gray-600 mb-6">
                        Thank you for your purchase. Your order has been placed successfully.
                    </p>
                </div>
                
                <div className="space-y-4">
                    {isProcessing ? (
                        <p className="text-sm text-gray-500">
                            Processing your payment...
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500">
                            Click below to view your order
                        </p>
                    )}
                    
                    <button
                        onClick={() => navigate('/my-orders', { state: { fromPayment: true } })}
                        disabled={isProcessing}
                        className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        View My Orders
                    </button>
                    
                    <button
                        onClick={() => navigate('/products')}
                        className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
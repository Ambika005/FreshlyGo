import { useAppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

const ProtectedSellerRoute = ({ children }) => {
    const { isseller, loadingSeller } = useAppContext();
    
    // Show loading while checking auth status
    if (loadingSeller) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }
    
    // Redirect to login if not authenticated
    if (!isseller) {
        return <Navigate to="/seller/login" replace />;
    }
    
    // Render children if authenticated
    return children;
};

export default ProtectedSellerRoute;
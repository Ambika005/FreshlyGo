import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import axios from 'axios';
export default function SellerLogin() {
    const { setIsseller, navigate, fetchSeller } = useAppContext();

    const handleLogin = async(e) => {
        try{
            e.preventDefault();
            
            // Extract form data
            const formData = new FormData(e.target);
            const email = formData.get('email');
            const password = formData.get('password');
            
            // Validate input
            if (!email || !password) {
                toast.error('Please fill in all fields');
                return;
            }
            
            // Send API request
            const response = await axios.post('/api/seller/login', {email, password});
            
            if(response.data.success){
                toast.success('Login successful!');
                // Refetch seller status to update context with server data
                await fetchSeller();
                navigate('/seller');
            } else {
                toast.error(response.data.message || "Login Failed");
            }
        } catch(error){
            console.log(error);
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>

            {/* Center Wrapper */}
            <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
                {/* Login Box */}
                <div className="flex flex-col w-full max-w-sm rounded-xl px-8 py-10 border border-gray-300 bg-white shadow-md text-gray-800">
                    
                    <h2 className="text-3xl font-semibold text-center text-gray-900">Sign In</h2>
                    <p className="text-gray-600 mt-1 text-center">Login to your seller account</p>

                    <form className="mt-8 space-y-4" onSubmit={handleLogin}>
                        
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                className="w-full p-2.5 bg-white border border-gray-300 rounded-md 
                                           focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                className="w-full p-2.5 bg-white border border-gray-300 rounded-md 
                                           focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Forgot password */}
                        <div className="text-right">
                            <a
                                href="#"
                                className="font-medium text-green-600 hover:text-green-700 text-sm"
                            >
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full mt-4 px-4 py-2.5 font-medium text-white 
                                       bg-green-600 rounded-md hover:bg-green-700 
                                       focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

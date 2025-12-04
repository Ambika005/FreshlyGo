import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
    const { setShowuserlogin, setUser, axios, navigate, fetchUser } = useAppContext();

    const [state, setState] = useState("login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const onChangeHandler = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`/api/user/${state}`, {
                name: data.name,
                email: data.email,
                password: data.password
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setUser(response.data.user);
                // Reset form data
                setData({ name: "", email: "", password: "" });
                fetchUser(); // Refresh user data
                navigate('/');
                setShowuserlogin(false);
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    {/* Your login form box */}

        <div onClick={()=>{setShowuserlogin(false)}} className="w-full h-screen flex items-center justify-center bg-gray-50 px-4">

            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
                className="w-full sm:w-[350px] text-center border border-gray-300 rounded-2xl px-8 py-8 bg-white shadow-md"
            >
                <h1 className="text-gray-900 text-3xl mt-4 font-semibold">
                    {state === "login" ? "Login" : "Register"}
                </h1>

                <p className="text-gray-500 text-sm mt-2 pb-4">
                    Please {state === "login" ? "sign in" : "sign up"} to continue
                </p>

                {/* Name Field - Only for Register */}
                {state !== "login" && (
                    <div className="flex items-center w-full mt-4 bg-white border border-gray-300 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-500"
                            viewBox="0 0 24 24"
                        >
                            <path d="M20 21a8 8 0 0 0-16 0" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>

                        <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={data.name}
                            onChange={onChangeHandler}
                            required
                            className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full"
                        />
                    </div>
                )}

                {/* Email Field */}
                <div className="flex items-center w-full mt-4 bg-white border border-gray-300 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500"
                        viewBox="0 0 24 24"
                    >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>

                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={data.email}
                        onChange={onChangeHandler}
                        required
                        className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full"
                    />
                </div>

                {/* Password Field */}
                <div className="flex items-center mt-4 w-full bg-white border border-gray-300 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500"
                        viewBox="0 0 24 24"
                    >
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>

                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={data.password}
                        onChange={onChangeHandler}
                        required
                        className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full"
                    />
                </div>

                {/* Forgot Password Link */}
                {state === "login" && (
                    <div className="mt-5 text-left">
                        <a className="text-sm text-blue-600 hover:underline" href="#">
                            Forgot password?
                        </a>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="mt-4 w-full h-11 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                    {state === "login" ? "Login" : "Create Account"}
                </button>

                {/* Switch Login/Register */}
                <p className="text-gray-500 text-sm mt-3 mb-6">
                    {state === "login"
                        ? "Don't have an account? "
                        : "Already have an account? "}
                    <button
                        type="button"
                        className="text-blue-600 hover:underline"
                        onClick={() =>
                            setState((prev) =>
                                prev === "login" ? "register" : "login"
                            )
                        }
                    >
                        {state === "login" ? "Register" : "Login"}
                    </button>
                </p>
            </form>
        </div>
        </div>
    );
};

export default Login;
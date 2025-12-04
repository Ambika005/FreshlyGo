import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { toast } from "react-hot-toast";
import axios from "axios";

const SellerLayout = () => {
  const { setIsseller, setSeller, navigate } = useAppContext();

  const logout = async () => {
    try{
      const response = await axios.get("/api/seller/logout");
      if(response.data.success){
        toast.success(response.data.message || "Logged out successfully");
        // Navigate first, then clear seller state after a brief delay
        navigate('/');
        setTimeout(() => {
          setIsseller(false);
          setSeller(null);
        }, 100);
      } else {
        toast.error(response.data.message || "Logout Failed");
      }
    } catch(error){
        console.log(error);
        toast.error(error.response?.data?.message || "Logout failed. Please try again.");
    }
  };

  const sidebarLinks = [
    { name: "Add Product", path: "/seller/add-product", icon: assets.add_product_icon },
    { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/seller/orders", icon: assets.orders_icon },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-100">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        
        <div className="px-6 py-5 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Seller Panel</h2>
        </div>

        <nav className="mt-4 flex flex-col gap-1">
          {sidebarLinks.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-gray-700 
                hover:bg-gray-100 transition rounded-r-full
                ${isActive ? "bg-gray-100 font-medium border-r-4 border-green-500" : ""}`
              }
            >
              <img src={item.icon} alt="" className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

      </aside>

      {/* RIGHT SECTION */}
      <div className="flex-1 flex flex-col">

        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Seller Dashboard</h1>

          <div className="flex items-center gap-4">
            <p className="text-gray-700">Hi, Admin 👋</p>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default SellerLayout;

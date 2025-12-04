import React from "react";
import { NavLink } from "react-router-dom";
import freshgo from "../assets/freshgo.svg";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets.js";
import toast from "react-hot-toast";

function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState("");

  const {
    user,
    setUser,
    navigate,
    setShowuserlogin,
    cartCount,axios,
  } = useAppContext();

  const logout = async () => {
    try{
      const res =  await axios.post("/api/user/logout"); 
      if (res.data.success) {
        setUser(null);
        navigate("/");
        toast.success(res.data.message || "Logged out successfully");
      }
      else{
        toast.error(res.data.message || "Logout Failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
   
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative">
      
      {/* Logo */}
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img src={freshgo} alt="FreshlyGo Logo" className="h-20 sm:h-24" />
      </NavLink>



      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">

        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/products/vegetables">Categories</NavLink>

        {/* Search Bar (desktop only) */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            value={searchInput}
            placeholder="Search products"
            onChange={(e) => {
              const value = e.target.value;
              setSearchInput(value);

              if (value.trim()) {
                navigate(`/search?q=${encodeURIComponent(value.trim())}`);
              }
            }}
          />
          <img
            className="h-4 w-4 cursor-pointer"
            src={assets.search_icon}
            alt="Search"
            onClick={() => {
              if (searchInput.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
              }
            }}
          />
        </div>

        {/* Cart Icon (desktop) */}
        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
          <img
            src={assets.nav_cart_icon}
            className="w-7 opacity-80"
            alt="CartIcon"
          />

          {cartCount > 0 && (
            <span
              className="
                absolute flex items-center justify-center rounded-full text-white bg-primary 
                w-[18px] h-[18px] text-xs
                -top-2 -right-3
              "
            >
              {cartCount}
            </span>
          )}
        </div>

        {/* Profile / Login */}
        {!user ? (
          <button
            onClick={() => setShowuserlogin(true)}
            className="px-8 py-2 bg-primary text-white rounded-full hover:bg-primary-dull"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img src={assets.profile_icon} className="w-10" alt="profile" />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-32 rounded-md text-sm z-40">
              <li
                onClick={() => navigate("my-orders")}
                className="p-2 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                My Orders
              </li>

              <li
                onClick={logout}
                className="p-2 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Cart Icon (ALWAYS visible) */}
      <div
        onClick={() => navigate("/cart")}
        className="sm:hidden relative cursor-pointer mr-4"
      >
        <img
          src={assets.nav_cart_icon}
          className="w-7 opacity-80"
          alt="CartIcon"
        />

        {cartCount > 0 && (
          <span
            className="
              absolute bg-primary text-white rounded-full flex items-center justify-center 
              w-[16px] h-[16px] text-[10px]
              -top-1 -right-1
              max-[360px]:top-0 max-[360px]:right-0 max-[360px]:w-[13px] max-[360px]:h-[13px] max-[360px]:text-[9px]
            "
          >
            {cartCount}
          </span>
        )}
      </div>

      {/* Hamburger Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="sm:hidden"
      >
        <img src={assets.menu_icon} alt="Menu" />
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-[70px] left-0 w-full bg-white shadow-md py-4 flex flex-col items-start gap-2 px-5 text-sm z-40 sm:hidden">

          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>Products</NavLink>
          <NavLink to="/products/vegetables" onClick={() => setOpen(false)}>Categories</NavLink>

          {/* Cart inside mobile menu */}
          <div
            onClick={() => { navigate("/cart"); setOpen(false); }}
            className="relative flex items-center gap-3 mt-2 cursor-pointer"
          >
            <img src={assets.nav_cart_icon} className="w-7 opacity-80" alt="Cart" />
            <span>Cart</span>

            {cartCount > 0 && (
              <span
                className="
                  absolute bg-primary text-white rounded-full flex items-center justify-center
                  w-[16px] h-[16px] text-[10px]
                  -top-1 -right-1
                "
              >
                {cartCount}
              </span>
            )}
          </div>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowuserlogin(true);
              }}
              className="px-6 py-2 mt-3 bg-primary text-white rounded-full"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="px-6 py-2 mt-3 bg-primary text-white rounded-full"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;

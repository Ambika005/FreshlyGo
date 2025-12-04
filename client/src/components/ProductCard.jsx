import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product = {} }) => {
  const navigate = useNavigate();
  const {
    cartItems = {},
    addToCart,
    removeFromCart,
    updateCartItem,
  } = useAppContext();

  // Handle missing product data
  if (!product || !product._id) {
    return (
      <div className="bg-gray-100 rounded-2xl p-4 shadow">
        <p className="text-gray-500">Product not available</p>
      </div>
    );
  }

  const quantity = cartItems[product._id] || 0;

  // Handle navigation to product details
  const handleCardClick = () => {
    if (product._id && product.category && product.category.length > 0) {
      // Handle category as array (take first element)
      const categoryName = Array.isArray(product.category) 
        ? product.category[0] 
        : product.category;
      navigate(`/products/${categoryName.toLowerCase()}/${product._id}`);
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl p-4 shadow hover:shadow-md transition cursor-pointer"
      onClick={handleCardClick}
    >

      {/* Product Image */}
      <img
        src={product.image?.[0] || assets.apple_image}
        alt={product.name || "Product"}
        className="w-full h-40 object-cover rounded-xl"
        onError={(e) => {
          e.target.src = assets.apple_image;
        }}
      />

      {/* Product Title */}
      <p className="mt-3 text-base font-semibold">{product.name || "Product Name"}</p>

      {/* Price */}
      <div className="flex justify-between items-center mt-2">
        <p className="text-primary font-medium">
          ₹{product.offerPrice || product.price || "0"}
          {product.offerPrice && product.price && product.offerPrice !== product.price && (
            <span className="text-gray-400 line-through text-sm ml-1">
              ₹{product.price}
            </span>
          )}
        </p>
      </div>

      {/* Add / Counter Section */}
      <div
        className="mt-4 text-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {quantity === 0 ? (
          // ADD BUTTON
          <button
            className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 w-[80px] h-[34px] rounded"
            onClick={() => addToCart(product._id)}
          >
            <img src={assets.cart_icon} alt="cart_icon" />
            Add
          </button>
        ) : (
          // COUNTER
          <div className="flex items-center justify-center gap-2 bg-primary/25 w-20 h-[34px] rounded select-none">

            {/* - button */}
            <button
              onClick={() => removeFromCart(product._id)}
              className="cursor-pointer text-md px-2 h-full"
            >
              −
            </button>

            {/* quantity */}
            <span className="text-md">{quantity}</span>

            {/* + button */}
            <button
              onClick={() => updateCartItem(product._id, quantity + 1)}
              className="cursor-pointer text-md px-2 h-full"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

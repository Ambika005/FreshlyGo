import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { category, id } = useParams();
  const { products, addToCart, cartItems } = useAppContext();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Find the product based on ID
    const foundProduct = products.find(item => item._id === id);
    setProduct(foundProduct);

    // Reset image selection when product changes
    setSelectedImageIndex(0);

    // Find related products (same category, exclude current product, limit to 4)
    if (foundProduct) {
      const foundProductCategory = Array.isArray(foundProduct.category) 
        ? foundProduct.category[0] 
        : foundProduct.category;
      
      const related = products
        .filter(item => {
          const itemCategory = Array.isArray(item.category) 
            ? item.category[0] 
            : item.category;
          return itemCategory.toLowerCase() === foundProductCategory.toLowerCase() && 
                 item._id !== foundProduct._id;
        })
        .slice(0, 4);
      setRelatedProducts(related);
    }
  }, [id, products]);

  // Handle Add to Cart with toast
  const handleAddToCart = () => {
    if (product) {
      addToCart(product._id);
      toast.success('Product added to cart');
    }
  };

  // Handle Buy Now (placeholder for now)
  const handleBuyNow = () => {
    if (product) {
      addToCart(product._id);
      toast.success('Redirecting to checkout...');
      // TODO: Add navigation to checkout page
    }
  };

  // Loading state
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-6xl text-gray-300 mb-4">📦</div>
            <h2 className="text-2xl font-medium text-gray-600">Product not found</h2>
            <p className="text-gray-500 mt-2">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              to="/products"
              className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dull transition"
            >
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const quantity = cartItems[product._id] || 0;
  const currentImage = product.image?.[selectedImageIndex] || product.image?.[0] || assets.apple_image;

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-primary transition">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary transition">Products</Link>
        <span>/</span>
        <Link 
          to={`/products/${category}`} 
          className="hover:text-primary transition capitalize"
        >
          {Array.isArray(product.category) ? product.category[0] : product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Product Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
        {/* Left - Image Gallery */}
        <div className="space-y-4">
          
          {/* Main Product Image */}
          <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center h-[400px]">
            <img
              src={currentImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.src = assets.apple_image;
              }}
            />
          </div>

          {/* Thumbnail Gallery */}
          {product.image && product.image.length > 1 && (
            <div className="flex space-x-2">
              {product.image.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    selectedImageIndex === index 
                      ? 'border-primary' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = assets.apple_image;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right - Product Information */}
        <div className="space-y-6">
          
          {/* Product Name */}
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          {/* Rating (Static for now) */}
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((star) => (
                <img key={star} src={assets.star_icon} alt="star" className="w-4 h-4" />
              ))}
              <img src={assets.star_dull_icon} alt="star" className="w-4 h-4" />
            </div>
            <span className="text-sm text-gray-600">(4)</span>
          </div>

          {/* Price Section */}
          <div className="space-y-2">
            {product.offerPrice && product.offerPrice !== product.price ? (
              <>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">MRP:</span>
                  <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-medium">MRP:</span>
                  <span className="text-2xl font-bold text-primary">₹{product.offerPrice}</span>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-lg font-medium">MRP:</span>
                <span className="text-2xl font-bold text-primary">₹{product.price}</span>
              </div>
            )}
            <p className="text-sm text-gray-600">(inclusive of all taxes)</p>
          </div>

          {/* About Product */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">About Product</h3>
            <ul className="space-y-2">
              {product.description?.map((desc, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-gray-700">{desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition flex items-center justify-center space-x-2"
            >
              <img src={assets.cart_icon} alt="cart" className="w-5 h-5 filter invert" />
              <span>Add to Cart</span>
              {quantity > 0 && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full ml-2">
                  {quantity}
                </span>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dull transition"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Related Products</h2>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
          </div>

          {/* Related Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct._id}
                onClick={() => {
                  // Navigate to the related product details page
                  const categoryName = Array.isArray(relatedProduct.category) 
                    ? relatedProduct.category[0] 
                    : relatedProduct.category;
                  window.location.href = `/products/${categoryName.toLowerCase()}/${relatedProduct._id}`;
                }}
                className="cursor-pointer"
              >
                <ProductCard product={relatedProduct} />
              </div>
            ))}
          </div>

          {/* See More Button */}
          <div className="text-center mt-12">
            <Link
              to={`/products/${Array.isArray(product.category) ? product.category[0].toLowerCase() : product.category.toLowerCase()}`}
              className="inline-block px-8 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-900 transition"
            >
              See more
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
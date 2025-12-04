import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const { category } = useParams();
  const { products } = useAppContext();

  // Find the category info from the categories array
  const categoryInfo = categories.find(
    cat => cat.path.toLowerCase() === category?.toLowerCase()
  );

  // Filter products based on category
  const filteredProducts = products.filter(item => {
    const itemCategory = Array.isArray(item.category) 
      ? item.category[0] 
      : item.category;
    return itemCategory.toLowerCase() === category?.toLowerCase();
  });

  // Get category display name (fallback to formatted category from URL)
  const categoryDisplayName = categoryInfo ? 
    categoryInfo.text : 
    category?.charAt(0).toUpperCase() + category?.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {categoryDisplayName || 'Products'}
          </h1>
          
          {filteredProducts.length > 0 && (
            <span className="text-gray-500 text-sm">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </span>
          )}
        </div>

        {/* Category Banner */}
        {categoryInfo && (
          <div 
            className="rounded-2xl p-8 mb-8 flex items-center justify-between"
            style={{ backgroundColor: categoryInfo.bgColor }}
          >
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {categoryInfo.text}
              </h2>
              <p className="text-gray-600">
                Fresh, quality products delivered to your door
              </p>
            </div>
            <img 
              src={categoryInfo.image} 
              alt={categoryInfo.text}
              className="w-24 h-24 object-contain"
            />
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          /* No Products Found */
          <div className="col-span-full text-center py-16">
            <div className="space-y-4">
              <div className="text-6xl text-gray-300">📦</div>
              <h3 className="text-2xl font-medium text-gray-600">
                No products found for this category
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {category ? 
                  `We couldn't find any products in the "${categoryDisplayName}" category. Try browsing other categories or search for specific products.` :
                  'This category appears to be empty or doesn\'t exist.'
                }
              </p>
              
              {/* Back to Categories Button */}
              <div className="mt-8">
                <button 
                  onClick={() => window.history.back()}
                  className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dull transition mr-4"
                >
                  ← Go Back
                </button>
                <button 
                  onClick={() => window.location.href = '/products'}
                  className="px-6 py-3 border border-primary text-primary rounded-full hover:bg-primary/10 transition"
                >
                  View All Products
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Navigation */}
      {filteredProducts.length > 0 && (
        <div className="mt-16 border-t pt-12">
          <h3 className="text-xl font-semibold mb-6 text-center">
            Explore Other Categories
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories
              .filter(cat => cat.path.toLowerCase() !== category?.toLowerCase())
              .map((cat, index) => (
                <div
                  key={index}
                  className="group cursor-pointer p-4 rounded-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: cat.bgColor }}
                  onClick={() => {
                    window.location.href = `/products/${cat.path.toLowerCase()}`;
                  }}
                >
                  <img
                    src={cat.image}
                    alt={cat.text}
                    className="w-16 h-16 mx-auto mb-2 object-contain"
                  />
                  <p className="text-xs font-medium text-center text-gray-700">
                    {cat.text}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import { assets } from '../assets/assets';

const ProductSearch = () => {
  const { products } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  // Efficient filtering logic with startsWith and includes conditions
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;

    const normalizedSearch = searchTerm.toLowerCase().trim();

    return products.filter((product) => {
      const productName = product.name.toLowerCase();
      
      // Single character: startsWith logic (case-insensitive)
      if (normalizedSearch.length === 1) {
        return productName.startsWith(normalizedSearch);
      }
      
      // More than 1 character: includes logic (case-insensitive)
      return productName.includes(normalizedSearch);
    });
  }, [products, searchTerm]);

  // Update search term from URL params with live updates
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    setSearchTerm(urlQuery);
  }, [searchParams]);

  const clearSearch = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Search Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          {searchTerm ? 'Search Results' : 'All Products'}
        </h2>

        {/* Search Info */}
        {searchTerm && (
          <div className="text-center mt-4 text-sm text-gray-600">
            {searchTerm.length === 1 
              ? `Showing products starting with "${searchTerm}"`
              : `Showing products containing "${searchTerm}"`
            } ({filteredProducts.length} results)
          </div>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          /* No Results Found */
          <div className="col-span-full text-center py-12">
            {searchTerm ? (
              <div className="space-y-4">
                <div className="text-6xl text-gray-300">🔍</div>
                <h3 className="text-xl font-medium text-gray-600">No results found</h3>
                <p className="text-gray-500">
                  No products match "{searchTerm}". Try a different search term.
                </p>
                <button 
                  onClick={clearSearch}
                  className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dull transition"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-lg">No products available</p>
            )}
          </div>
        )}
      </div>

      {/* Live Search Info */}
      {!searchTerm && (
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 max-w-2xl mx-auto border border-blue-100">
          <h3 className="text-lg font-medium mb-4 text-center text-gray-800">🔍 Live Search - Type to see instant results!</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Single Character (starts with):</p>
              <ul className="text-gray-600 mt-1 space-y-1">
                <li>• "a" → Apple, Amul Milk</li>
                <li>• "q" → Organic Quinoa</li>
                <li>• "b" → Banana, Brown Bread</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-700">Multiple Characters (contains):</p>
              <ul className="text-gray-600 mt-1 space-y-1">
                <li>• "rice" → Basmati Rice, Brown Rice</li>
                <li>• "milk" → Amul Milk</li>
                <li>• "bread" → Brown Bread, Whole Bread</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-600 font-medium">💡 Start typing in the search bar above to see live results!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
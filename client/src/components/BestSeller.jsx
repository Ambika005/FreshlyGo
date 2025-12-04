import React from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from './ProductCard'
import { assets } from '../assets/assets'

const BestSeller = () => {
  const { products } = useAppContext();

  // Get first 8 products as best sellers (you can modify logic as needed)
  const bestSellerProducts = products.slice(0, 8);

  return (
    <section className="py-16">
      <div className="container mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Best Sellers
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular products loved by thousands of customers
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellerProducts.length > 0 ? (
            bestSellerProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            /* Loading skeleton or fallback */
            Array(8).fill(0).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-2xl p-4 animate-pulse">
                <div className="bg-gray-200 w-full h-40 rounded-xl mb-3"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3 mb-3"></div>
                <div className="bg-gray-200 h-8 rounded"></div>
              </div>
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.location.href = '/products'}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dull transition-colors"
          >
            View All Products
            <img src={assets.arrow_right_icon_colored} alt="arrow" className="w-4 h-4 filter invert" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default BestSeller
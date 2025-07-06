import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShoppingCart, FiEdit3, FiCheck, FiStar, FiShield } = FiIcons;

const Product = () => {
  const { addItem } = useCart();

  // S3 hosted gold bar image
  const S3_GOLD_BAR_IMAGE = 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751767340338-blob';

  const product = {
    id: 1,
    name: 'Premium AI-Ready Gold Bar',
    price: 599.99,
    description: 'Authentic 99.9% pure gold bar perfect for investment or AI-powered custom engraving. Each bar comes with a certificate of authenticity and is optimized for our advanced Imagic and ControlCom AI processing systems.',
    features: [
      '99.9% Pure Gold',
      'Certificate of Authenticity', 
      'AI Custom Engraving Available',
      'Imagic Text Processing',
      'ControlCom Logo Compositing',
      'Investment Grade'
    ],
    specifications: {
      'Purity': '99.9% Pure Gold',
      'Weight': '1 Troy Ounce (31.1g)',
      'Dimensions': '50mm x 29mm x 2.5mm', 
      'Finish': 'Brilliant Uncirculated',
      'AI Processing': 'Imagic & ControlCom Ready',
      'Engraving': 'AI-Powered Precision'
    }
  };

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-gold-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 shadow-2xl">
                <img 
                  src={S3_GOLD_BAR_IMAGE}
                  alt="Premium AI-Ready Gold Bar"
                  className="w-full h-auto rounded-lg animate-float"
                  onError={(e) => {
                    console.error('Failed to load S3 hosted gold bar image');
                    // Fallback content
                    e.target.outerHTML = `
                      <div class="w-full h-64 bg-gradient-to-br from-gold-300 to-gold-600 rounded-lg flex items-center justify-center">
                        <span class="text-gold-900 font-bold text-2xl">GOLD BAR</span>
                      </div>
                    `;
                  }}
                />
                <div className="absolute top-4 right-4 bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  AI Ready
                </div>
              </div>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-gold-600 mb-4">
                ${product.price}
              </p>
              <p className="text-gray-600 text-lg">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-gold-600" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3 bg-gray-100 rounded-lg">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link 
                to="/customize" 
                className="flex-1 bg-gold-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors text-center shadow-lg hover:shadow-xl"
              >
                <SafeIcon icon={FiEdit3} className="w-5 h-5 inline mr-2" />
                AI Customize Gold Bar
              </Link>
              <button 
                onClick={handleAddToCart} 
                className="flex-1 border-2 border-gold-500 text-gold-600 px-6 py-3 rounded-lg font-semibold hover:bg-gold-500 hover:text-white transition-colors"
              >
                <SafeIcon icon={FiShoppingCart} className="w-5 h-5 inline mr-2" />
                Add to Cart
              </button>
            </div>

            <div className="bg-gold-50 border border-gold-200 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-gold-800 mb-2">
                <SafeIcon icon={FiShield} className="w-4 h-4 inline mr-1" />
                AI Processing Benefits
              </h4>
              <ul className="text-sm text-gold-700 space-y-1">
                <li>• Imagic AI for photorealistic text engraving</li>
                <li>• ControlCom AI for logo compositing with depth</li>
                <li>• Professional quality AI-generated results</li>
                <li>• S3 hosted gold bar image for consistent processing</li>
                <li>• No overlay artifacts - pure AI generation</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Product;
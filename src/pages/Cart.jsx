import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiImage } = FiIcons;

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <SafeIcon icon={FiShoppingBag} className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some beautiful gold products to get started.</p>
            <Link
              to="/product"
              className="bg-gold-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{items.length} item(s) in your cart</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {item.customization?.finalRender ? (
                      <img
                        src={item.customization.finalRender}
                        alt="Custom Gold Bar"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-gold-300 to-gold-600 rounded-lg flex items-center justify-center">
                        <span className="text-gold-900 font-bold text-xs">GOLD</span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gold-600 font-bold">${item.price}</p>
                    
                    {/* Customization Info */}
                    {item.customization && (
                      <div className="mt-2 text-sm text-gray-600">
                        {item.customization.text && (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Text:</span>
                            <span>"{item.customization.text}"</span>
                          </div>
                        )}
                        {item.customization.logo && (
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiImage} className="w-4 h-4" />
                            <span>Custom logo included</span>
                          </div>
                        )}
                        {item.customization.finalRender && (
                          <div className="flex items-center space-x-2 text-green-600">
                            <span className="font-medium">✓ AI-Rendered Preview Available</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <SafeIcon icon={FiMinus} className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <SafeIcon icon={FiPlus} className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-semibold">${(getTotalPrice() * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-gold-600">${(getTotalPrice() * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-gold-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gold-600 transition-colors text-center block"
              >
                Proceed to Checkout
              </Link>
              
              <Link
                to="/product"
                className="w-full mt-3 border-2 border-gold-500 text-gold-600 py-3 px-6 rounded-lg font-semibold hover:bg-gold-500 hover:text-white transition-colors text-center block"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
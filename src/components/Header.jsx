import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiSettings, FiTool } = FiIcons;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">LG</span>
            </div>
            <span className="text-xl font-bold text-gray-900">LuxGold</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gold-600 transition-colors">
              Home
            </Link>
            <Link to="/product" className="text-gray-700 hover:text-gold-600 transition-colors">
              Product
            </Link>
            {user && (
              <Link to="/orders" className="text-gray-700 hover:text-gold-600 transition-colors">
                My Orders
              </Link>
            )}
            <Link to="/test-merger" className="text-gray-700 hover:text-gold-600 transition-colors flex items-center space-x-1">
              <SafeIcon icon={FiTool} className="w-4 h-4" />
              <span>Test Merger</span>
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-gold-600 transition-colors">
              <SafeIcon icon={FiShoppingCart} className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gold-600 transition-colors"
                >
                  <SafeIcon icon={FiUser} className="w-6 h-6" />
                  <span className="hidden sm:block">{user.name}</span>
                </button>

                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  >
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/dashboard'}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <SafeIcon icon={FiSettings} className="w-4 h-4 inline mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <SafeIcon icon={FiUser} className="w-4 h-4 inline mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <SafeIcon icon={FiLogOut} className="w-4 h-4 inline mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-gray-700 hover:text-gold-600 transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gold-500 text-white px-4 py-2 rounded-md hover:bg-gold-600 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-gold-600 transition-colors"
            >
              <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className="text-gray-700 hover:text-gold-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/product"
                className="text-gray-700 hover:text-gold-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Product
              </Link>
              {user && (
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-gold-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
              )}
              <Link
                to="/test-merger"
                className="text-gray-700 hover:text-gold-600 transition-colors py-2 flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <SafeIcon icon={FiTool} className="w-4 h-4" />
                <span>Test Merger</span>
              </Link>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
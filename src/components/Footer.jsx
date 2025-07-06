import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram } = FiIcons;

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">LG</span>
              </div>
              <span className="text-xl font-bold">LuxGold</span>
            </div>
            <p className="text-gray-300 text-sm">
              Premium custom gold products crafted with precision and elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-gold-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/product" className="text-gray-300 hover:text-gold-400 transition-colors">
                  Product
                </Link>
              </li>
              <li>
                <Link to="/customize" className="text-gray-300 hover:text-gold-400 transition-colors">
                  Customize
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-300">
                <SafeIcon icon={FiMail} className="w-4 h-4" />
                <span>info@luxgold.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <SafeIcon icon={FiPhone} className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                <span>123 Gold Street, NY</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-gold-400 transition-colors">
                <SafeIcon icon={FiFacebook} className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-gold-400 transition-colors">
                <SafeIcon icon={FiTwitter} className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-gold-400 transition-colors">
                <SafeIcon icon={FiInstagram} className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 LuxGold. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
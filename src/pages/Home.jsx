import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiShield, FiTruck, FiAward } = FiIcons;

const Home = () => {
  const features = [
    { icon: FiStar, title: 'Premium Quality', description: 'Crafted with the finest gold materials' },
    { icon: FiShield, title: 'Guaranteed Authenticity', description: 'Certified genuine gold products' },
    { icon: FiTruck, title: 'Fast Delivery', description: 'Express shipping worldwide' },
    { icon: FiAward, title: 'AI Custom Engraving', description: 'Personalized designs with advanced AI' }
  ];

  // S3 hosted gold bar image for homepage
  const S3_GOLD_BAR_IMAGE = 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751767340338-blob';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gold-50 to-gold-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Luxury <span className="text-gold-600">Gold</span>
                <br />
                AI-Customized for You
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create personalized gold products with your custom logo or text using advanced AI technology. 
                Professional quality meets individual style with Imagic and ControlCom AI processing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/product" 
                  className="bg-gold-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors text-center"
                >
                  Shop Now
                </Link>
                <Link 
                  to="/customize" 
                  className="border-2 border-gold-500 text-gold-600 px-8 py-3 rounded-lg font-semibold hover:bg-gold-500 hover:text-white transition-colors text-center"
                >
                  AI Customize
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="w-full max-w-md mx-auto">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 shadow-2xl animate-float">
                  <img 
                    src={S3_GOLD_BAR_IMAGE}
                    alt="Premium Gold Bar"
                    className="w-full h-auto rounded-lg"
                    onError={(e) => {
                      console.error('Failed to load S3 hosted gold bar image');
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    AI Ready
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose LuxGold?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the perfect blend of luxury, quality, and personalization with our AI-powered engraving technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-100 rounded-full mb-4">
                  <SafeIcon icon={feature.icon} className="w-8 h-8 text-gold-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Create Your AI-Customized Gold Product?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start designing your personalized gold product today. Upload your logo or add custom text 
              with our advanced Imagic and ControlCom AI processing for photorealistic results.
            </p>
            <Link 
              to="/customize" 
              className="bg-gold-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors inline-block"
            >
              Start AI Customization
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
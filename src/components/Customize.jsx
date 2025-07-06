import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CustomizationPanel from './CustomizationPanel';
import CSSLivePreview from './CSSLivePreview';
import AIRenderingProcessor from './AIRenderingProcessor';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft } = FiIcons;

const Customize = () => {
  const [customText, setCustomText] = useState('');
  const [logoImage, setLogoImage] = useState(null);
  const [currentView, setCurrentView] = useState('design'); // 'design' or 'ai-processing'

  const handleProcessWithAI = () => {
    if (!customText.trim() && !logoImage) {
      alert('Please add custom text or upload a logo before processing.');
      return;
    }
    setCurrentView('ai-processing');
  };

  const handleBackToDesign = () => {
    setCurrentView('design');
  };

  // Render AI Processing view
  if (currentView === 'ai-processing') {
    return (
      <AIRenderingProcessor
        customText={customText}
        logoImage={logoImage}
        onBack={handleBackToDesign}
      />
    );
  }

  // Main design view
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-gold-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Customize Your Gold Bar
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Design your personalized gold bar with custom text or logo. We'll use advanced AI to create photorealistic engravings.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Customization */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <CustomizationPanel
              customText={customText}
              logoImage={logoImage}
              onTextChange={setCustomText}
              onLogoChange={setLogoImage}
            />

            {/* AI Processing Option */}
            {(customText.trim() || logoImage) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    AI-Powered Processing
                  </h3>
                  
                  <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">
                      {customText ? '🤖 Imagic AI Text Processing' : '🎨 ControlCom AI Logo Processing'}
                    </h4>
                    <p className="text-sm text-purple-700">
                      {customText 
                        ? `Your text "${customText}" will be processed using Imagic AI for photorealistic text-guided engraving with natural shadows and depth.`
                        : 'Your logo will be processed using ControlCom AI for realistic image compositing with proper lighting and texture blending.'
                      }
                    </p>
                  </div>

                  <button
                    onClick={handleProcessWithAI}
                    className="w-full bg-gold-500 text-white px-6 py-4 rounded-lg font-semibold hover:bg-gold-600 transition-colors shadow-lg hover:shadow-xl"
                  >
                    🚀 Process with {customText ? 'Imagic' : 'ControlCom'} AI
                    <p className="text-sm text-gold-100 mt-1">
                      Generate photorealistic engraving preview
                    </p>
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Panel - Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <CSSLivePreview
              customText={customText}
              logoImage={logoImage}
              onTextChange={setCustomText}
              onLogoChange={setLogoImage}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Customize;
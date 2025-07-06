import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import AIRenderingProcessor from './AIRenderingProcessor';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiType, FiX, FiImage, FiEdit3, FiTarget, FiArrowRight, FiBrain } = FiIcons;

const EnhancedCustomizer = () => {
  const [customText, setCustomText] = useState('');
  const [logoImage, setLogoImage] = useState(null);
  const [activeTab, setActiveTab] = useState('text');
  const [showAIProcessor, setShowAIProcessor] = useState(false);

  const textPresets = [
    'Happy Birthday',
    'Anniversary 2024', 
    'Congratulations',
    'Best Wishes',
    'Thank You',
    'Love Always'
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogoImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  });

  const clearLogo = () => {
    setLogoImage(null);
  };

  const handlePresetText = (preset) => {
    setCustomText(preset);
  };

  const hasContent = customText.trim() || logoImage;

  const handleProcessContent = () => {
    if (!hasContent) {
      alert('Please add custom text or upload a logo before processing.');
      return;
    }
    setShowAIProcessor(true);
  };

  const handleBackToDesign = () => {
    setShowAIProcessor(false);
  };

  // If showing AI processor, render that component
  if (showAIProcessor) {
    return (
      <AIRenderingProcessor
        customText={customText}
        logoImage={logoImage}
        onBack={handleBackToDesign}
      />
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-gold-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Step 1: Design Your Custom Gold Bar
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create your design first, then we'll generate a photorealistic preview using advanced AI
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            {/* Tab Navigation */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <SafeIcon icon={FiTarget} className="w-5 h-5 mr-2 text-gold-600" />
                Design Your Custom Engraving
              </h3>
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                    activeTab === 'text'
                      ? 'bg-white text-gold-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <SafeIcon icon={FiType} className="w-4 h-4 inline mr-2" />
                  Custom Text
                </button>
                <button
                  onClick={() => setActiveTab('logo')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                    activeTab === 'logo'
                      ? 'bg-white text-gold-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <SafeIcon icon={FiImage} className="w-4 h-4 inline mr-2" />
                  Upload Logo
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'text' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Enter Your Custom Text
                    </label>
                    <textarea
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="Type your custom text here..."
                      className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 resize-none text-lg"
                      rows="4"
                      maxLength={40}
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>Characters: {customText.length}/40</span>
                      <span>Will be processed with Imagic AI</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Quick Presets
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {textPresets.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => handlePresetText(preset)}
                          className={`p-3 text-sm border-2 rounded-lg transition-all ${
                            customText === preset
                              ? 'border-gold-500 bg-gold-50 text-gold-700'
                              : 'border-gray-300 hover:border-gold-300 hover:bg-gold-50'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 mb-2">
                      Imagic AI Text Processing
                    </h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Text will be realistically engraved using Imagic AI</li>
                      <li>• Photorealistic depth, shadows, and lighting effects</li>
                      <li>• Positioned naturally on the gold bar surface</li>
                      <li>• Professional serif font with realistic texturing</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === 'logo' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {!logoImage ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Upload Your Logo
                      </label>
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                          isDragActive
                            ? 'border-gold-500 bg-gold-50'
                            : 'border-gray-300 hover:border-gold-400 hover:bg-gold-50'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <SafeIcon icon={FiUpload} className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-lg text-gray-600 mb-2">
                          {isDragActive
                            ? 'Drop your logo here'
                            : 'Drag & drop your logo, or click to browse'}
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, JPEG, GIF, or SVG • Max 5MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Logo Preview (Original)
                      </label>
                      <div className="relative inline-block mb-4">
                        <img
                          src={logoImage}
                          alt="Uploaded logo"
                          className="max-w-xs max-h-32 mx-auto rounded-lg shadow-lg"
                        />
                        <button
                          onClick={clearLogo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Original logo ready for ControlCom AI processing
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">
                      ControlCom AI Logo Processing
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Logo will be realistically composited using ControlCom AI</li>
                      <li>• Depth-aware blending with natural surface integration</li>
                      <li>• AI-generated lighting and material interaction</li>
                      <li>• Professional engraving appearance with realistic shadows</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Design Summary */}
            {hasContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <h3 className="font-semibold text-green-800 mb-2">Design Ready for AI Processing</h3>
                <div className="text-sm text-green-700 space-y-1">
                  {customText && <p>• Custom Text: "{customText}"</p>}
                  {logoImage && <p>• Custom logo uploaded</p>}
                  <p>• Ready for {customText ? 'Imagic' : 'ControlCom'} AI processing</p>
                  <p>• Will be rendered with photorealistic quality</p>
                </div>
              </motion.div>
            )}

            {/* Process Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleProcessContent}
                disabled={!hasContent}
                className={`inline-flex items-center space-x-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                  !hasContent
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gold-500 text-white hover:bg-gold-600 shadow-lg hover:shadow-xl'
                }`}
              >
                <SafeIcon icon={FiBrain} className="w-5 h-5" />
                <span>Process with AI</span>
                <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
              </button>
              {!hasContent && (
                <p className="text-sm text-gray-500 mt-2">
                  Add custom text or upload a logo to continue
                </p>
              )}
            </div>
          </motion.div>

          {/* AI Technology Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6"
          >
            <h4 className="font-medium text-purple-800 mb-3 flex items-center">
              <SafeIcon icon={FiBrain} className="w-4 h-4 mr-2" />
              AI Technology Pipeline
            </h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Step 1: Design your content (current step)</li>
              <li>• Step 2: AI processing with {customText ? 'Imagic (text-guided editing)' : 'ControlCom (image compositing)'}</li>
              <li>• Step 3: Photorealistic preview with download and cart options</li>
              <li>• Technology: Advanced neural networks for realistic rendering</li>
              <li>• Output: Professional-grade preview suitable for production</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCustomizer;
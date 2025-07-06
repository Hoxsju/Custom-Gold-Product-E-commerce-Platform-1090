import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiType, FiX, FiImage, FiEdit3 } = FiIcons;

const CustomizationPanel = ({ onTextChange, onLogoChange, customText, logoImage }) => {
  const [activeTab, setActiveTab] = useState('text');
  const [textPresets] = useState([
    'Happy Birthday',
    'Anniversary 2024',
    'Congratulations',
    'Best Wishes',
    'Thank You',
    'Love Always'
  ]);

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
          onLogoChange(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  });

  const clearLogo = () => {
    onLogoChange(null);
  };

  const handlePresetText = (preset) => {
    onTextChange(preset);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Customize Your Gold Bar</h3>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'text'
              ? 'bg-white text-gold-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <SafeIcon icon={FiType} className="w-4 h-4 inline mr-2" />
          Add Text
        </button>
        <button
          onClick={() => setActiveTab('logo')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'logo'
              ? 'bg-white text-gold-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <SafeIcon icon={FiImage} className="w-4 h-4 inline mr-2" />
          Upload Logo
        </button>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Text
              </label>
              <textarea
                value={customText}
                onChange={(e) => onTextChange(e.target.value)}
                placeholder="Enter your custom text here..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                rows="3"
                maxLength={50}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Characters: {customText.length}/50</span>
                <span>Laser engraved</span>
              </div>
            </div>
            
            {/* Text Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {textPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetText(preset)}
                    className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gold-50 hover:border-gold-300 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-gold-50 border border-gold-200 rounded-lg p-3">
              <h4 className="font-medium text-gold-800 mb-2">
                <SafeIcon icon={FiEdit3} className="w-4 h-4 inline mr-1" />
                Text Engraving Details
              </h4>
              <ul className="text-sm text-gold-700 space-y-1">
                <li>• Maximum 50 characters</li>
                <li>• Precision laser engraving</li>
                <li>• Permanent and scratch-resistant</li>
                <li>• Professional serif font</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'logo' && (
          <div className="space-y-4">
            {!logoImage ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-gold-500 bg-gold-50'
                    : 'border-gray-300 hover:border-gold-400'
                }`}
              >
                <input {...getInputProps()} />
                <SafeIcon icon={FiUpload} className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {isDragActive
                    ? 'Drop your logo here'
                    : 'Drag & drop your logo, or click to select'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, JPEG, GIF, or SVG (Max 5MB)
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={logoImage}
                  alt="Uploaded logo"
                  className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                />
                <button
                  onClick={clearLogo}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="bg-gold-50 border border-gold-200 rounded-lg p-3">
              <h4 className="font-medium text-gold-800 mb-2">
                <SafeIcon icon={FiImage} className="w-4 h-4 inline mr-1" />
                Logo Engraving Guidelines
              </h4>
              <ul className="text-sm text-gold-700 space-y-1">
                <li>• High contrast designs work best</li>
                <li>• Simple logos produce cleaner results</li>
                <li>• Avoid text smaller than 8pt</li>
                <li>• Black & white or single color preferred</li>
                <li>• Vector formats (SVG) recommended</li>
              </ul>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CustomizationPanel;
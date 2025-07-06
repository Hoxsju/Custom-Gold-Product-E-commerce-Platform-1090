import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiRotateCw, FiZoomIn, FiZoomOut, FiRefreshCw, FiShoppingCart, FiDownload, FiImage, FiType, FiArrowLeft, FiSettings } = FiIcons;

const AdjustmentPreview = ({ customText = '', logoImage = null, onBack }) => {
  const { addItem } = useCart();
  const previewRef = useRef(null);
  
  const [engravingSettings, setEngravingSettings] = useState({
    rotation: 0,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    opacity: 0.9
  });

  // Product data
  const baseProduct = {
    id: `custom-${Date.now()}`,
    name: 'Custom Engraved Gold Bar',
    price: 599.99
  };

  // Gold bar image
  const GOLD_BAR_IMAGE = 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751622642876-blob';

  // Control functions - Fixed with proper state updates
  const handleRotationChange = (delta) => {
    setEngravingSettings(prev => {
      const newRotation = (prev.rotation + delta) % 360;
      console.log('Rotation changed:', prev.rotation, '+', delta, '=', newRotation);
      return { ...prev, rotation: newRotation };
    });
  };

  const handleScaleChange = (delta) => {
    setEngravingSettings(prev => {
      const newScale = Math.max(0.5, Math.min(2.5, prev.scale + delta));
      console.log('Scale changed:', prev.scale, '+', delta, '=', newScale);
      return { ...prev, scale: newScale };
    });
  };

  const handlePositionChange = (deltaX, deltaY) => {
    setEngravingSettings(prev => {
      const newOffsetX = Math.max(-40, Math.min(40, prev.offsetX + deltaX));
      const newOffsetY = Math.max(-20, Math.min(20, prev.offsetY + deltaY));
      console.log('Position changed:', prev.offsetX, prev.offsetY, '+', deltaX, deltaY, '=', newOffsetX, newOffsetY);
      return { ...prev, offsetX: newOffsetX, offsetY: newOffsetY };
    });
  };

  const handleResetSettings = () => {
    console.log('Resetting all settings');
    setEngravingSettings({
      rotation: 0,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      opacity: 0.9
    });
  };

  // Add to cart function
  const handleAddToCart = () => {
    const customProduct = {
      ...baseProduct,
      customization: {
        text: customText,
        logo: logoImage,
        processedLogo: logoImage,
        settings: engravingSettings,
        finalRender: null
      }
    };

    addItem(customProduct);
    alert('Custom engraved gold bar added to cart!');
  };

  // Download preview function
  const handleDownloadPreview = async () => {
    if (!previewRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 3,
        backgroundColor: null,
        logging: false
      });

      const link = document.createElement('a');
      link.download = `engraved-gold-bar-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const hasContent = customText.trim() || logoImage;

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-gold-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
            <span>Back to Design</span>
          </button>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Step 3: Live Preview & Adjustment Controls
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your design has been processed with gold engraving color. Use the controls below to adjust positioning.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {/* Live Preview Container */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6">
              <div
                ref={previewRef}
                className="relative mx-auto max-w-lg"
                style={{ aspectRatio: '16/10' }}
              >
                {/* Gold Bar Base Image */}
                <img
                  src={GOLD_BAR_IMAGE}
                  alt="Gold Bar"
                  className="w-full h-full object-contain rounded-lg shadow-lg"
                  style={{ filter: 'brightness(1.05) contrast(1.02)' }}
                />

                {/* Live Indicator */}
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse flex items-center z-10">
                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-ping"></div>
                  LIVE
                </div>

                {/* Backend Processed Indicator */}
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                  ✓ Processed
                </div>

                {/* Bottom Rectangle Engraving Area - Precisely positioned */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: '25%',
                    right: '25%',
                    bottom: '25%',
                    height: '15%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Custom Text Engraving - Backend Processed Color */}
                  {customText.trim() && (
                    <motion.div
                      key={`text-${engravingSettings.rotation}-${engravingSettings.scale}-${engravingSettings.offsetX}-${engravingSettings.offsetY}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        transform: `
                          translate(${engravingSettings.offsetX}px, ${engravingSettings.offsetY}px)
                          rotate(${engravingSettings.rotation}deg)
                          scale(${engravingSettings.scale})
                        `,
                        transformOrigin: 'center'
                      }}
                    >
                      <div
                        className="text-center font-serif font-bold select-none whitespace-nowrap overflow-hidden"
                        style={{
                          // Backend processed gold engraving color
                          color: '#5a4410',
                          fontSize: `${Math.max(8, Math.min(16, 120 / Math.max(customText.length, 1)))}px`,
                          textShadow: `
                            1px 1px 2px rgba(90, 68, 16, 0.9),
                            0 0 4px rgba(90, 68, 16, 0.7),
                            inset 0 1px 0 rgba(255, 215, 0, 0.3)
                          `,
                          opacity: engravingSettings.opacity,
                          letterSpacing: '1px',
                          lineHeight: '1.1',
                          filter: 'contrast(1.4) brightness(0.6)',
                          // Enhanced embossed effect
                          background: `linear-gradient(145deg, rgba(90, 68, 16, 0.15), rgba(90, 68, 16, 0.35))`,
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          maxWidth: '100%',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {customText}
                      </div>
                    </motion.div>
                  )}

                  {/* Logo Engraving - Backend Processed */}
                  {logoImage && !customText.trim() && (
                    <motion.div
                      key={`logo-${engravingSettings.rotation}-${engravingSettings.scale}-${engravingSettings.offsetX}-${engravingSettings.offsetY}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        transform: `
                          translate(${engravingSettings.offsetX}px, ${engravingSettings.offsetY}px)
                          rotate(${engravingSettings.rotation}deg)
                          scale(${engravingSettings.scale})
                        `,
                        transformOrigin: 'center'
                      }}
                    >
                      <img
                        src={logoImage}
                        alt="Processed Logo Engraving"
                        className="max-w-full max-h-full object-contain select-none"
                        style={{
                          // Backend processed gold color applied
                          filter: `
                            contrast(1.3) brightness(0.8) opacity(${engravingSettings.opacity})
                            drop-shadow(1px 1px 2px rgba(90, 68, 16, 0.8))
                            sepia(1) hue-rotate(-30deg) saturate(3)
                          `,
                          mixBlendMode: 'multiply',
                          maxWidth: '90%',
                          maxHeight: '90%'
                        }}
                      />
                    </motion.div>
                  )}

                  {/* Engraving Area Highlight */}
                  <div
                    className="absolute border border-gold-400 opacity-20 pointer-events-none"
                    style={{ inset: 0, borderRadius: '2px' }}
                  />
                </div>
              </div>
            </div>

            {/* Preview Info */}
            <div className="p-4 bg-gold-50 border-t">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-gold-700">
                  <SafeIcon icon={FiImage} className="w-4 h-4" />
                  <span>Live Preview with Controls</span>
                </div>
                <div className="text-gold-600 font-medium">
                  Color: #5a4410 Applied
                </div>
              </div>
              <div className="mt-2 text-xs text-gold-600">
                <p>✓ Content converted to gold engraving color</p>
                <p>✓ Professional depth and shadow effects applied</p>
                <p>✓ Ready for positioning adjustments</p>
              </div>
            </div>
          </motion.div>

          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <SafeIcon icon={FiSettings} className="w-5 h-5 mr-2 text-gold-600" />
              Engraving Adjustment Controls
            </h3>

            {/* Rotation & Scale Controls */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Rotation & Scale</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleRotationChange(-15)}
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 px-4 py-3 rounded-lg text-sm transition-colors shadow-sm border border-gray-200"
                >
                  <SafeIcon icon={FiRotateCw} className="w-4 h-4 transform rotate-180" />
                  <span>Rotate L</span>
                </button>

                <button
                  onClick={() => handleRotationChange(15)}
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 px-4 py-3 rounded-lg text-sm transition-colors shadow-sm border border-gray-200"
                >
                  <SafeIcon icon={FiRotateCw} className="w-4 h-4" />
                  <span>Rotate R</span>
                </button>

                <button
                  onClick={() => handleScaleChange(0.1)}
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 px-4 py-3 rounded-lg text-sm transition-colors shadow-sm border border-gray-200"
                >
                  <SafeIcon icon={FiZoomIn} className="w-4 h-4" />
                  <span>Larger</span>
                </button>

                <button
                  onClick={() => handleScaleChange(-0.1)}
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 px-4 py-3 rounded-lg text-sm transition-colors shadow-sm border border-gray-200"
                >
                  <SafeIcon icon={FiZoomOut} className="w-4 h-4" />
                  <span>Smaller</span>
                </button>
              </div>
            </div>

            {/* Position Controls */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Fine Position Adjustment</h4>
              <div className="flex justify-center">
                <div className="grid grid-cols-3 gap-2 w-32">
                  <div></div>
                  <button
                    onClick={() => handlePositionChange(0, -3)}
                    className="bg-white hover:bg-gray-100 p-3 rounded-lg text-sm transition-colors shadow-sm border border-gray-200"
                    title="Move Up"
                  >
                    ↑
                  </button>
                  <div></div>

                  <button
                    onClick={() => handlePositionChange(-3, 0)}
                    className="bg-white hover:bg-gray-100 p-3 rounded-lg text-sm transition-colors shadow-sm border border-gray-200"
                    title="Move Left"
                  >
                    ←
                  </button>

                  <button
                    onClick={handleResetSettings}
                    className="bg-gold-500 hover:bg-gold-600 text-white p-3 rounded-lg text-sm transition-colors shadow-sm"
                    title="Reset All"
                  >
                    ⌂
                  </button>

                  <button
                    onClick={() => handlePositionChange(3, 0)}
                    className="bg-white hover:bg-gray-100 p-3 rounded-lg text-sm transition-colors shadow-sm border border-gray-200"
                    title="Move Right"
                  >
                    →
                  </button>

                  <div></div>
                  <button
                    onClick={() => handlePositionChange(0, 3)}
                    className="bg-white hover:bg-gray-100 p-3 rounded-lg text-sm transition-colors shadow-sm border border-gray-200"
                    title="Move Down"
                  >
                    ↓
                  </button>
                  <div></div>
                </div>
              </div>
            </div>

            {/* Settings Display */}
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Current Settings</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rotation:</span>
                  <span className="font-medium">{engravingSettings.rotation}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scale:</span>
                  <span className="font-medium">{(engravingSettings.scale * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Position X:</span>
                  <span className="font-medium">{engravingSettings.offsetX}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Position Y:</span>
                  <span className="font-medium">{engravingSettings.offsetY}px</span>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="mb-6">
              <button
                onClick={handleResetSettings}
                className="w-full flex items-center justify-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
                <span>Reset All Settings</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!hasContent}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center ${
                  hasContent
                    ? 'bg-gold-500 text-white hover:bg-gold-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <SafeIcon icon={FiShoppingCart} className="w-5 h-5 mr-2" />
                Add to Cart - ${baseProduct.price}
              </button>

              <button
                onClick={handleDownloadPreview}
                disabled={!hasContent}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center ${
                  hasContent
                    ? 'border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white'
                    : 'border-2 border-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <SafeIcon icon={FiDownload} className="w-5 h-5 mr-2" />
                Download Preview
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentPreview;
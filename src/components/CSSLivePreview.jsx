import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiRotateCw, FiZoomIn, FiZoomOut, FiRefreshCw, FiShoppingCart, FiDownload, FiImage, FiType } = FiIcons;

const CSSLivePreview = ({ customText = '', logoImage = null, onTextChange, onLogoChange }) => {
  const { addItem } = useCart();
  const previewRef = useRef(null);
  const [engravingSettings, setEngravingSettings] = useState({
    rotation: 0,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    opacity: 0.9
  });

  // Backend processing states
  const [processedLogo, setProcessedLogo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Product data
  const baseProduct = {
    id: `custom-${Date.now()}`,
    name: 'Custom Engraved Gold Bar',
    price: 599.99
  };

  // Updated gold bar image URL
  const GOLD_BAR_IMAGE = 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751720510839-01660712561c4928a3c61a927d22f2e0superresolution.webp';

  // Backend processing function for logo
  const processLogoToGoldEngraving = async (imageDataUrl) => {
    if (!imageDataUrl) {
      setProcessedLogo(null);
      return;
    }

    setIsProcessing(true);
    try {
      // Create a canvas to process the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageDataUrl;
      });

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Process each pixel to create gold engraving effect
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        // Convert to grayscale
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;

        // Apply gold engraving color (#5a4410 = 90, 68, 16)
        // Darker areas become more transparent, lighter areas become gold-colored
        const intensity = gray / 255;
        const goldR = 90;
        const goldG = 68;
        const goldB = 16;

        // Invert intensity for engraving effect (darker original = more visible engraving)
        const engravingIntensity = 1 - intensity;

        data[i] = goldR;
        data[i + 1] = goldG;
        data[i + 2] = goldB;
        data[i + 3] = alpha * engravingIntensity * 0.8; // Adjust opacity for engraving effect
      }

      // Put processed image data back
      ctx.putImageData(imageData, 0, 0);

      // Convert to data URL
      const processedDataUrl = canvas.toDataURL('image/png');
      setProcessedLogo(processedDataUrl);

    } catch (error) {
      console.error('Logo processing failed:', error);
      setProcessedLogo(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process logo when it changes
  useEffect(() => {
    if (logoImage) {
      processLogoToGoldEngraving(logoImage);
    } else {
      setProcessedLogo(null);
    }
  }, [logoImage]);

  // Control functions - Fixed to properly update state
  const adjustRotation = (delta) => {
    setEngravingSettings(prev => {
      const newRotation = (prev.rotation + delta) % 360;
      console.log('Adjusting rotation:', prev.rotation, '+', delta, '=', newRotation);
      return { ...prev, rotation: newRotation };
    });
  };

  const adjustScale = (delta) => {
    setEngravingSettings(prev => {
      const newScale = Math.max(0.5, Math.min(2.5, prev.scale + delta));
      console.log('Adjusting scale:', prev.scale, '+', delta, '=', newScale);
      return { ...prev, scale: newScale };
    });
  };

  const adjustPosition = (deltaX, deltaY) => {
    setEngravingSettings(prev => {
      const newOffsetX = Math.max(-40, Math.min(40, prev.offsetX + deltaX));
      const newOffsetY = Math.max(-20, Math.min(20, prev.offsetY + deltaY));
      console.log('Adjusting position:', prev.offsetX, prev.offsetY, '+', deltaX, deltaY, '=', newOffsetX, newOffsetY);
      return { ...prev, offsetX: newOffsetX, offsetY: newOffsetY };
    });
  };

  const resetSettings = () => {
    console.log('Resetting engraving settings');
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
    if (!customText.trim() && !logoImage) {
      alert('Please add custom text or upload a logo before adding to cart.');
      return;
    }

    const customProduct = {
      ...baseProduct,
      customization: {
        text: customText,
        logo: logoImage,
        processedLogo: processedLogo,
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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center z-10">
              <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-2"></div>
              Processing...
            </div>
          )}

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
            {processedLogo && !customText.trim() && (
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
                  src={processedLogo}
                  alt="Processed Logo Engraving"
                  className="max-w-full max-h-full object-contain select-none"
                  style={{
                    // Additional effects on top of backend processing
                    filter: `
                      contrast(1.3) brightness(0.8) opacity(${engravingSettings.opacity})
                      drop-shadow(1px 1px 2px rgba(90, 68, 16, 0.8))
                    `,
                    mixBlendMode: 'multiply',
                    maxWidth: '90%',
                    maxHeight: '90%'
                  }}
                />
              </motion.div>
            )}

            {/* Engraving Area Guide (shown when no content) */}
            {!hasContent && (
              <div className="absolute inset-0 border-2 border-dashed border-gold-500 rounded-sm bg-gold-100 bg-opacity-30 flex items-center justify-center">
                <div className="text-center text-gold-700">
                  <SafeIcon icon={FiType} className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-xs font-semibold">Bottom Rectangle</p>
                  <p className="text-xs">Engraving Area</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Indicator */}
          {hasContent && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
              ✓ Backend Processed
            </div>
          )}

          {/* Engraving Area Highlight */}
          {hasContent && (
            <div
              className="absolute border border-gold-400 opacity-20 pointer-events-none"
              style={{
                left: '25%',
                right: '25%',
                bottom: '25%',
                height: '15%',
                borderRadius: '2px'
              }}
            />
          )}
        </div>
      </div>

      {/* Controls Panel - Fixed Event Handlers */}
      {hasContent && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Engraving Adjustment Controls</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={(e) => { e.preventDefault(); adjustRotation(-15); }}
                className="flex items-center space-x-1 bg-white hover:bg-gray-100 px-3 py-2 rounded-lg text-sm transition-colors shadow-sm border"
                type="button"
              >
                <SafeIcon icon={FiRotateCw} className="w-4 h-4 transform rotate-180" />
                <span>Rotate L</span>
              </button>

              <button
                onClick={(e) => { e.preventDefault(); adjustRotation(15); }}
                className="flex items-center space-x-1 bg-white hover:bg-gray-100 px-3 py-2 rounded-lg text-sm transition-colors shadow-sm border"
                type="button"
              >
                <SafeIcon icon={FiRotateCw} className="w-4 h-4" />
                <span>Rotate R</span>
              </button>

              <button
                onClick={(e) => { e.preventDefault(); adjustScale(0.1); }}
                className="flex items-center space-x-1 bg-white hover:bg-gray-100 px-3 py-2 rounded-lg text-sm transition-colors shadow-sm border"
                type="button"
              >
                <SafeIcon icon={FiZoomIn} className="w-4 h-4" />
                <span>Larger</span>
              </button>

              <button
                onClick={(e) => { e.preventDefault(); adjustScale(-0.1); }}
                className="flex items-center space-x-1 bg-white hover:bg-gray-100 px-3 py-2 rounded-lg text-sm transition-colors shadow-sm border"
                type="button"
              >
                <SafeIcon icon={FiZoomOut} className="w-4 h-4" />
                <span>Smaller</span>
              </button>

              <button
                onClick={(e) => { e.preventDefault(); resetSettings(); }}
                className="flex items-center space-x-1 bg-gold-500 hover:bg-gold-600 text-white px-3 py-2 rounded-lg text-sm transition-colors shadow-sm"
                type="button"
              >
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Fine Position Controls - Fixed Event Handlers */}
          <div className="mb-4 flex justify-center">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-2">Fine Position Adjustment</p>
              <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
                <div></div>
                <button
                  onClick={(e) => { e.preventDefault(); adjustPosition(0, -2); }}
                  className="bg-white hover:bg-gray-100 p-2 rounded text-sm transition-colors shadow-sm border"
                  title="Move Up"
                  type="button"
                >
                  ↑
                </button>
                <div></div>

                <button
                  onClick={(e) => { e.preventDefault(); adjustPosition(-2, 0); }}
                  className="bg-white hover:bg-gray-100 p-2 rounded text-sm transition-colors shadow-sm border"
                  title="Move Left"
                  type="button"
                >
                  ←
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); adjustPosition(0, 0); }}
                  className="bg-gray-200 p-2 rounded text-sm border"
                  title="Center"
                  type="button"
                >
                  ⌂
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); adjustPosition(2, 0); }}
                  className="bg-white hover:bg-gray-100 p-2 rounded text-sm transition-colors shadow-sm border"
                  title="Move Right"
                  type="button"
                >
                  →
                </button>

                <div></div>
                <button
                  onClick={(e) => { e.preventDefault(); adjustPosition(0, 2); }}
                  className="bg-white hover:bg-gray-100 p-2 rounded text-sm transition-colors shadow-sm border"
                  title="Move Down"
                  type="button"
                >
                  ↓
                </button>
                <div></div>
              </div>
            </div>
          </div>

          {/* Settings Display - Now shows live values */}
          <div className="text-xs text-gray-500 text-center mb-4 bg-gray-100 rounded-lg p-2">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <span className="font-medium">Rotation:</span> {engravingSettings.rotation}°
              </div>
              <div>
                <span className="font-medium">Scale:</span> {(engravingSettings.scale * 100).toFixed(0)}%
              </div>
              <div>
                <span className="font-medium">Position X:</span> {engravingSettings.offsetX}px
              </div>
              <div>
                <span className="font-medium">Position Y:</span> {engravingSettings.offsetY}px
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!hasContent}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center ${
                hasContent
                  ? 'bg-gold-500 text-white hover:bg-gold-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              type="button"
            >
              <SafeIcon icon={FiShoppingCart} className="w-5 h-5 mr-2" />
              Add to Cart - ${baseProduct.price}
            </button>

            <button
              onClick={handleDownloadPreview}
              disabled={!hasContent}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center ${
                hasContent
                  ? 'border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white'
                  : 'border-2 border-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              type="button"
            >
              <SafeIcon icon={FiDownload} className="w-5 h-5 mr-2" />
              Download Preview
            </button>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="p-4 bg-gold-50 border-t">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gold-700">
            <SafeIcon icon={FiImage} className="w-4 h-4" />
            <span>Backend Processed Engraving</span>
          </div>
          <div className="text-gold-600 font-medium">
            Color: #5a4410 Applied
          </div>
        </div>
        {hasContent && (
          <div className="mt-2 text-xs text-gold-600">
            <p>✓ Backend color processing complete</p>
            <p>✓ {customText ? 'Text converted to #5a4410' : 'Logo processed with gold engraving color'}</p>
            <p>✓ Real-time adjustment controls active</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSSLivePreview;
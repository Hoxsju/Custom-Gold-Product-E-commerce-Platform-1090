import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShoppingCart, FiDownload, FiArrowLeft, FiZap, FiBrain, FiImage, FiCheck, FiStar, FiGlobe } = FiIcons;

const AIResultPreview = ({ aiResult, customText, logoImage, aiModel, onBack }) => {
  const { addItem } = useCart();
  const [isDownloading, setIsDownloading] = useState(false);

  // Product data
  const baseProduct = {
    id: `ai-custom-${Date.now()}`,
    name: `AI-Generated Custom Gold Bar (${aiModel})`,
    price: 599.99
  };

  // Add to cart function
  const handleAddToCart = () => {
    const customProduct = {
      ...baseProduct,
      customization: {
        text: customText,
        logo: logoImage,
        aiModel: aiModel,
        aiRendering: aiResult.imageData,
        aiMetadata: aiResult.metadata,
        finalRender: aiResult.imageData
      }
    };

    addItem(customProduct);
    alert(`${aiModel}-generated custom gold bar added to cart!`);
  };

  // Download function
  const handleDownload = async () => {
    if (!aiResult?.imageData) return;

    setIsDownloading(true);
    try {
      // Create download link
      const link = document.createElement('a');
      link.download = `${aiModel.toLowerCase()}-rendered-gold-bar-${Date.now()}.png`;
      link.href = aiResult.imageData;
      link.click();

      // Brief delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
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
            🎉 {aiModel} AI Generation Complete!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your custom gold bar has been generated using {aiModel} AI with the S3 hosted gold bar image
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Generated Result */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {/* AI Rendered Image */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6">
              {aiResult?.imageData ? (
                <div className="relative">
                  <img
                    src={aiResult.imageData}
                    alt={`${aiModel}-generated custom gold bar`}
                    className="w-full h-auto rounded-lg shadow-lg"
                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                  />

                  {/* AI Badge */}
                  <div className="absolute top-3 left-3 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse flex items-center">
                    <SafeIcon icon={FiBrain} className="w-3 h-3 mr-1" />
                    {aiModel} AI Generated
                  </div>

                  {/* Quality Badge */}
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    <SafeIcon icon={FiStar} className="w-3 h-3 mr-1" />
                    Photorealistic
                  </div>

                  {/* S3 Hosted Badge */}
                  <div className="absolute bottom-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    <SafeIcon icon={FiGlobe} className="w-3 h-3 mr-1" />
                    S3 Hosted
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
                  <p className="text-gray-500">AI rendering not available</p>
                </div>
              )}
            </div>

            {/* AI Info Panel */}
            <div className="p-4 bg-purple-50 border-t">
              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center space-x-2 text-purple-700">
                  <SafeIcon icon={FiZap} className="w-4 h-4" />
                  <span>{aiResult?.metadata?.model || `${aiModel} AI Model`}</span>
                </div>
                <div className="text-purple-600 font-medium">
                  {aiResult?.metadata?.quality || 'High Quality'}
                </div>
              </div>

              {aiResult?.metadata && (
                <div className="text-xs text-purple-600 space-y-1">
                  <p>✓ Processing Time: {aiResult.metadata.processingTime}</p>
                  <p>✓ {aiResult.metadata.technique || `Advanced ${aiModel} rendering`}</p>
                  {customText && <p>✓ Text: "{customText}" realistically engraved</p>}
                  {logoImage && !customText && <p>✓ Logo composited with depth-aware blending</p>}
                  <p>✓ Base: {aiResult.metadata.baseImage || 'S3 Hosted Gold Bar'}</p>
                  <p>✓ Single merged image with no overlays</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Controls & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <SafeIcon icon={FiImage} className="w-5 h-5 mr-2 text-gold-600" />
              AI Generation Complete
            </h3>

            {/* Content Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Generation Summary</h4>
              <div className="text-sm text-gray-700 space-y-2">
                {customText && (
                  <div className="flex items-start justify-between">
                    <span>Custom Text:</span>
                    <span className="font-medium text-right">"{customText}"</span>
                  </div>
                )}
                {logoImage && !customText && (
                  <div className="flex items-center justify-between">
                    <span>Custom Logo:</span>
                    <span className="font-medium">Processed with AI</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>AI Model:</span>
                  <span className={`font-medium ${customText ? 'text-purple-700' : 'text-blue-700'}`}>
                    {aiModel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Base Image:</span>
                  <span className="font-medium">S3 Hosted Gold Bar</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Source:</span>
                  <span className="font-medium text-blue-600">AWS S3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Quality:</span>
                  <span className="font-medium text-green-700">Photorealistic</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Output:</span>
                  <span className="font-medium text-blue-700">Single merged image</span>
                </div>
              </div>
            </div>

            {/* AI Features */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">AI Features Applied</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                  <span>S3 hosted gold bar image loaded successfully</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                  <span>Realistic depth and shadow rendering</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                  <span>Surface texture preservation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                  <span>Professional lighting effects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                  <span>Photorealistic material blending</span>
                </div>
                {customText && (
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                    <span>Text-guided engraving precision</span>
                  </div>
                )}
                {logoImage && !customText && (
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                    <span>Logo depth-aware compositing</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                  <span>No canvas overlays - pure AI generation</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!hasContent || !aiResult}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center ${
                  hasContent && aiResult
                    ? 'bg-gold-500 text-white hover:bg-gold-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <SafeIcon icon={FiShoppingCart} className="w-5 h-5 mr-2" />
                Add to Cart - ${baseProduct.price}
              </button>

              <button
                onClick={handleDownload}
                disabled={!hasContent || !aiResult || isDownloading}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center ${
                  hasContent && aiResult && !isDownloading
                    ? 'border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white'
                    : 'border-2 border-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiDownload} className="w-5 h-5 mr-2" />
                    Download {aiModel} Result
                  </>
                )}
              </button>
            </div>

            {/* AI Technology Info */}
            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2 flex items-center">
                <SafeIcon icon={FiBrain} className="w-4 h-4 mr-1" />
                AI Technology Used
              </h4>
              <div className="text-xs text-purple-700 space-y-1">
                {customText ? (
                  <>
                    <p>• Imagic: Text-guided image editing for realistic text engraving</p>
                    <p>• Advanced prompt engineering for precise positioning</p>
                    <p>• Photorealistic shadow and depth generation</p>
                    <p>• GitHub: rinongal/imagic</p>
                  </>
                ) : (
                  <>
                    <p>• ControlCom: Advanced image compositing with depth awareness</p>
                    <p>• Realistic surface integration and blending</p>
                    <p>• AI-generated lighting and material interaction</p>
                    <p>• GitHub: gy777/ControlCom</p>
                  </>
                )}
                <p>• Base image loaded from S3 hosting service</p>
                <p>• Professional-grade output suitable for production</p>
                <p>• Single merged image with no overlay artifacts</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIResultPreview;
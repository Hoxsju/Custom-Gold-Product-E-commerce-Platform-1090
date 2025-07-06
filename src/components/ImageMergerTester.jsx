import React, { useState } from 'react';
import { motion } from 'framer-motion';
import aiRenderingService from '../services/aiRenderingService';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiCheck, FiX, FiImage, FiDownload } = FiIcons;

const ImageMergerTester = () => {
  const [isTesting, setIsTesting] = useState(false); // Fixed: was 'isTestin'
  const [testResult, setTestResult] = useState(null);
  const [mergedImage, setMergedImage] = useState(null);

  const runImageMergerTest = async () => {
    setIsTesting(true); // Fixed: was 'setIsTestin'
    setTestResult(null);
    setMergedImage(null);

    try {
      console.log('🧪 Starting image merger test...');
      
      // Test with the Regravity logo
      const testLogoUrl = 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751721085141-Regravity-logo.png';
      const result = await aiRenderingService.generateLogoEngraving(testLogoUrl);
      
      if (result.success) {
        console.log('✅ Test successful!');
        setTestResult({
          success: true,
          message: 'Image merger test passed successfully!',
          metadata: result.metadata
        });
        setMergedImage(result.imageData);
      } else {
        throw new Error('Test failed: ' + result.error);
      }
      
    } catch (error) {
      console.error('❌ Test failed:', error);
      setTestResult({
        success: false,
        message: error.message
      });
    } finally {
      setIsTesting(false); // Fixed: was 'setIsTestin'
    }
  };

  const downloadMergedImage = () => {
    if (!mergedImage) return;
    
    const link = document.createElement('a');
    link.download = `merged-gold-bar-${Date.now()}.png`;
    link.href = mergedImage;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🧪 Image Merger Testing Tool
        </h2>
        
        <p className="text-gray-600 mb-6">
          This tool tests the image merging functionality by combining the Regravity logo
          with the gold bar background to verify the fix works correctly.
        </p>

        {/* Test Images Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Gold Bar Background</h3>
            <img 
              src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751721112324-01660712561c4928a3c61a927d22f2e0.png"
              alt="Gold Bar"
              className="w-full max-w-xs mx-auto rounded-lg shadow-md"
            />
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Regravity Logo</h3>
            <img 
              src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751721085141-Regravity-logo.png"
              alt="Regravity Logo"
              className="w-full max-w-xs mx-auto rounded-lg shadow-md bg-gray-100 p-4"
            />
          </div>
        </div>

        {/* Test Button */}
        <div className="text-center mb-8">
          <button
            onClick={runImageMergerTest}
            disabled={isTesting} // Fixed: was 'isTestin'
            className={`inline-flex items-center space-x-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
              isTesting // Fixed: was 'isTestin'
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gold-500 hover:bg-gold-600 shadow-lg hover:shadow-xl'
            } text-white`}
          >
            {isTesting ? ( // Fixed: was 'isTestin'
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Testing Image Merger...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiPlay} className="w-5 h-5" />
                <span>Run Image Merger Test</span>
              </>
            )}
          </button>
        </div>

        {/* Test Result */}
        {testResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-lg mb-6 ${
              testResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon 
                icon={testResult.success ? FiCheck : FiX} 
                className={`w-6 h-6 ${
                  testResult.success ? 'text-green-600' : 'text-red-600'
                }`} 
              />
              <h3 className={`font-semibold text-lg ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.success ? 'Test Passed!' : 'Test Failed!'}
              </h3>
            </div>
            
            <p className={`${
              testResult.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {testResult.message}
            </p>
            
            {testResult.metadata && (
              <div className="mt-4 text-sm text-green-700">
                <p><strong>Model:</strong> {testResult.metadata.model}</p>
                <p><strong>Processing Time:</strong> {testResult.metadata.processingTime}</p>
                <p><strong>Quality:</strong> {testResult.metadata.quality}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Merged Image Result */}
        {mergedImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              🎉 Merged Result
            </h3>
            
            <div className="relative inline-block">
              <img 
                src={mergedImage}
                alt="Merged Gold Bar with Logo"
                className="max-w-full h-auto rounded-lg shadow-xl border border-gray-200"
                style={{ maxHeight: '500px' }}
              />
              
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                ✓ Merged Successfully
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={downloadMergedImage}
                className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                <SafeIcon icon={FiDownload} className="w-5 h-5" />
                <span>Download Merged Image</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Technical Details */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">🔧 Technical Details</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Tests image loading with proper CORS handling</li>
            <li>• Verifies both gold bar and logo images load correctly</li>
            <li>• Applies engraving effects with multiple depth layers</li>
            <li>• Generates high-resolution output (800x600)</li>
            <li>• Uses dark gold color (#5a4410) for realistic engraving</li>
            <li>• Includes surface reflections and metallic highlights</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageMergerTester;
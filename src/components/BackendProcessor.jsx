import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FabricCanvasPreview from './FabricCanvasPreview';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCpu, FiArrowLeft, FiLoader, FiCheck } = FiIcons;

const BackendProcessor = ({ customText, logoImage, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Processing, 2: Preview with Controls
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [processedText, setProcessedText] = useState('');
  const [processedLogo, setProcessedLogo] = useState(null);
  const [fabricRendering, setFabricRendering] = useState(null);

  // Start backend processing when component mounts
  useEffect(() => {
    startBackendProcessing();
  }, []);

  const startBackendProcessing = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);

    const stages = [
      { stage: 'Initializing Fabric.js canvas engine...', duration: 800 },
      { stage: 'Loading gold bar image for overlay positioning...', duration: 600 },
      { stage: 'Processing content for engraving effect...', duration: 1200 },
      { stage: 'Creating canvas overlay on lower rectangle...', duration: 1000 },
      { stage: 'Applying gold engraving style (#5a4410)...', duration: 800 },
      { stage: 'Finalizing Fabric.js rendering...', duration: 600 }
    ];

    let progress = 0;
    const progressStep = 100 / stages.length;

    for (let i = 0; i < stages.length; i++) {
      setProcessingStage(stages[i].stage);
      
      const steps = 10;
      const stepDuration = stages[i].duration / steps;
      
      for (let j = 0; j < steps; j++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        const currentProgress = progress + (j + 1) / steps * progressStep;
        setProcessingProgress(Math.min(currentProgress, 100));
      }
      
      progress += progressStep;

      // Process content during specific stages
      if (i === 2) { // Stage 3: Content processing
        if (customText) {
          setProcessedText(customText);
        }
        if (logoImage) {
          await processLogoForFabric(logoImage);
        }
      }
      
      if (i === 4) { // Stage 5: Fabric.js rendering
        await initializeFabricRendering();
      }
    }

    setProcessingProgress(100);
    setProcessingStage('Fabric.js backend processing complete!');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsProcessing(false);
    setCurrentStep(2); // Move to preview step
  };

  // Process logo for Fabric.js usage
  const processLogoForFabric = async (imageDataUrl) => {
    try {
      // Create canvas for logo processing
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
      
      // Get image data and convert to grayscale
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = gray;     // Red
        data[i + 1] = gray; // Green  
        data[i + 2] = gray; // Blue
        // Keep original alpha
      }

      // Put processed image data back
      ctx.putImageData(imageData, 0, 0);
      
      // Convert to data URL for Fabric.js
      const processedDataUrl = canvas.toDataURL('image/png');
      setProcessedLogo(processedDataUrl);
      
    } catch (error) {
      console.error('Logo processing for Fabric.js failed:', error);
      setProcessedLogo(logoImage); // Fallback to original
    }
  };

  // Initialize Fabric.js rendering data
  const initializeFabricRendering = async () => {
    const renderingData = {
      text: processedText,
      logo: processedLogo || logoImage,
      timestamp: Date.now()
    };
    setFabricRendering(renderingData);
  };

  // If showing preview with controls
  if (currentStep === 2) {
    return (
      <FabricCanvasPreview
        customText={processedText}
        logoImage={processedLogo || logoImage}
        fabricRenderingData={fabricRendering}
        onBack={onBack}
      />
    );
  }

  // Step 1: Backend Processing
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
            <span>Back to Design</span>
          </button>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Step 2: Fabric.js Backend Processing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Processing your design with Fabric.js canvas overlay on the gold bar's lower rectangle
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
              {isProcessing ? (
                <SafeIcon icon={FiLoader} className="w-16 h-16 text-blue-600 animate-spin" />
              ) : (
                <SafeIcon icon={FiCheck} className="w-16 h-16 text-green-600" />
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {isProcessing ? 'Processing with Fabric.js' : 'Fabric.js Processing Complete!'}
            </h3>
            <p className="text-gray-600 text-lg">
              {isProcessing 
                ? 'Creating canvas overlay on gold bar lower rectangle'
                : 'Canvas overlay ready with professional engraving effects'
              }
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-6 mb-8">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span className="font-medium">{Math.round(processingProgress)}% Complete</span>
              <span>{isProcessing ? 'Processing...' : 'Complete'}</span>
            </div>

            {/* Current Stage */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2">
                <SafeIcon icon={FiCpu} className="w-5 h-5 text-blue-600" />
                <p className="text-blue-600 font-medium text-lg">
                  {processingStage}
                </p>
              </div>
            </div>
          </div>

          {/* Content Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h4 className="font-semibold text-gray-800 mb-3">Fabric.js Processing Summary</h4>
            <div className="text-sm text-gray-700 space-y-2">
              {customText && (
                <div className="flex items-center justify-between">
                  <span>Custom Text:</span>
                  <span className="font-medium">"{customText}"</span>
                </div>
              )}
              {logoImage && (
                <div className="flex items-center justify-between">
                  <span>Logo Image:</span>
                  <span className="font-medium">Processed for canvas overlay</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Canvas Engine:</span>
                <span className="font-medium text-blue-700">Fabric.js v5.3.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Overlay Position:</span>
                <span className="font-medium">Lower rectangle area</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Engraving Style:</span>
                <span className="font-medium text-yellow-700">#5a4410 (Dark Gold)</span>
              </div>
            </div>
          </div>

          {/* Processing Complete Message */}
          {!isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-lg p-6"
            >
              <div className="flex items-center justify-center space-x-2 text-green-800 mb-3">
                <SafeIcon icon={FiCheck} className="w-6 h-6" />
                <span className="font-semibold text-lg">Fabric.js Processing Complete!</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p>✓ Canvas overlay created on gold bar lower rectangle</p>
                <p>✓ Content styled with dark gold engraving effect (#5a4410)</p>
                <p>✓ Fabric.js controls ready for positioning and scaling</p>
                <p>✓ Professional serif font and shadow effects applied</p>
              </div>
              
              <p className="text-green-600 mt-4 text-sm">
                Proceeding to Fabric.js canvas preview with adjustment controls...
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BackendProcessor;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AIRenderingPreview from './AIRenderingPreview';
import aiRenderingService from '../services/aiRenderingService';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCpu, FiArrowLeft, FiLoader, FiCheck, FiZap, FiBrain } = FiIcons;

const AIRenderingProcessor = ({ customText, logoImage, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Processing, 2: Preview
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [aiResult, setAIResult] = useState(null);
  const [error, setError] = useState(null);

  // Start AI processing when component mounts
  useEffect(() => {
    startAIProcessing();
  }, []);

  const startAIProcessing = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setError(null);

    try {
      // Determine processing type
      const isTextEngraving = customText.trim();
      const isLogoEngraving = logoImage && !customText.trim();

      if (isTextEngraving) {
        await processTextWithImagic();
      } else if (isLogoEngraving) {
        await processLogoWithControlCom();
      } else {
        throw new Error('No content to process');
      }
    } catch (error) {
      console.error('AI processing failed:', error);
      setError(error.message);
      setIsProcessing(false);
    }
  };

  const processTextWithImagic = async () => {
    setProcessingStage('Initializing Imagic model for text engraving...');
    setProcessingProgress(10);

    try {
      // Simulate progressive updates
      const stages = [
        { stage: 'Loading Imagic text-guided editing model...', progress: 20 },
        { stage: 'Processing base gold bar image...', progress: 35 },
        { stage: 'Generating text engraving prompt...', progress: 50 },
        { stage: 'Applying realistic engraving effects...', progress: 70 },
        { stage: 'Rendering photorealistic shadows and depth...', progress: 85 },
        { stage: 'Finalizing high-quality result...', progress: 95 }
      ];

      for (const { stage, progress } of stages) {
        setProcessingStage(stage);
        setProcessingProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Call Imagic AI service
      const result = await aiRenderingService.generateTextEngraving(customText);
      
      setAIResult(result);
      setProcessingProgress(100);
      setProcessingStage('Imagic text engraving complete!');
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsProcessing(false);
      setCurrentStep(2);

    } catch (error) {
      throw new Error(`Imagic text processing failed: ${error.message}`);
    }
  };

  const processLogoWithControlCom = async () => {
    setProcessingStage('Initializing ControlCom for logo compositing...');
    setProcessingProgress(10);

    try {
      const stages = [
        { stage: 'Loading ControlCom image compositing model...', progress: 20 },
        { stage: 'Processing background gold bar...', progress: 30 },
        { stage: 'Analyzing logo image structure...', progress: 45 },
        { stage: 'Computing depth-aware blending...', progress: 60 },
        { stage: 'Applying realistic surface integration...', progress: 75 },
        { stage: 'Generating lighting and reflections...', progress: 90 },
        { stage: 'Compositing final photorealistic result...', progress: 95 }
      ];

      for (const { stage, progress } of stages) {
        setProcessingStage(stage);
        setProcessingProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 900));
      }

      // Call ControlCom AI service
      const result = await aiRenderingService.generateLogoEngraving(logoImage);
      
      setAIResult(result);
      setProcessingProgress(100);
      setProcessingStage('ControlCom logo compositing complete!');
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsProcessing(false);
      setCurrentStep(2);

    } catch (error) {
      throw new Error(`ControlCom logo processing failed: ${error.message}`);
    }
  };

  // If showing preview
  if (currentStep === 2 && aiResult) {
    return (
      <AIRenderingPreview
        aiResult={aiResult}
        customText={customText}
        logoImage={logoImage}
        onBack={onBack}
      />
    );
  }

  // Step 1: AI Processing
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-purple-50 to-blue-50">
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
            Step 2: AI Photorealistic Rendering
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {customText 
              ? 'Using Imagic for text-guided realistic engraving generation'
              : 'Using ControlCom for photorealistic logo compositing'
            }
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center"
        >
          {error ? (
            // Error State
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <SafeIcon icon={FiZap} className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-900 mb-3">
                AI Processing Failed
              </h3>
              <p className="text-red-600 text-lg mb-6">{error}</p>
              <button
                onClick={startAIProcessing}
                className="bg-gold-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors"
              >
                Retry AI Processing
              </button>
            </div>
          ) : (
            // Processing State
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                {isProcessing ? (
                  <SafeIcon icon={FiBrain} className="w-16 h-16 text-purple-600 animate-pulse" />
                ) : (
                  <SafeIcon icon={FiCheck} className="w-16 h-16 text-green-600" />
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {isProcessing 
                  ? (customText ? 'Imagic AI Processing' : 'ControlCom AI Processing')
                  : 'AI Processing Complete!'
                }
              </h3>
              
              <p className="text-gray-600 text-lg">
                {isProcessing
                  ? 'Generating photorealistic engraving with advanced AI models'
                  : 'Your custom gold bar has been rendered with AI precision'
                }
              </p>
            </div>
          )}

          {!error && (
            <>
              {/* Progress Bar */}
              <div className="space-y-6 mb-8">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="font-medium">{Math.round(processingProgress)}% Complete</span>
                  <span>{isProcessing ? 'Processing...' : 'Complete'}</span>
                </div>

                {/* Current Stage */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <SafeIcon icon={FiCpu} className="w-5 h-5 text-purple-600" />
                    <p className="text-purple-600 font-medium text-lg">
                      {processingStage}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Model Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                <h4 className="font-semibold text-gray-800 mb-3">AI Processing Details</h4>
                <div className="text-sm text-gray-700 space-y-2">
                  {customText && (
                    <>
                      <div className="flex items-center justify-between">
                        <span>AI Model:</span>
                        <span className="font-medium text-purple-700">Imagic (Text-Guided Editing)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Input Text:</span>
                        <span className="font-medium">"{customText}"</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Technique:</span>
                        <span className="font-medium">Text-guided realistic engraving</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>GitHub Project:</span>
                        <span className="font-medium text-blue-600">github.com/rinongal/imagic</span>
                      </div>
                    </>
                  )}
                  
                  {logoImage && !customText && (
                    <>
                      <div className="flex items-center justify-between">
                        <span>AI Model:</span>
                        <span className="font-medium text-blue-700">ControlCom (Image Compositing)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Input:</span>
                        <span className="font-medium">Custom logo image</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Technique:</span>
                        <span className="font-medium">Depth-aware realistic blending</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>GitHub Project:</span>
                        <span className="font-medium text-blue-600">github.com/gy777/ControlCom</span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span>Output Quality:</span>
                    <span className="font-medium text-green-700">Photorealistic</span>
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
                    <span className="font-semibold text-lg">
                      {customText ? 'Imagic' : 'ControlCom'} Processing Complete!
                    </span>
                  </div>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>✓ Photorealistic engraving generated with AI precision</p>
                    <p>✓ Realistic lighting, shadows, and surface reflections applied</p>
                    <p>✓ Professional-grade quality suitable for production preview</p>
                    <p>✓ Ready for download and cart integration</p>
                  </div>
                  <p className="text-green-600 mt-4 text-sm">
                    Proceeding to AI-generated preview with download options...
                  </p>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AIRenderingProcessor;
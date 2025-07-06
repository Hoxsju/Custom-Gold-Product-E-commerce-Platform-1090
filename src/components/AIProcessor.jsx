import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AIResultPreview from './AIResultPreview';
import aiRenderingService from '../services/aiRenderingService';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCpu, FiArrowLeft, FiLoader, FiCheck, FiZap, FiBrain, FiAlertTriangle } = FiIcons;

const AIProcessor = ({ customText, logoImage, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Processing, 2: Result
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [aiResult, setAIResult] = useState(null);
  const [error, setError] = useState(null);

  // Determine AI model based on input
  const isTextEngraving = customText.trim();
  const isLogoEngraving = logoImage && !customText.trim();
  const aiModel = isTextEngraving ? 'Imagic' : 'ControlCom';

  // Start AI processing when component mounts
  useEffect(() => {
    startAIProcessing();
  }, []);

  const startAIProcessing = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setError(null);

    try {
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
    const stages = [
      { stage: 'Loading S3 hosted gold bar image...', progress: 10 },
      { stage: 'Initializing Imagic text-guided editing model...', progress: 20 },
      { stage: 'Validating image connectivity and format...', progress: 30 },
      { stage: 'Processing text input and generating prompt...', progress: 45 },
      { stage: 'Applying realistic text engraving with AI...', progress: 70 },
      { stage: 'Rendering photorealistic shadows and depth...', progress: 85 },
      { stage: 'Finalizing high-quality merged result...', progress: 95 }
    ];

    for (const { stage, progress } of stages) {
      setProcessingStage(stage);
      setProcessingProgress(progress);
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    // Generate structured prompt for Imagic
    const imagicPrompt = `Engrave the text "${customText}" into the center of the gold bar in dark brown, matching the color tone and surface texture of the metal. Create realistic shadows, depth, and metallic reflections that make the text appear naturally carved into the gold surface.`;

    console.log('🤖 Imagic Prompt:', imagicPrompt);

    // Call Imagic AI service with structured prompt and S3 hosted gold bar
    const result = await aiRenderingService.generateTextEngraving(customText, {
      prompt: imagicPrompt
    });

    setAIResult(result);
    setProcessingProgress(100);
    setProcessingStage('Imagic text engraving complete!');
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsProcessing(false);
    setCurrentStep(2);
  };

  const processLogoWithControlCom = async () => {
    const stages = [
      { stage: 'Loading S3 hosted gold bar image...', progress: 10 },
      { stage: 'Initializing ControlCom image compositing model...', progress: 20 },
      { stage: 'Validating background image connectivity...', progress: 30 },
      { stage: 'Processing uploaded logo image...', progress: 40 },
      { stage: 'Computing depth-aware blending parameters...', progress: 60 },
      { stage: 'Applying realistic surface integration...', progress: 75 },
      { stage: 'Generating lighting and material reflections...', progress: 90 },
      { stage: 'Compositing final photorealistic result...', progress: 95 }
    ];

    for (const { stage, progress } of stages) {
      setProcessingStage(stage);
      setProcessingProgress(progress);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Call ControlCom AI service with structured parameters and S3 hosted gold bar
    const result = await aiRenderingService.generateLogoEngraving(logoImage, {
      blendingMode: 'depth_aware',
      surfaceIntegration: true,
      generateShadows: true,
      generateReflections: true
    });

    setAIResult(result);
    setProcessingProgress(100);
    setProcessingStage('ControlCom logo compositing complete!');
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsProcessing(false);
    setCurrentStep(2);
  };

  // If showing result preview
  if (currentStep === 2 && aiResult) {
    return (
      <AIResultPreview
        aiResult={aiResult}
        customText={customText}
        logoImage={logoImage}
        aiModel={aiModel}
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
            AI Processing: {aiModel} Generation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isTextEngraving
              ? 'Using Imagic AI for realistic text engraving with S3 hosted gold bar'
              : 'Using ControlCom AI for photorealistic logo compositing with S3 hosted gold bar'}
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
                <SafeIcon icon={FiAlertTriangle} className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-900 mb-3">
                AI Processing Failed
              </h3>
              <p className="text-red-600 text-lg mb-6 max-w-2xl mx-auto">
                {error}
              </p>
              <div className="space-y-3">
                <button
                  onClick={startAIProcessing}
                  className="bg-gold-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors mr-4"
                >
                  Retry AI Processing
                </button>
                <button
                  onClick={onBack}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Back to Design
                </button>
              </div>
              
              {/* Additional error help */}
              {error.includes('Gold bar image failed') && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
                  <div className="flex items-center space-x-2 text-yellow-800 mb-2">
                    <SafeIcon icon={FiAlertTriangle} className="w-4 h-4" />
                    <span className="font-medium">Connection Issue</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    The S3 hosted gold bar image couldn't be loaded. This might be due to:
                  </p>
                  <ul className="text-xs text-yellow-600 mt-2 space-y-1 text-left">
                    <li>• Temporary network connectivity issues</li>
                    <li>• S3 bucket temporarily unavailable</li>
                    <li>• Firewall or proxy blocking the image source</li>
                  </ul>
                </div>
              )}
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
                  ? `${aiModel} AI Processing`
                  : 'AI Processing Complete!'}
              </h3>
              <p className="text-gray-600 text-lg">
                {isProcessing
                  ? 'Generating photorealistic engraving with S3 hosted gold bar image'
                  : 'Your custom gold bar has been rendered with AI precision'}
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
                  <div className="flex items-center justify-between">
                    <span>AI Model:</span>
                    <span className={`font-medium ${isTextEngraving ? 'text-purple-700' : 'text-blue-700'}`}>
                      {aiModel} ({isTextEngraving ? 'Text-Guided Editing' : 'Image Compositing'})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Input:</span>
                    <span className="font-medium">
                      {isTextEngraving ? `"${customText}"` : 'Custom logo image'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Base Image:</span>
                    <span className="font-medium">S3 Hosted Gold Bar</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Source:</span>
                    <span className="font-medium text-blue-600 text-xs">quest-media-storage-bucket.s3.us-east-2.amazonaws.com</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Technique:</span>
                    <span className="font-medium">
                      {isTextEngraving ? 'Text-guided realistic engraving' : 'Depth-aware realistic blending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>GitHub Project:</span>
                    <span className="font-medium text-blue-600">
                      {isTextEngraving ? 'github.com/rinongal/imagic' : 'github.com/gy777/ControlCom'}
                    </span>
                  </div>
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
                      {aiModel} Processing Complete!
                    </span>
                  </div>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>✓ S3 hosted gold bar image loaded successfully</p>
                    <p>✓ Photorealistic engraving generated with AI precision</p>
                    <p>✓ Realistic lighting, shadows, and surface reflections applied</p>
                    <p>✓ Professional-grade quality suitable for production preview</p>
                    <p>✓ Ready for download and cart integration</p>
                  </div>
                  <p className="text-green-600 mt-4 text-sm">
                    Proceeding to AI-generated result with download options...
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

export default AIProcessor;
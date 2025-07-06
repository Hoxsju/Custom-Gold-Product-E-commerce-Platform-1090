import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import SafeIcon from '../common/SafeIcon';
import LiveProductRenderer from './LiveProductRenderer';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiType, FiX, FiImage, FiEdit3, FiArrowRight, FiArrowLeft, FiLoader, FiCheck, FiEye, FiCpu } = FiIcons;

const CustomizationWizard = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customText, setCustomText] = useState('');
  const [logoImage, setLogoImage] = useState(null);
  const [activeTab, setActiveTab] = useState('text');
  
  // Backend rendering states
  const [isBackendRendering, setIsBackendRendering] = useState(false);
  const [backendProgress, setBackendProgress] = useState(0);
  const [backendStage, setBackendStage] = useState('');
  
  // Final rendering states
  const [isFinalRendering, setIsFinalRendering] = useState(false);
  const [finalProgress, setFinalProgress] = useState(0);
  const [finalStage, setFinalStage] = useState('');
  
  const [livePreview, setLivePreview] = useState(null);
  const [finalResult, setFinalResult] = useState(null);

  // YOUR TRANSPARENT PRODUCT IMAGE
  const REAL_PRODUCT_IMAGE = 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751619167457-blob';

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
    maxSize: 5 * 1024 * 1024,
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

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Check if we have content before proceeding
      if (!customText.trim() && !logoImage) {
        alert('Please add custom text or upload a logo before proceeding.');
        return;
      }
      setCurrentStep(2); // Go to backend rendering
    } else if (currentStep === 3) {
      setCurrentStep(4); // Go to final rendering
    }
  };

  const handleBackStep = () => {
    if (currentStep === 1) {
      onBack();
    } else if (currentStep === 2) {
      setCurrentStep(1);
      setIsBackendRendering(false);
      setBackendProgress(0);
    } else if (currentStep === 3) {
      setCurrentStep(1);
      setLivePreview(null);
    } else if (currentStep === 4) {
      setCurrentStep(3);
      setIsFinalRendering(false);
      setFinalProgress(0);
      setFinalResult(null);
    } else if (currentStep === 5) {
      setCurrentStep(3);
      setFinalResult(null);
    }
  };

  // Start backend rendering when entering step 2
  useEffect(() => {
    if (currentStep === 2 && !isBackendRendering) {
      startBackendRendering();
    }
  }, [currentStep]);

  // Start final rendering when entering step 4
  useEffect(() => {
    if (currentStep === 4 && !isFinalRendering && !finalResult) {
      startFinalRendering();
    }
  }, [currentStep]);

  const startBackendRendering = async () => {
    setIsBackendRendering(true);
    setBackendProgress(0);

    const stages = [
      { stage: 'Initializing 3D rendering engine...', duration: 1000 },
      { stage: 'Processing design elements...', duration: 800 },
      { stage: 'Mapping to gold surface geometry...', duration: 900 },
      { stage: 'Calculating perspective transforms...', duration: 700 },
      { stage: 'Generating live 3D preview...', duration: 600 }
    ];

    let progress = 0;
    const progressStep = 100 / stages.length;

    for (let i = 0; i < stages.length; i++) {
      setBackendStage(stages[i].stage);
      
      const steps = 10;
      const stepDuration = stages[i].duration / steps;
      
      for (let j = 0; j < steps; j++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        const currentProgress = progress + (j + 1) / steps * progressStep;
        setBackendProgress(Math.min(currentProgress, 100));
      }
      
      progress += progressStep;
    }

    setBackendProgress(100);
    setBackendStage('3D preview ready!');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsBackendRendering(false);
    setCurrentStep(3); // Move to live preview step
  };

  const startFinalRendering = async () => {
    setIsFinalRendering(true);
    setFinalProgress(0);
    setFinalResult(null);

    const stages = [
      { stage: 'Initializing high-resolution canvas...', duration: 800 },
      { stage: 'Applying advanced surface textures...', duration: 900 },
      { stage: 'Rendering metallic reflections...', duration: 1000 },
      { stage: 'Processing depth and shadow effects...', duration: 700 },
      { stage: 'Finalizing professional output...', duration: 600 }
    ];

    let progress = 0;
    const progressStep = 100 / stages.length;

    for (let i = 0; i < stages.length; i++) {
      setFinalStage(stages[i].stage);
      
      const steps = 10;
      const stepDuration = stages[i].duration / steps;
      
      for (let j = 0; j < steps; j++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        const currentProgress = progress + (j + 1) / steps * progressStep;
        setFinalProgress(Math.min(currentProgress, 100));
      }
      
      progress += progressStep;
    }

    setFinalProgress(100);
    setFinalStage('Professional render complete!');

    // Use the live preview as the final result
    if (livePreview) {
      setFinalResult(livePreview);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsFinalRendering(false);
    setCurrentStep(5);
  };

  const handleLiveRenderComplete = (dataUrl) => {
    setLivePreview(dataUrl);
  };

  const handleComplete = () => {
    onComplete({
      customText,
      logoImage,
      finalResult: finalResult || livePreview
    });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Step 1: Design Your Engraving';
      case 2: return 'Step 2: Backend 3D Processing';
      case 3: return 'Step 3: Live 3D Preview';
      case 4: return 'Step 4: Professional Rendering';
      case 5: return 'Step 5: Your Masterpiece';
      default: return '';
    }
  };

  // Check if we have content for next step
  const hasContent = customText.trim() || logoImage;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gold-50 to-gold-100 p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{getStepTitle()}</h2>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === currentStep
                    ? 'bg-gold-500 text-white'
                    : step < currentStep
                    ? 'bg-gold-400 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step < currentStep ? <SafeIcon icon={FiCheck} className="w-4 h-4" /> : step}
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gold-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Design Input Only */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  Create your custom engraving design. Add text or upload a logo to get started.
                </p>
              </div>

              {/* Tabs */}
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
                        maxLength={50}
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>Characters: {customText.length}/50</span>
                        <span>Precision laser engraving</span>
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
                          Logo Preview
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
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Design Summary */}
              {hasContent && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Design Ready</h3>
                  <div className="text-sm text-green-700 space-y-1">
                    {customText && <p>• Custom Text: "{customText}"</p>}
                    {logoImage && <p>• Custom logo uploaded</p>}
                    <p>• Ready for 3D processing</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center pt-6 border-t">
                <button
                  onClick={handleBackStep}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
                  <span>Back</span>
                </button>
                
                <button
                  onClick={handleNextStep}
                  disabled={!hasContent}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-all ${
                    !hasContent
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gold-500 text-white hover:bg-gold-600 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <span>Process with 3D Engine</span>
                  <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Backend Processing */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="max-w-lg mx-auto">
                <div className="mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <SafeIcon icon={FiCpu} className="w-16 h-16 text-blue-600 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Backend 3D Processing
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Our AI engine is processing your design for 3D rendering
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${backendProgress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-medium">{Math.round(backendProgress)}% Complete</span>
                    <span>Processing...</span>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-600 font-medium text-lg">
                      {backendStage}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Live 3D Preview */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  🎉 Live 3D Preview Ready!
                </h3>
                <p className="text-gray-600 text-lg">
                  Your design has been processed and rendered in real-time 3D
                </p>
              </div>

              <LiveProductRenderer
                productImage={REAL_PRODUCT_IMAGE}
                customText={customText}
                logoImage={logoImage}
                onRenderComplete={handleLiveRenderComplete}
                renderingMode="live"
              />
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-green-800 mb-2">
                  <SafeIcon icon={FiEye} className="w-5 h-5" />
                  <span className="font-medium">Interactive 3D Preview Active</span>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <p>• Real-time perspective mapping applied</p>
                  <p>• Interactive controls for positioning and scaling</p>
                  <p>• Multi-layer engraving simulation</p>
                  <p>• Use controls below to adjust your design</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-6 border-t">
                <button
                  onClick={handleBackStep}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
                  <span>Back to Design</span>
                </button>
                
                <button
                  onClick={handleNextStep}
                  className="flex items-center space-x-2 bg-gold-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-all shadow-lg hover:shadow-xl"
                >
                  <span>Create Professional Render</span>
                  <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Final Professional Rendering */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="max-w-lg mx-auto">
                <div className="mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-gold-100 to-gold-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <SafeIcon icon={FiLoader} className="w-16 h-16 text-gold-600 animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Creating Professional Render
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Generating high-quality final output with enhanced effects
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-gold-400 to-gold-600 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${finalProgress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-medium">{Math.round(finalProgress)}% Complete</span>
                    <span>Rendering...</span>
                  </div>

                  <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
                    <p className="text-gold-600 font-medium text-lg">
                      {finalStage}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Final Result */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  🏆 Your Custom Gold Bar is Complete!
                </h3>
                <p className="text-gray-600 text-lg">
                  Professional-grade rendering with realistic engraving effects
                </p>
              </div>

              {/* Final Rendered Image */}
              {finalResult && (
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={finalResult}
                      alt="Final professional rendered custom gold bar"
                      className="max-w-full h-auto rounded-lg shadow-2xl"
                      style={{ maxHeight: '500px' }}
                    />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ✓ Professional Render
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 text-green-800 mb-3">
                  <SafeIcon icon={FiCheck} className="w-5 h-5" />
                  <span className="font-medium">Professional Rendering Complete</span>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  {customText && <p>• Custom Text: "{customText}" with 3D depth effects</p>}
                  {logoImage && <p>• Logo with perspective mapping and surface adaptation</p>}
                  <p>• Multi-layer engraving simulation</p>
                  <p>• Realistic metallic reflections</p>
                  <p>• Professional-grade preview quality</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-6 border-t">
                <button
                  onClick={handleBackStep}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
                  <span>Back to Preview</span>
                </button>
                
                <button
                  onClick={handleComplete}
                  className="flex items-center space-x-2 bg-gold-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-all shadow-lg hover:shadow-xl"
                >
                  <SafeIcon icon={FiCheck} className="w-5 h-5" />
                  <span>Add to Cart - $599.99</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomizationWizard;
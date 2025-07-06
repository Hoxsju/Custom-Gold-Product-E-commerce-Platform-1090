import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { fabric } from 'fabric';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiRotateCw, FiZoomIn, FiZoomOut, FiRefreshCw, FiShoppingCart, 
  FiDownload, FiImage, FiArrowLeft, FiSettings, FiLayers
} = FiIcons;

const FabricCanvasPreview = ({ customText = '', logoImage = null, fabricRenderingData, onBack }) => {
  const { addItem } = useCart();
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const goldBarImageRef = useRef(null);
  
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [activeObject, setActiveObject] = useState(null);
  const [canvasSettings, setCanvasSettings] = useState({
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    left: 0,
    top: 0
  });

  // Product data
  const baseProduct = {
    id: `custom-${Date.now()}`,
    name: 'Custom Engraved Gold Bar',
    price: 599.99
  };

  // Gold bar image
  const GOLD_BAR_IMAGE = 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751622642876-blob';

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: 'transparent',
      selection: true,
      preserveObjectStacking: true
    });

    fabricCanvasRef.current = canvas;

    // Load gold bar background image
    fabric.Image.fromURL(GOLD_BAR_IMAGE, (img) => {
      // Scale image to fit canvas
      const canvasAspect = canvas.width / canvas.height;
      const imgAspect = img.width / img.height;
      
      let scale;
      if (imgAspect > canvasAspect) {
        scale = canvas.width / img.width * 0.9;
      } else {
        scale = canvas.height / img.height * 0.9;
      }

      img.set({
        scaleX: scale,
        scaleY: scale,
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
        excludeFromExport: false
      });

      canvas.add(img);
      canvas.sendToBack(img);
      goldBarImageRef.current = img;

      // Add content overlay to lower rectangle area
      addContentOverlay(canvas, img);
      
      canvas.renderAll();
      setIsCanvasReady(true);
    }, {
      crossOrigin: 'anonymous'
    });

    // Handle object selection
    canvas.on('selection:created', (e) => {
      setActiveObject(e.selected[0]);
      updateCanvasSettings(e.selected[0]);
    });

    canvas.on('selection:updated', (e) => {
      setActiveObject(e.selected[0]);
      updateCanvasSettings(e.selected[0]);
    });

    canvas.on('selection:cleared', () => {
      setActiveObject(null);
    });

    canvas.on('object:modified', (e) => {
      if (e.target) {
        updateCanvasSettings(e.target);
      }
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  // Add content overlay to the lower rectangle area of gold bar
  const addContentOverlay = (canvas, goldBarImg) => {
    if (!goldBarImg) return;

    // Calculate the lower rectangle area based on gold bar position and size
    const imgBounds = goldBarImg.getBoundingRect();
    const overlayArea = {
      left: imgBounds.left + imgBounds.width * 0.25,
      top: imgBounds.top + imgBounds.height * 0.70,
      width: imgBounds.width * 0.5,
      height: imgBounds.height * 0.15
    };

    // Add text if provided
    if (customText.trim()) {
      const textObj = new fabric.Text(customText, {
        left: overlayArea.left + overlayArea.width / 2,
        top: overlayArea.top + overlayArea.height / 2,
        originX: 'center',
        originY: 'center',
        fontFamily: 'Times New Roman, serif',
        fontSize: Math.min(overlayArea.width / customText.length * 1.5, overlayArea.height * 0.7),
        fill: '#5a4410', // Dark gold color
        fontWeight: 'bold',
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.3)',
          blur: 2,
          offsetX: 1,
          offsetY: 1
        }),
        stroke: '#3d2f0b',
        strokeWidth: 0.5,
        paintFirst: 'stroke'
      });

      canvas.add(textObj);
      setActiveObject(textObj);
      updateCanvasSettings(textObj);
    }
    
    // Add logo if provided
    else if (logoImage) {
      fabric.Image.fromURL(logoImage, (logoObj) => {
        // Scale logo to fit in overlay area
        const logoScale = Math.min(
          overlayArea.width / logoObj.width * 0.8,
          overlayArea.height / logoObj.height * 0.8
        );

        logoObj.set({
          left: overlayArea.left + overlayArea.width / 2,
          top: overlayArea.top + overlayArea.height / 2,
          originX: 'center',
          originY: 'center',
          scaleX: logoScale,
          scaleY: logoScale,
          opacity: 0.8,
          // Apply engraving effect filters
          filters: [
            new fabric.Image.filters.Grayscale(),
            new fabric.Image.filters.BlendColor({
              color: '#5a4410',
              mode: 'multiply',
              alpha: 0.8
            })
          ]
        });

        logoObj.applyFilters();
        canvas.add(logoObj);
        setActiveObject(logoObj);
        updateCanvasSettings(logoObj);
        canvas.renderAll();
      }, {
        crossOrigin: 'anonymous'
      });
    }
  };

  // Update canvas settings from active object
  const updateCanvasSettings = (obj) => {
    if (!obj) return;
    
    setCanvasSettings({
      rotation: obj.angle || 0,
      scaleX: obj.scaleX || 1,
      scaleY: obj.scaleY || 1,
      left: obj.left || 0,
      top: obj.top || 0
    });
  };

  // Control functions
  const handleRotation = (delta) => {
    if (!activeObject || !fabricCanvasRef.current) return;
    
    const newAngle = (activeObject.angle + delta) % 360;
    activeObject.rotate(newAngle);
    fabricCanvasRef.current.renderAll();
    updateCanvasSettings(activeObject);
  };

  const handleScale = (delta) => {
    if (!activeObject || !fabricCanvasRef.current) return;
    
    const newScale = Math.max(0.5, Math.min(3, activeObject.scaleX + delta));
    activeObject.scale(newScale);
    fabricCanvasRef.current.renderAll();
    updateCanvasSettings(activeObject);
  };

  const handlePosition = (deltaX, deltaY) => {
    if (!activeObject || !fabricCanvasRef.current) return;
    
    activeObject.set({
      left: activeObject.left + deltaX,
      top: activeObject.top + deltaY
    });
    fabricCanvasRef.current.renderAll();
    updateCanvasSettings(activeObject);
  };

  const handleReset = () => {
    if (!activeObject || !fabricCanvasRef.current) return;
    
    // Reset to original position in overlay area
    const canvas = fabricCanvasRef.current;
    const goldBarImg = goldBarImageRef.current;
    
    if (goldBarImg) {
      const imgBounds = goldBarImg.getBoundingRect();
      const overlayArea = {
        left: imgBounds.left + imgBounds.width * 0.25,
        top: imgBounds.top + imgBounds.height * 0.70,
        width: imgBounds.width * 0.5,
        height: imgBounds.height * 0.15
      };
      
      activeObject.set({
        left: overlayArea.left + overlayArea.width / 2,
        top: overlayArea.top + overlayArea.height / 2,
        angle: 0,
        scaleX: 1,
        scaleY: 1
      });
      
      canvas.renderAll();
      updateCanvasSettings(activeObject);
    }
  };

  // Add to cart function
  const handleAddToCart = () => {
    if (!fabricCanvasRef.current) return;
    
    // Export canvas as image
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    
    const customProduct = {
      ...baseProduct,
      customization: {
        text: customText,
        logo: logoImage,
        fabricRendering: dataURL,
        settings: canvasSettings,
        finalRender: dataURL
      }
    };
    
    addItem(customProduct);
    alert('Custom engraved gold bar added to cart!');
  };

  // Download preview function
  const handleDownloadPreview = () => {
    if (!fabricCanvasRef.current) return;
    
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 3
    });
    
    const link = document.createElement('a');
    link.download = `fabric-engraved-gold-bar-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
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
            Step 3: Fabric.js Canvas Preview & Controls
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive canvas overlay with precise positioning on the gold bar's lower rectangle area.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fabric.js Canvas Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {/* Canvas Container */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6">
              <canvas 
                ref={canvasRef}
                className="w-full h-auto max-w-full rounded-lg shadow-md border border-gray-200"
              />
              
              {/* Live Indicator */}
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse flex items-center z-10">
                <div className="w-2 h-2 bg-white rounded-full mr-1 animate-ping"></div>
                LIVE
              </div>

              {/* Fabric.js Indicator */}
              <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                ⚡ Fabric.js
              </div>

              {/* Loading Overlay */}
              {!isCanvasReady && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-gray-600 text-sm">Initializing Fabric.js canvas...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas Info */}
            <div className="p-4 bg-blue-50 border-t">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-blue-700">
                  <SafeIcon icon={FiLayers} className="w-4 h-4" />
                  <span>Fabric.js Canvas Overlay</span>
                </div>
                <div className="text-blue-600 font-medium">
                  Lower Rectangle Area
                </div>
              </div>
              
              <div className="mt-2 text-xs text-blue-600">
                <p>✓ Canvas positioned on gold bar lower rectangle</p>
                <p>✓ Dark gold engraving style (#5a4410) applied</p>
                <p>✓ Interactive controls for precise positioning</p>
              </div>
            </div>
          </motion.div>

          {/* Fabric.js Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <SafeIcon icon={FiSettings} className="w-5 h-5 mr-2 text-gold-600" />
              Fabric.js Canvas Controls
            </h3>

            {/* Selection Status */}
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Active Object</p>
              <p className="text-sm text-gray-600">
                {activeObject ? 
                  (activeObject.type === 'text' ? 'Text Layer' : 'Logo Layer') : 
                  'No object selected - Click on content to select'
                }
              </p>
            </div>

            {/* Rotation & Scale Controls */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Transform Controls</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleRotation(-15)}
                  disabled={!activeObject}
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed px-4 py-3 rounded-lg text-sm transition-colors shadow-sm border border-gray-200"
                >
                  <SafeIcon icon={FiRotateCw} className="w-4 h-4 transform rotate-180" />
                  <span>Rotate L</span>
                </button>
                
                <button
                  onClick={() => handleRotation(15)}
                  disabled={!activeObject}
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed px-4 py-3 rounded-lg text-sm transition-colors shadow-sm border border-gray-200"
                >
                  <SafeIcon icon={FiRotateCw} className="w-4 h-4" />
                  <span>Rotate R</span>
                </button>
                
                <button
                  onClick={() => handleScale(0.1)}
                  disabled={!activeObject}
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed px-4 py-3 rounded-lg text-sm transition-colors shadow-sm border border-gray-200"
                >
                  <SafeIcon icon={FiZoomIn} className="w-4 h-4" />
                  <span>Larger</span>
                </button>
                
                <button
                  onClick={() => handleScale(-0.1)}
                  disabled={!activeObject}
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed px-4 py-3 rounded-lg text-sm transition-colors shadow-sm border border-gray-200"
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
                    onClick={() => handlePosition(0, -5)}
                    disabled={!activeObject}
                    className="bg-white hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed p-3 rounded-lg text-sm transition-colors shadow-sm border border-gray-200"
                    title="Move Up"
                  >
                    ↑
                  </button>
                  <div></div>
                  
                  <button
                    onClick={() => handlePosition(-5, 0)}
                    disabled={!activeObject}
                    className="bg-white hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed p-3 rounded-lg text-sm transition-colors shadow-sm border border-gray-200"
                    title="Move Left"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={!activeObject}
                    className="bg-gold-500 hover:bg-gold-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-lg text-sm transition-colors shadow-sm"
                    title="Reset Position"
                  >
                    ⌂
                  </button>
                  <button
                    onClick={() => handlePosition(5, 0)}
                    disabled={!activeObject}
                    className="bg-white hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed p-3 rounded-lg text-sm transition-colors shadow-sm border border-gray-200"
                    title="Move Right"
                  >
                    →
                  </button>
                  
                  <div></div>
                  <button
                    onClick={() => handlePosition(0, 5)}
                    disabled={!activeObject}
                    className="bg-white hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed p-3 rounded-lg text-sm transition-colors shadow-sm border border-gray-200"
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
              <h4 className="text-sm font-medium text-gray-700 mb-2">Canvas Settings</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rotation:</span>
                  <span className="font-medium">{Math.round(canvasSettings.rotation)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scale:</span>
                  <span className="font-medium">{(canvasSettings.scaleX * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Left:</span>
                  <span className="font-medium">{Math.round(canvasSettings.left)}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Top:</span>
                  <span className="font-medium">{Math.round(canvasSettings.top)}px</span>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="mb-6">
              <button
                onClick={handleReset}
                disabled={!activeObject}
                className="w-full flex items-center justify-center space-x-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
                <span>Reset to Center</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!hasContent || !isCanvasReady}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center ${
                  hasContent && isCanvasReady
                    ? 'bg-gold-500 text-white hover:bg-gold-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <SafeIcon icon={FiShoppingCart} className="w-5 h-5 mr-2" />
                Add to Cart - ${baseProduct.price}
              </button>
              
              <button
                onClick={handleDownloadPreview}
                disabled={!hasContent || !isCanvasReady}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center ${
                  hasContent && isCanvasReady
                    ? 'border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white'
                    : 'border-2 border-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <SafeIcon icon={FiDownload} className="w-5 h-5 mr-2" />
                Download Canvas
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FabricCanvasPreview;
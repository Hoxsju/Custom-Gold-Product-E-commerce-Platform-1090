import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiRotateCw, FiZoomIn, FiZoomOut, FiMove, FiRefreshCw, FiEye } = FiIcons;

const LiveProductRenderer = ({
  productImage,
  customText = '',
  logoImage = null,
  onRenderComplete = null,
  renderingMode = 'live' // 'live' or 'final'
}) => {
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productImg, setProductImg] = useState(null);
  const [logoImg, setLogoImg] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 450 });
  const [engravingSettings, setEngravingSettings] = useState({
    rotation: 0,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    depth: 0.8,
    perspective: 0.15
  });

  // Only show if there's content to preview
  const hasContent = customText.trim() || logoImage;

  // Enhanced engraving area mapping for the gold bar surface
  const getEngravingArea = (imgBounds) => {
    const { x, y, width, height } = imgBounds;
    
    // Define the main engraving surface on the gold bar
    return {
      // Center area of the gold bar for engraving
      centerX: x + width * 0.5,
      centerY: y + height * 0.47, // Slightly below center for better positioning
      width: width * 0.35, // Reasonable engraving area
      height: height * 0.15, // Height appropriate for text/small logos
      
      // Perspective points for 3D trapezoid effect
      topLeft: { x: x + width * 0.325, y: y + height * 0.40 },
      topRight: { x: x + width * 0.675, y: y + height * 0.40 },
      bottomLeft: { x: x + width * 0.315, y: y + height * 0.54 },
      bottomRight: { x: x + width * 0.685, y: y + height * 0.54 },
      
      // Original bounds for reference
      originalX: x,
      originalY: y,
      originalWidth: width,
      originalHeight: height
    };
  };

  // Advanced perspective transformation using canvas transform
  const applyPerspectiveTransform = (ctx, area, callback) => {
    ctx.save();
    
    // Calculate perspective transformation matrix
    const { topLeft, topRight, bottomLeft, bottomRight } = area;
    
    // Simple perspective approximation using transform
    const scaleX = (topRight.x - topLeft.x) / area.width;
    const scaleY = (bottomLeft.y - topLeft.y) / area.height;
    const skewX = (topRight.y - topLeft.y) / area.width;
    const skewY = (bottomLeft.x - topLeft.x) / area.height;
    
    // Apply transformation
    ctx.setTransform(
      scaleX, skewX,
      skewY, scaleY,
      topLeft.x, topLeft.y
    );
    
    callback(ctx);
    ctx.restore();
  };

  // Enhanced text rendering with realistic engraving effects
  const renderEngravingText = (ctx, area, text) => {
    if (!text.trim()) return;
    
    // Calculate appropriate font size based on text length and area
    const baseFontSize = Math.min(area.width / text.length * 1.2, area.height * 0.7);
    const adjustedFontSize = Math.max(baseFontSize * engravingSettings.scale, 8);
    
    // Apply perspective transformation
    applyPerspectiveTransform(ctx, area, (transformedCtx) => {
      // Set up text properties
      transformedCtx.font = `bold ${adjustedFontSize}px 'Times New Roman', serif`;
      transformedCtx.textAlign = 'center';
      transformedCtx.textBaseline = 'middle';
      
      const centerX = area.width * 0.5 + engravingSettings.offsetX;
      const centerY = area.height * 0.5 + engravingSettings.offsetY;
      
      // Apply rotation if needed
      if (engravingSettings.rotation !== 0) {
        transformedCtx.translate(centerX, centerY);
        transformedCtx.rotate(engravingSettings.rotation * Math.PI / 180);
        transformedCtx.translate(-centerX, -centerY);
      }
      
      // Render multiple layers for 3D engraving effect
      renderTextWithDepth(transformedCtx, text, centerX, centerY, adjustedFontSize);
    });
  };

  // Multi-layer text rendering for realistic 3D engraving
  const renderTextWithDepth = (ctx, text, x, y, fontSize) => {
    const depthFactor = engravingSettings.depth;
    
    // Layer 1: Deep shadow (engraved depression)
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillText(text, x + 2 * depthFactor, y + 3 * depthFactor);
    ctx.restore();
    
    // Layer 2: Medium shadow
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillText(text, x + 1.5 * depthFactor, y + 2 * depthFactor);
    ctx.restore();
    
    // Layer 3: Light shadow
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillText(text, x + 1 * depthFactor, y + 1.5 * depthFactor);
    ctx.restore();
    
    // Layer 4: Main engraved text (darker)
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#2a2a2a';
    ctx.fillText(text, x, y);
    ctx.restore();
    
    // Layer 5: Highlight edge (metallic reflection)
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
    ctx.fillText(text, x - 0.5, y - 0.5);
    ctx.restore();
    
    // Layer 6: Bright highlight
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(text, x - 1, y - 1);
    ctx.restore();
  };

  // Enhanced logo rendering with perspective mapping
  const renderEngravingLogo = (ctx, area, logoImg) => {
    if (!logoImg) return;
    
    // Calculate logo dimensions with proper scaling
    const logoAspect = logoImg.width / logoImg.height;
    const maxWidth = area.width * 0.7 * engravingSettings.scale;
    const maxHeight = area.height * 0.7 * engravingSettings.scale;
    
    let logoWidth = maxWidth;
    let logoHeight = logoWidth / logoAspect;
    
    if (logoHeight > maxHeight) {
      logoHeight = maxHeight;
      logoWidth = logoHeight * logoAspect;
    }
    
    // Apply perspective transformation
    applyPerspectiveTransform(ctx, area, (transformedCtx) => {
      const centerX = area.width * 0.5 + engravingSettings.offsetX;
      const centerY = area.height * 0.5 + engravingSettings.offsetY;
      const logoX = centerX - logoWidth / 2;
      const logoY = centerY - logoHeight / 2;
      
      // Apply rotation if needed
      if (engravingSettings.rotation !== 0) {
        transformedCtx.translate(centerX, centerY);
        transformedCtx.rotate(engravingSettings.rotation * Math.PI / 180);
        transformedCtx.translate(-centerX, -centerY);
      }
      
      // Render logo with engraving effect
      renderLogoWithDepth(transformedCtx, logoImg, logoX, logoY, logoWidth, logoHeight);
    });
  };

  // Multi-layer logo rendering for engraving effect
  const renderLogoWithDepth = (ctx, logoImg, x, y, width, height) => {
    const depthFactor = engravingSettings.depth;
    
    // Create shadow layers for depth
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(logoImg, x + 2 * depthFactor, y + 3 * depthFactor, width, height);
    ctx.restore();
    
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(logoImg, x + 1.5 * depthFactor, y + 2 * depthFactor, width, height);
    ctx.restore();
    
    // Main logo (darkened for engraved effect)
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(logoImg, x, y, width, height);
    ctx.restore();
    
    // Highlight for metallic effect
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(logoImg, x - 0.5, y - 0.5, width, height);
    ctx.restore();
  };

  // Main rendering function
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !productImg) return;
    
    const ctx = canvas.getContext('2d');
    
    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate product image bounds (centered and scaled)
    const imgAspect = productImg.naturalWidth / productImg.naturalHeight;
    const canvasAspect = canvas.width / canvas.height;
    
    let drawWidth, drawHeight, drawX, drawY;
    
    if (imgAspect > canvasAspect) {
      drawWidth = canvas.width * 0.9;
      drawHeight = drawWidth / imgAspect;
    } else {
      drawHeight = canvas.height * 0.9;
      drawWidth = drawHeight * imgAspect;
    }
    
    drawX = (canvas.width - drawWidth) / 2;
    drawY = (canvas.height - drawHeight) / 2;
    
    // Draw the product image first
    ctx.drawImage(productImg, drawX, drawY, drawWidth, drawHeight);
    
    // Only render customizations if we have content
    if (hasContent) {
      // Get engraving area
      const engravingArea = getEngravingArea({
        x: drawX,
        y: drawY,
        width: drawWidth,
        height: drawHeight
      });
      
      // Render customizations ON TOP of the product
      if (logoImage && logoImg) {
        renderEngravingLogo(ctx, engravingArea, logoImg);
      } else if (customText.trim()) {
        renderEngravingText(ctx, engravingArea, customText);
      }
      
      // Add subtle surface reflection
      addSurfaceReflection(ctx, {
        x: drawX,
        y: drawY,
        width: drawWidth,
        height: drawHeight
      });
    }
    
    // Trigger callback if provided
    if (onRenderComplete) {
      onRenderComplete(canvas.toDataURL('image/png', 1.0));
    }
  }, [productImg, logoImg, customText, logoImage, engravingSettings, onRenderComplete, hasContent]);

  // Add surface reflection effect
  const addSurfaceReflection = (ctx, bounds) => {
    ctx.save();
    
    // Create subtle metallic reflection
    const gradient = ctx.createLinearGradient(
      bounds.x, bounds.y,
      bounds.x + bounds.width * 0.7, bounds.y + bounds.height * 0.3
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = gradient;
    ctx.fillRect(bounds.x, bounds.y, bounds.width * 0.7, bounds.height * 0.3);
    
    ctx.restore();
  };

  // Load product image
  useEffect(() => {
    if (productImage) {
      setIsLoading(true);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setProductImg(img);
        setIsLoading(false);
        console.log('Product image loaded successfully');
      };
      img.onerror = (error) => {
        console.error('Failed to load product image:', error);
        setIsLoading(false);
      };
      img.src = productImage;
    }
  }, [productImage]);

  // Load logo image
  useEffect(() => {
    if (logoImage) {
      const img = new Image();
      img.onload = () => {
        setLogoImg(img);
        console.log('Logo image loaded successfully');
      };
      img.onerror = (error) => {
        console.error('Failed to load logo image:', error);
      };
      img.src = logoImage;
    } else {
      setLogoImg(null);
    }
  }, [logoImage]);

  // Re-render when dependencies change
  useEffect(() => {
    if (!isLoading && productImg) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        renderCanvas();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [renderCanvas, isLoading, productImg]);

  // Control functions
  const adjustRotation = (delta) => {
    setEngravingSettings(prev => ({
      ...prev,
      rotation: (prev.rotation + delta) % 360
    }));
  };

  const adjustScale = (delta) => {
    setEngravingSettings(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(2, prev.scale + delta))
    }));
  };

  const adjustPosition = (deltaX, deltaY) => {
    setEngravingSettings(prev => ({
      ...prev,
      offsetX: prev.offsetX + deltaX,
      offsetY: prev.offsetY + deltaY
    }));
  };

  const resetSettings = () => {
    setEngravingSettings({
      rotation: 0,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      depth: 0.8,
      perspective: 0.15
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading 3D renderer...</p>
        </div>
      </div>
    );
  }

  // Show placeholder when no content
  if (!hasContent) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <SafeIcon icon={FiEye} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Live 3D Preview</h3>
        <p className="text-gray-500 text-sm">
          Add custom text or upload a logo to see your live 3D engraved preview
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Canvas Container */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="w-full h-auto max-w-full rounded-lg shadow-md border border-gray-200"
          style={{ 
            display: 'block',
            maxHeight: '500px'
          }}
        />
        
        {/* Live indicator */}
        {renderingMode === 'live' && (
          <div className="absolute top-6 left-6 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-ping"></div>
            LIVE
          </div>
        )}
        
        {/* Engraving indicator */}
        {hasContent && (
          <div className="absolute top-6 right-6 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            ✓ 3D Engraved
          </div>
        )}
      </div>

      {/* Controls */}
      {hasContent && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => adjustRotation(-15)}
              className="flex items-center space-x-1 bg-white hover:bg-gray-100 px-3 py-2 rounded-lg text-sm transition-colors shadow-sm"
            >
              <SafeIcon icon={FiRotateCw} className="w-4 h-4 transform rotate-180" />
              <span>Rotate L</span>
            </button>
            
            <button
              onClick={() => adjustRotation(15)}
              className="flex items-center space-x-1 bg-white hover:bg-gray-100 px-3 py-2 rounded-lg text-sm transition-colors shadow-sm"
            >
              <SafeIcon icon={FiRotateCw} className="w-4 h-4" />
              <span>Rotate R</span>
            </button>
            
            <button
              onClick={() => adjustScale(0.1)}
              className="flex items-center space-x-1 bg-white hover:bg-gray-100 px-3 py-2 rounded-lg text-sm transition-colors shadow-sm"
            >
              <SafeIcon icon={FiZoomIn} className="w-4 h-4" />
              <span>Larger</span>
            </button>
            
            <button
              onClick={() => adjustScale(-0.1)}
              className="flex items-center space-x-1 bg-white hover:bg-gray-100 px-3 py-2 rounded-lg text-sm transition-colors shadow-sm"
            >
              <SafeIcon icon={FiZoomOut} className="w-4 h-4" />
              <span>Smaller</span>
            </button>
            
            <button
              onClick={resetSettings}
              className="flex items-center space-x-1 bg-gold-500 hover:bg-gold-600 text-white px-3 py-2 rounded-lg text-sm transition-colors shadow-sm"
            >
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          {/* Position controls */}
          <div className="mt-3 flex justify-center">
            <div className="grid grid-cols-3 gap-1 w-20">
              <div></div>
              <button
                onClick={() => adjustPosition(0, -3)}
                className="bg-white hover:bg-gray-100 p-1 rounded text-xs transition-colors shadow-sm"
              >
                ↑
              </button>
              <div></div>
              
              <button
                onClick={() => adjustPosition(-3, 0)}
                className="bg-white hover:bg-gray-100 p-1 rounded text-xs transition-colors shadow-sm"
              >
                ←
              </button>
              <button
                onClick={() => adjustPosition(0, 0)}
                className="bg-gray-200 p-1 rounded text-xs"
              >
                ⌂
              </button>
              <button
                onClick={() => adjustPosition(3, 0)}
                className="bg-white hover:bg-gray-100 p-1 rounded text-xs transition-colors shadow-sm"
              >
                →
              </button>
              
              <div></div>
              <button
                onClick={() => adjustPosition(0, 3)}
                className="bg-white hover:bg-gray-100 p-1 rounded text-xs transition-colors shadow-sm"
              >
                ↓
              </button>
              <div></div>
            </div>
          </div>

          {/* Settings display */}
          <div className="mt-3 text-xs text-gray-500 text-center">
            Rotation: {engravingSettings.rotation}° | Scale: {(engravingSettings.scale * 100).toFixed(0)}% | Position: ({engravingSettings.offsetX}, {engravingSettings.offsetY})
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveProductRenderer;
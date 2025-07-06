import React from 'react';
import { motion } from 'framer-motion';
import LiveProductRenderer from './LiveProductRenderer';

const ProductPreview = ({ customText, logoImage, goldProduct }) => {
  // YOUR TRANSPARENT PRODUCT IMAGE
  const PRODUCT_IMAGE = 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751619167457-blob';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Live 3D Preview</h3>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <LiveProductRenderer
          productImage={PRODUCT_IMAGE}
          customText={customText}
          logoImage={logoImage}
          renderingMode="live"
        />
      </motion.div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 mb-2">
          Real-time 3D preview with perspective engraving
        </p>
        
        {(customText || logoImage) && (
          <div className="bg-gold-50 border border-gold-200 rounded-lg p-3 mt-3">
            <p className="text-xs text-gold-700 font-medium">
              ✨ Advanced 3D rendering with surface mapping
            </p>
            <p className="text-xs text-gold-600">
              Your customization shows exactly how it will appear on the gold surface
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPreview;
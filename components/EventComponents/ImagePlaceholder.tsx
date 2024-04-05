// ImagePlaceholder.tsx
import React from 'react';

interface ImagePlaceholderProps {
  width: number;
  height: number;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ width, height }) => {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#f0f0f0',
        animationName: 'shimmer',
        animationDuration: '2s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
      }}
    />
  );
};

export default ImagePlaceholder;
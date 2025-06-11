import React, { useState } from 'react';

interface OptimizedGalleryImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  quality?: number;
}

export const OptimizedGalleryImage: React.FC<OptimizedGalleryImageProps> = ({
  src,
  alt,
  className = '',
  width = 800,
  height = 600,
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, 50vw',
  quality = 80
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Generate Cloudinary URL with optimizations if it's a Cloudinary URL
  // Otherwise, use the original URL
  const getOptimizedUrl = (url: string) => {
    if (url.includes('cloudinary.com')) {
      // Extract base URL and transformation string
      const urlParts = url.split('/upload/');
      if (urlParts.length === 2) {
        const transformations = `f_auto,q_${quality},w_${width},c_fill`;
        return `${urlParts[0]}/upload/${transformations}/${urlParts[1]}`;
      }
    }
    
    // For non-Cloudinary URLs, return as is
    return url;
  };
  
  // Generate a low-quality placeholder URL
  const getPlaceholderUrl = (url: string) => {
    if (url.includes('cloudinary.com')) {
      const urlParts = url.split('/upload/');
      if (urlParts.length === 2) {
        const transformations = 'f_auto,q_10,w_50,e_blur:1000,c_fill';
        return `${urlParts[0]}/upload/${transformations}/${urlParts[1]}`;
      }
    }
    
    // Fallback placeholder for non-Cloudinary URLs
    return url;
  };
  
  const optimizedSrc = getOptimizedUrl(src);
  const placeholderSrc = getPlaceholderUrl(src);
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Low-quality placeholder */}
      {!isLoaded && (
        <img
          src={placeholderSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          aria-hidden="true"
        />
      )}
      
      {/* Main optimized image */}
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        sizes={sizes}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

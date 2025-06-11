import React, { useState, useEffect } from 'react';
import { 
  getOptimizedUrl, 
  generateSrcSet, 
  getBlurPlaceholder,
  convertToCloudinaryUrl
} from '../../utils/cloudinary';

interface OptimizedImageProps {
  src: string;
  alt: string;
  type?: 'hero' | 'gallery' | 'thumbnail' | 'background' | 'portfolio';
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onClick?: () => void;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  publicId?: string; // If direct Cloudinary publicId is provided instead of src
}

/**
 * OptimizedImage component using Cloudinary
 * 
 * This component handles:
 * - Responsive image loading
 * - WebP and AVIF format delivery when supported
 * - Automatic quality optimization
 * - Lazy loading with blur placeholders
 * - Art direction through Cloudinary transformations
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  type = 'gallery',
  width,
  height,
  className = '',
  priority = false,
  onLoad,
  onClick,
  sizes = '100vw',
  objectFit = 'cover',
  publicId
}) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [blurSrc, setBlurSrc] = useState<string>('');
  
  useEffect(() => {
    // If publicId is provided, use it directly
    if (publicId) {
      setImgSrc(getOptimizedUrl(publicId, type, width, height));
      setBlurSrc(getBlurPlaceholder(publicId));
    } else if (src) {
      // Otherwise, convert from standard URL if needed
      setImgSrc(convertToCloudinaryUrl(src, type, width, height));
      
      // For now, use a very simple blur placeholder approach for non-Cloudinary images
      // In a production app, we'd generate these server-side or at build time
      setBlurSrc(src);
    }
  }, [src, publicId, type, width, height]);
  
  // Create srcSet for responsive images
  const srcSet = publicId ? generateSrcSet(publicId, type) : '';
  
  // Handle image load completion
  const handleImageLoaded = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  // Style for object-fit property
  const imageStyle: React.CSSProperties = {
    objectFit,
    transition: 'opacity 500ms ease-in-out',
    opacity: isLoading ? 0 : 1,
  };

  // Style for placeholder
  const placeholderStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    filter: 'blur(20px)',
    transform: 'scale(1.1)', // Slightly larger to ensure edges are covered despite blur
    opacity: isLoading ? 1 : 0,
    transition: 'opacity 500ms ease-in-out',
    objectFit
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto' }}
    >
      {/* Blur placeholder - visible while main image loads */}
      {!priority && blurSrc && (
        <img 
          src={blurSrc}
          alt=""
          aria-hidden="true"
          style={placeholderStyle}
          className="w-full h-full"
        />
      )}
      
      {/* Main optimized image */}
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        srcSet={srcSet}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleImageLoaded}
        onClick={onClick}
        style={imageStyle}
        className="w-full h-full"
      />
    </div>
  );
};

export default OptimizedImage;

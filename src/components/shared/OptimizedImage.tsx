import React, { useState, useEffect, CSSProperties } from 'react';
import { useInView } from 'react-intersection-observer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  priority?: boolean; // Load immediately without lazy loading
  onLoad?: () => void;
  onClick?: () => void;
}

/**
 * OptimizedImage Component
 *
 * Features:
 * - Lazy loading with Intersection Observer
 * - Blur placeholder for smooth loading
 * - Automatic Cloudinary optimizations
 * - Responsive image sizing
 * - Progressive enhancement
 */
export function OptimizedImage({
  src,
  alt,
  className = '',
  style = {},
  width,
  height,
  priority = false,
  onLoad,
  onClick
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Use Intersection Observer for lazy loading
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px', // Start loading 50px before entering viewport
    skip: priority // Skip lazy loading for priority images
  });

  // Check if it's a Cloudinary URL
  const isCloudinary = src.includes('cloudinary.com');

  // Generate optimized URLs for Cloudinary images
  const getOptimizedUrl = (url: string, transform: string) => {
    if (!isCloudinary) return url;
    return url.replace('/upload/', `/upload/${transform}/`);
  };

  // Generate blur placeholder URL (tiny, heavily blurred version)
  const blurUrl = getOptimizedUrl(src, 'w_50,q_10,e_blur:1000,f_auto');

  // Generate optimized main image URL
  const getMainImageUrl = () => {
    if (!isCloudinary) return src;

    const transforms = [];
    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    transforms.push('c_fill', 'q_auto', 'f_auto');

    // Add responsive transformations
    if (width && width > 768) {
      transforms.push('dpr_2.0'); // Retina display support
    }

    return getOptimizedUrl(src, transforms.join(','));
  };

  const optimizedUrl = getMainImageUrl();

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    if (!isCloudinary || !width) return undefined;

    const sizes = [
      Math.round(width * 0.5),  // Mobile
      Math.round(width * 0.75), // Tablet
      width,                     // Desktop
      Math.round(width * 1.5),  // Retina
    ];

    return sizes
      .map(size => {
        const url = getOptimizedUrl(src, `w_${size},q_auto,f_auto`);
        return `${url} ${size}w`;
      })
      .join(', ');
  };

  const srcSet = generateSrcSet();

  // Load immediately for priority images
  useEffect(() => {
    if (priority && !isLoaded) {
      const img = new Image();
      img.src = optimizedUrl;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setError(true);
    }
  }, [priority, optimizedUrl, isLoaded]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setError(true);
    console.error(`Failed to load image: ${src}`);
  };

  // Fallback for error state
  if (error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ ...style, width, height }}
      >
        <span className="text-gray-400 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onClick={onClick}
    >
      {/* Blur placeholder - always show initially */}
      {isCloudinary && (
        <img
          src={blurUrl}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
        />
      )}

      {/* Main image - load based on priority or intersection */}
      {(priority || inView) && (
        <img
          src={optimizedUrl}
          srcSet={srcSet}
          sizes={width ? `(max-width: 768px) 50vw, ${width}px` : undefined}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          width={width}
          height={height}
        />
      )}

      {/* Loading skeleton as fallback */}
      {!isLoaded && !isCloudinary && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}

/**
 * Helper hook to preload images
 */
export function useImagePreloader(urls: string[]) {
  useEffect(() => {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, [urls]);
}

export default OptimizedImage;
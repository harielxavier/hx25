import React, { useState } from 'react';
import { FALLBACK_IMAGES } from '../utils/imageConstants';

type ImageCategory = 'wedding' | 'engagement' | 'portrait' | 'landscape' | 'equipment' | 'avatar' | 'blog';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  category?: ImageCategory;
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  category = 'wedding',
  fallbackSrc,
  ...props
}) => {
  const [error, setError] = useState(false);
  
  // Determine the appropriate fallback image
  const getFallbackImage = () => {
    if (fallbackSrc) return fallbackSrc;
    
    // Use stock images based on category
    if (category === 'blog') return `/images/stock/wedding/wedding-${Math.floor(Math.random() * 40) + 1}.jpg`;
    if (category === 'avatar') return FALLBACK_IMAGES.AVATAR;
    
    return FALLBACK_IMAGES.BLOG_POST;
  };
  
  // Validate the source URL
  const validateSrc = (url: string): string => {
    // If it's already a valid local path starting with /
    if (url.startsWith('/')) return url;
    
    // Check if URL is valid
    try {
      new URL(url);
      return url;
    } catch {
      // If not a valid URL, return fallback
      return getFallbackImage();
    }
  };
  
  // The source to use - either the validated original or the fallback
  const imageSrc = error ? getFallbackImage() : validateSrc(src);
  
  return (
    <img
      src={imageSrc}
      alt={alt}
      onError={() => setError(true)}
      {...props}
    />
  );
};

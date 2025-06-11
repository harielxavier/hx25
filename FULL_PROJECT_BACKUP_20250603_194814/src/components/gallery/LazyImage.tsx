import { useState, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function LazyImage({ src, alt, className = '', onLoad, onError }: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Function to load the image
  const loadImage = () => {
    setIsLoading(true);
    setHasError(false);
    
    // Add a cache-busting parameter for retries
    const cacheBustSrc = retryCount > 0 
      ? `${src}${src.includes('?') ? '&' : '?'}cb=${Date.now()}`
      : src;
    
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(cacheBustSrc);
      setIsLoading(false);
      setHasError(false);
      if (onLoad) onLoad();
    };
    
    img.onerror = () => {
      console.error(`Failed to load image: ${cacheBustSrc}`);
      setIsLoading(false);
      setHasError(true);
      if (onError) onError();
    };
    
    img.src = cacheBustSrc;
  };
  
  // Handle retry
  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      loadImage();
    }
  };
  
  // Load the image when the component mounts or when src changes
  useEffect(() => {
    setRetryCount(0); // Reset retry count when src changes
    loadImage();
  }, [src]);
  
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
        </div>
      </div>
    );
  }
  
  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 ${className}`}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-red-500 mb-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        {retryCount < 3 ? (
          <button 
            onClick={handleRetry} 
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            Retry
          </button>
        ) : (
          <span className="text-xs text-gray-500">Failed to load image</span>
        )}
      </div>
    );
  }
  
  return <img src={imageSrc} alt={alt} className={className} />;
}
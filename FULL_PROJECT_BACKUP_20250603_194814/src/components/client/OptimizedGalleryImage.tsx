import React, { useState, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';
import { getOptimizedImageUrls } from '../../services/firebaseCloudinaryService';

interface OptimizedGalleryImageProps {
  firebaseUrl: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  onClick?: () => void;
  selected?: boolean;
  selectable?: boolean;
  aspectRatio?: number;
  objectFit?: 'cover' | 'contain' | 'fill';
  priority?: boolean;
}

/**
 * OptimizedGalleryImage Component
 * 
 * This component displays images from Firebase Storage with Cloudinary optimization.
 * It includes:
 * - Responsive image loading
 * - Blur placeholder while loading
 * - Selection state for client galleries
 * - Lazy loading with priority option
 */
const OptimizedGalleryImage: React.FC<OptimizedGalleryImageProps> = ({
  firebaseUrl,
  alt,
  className = '',
  width = '100%',
  height = 'auto',
  onClick,
  selected = false,
  selectable = false,
  aspectRatio,
  objectFit = 'cover',
  priority = false
}) => {
  const [loaded, setLoaded] = useState(false);
  const [imageUrls, setImageUrls] = useState<{
    optimizedUrl: string;
    blurPlaceholder: string;
    responsiveSrcSet: string;
  } | null>(null);

  useEffect(() => {
    if (firebaseUrl) {
      const urls = getOptimizedImageUrls(firebaseUrl);
      setImageUrls({
        optimizedUrl: urls.optimizedUrl,
        blurPlaceholder: urls.blurPlaceholder,
        responsiveSrcSet: urls.responsiveSrcSet
      });
    }
  }, [firebaseUrl]);

  const handleImageLoad = () => {
    setLoaded(true);
  };

  if (!firebaseUrl || !imageUrls) {
    return (
      <Skeleton 
        variant="rectangular" 
        width={width} 
        height={aspectRatio ? 0 : (height || 200)} 
        sx={{ 
          paddingTop: aspectRatio ? `${aspectRatio * 100}%` : 0,
          borderRadius: '4px'
        }}
      />
    );
  }

  return (
    <Box
      className={`relative ${className} ${selectable ? 'cursor-pointer' : ''}`}
      sx={{
        position: 'relative',
        width,
        height: aspectRatio ? 'auto' : height,
        paddingTop: aspectRatio ? `${aspectRatio * 100}%` : 0,
        overflow: 'hidden',
        borderRadius: '4px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: selectable ? 'scale(1.02)' : 'none',
          boxShadow: selectable ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
        }
      }}
      onClick={onClick}
    >
      {/* Blur placeholder */}
      {!loaded && (
        <img
          src={imageUrls.blurPlaceholder}
          alt={alt}
          style={{
            position: aspectRatio ? 'absolute' : 'relative',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit,
            filter: 'blur(10px)',
            transition: 'opacity 0.2s',
            opacity: loaded ? 0 : 1
          }}
        />
      )}

      {/* Main optimized image */}
      <img
        src={imageUrls.optimizedUrl}
        srcSet={imageUrls.responsiveSrcSet}
        sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleImageLoad}
        style={{
          position: aspectRatio ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />

      {/* Selection indicator */}
      {selectable && (
        <Box
          className="absolute inset-0 flex items-center justify-center"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: selected ? 'rgba(25, 118, 210, 0.4)' : 'transparent',
            border: selected ? '3px solid #1976d2' : 'none',
            borderRadius: '4px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: selected 
                ? 'rgba(25, 118, 210, 0.4)' 
                : 'rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          {selected && (
            <Box
              className="bg-primary text-white rounded-full p-2"
              sx={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: '#1976d2',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              ✓
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default OptimizedGalleryImage;

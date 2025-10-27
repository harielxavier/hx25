import React, { useState, useEffect, CSSProperties } from 'react';
import { 
  getImageByIdentifier, 
  SiteImageData, 
  getPlaceholderImage 
} from '../../services/imageService';
import { Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import LoadingSpinner from '../ui/LoadingSpinner'; // Assuming you have this

interface ManagedImageProps {
  identifier: string;
  className?: string;
  style?: CSSProperties;
  alt?: string; // Add alt text prop
  placeholderCategory?: string; // e.g., 'wedding', 'portrait' for placeholder fallback
  useSkeleton?: boolean; // Option to use a skeleton loader
  skeletonClassName?: string; // Custom class for skeleton
  triggerLightbox?: boolean; // Prop to explicitly control lightbox trigger (optional)
}

const ManagedImage: React.FC<ManagedImageProps> = ({
  identifier,
  className = '',
  style = {},
  alt = '', // Default alt to empty string
  placeholderCategory = 'default',
  useSkeleton = true,
  skeletonClassName = 'bg-gray-200 animate-pulse', // Default skeleton style
  triggerLightbox // Optional explicit control
}) => {
  const [imageData, setImageData] = useState<SiteImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getImageByIdentifier(identifier);
        if (data) {
          setImageData(data);
        } else {
          setError(`Image not found for identifier: ${identifier}`);
          // Optionally set a default/placeholder image data here if needed
        }
      } catch (err) {
        console.error(`Error fetching managed image ${identifier}:`, err);
        setError('Failed to load image data.');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [identifier]); // Refetch if identifier changes

  const effectiveSrc = imageData?.src || getPlaceholderImage(placeholderCategory);
  const effectiveAlt = alt || imageData?.alt || identifier; // Fallback alt text
  const shouldEnableLightbox = triggerLightbox ?? (imageData?.enableLightbox ?? false);

  // --- Loading State ---
  if (loading) {
    if (useSkeleton) {
      // Basic skeleton loader (adjust dimensions as needed or via props)
      return (
        <div 
          className={`${skeletonClassName} ${className}`.trim()} 
          style={{ ...style, minHeight: '50px' }} // Ensure skeleton has some height
          aria-label="Loading image"
        ></div>
      );
    } else {
      // Simple spinner (optional)
      return (
        <div 
          className={`flex items-center justify-center ${className}`.trim()} 
          style={{ ...style, minHeight: '50px' }}
        >
          <LoadingSpinner size="sm" />
        </div>
      );
    }
  }

  // --- Error State ---
  if (error) {
    console.error(error);
    // Render placeholder on error, with a specific fallback for logo
    const fallbackSrc = identifier === 'common.header.logo' ? 'https://res.cloudinary.com/dos0qac90/image/upload/v1761593382/hariel-xavier-photography/MoStuff/faviconhx.png' : getPlaceholderImage(placeholderCategory);
    return (
      <img
        src={fallbackSrc}
        alt={`Error loading: ${identifier}`}
        className={className}
        style={style}
        aria-label={error} // Provide error context
      />
    );
  }

  // --- Success State (Image Found or Placeholder Fallback) ---
  const imgElement = (
    <img
      src={effectiveSrc}
      alt={effectiveAlt}
      width={imageData?.width} // Use fetched width if available
      height={imageData?.height} // Use fetched height if available
      className={className}
      style={style}
      data-image-id={identifier} // Add identifier for potential admin tools
      loading="lazy" // Basic lazy loading
    />
  );

  // If lightbox is enabled for this image, wrap with PhotoSwipe's Item
  if (shouldEnableLightbox) {
    return (
      <Item
        original={imageData?.src || getPlaceholderImage(placeholderCategory)} // Use original src for lightbox
        thumbnail={imageData?.src || getPlaceholderImage(placeholderCategory)} // Can optimize with actual thumbnail later
        width={imageData?.width || -1} // Provide dimensions if known, -1 lets PhotoSwipe figure it out
        height={imageData?.height || -1}
        alt={imageData?.alt || identifier}
      >
        {({ ref, open: openLightbox }) => (
          <div 
            ref={ref as React.Ref<HTMLDivElement>} // Cast ref type if needed
            onClick={openLightbox} 
            className={`${className} cursor-pointer`.trim()} // Add cursor pointer if lightbox enabled
            style={style}
          >
            {/* Render the actual image element inside */} 
            {imgElement}
          </div>
        )}
      </Item>
    );
  }

  // If lightbox is not enabled, just return the plain image element
  return imgElement;
};

export default ManagedImage;

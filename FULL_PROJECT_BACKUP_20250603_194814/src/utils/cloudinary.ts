/**
 * Cloudinary configuration and utility functions
 * This centralized approach ensures consistent image optimization across the site
 */
import { Cloudinary } from '@cloudinary/url-gen';
import { 
  scale, 
  fill, 
  crop, 
  thumbnail 
} from '@cloudinary/url-gen/actions/resize';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { face, faces } from '@cloudinary/url-gen/qualifiers/focusOn';

// Cloudinary credentials (match with existing account)
export const CLOUDINARY_CLOUD_NAME = 'dos0qac90';

// Initialize Cloudinary SDK
export const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME
  },
  url: {
    secure: true // Always use HTTPS
  }
});

/**
 * Transform image URLs for optimal delivery based on purpose
 * @param publicId The Cloudinary public ID of the image
 * @param type The type of image/purpose (determines optimization settings)
 * @param width Optional width to resize to
 * @param height Optional height to resize to
 * @returns Optimized Cloudinary URL
 */
export const getOptimizedUrl = (
  publicId: string,
  type: 'hero' | 'gallery' | 'thumbnail' | 'background' | 'portfolio',
  width?: number,
  height?: number
): string => {
  // Start with base image
  const image = cld.image(publicId);
  
  // Always apply these optimizations for all images
  image
    .format('auto') // Auto format (WebP if supported)
    .quality('auto'); // Auto quality based on network
  
  // Apply purpose-specific optimizations
  switch (type) {
    case 'hero':
      // Hero images (usually fullscreen or large)
      image.resize(fill()
        .width(width || 1920)
        .height(height || 1080)
        .gravity(focusOn(faces())) // Focus on faces for portraits
      );
      break;
      
    case 'gallery':
      // Gallery images (medium-sized, consistent dimensions)
      image.resize(crop()
        .width(width || 800)
        .height(height || 600)
        .gravity(focusOn(faces()))
      );
      break;
      
    case 'thumbnail':
      // Small thumbnails (e.g., for image grids)
      image.resize(thumbnail()
        .width(width || 300)
        .height(height || 300)
        .gravity(focusOn(face()))
      );
      break;
      
    case 'background':
      // Background images (usually large, may be blurred or overlaid)
      image.resize(fill()
        .width(width || 1920)
        .height(height || 1080)
      );
      break;
      
    case 'portfolio':
      // Portfolio images (high quality, variable sizes)
      if (width && height) {
        image.resize(fill()
          .width(width)
          .height(height)
          .gravity(focusOn(faces()))
        );
      } else if (width) {
        // If only width is provided, scale proportionally
        image.resize(scale()
          .width(width)
        );
      } else {
        // Default size if none provided
        image.resize(scale()
          .width(1200)
        );
      }
      break;
      
    default:
      // Default resizing behavior
      if (width && height) {
        image.resize(fill()
          .width(width)
          .height(height)
        );
      } else if (width) {
        image.resize(scale()
          .width(width)
        );
      }
  }
  
  return image.toURL();
};

/**
 * Convert a standard URL to a Cloudinary URL
 * Use this for migrating existing images to Cloudinary
 * @param url Regular image URL
 * @param type Optimization purpose
 * @param width Optional width
 * @param height Optional height
 * @returns Optimized Cloudinary URL or original if not applicable
 */
export const convertToCloudinaryUrl = (
  url: string,
  _type: 'hero' | 'gallery' | 'thumbnail' | 'background' | 'portfolio',
  _width?: number,
  _height?: number
): string => {
  if (!url) return '';
  
  // If already a Cloudinary URL, return as is
  if (url.includes('cloudinary.com')) {
    return url;
  }
  
  // For all other URLs, they would need to be uploaded to Cloudinary first
  // This would typically be done via a backend process
  // For now, just return the original URL
  return url;
};

/**
 * Generate responsive srcSet using Cloudinary
 * @param publicId Cloudinary public ID
 * @param type Image purpose
 * @param breakpoints Array of width breakpoints for srcSet
 * @returns Complete srcSet string
 */
export const generateSrcSet = (
  publicId: string,
  type: 'hero' | 'gallery' | 'thumbnail' | 'background' | 'portfolio',
  breakpoints: number[] = [320, 640, 768, 1024, 1280, 1536, 1920]
): string => {
  return breakpoints
    .map(width => `${getOptimizedUrl(publicId, type, width)} ${width}w`)
    .join(', ');
};

/**
 * Get blur placeholder URL for lazy loading
 * @param publicId Cloudinary public ID
 * @returns Low-quality placeholder image URL
 */
export const getBlurPlaceholder = (publicId: string): string => {
  const image = cld.image(publicId);
  
  image
    .format('auto')
    .quality('auto')
    .resize(thumbnail().width(10));
  
  return image.toURL();
};

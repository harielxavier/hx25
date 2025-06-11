/**
 * Cloudinary Configuration
 * 
 * This file contains the configuration for Cloudinary integration.
 * Cloudinary is used for optimized image delivery in conjunction with Firebase Storage.
 */

export const cloudinaryConfig = {
  cloudName: 'dos0qac90',
  apiKey: '732256417531588',
  apiSecret: 'yslulpTj48WkkNlTmjwNDg70Aw',
  uploadPreset: 'hariel_xavier_gallery',
  folder: 'gallery_images'
};

/**
 * Generate a Cloudinary URL from a Firebase Storage URL
 * 
 * @param firebaseUrl - Firebase Storage URL of the image
 * @param options - Transformation options
 * @returns Optimized Cloudinary URL
 */
export const getCloudinaryUrl = (
  firebaseUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    crop?: 'fill' | 'scale' | 'fit' | 'limit' | 'thumb' | 'crop';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    effect?: string;
    blur?: number;
    placeholder?: boolean;
  } = {}
): string => {
  if (!firebaseUrl) return '';
  
  // Extract the file path from Firebase URL
  const filePathMatch = firebaseUrl.match(/o\/(.+?)(\?|$)/);
  if (!filePathMatch) return firebaseUrl;
  
  const filePath = decodeURIComponent(filePathMatch[1]);
  
  // Build transformation string
  const transformations = [];
  
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.format) transformations.push(`f_${options.format}`);
  if (options.effect) transformations.push(`e_${options.effect}`);
  if (options.blur) transformations.push(`e_blur:${options.blur}`);
  
  // For placeholder images (very small, blurred)
  if (options.placeholder) {
    transformations.push('w_50,h_50,c_fill,e_blur:1000,q_auto:low');
  }
  
  const transformationString = transformations.length > 0 
    ? transformations.join(',') + '/'
    : '';
  
  // Construct Cloudinary URL
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/fetch/${transformationString}${encodeURIComponent(firebaseUrl)}`;
};

/**
 * Generate responsive image URLs for different screen sizes
 * 
 * @param firebaseUrl - Firebase Storage URL of the image
 * @returns Object with different sized image URLs
 */
export const getResponsiveImageUrls = (firebaseUrl: string): {
  original: string;
  large: string;
  medium: string;
  small: string;
  thumbnail: string;
  placeholder: string;
} => {
  return {
    original: firebaseUrl,
    large: getCloudinaryUrl(firebaseUrl, { width: 1920, quality: 80, format: 'auto' }),
    medium: getCloudinaryUrl(firebaseUrl, { width: 1200, quality: 80, format: 'auto' }),
    small: getCloudinaryUrl(firebaseUrl, { width: 800, quality: 80, format: 'auto' }),
    thumbnail: getCloudinaryUrl(firebaseUrl, { width: 400, height: 400, crop: 'fill', quality: 80, format: 'auto' }),
    placeholder: getCloudinaryUrl(firebaseUrl, { placeholder: true })
  };
};

export default {
  cloudinaryConfig,
  getCloudinaryUrl,
  getResponsiveImageUrls
};

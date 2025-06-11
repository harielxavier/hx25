/**
 * Image Optimization Utilities
 * 
 * This file contains utility functions for optimizing images using Cloudinary
 * in combination with Firebase Storage. These utilities help improve performance
 * and user experience by delivering appropriately sized and optimized images.
 */

import cloudinaryService from '../services/cloudinaryService';
import { getOptimizedImageUrls } from '../services/firebaseCloudinaryService';

/**
 * Transform any image URL to use Cloudinary for optimization
 * 
 * @param url - Original image URL (Firebase, local, or external)
 * @param width - Desired width (default: 800)
 * @param height - Desired height (default: 0 for auto)
 * @returns Optimized image URL
 */
export const transformImageUrl = (
  url: string,
  width: number = 800,
  height: number = 0
): string => {
  // Handle relative URLs (local images)
  if (url.startsWith('/')) {
    // For blog images, apply special optimization
    if (url.includes('/images/stock/blog/')) {
      return url; // Already optimized locally
    }
    
    // For other local images, return as is (already optimized)
    return url;
  }
  
  // For Firebase Storage URLs, use Cloudinary optimization
  if (url.includes('firebasestorage.googleapis.com')) {
    const transformations = height > 0 
      ? `w_${width},h_${height},c_fill,q_auto:good` 
      : `w_${width},c_limit,q_auto:good`;
    return cloudinaryService.getCloudinaryUrl(url, transformations);
  }
  
  // For external URLs, return as is
  return url;
};

/**
 * Generate a responsive image source set for different screen sizes
 * 
 * @param firebaseUrl - Firebase Storage URL of the image
 * @param widths - Array of widths to include in the srcset
 * @returns Srcset string for responsive images
 */
export const generateResponsiveSrcSet = (
  firebaseUrl: string,
  widths: number[] = [400, 800, 1200, 1600, 2000]
): string => {
  return cloudinaryService.getResponsiveSrcSet(firebaseUrl, widths);
};

/**
 * Generate image sizes attribute for responsive images
 * 
 * @param sizes - Array of size descriptors or a single string
 * @returns Sizes attribute string
 */
export const generateSizesAttribute = (
  sizes: string[] | string = [
    '(max-width: 640px) 100vw',
    '(max-width: 1024px) 50vw',
    '33vw'
  ]
): string => {
  if (typeof sizes === 'string') return sizes;
  return sizes.join(', ');
};

/**
 * Get optimized image URLs for different purposes
 * 
 * @param firebaseUrl - Firebase Storage URL of the image
 * @returns Object with different optimized URLs
 */
export const getOptimizedImageSet = (firebaseUrl: string) => {
  return getOptimizedImageUrls(firebaseUrl);
};

/**
 * Generate a blur placeholder URL for lazy loading
 * 
 * @param firebaseUrl - Firebase Storage URL of the image
 * @returns URL for a tiny blurred placeholder image
 */
export const getBlurPlaceholder = (firebaseUrl: string): string => {
  return cloudinaryService.getBlurPlaceholder(firebaseUrl);
};

/**
 * Generate a social media sharing image
 * 
 * @param firebaseUrl - Firebase Storage URL of the image
 * @returns URL optimized for social media sharing
 */
export const getSocialImage = (firebaseUrl: string): string => {
  return cloudinaryService.getSocialImage(firebaseUrl);
};

/**
 * Generate a watermarked version of an image
 * 
 * @param firebaseUrl - Firebase Storage URL of the image
 * @returns URL for a watermarked image
 */
export const getWatermarkedImage = (firebaseUrl: string): string => {
  return cloudinaryService.getWatermarkedImage(firebaseUrl);
};

/**
 * Calculate aspect ratio from image dimensions
 * 
 * @param width - Image width
 * @param height - Image height
 * @returns Aspect ratio as a number (height/width)
 */
export const calculateAspectRatio = (width: number, height: number): number => {
  return height / width;
};

/**
 * Get appropriate image dimensions based on device size
 * 
 * @param originalWidth - Original image width
 * @param originalHeight - Original image height
 * @param maxWidth - Maximum width constraint
 * @param maxHeight - Maximum height constraint
 * @returns Object with calculated width and height
 */
export const getResponsiveDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number = window.innerWidth,
  maxHeight: number = window.innerHeight
): { width: number; height: number } => {
  const aspectRatio = originalHeight / originalWidth;
  
  let width = originalWidth;
  let height = originalHeight;
  
  // Scale down if wider than maxWidth
  if (width > maxWidth) {
    width = maxWidth;
    height = width * aspectRatio;
  }
  
  // Scale down further if taller than maxHeight
  if (height > maxHeight) {
    height = maxHeight;
    width = height / aspectRatio;
  }
  
  return { width, height };
};

export default {
  generateResponsiveSrcSet,
  generateSizesAttribute,
  getOptimizedImageSet,
  getBlurPlaceholder,
  getSocialImage,
  getWatermarkedImage,
  calculateAspectRatio,
  getResponsiveDimensions,
  transformImageUrl
};

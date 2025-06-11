/**
 * Utility functions for image optimization and transformation
 * This can be extended to use Cloudinary or other image optimization services in the future
 */

/**
 * Transform image URL for optimal delivery
 * @param {string} url - Original image URL or path
 * @param {number} width - Desired width for the image
 * @param {Object} options - Additional options for transformations
 * @returns {string} - Transformed image URL
 */
export const transformImageUrl = (url, width = null, options = {}) => {
  // If url is null or undefined, return a placeholder
  if (!url) {
    return '/images/placeholder-image.jpg';
  }

  // Handle Cloudinary URLs when integrated
  if (url.includes('cloudinary.com')) {
    // Cloudinary transformation logic would go here
    // Example: return url.replace('/upload/', `/upload/w_${width},c_fill,q_auto,f_auto/`);
    return url;
  }

  // Handle Firebase Storage URLs
  if (url.includes('firebasestorage.googleapis.com') || url.includes('storage.googleapis.com')) {
    // Firebase image URL transformation logic would go here
    return url;
  }

  // For local images (like those in public directory)
  if (url.startsWith('/')) {
    // Just return the local path as is for now
    // In production, these would likely be served through a CDN with proper caching
    return url;
  }

  // For external URLs that we don't transform
  return url;
};

/**
 * Generate responsive image srcset
 * @param {string} url - Original image URL
 * @param {Array<number>} sizes - Array of widths to generate
 * @returns {string} - Generated srcset attribute
 */
export const generateSrcSet = (url, sizes = [400, 800, 1200, 1600]) => {
  return sizes.map(size => `${transformImageUrl(url, size)} ${size}w`).join(', ');
};

/**
 * Get blurred placeholder URL for lazy loading
 * @param {string} url - Original image URL
 * @returns {string} - URL for tiny blurred placeholder
 */
export const getBlurredPlaceholder = (url) => {
  if (!url) return null;
  return transformImageUrl(url, 20); // Tiny image that will be blurred with CSS
};

export default {
  transformImageUrl,
  generateSrcSet,
  getBlurredPlaceholder
};

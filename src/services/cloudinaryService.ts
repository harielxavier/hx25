/**
 * Cloudinary Integration Service
 * 
 * This service provides methods for working with Cloudinary as a CDN for images
 * stored in Firebase Storage. It handles URL transformations, optimization, and
 * delivery of images through Cloudinary's powerful image processing capabilities.
 */

// Define transformation presets
export enum CloudinaryPreset {
  THUMBNAIL = 'w_400,c_limit,q_auto:good',
  GALLERY = 'w_1200,c_limit,q_auto:good',
  MEDIUM = 'w_800,c_limit,q_auto:good',
  FULL = 'q_auto:good',
  WATERMARK = 'w_1200,c_limit,q_auto:good,l_watermark,o_50,g_south_east',
  SOCIAL = 'w_1200,h_630,c_fill,g_auto,q_auto:good',
  BLUR_PLACEHOLDER = 'w_50,e_blur:1000,q_30',
}

// Interface for Cloudinary configuration
interface CloudinaryConfig {
  cloudName: string;
  apiKey?: string;
  uploadPreset?: string;
  folder?: string;
}

// Default configuration - replace with your Cloudinary account details
const defaultConfig: CloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dos0qac90',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  uploadPreset: 'hariel-xavier-photography',
  folder: 'hariel-xavier-photography'
};

/**
 * Converts a Firebase Storage URL to a Cloudinary URL
 * This assumes you've set up Cloudinary to fetch from your Firebase Storage
 * 
 * @param firebaseUrl - The original Firebase Storage URL
 * @param transformations - Optional Cloudinary transformations
 * @param config - Optional Cloudinary configuration
 * @returns Cloudinary URL with transformations
 */
export const getCloudinaryUrl = (
  firebaseUrl: string,
  transformations: string | CloudinaryPreset = CloudinaryPreset.GALLERY,
  config: CloudinaryConfig = defaultConfig
): string => {
  try {
    // Ensure it's a valid URL before parsing
    if (!firebaseUrl || !firebaseUrl.startsWith('http')) {
      console.warn('getCloudinaryUrl received an invalid or non-HTTP URL:', firebaseUrl);
      // Optionally return a placeholder or throw an error
      return ''; // Or return a placeholder image URL
    }

    const url = new URL(firebaseUrl);
    const pathStartIndex = url.pathname.indexOf('/o/');

    if (pathStartIndex !== -1) {
      // Extract the path after '/o/'
      let objectPath = url.pathname.substring(pathStartIndex + 3); // +3 to skip '/o/'

      // Decode the URL-encoded path
      objectPath = decodeURIComponent(objectPath);

      // Remove potential query parameters from the path segment (like ?alt=media&token=...)
      const queryParamIndex = objectPath.indexOf('?');
      if (queryParamIndex !== -1) {
        objectPath = objectPath.substring(0, queryParamIndex);
      }

      if (objectPath) {
        // Construct the Cloudinary URL using the extracted path (upload mapping)
        // Ensure the folder path (if exists) ends with a slash
        const folderPrefix = config.folder ? `${config.folder}/` : '';
        console.log(`Using Cloudinary upload mapping for path: ${folderPrefix}${objectPath}`);
        return `https://res.cloudinary.com/${config.cloudName}/image/upload/${transformations}/${folderPrefix}${objectPath}`;
      }
    }

    // Fallback: If path extraction fails, use Cloudinary fetch mode
    console.warn(`Could not extract path from Firebase URL, using Cloudinary fetch mode for: ${firebaseUrl}`);
    const encodedUrl = encodeURIComponent(firebaseUrl);
    return `https://res.cloudinary.com/${config.cloudName}/image/fetch/${transformations}/${encodedUrl}`;

  } catch (error) {
    console.error(`Error processing URL in getCloudinaryUrl (${firebaseUrl}):`, error);

    // Fallback: If any error occurs during parsing, use Cloudinary fetch mode
    const encodedUrl = encodeURIComponent(firebaseUrl);
    return `https://res.cloudinary.com/${config.cloudName}/image/fetch/${transformations}/${encodedUrl}`;
  }
};

/**
 * Generates a responsive image srcset using Cloudinary
 * 
 * @param firebaseUrl - The original Firebase Storage URL
 * @param widths - Array of widths to include in the srcset
 * @param config - Optional Cloudinary configuration
 * @returns Srcset string for responsive images
 */
export const getResponsiveSrcSet = (
  firebaseUrl: string,
  widths: number[] = [400, 800, 1200, 1600, 2000],
  config: CloudinaryConfig = defaultConfig
): string => {
  return widths
    .map(width => {
      const transformations = `w_${width},c_limit,q_auto`;
      const url = getCloudinaryUrl(firebaseUrl, transformations, config);
      return `${url} ${width}w`;
    })
    .join(', ');
};

/**
 * Generates a blur placeholder image URL for lazy loading
 * 
 * @param firebaseUrl - The original Firebase Storage URL
 * @param config - Optional Cloudinary configuration
 * @returns URL for a tiny blurred placeholder image
 */
export const getBlurPlaceholder = (
  firebaseUrl: string,
  config: CloudinaryConfig = defaultConfig
): string => {
  return getCloudinaryUrl(firebaseUrl, CloudinaryPreset.BLUR_PLACEHOLDER, config);
};

/**
 * Generates a watermarked version of an image
 * 
 * @param firebaseUrl - The original Firebase Storage URL
 * @param config - Optional Cloudinary configuration
 * @returns URL for a watermarked image
 */
export const getWatermarkedImage = (
  firebaseUrl: string,
  config: CloudinaryConfig = defaultConfig
): string => {
  return getCloudinaryUrl(firebaseUrl, CloudinaryPreset.WATERMARK, config);
};

/**
 * Generates a social media sharing image
 * 
 * @param firebaseUrl - The original Firebase Storage URL
 * @param config - Optional Cloudinary configuration
 * @returns URL optimized for social media sharing
 */
export const getSocialImage = (
  firebaseUrl: string,
  config: CloudinaryConfig = defaultConfig
): string => {
  return getCloudinaryUrl(firebaseUrl, CloudinaryPreset.SOCIAL, config);
};

/**
 * Applies custom transformations to an image
 * 
 * @param firebaseUrl - The original Firebase Storage URL
 * @param transformations - Custom transformation string
 * @param config - Optional Cloudinary configuration
 * @returns URL with custom transformations
 */
export const applyCustomTransformations = (
  firebaseUrl: string,
  transformations: string,
  config: CloudinaryConfig = defaultConfig
): string => {
  return getCloudinaryUrl(firebaseUrl, transformations, config);
};

/**
 * Updates the Cloudinary configuration
 * 
 * @param newConfig - New configuration values
 * @returns Updated configuration
 */
export const updateCloudinaryConfig = (
  newConfig: Partial<CloudinaryConfig>
): CloudinaryConfig => {
  Object.assign(defaultConfig, newConfig);
  return { ...defaultConfig };
};

export default {
  getCloudinaryUrl,
  getResponsiveSrcSet,
  getBlurPlaceholder,
  getWatermarkedImage,
  getSocialImage,
  applyCustomTransformations,
  updateCloudinaryConfig,
  CloudinaryPreset
};

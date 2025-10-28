/**
 * Cloudinary URL Helper Functions
 *
 * Utilities for generating optimized Cloudinary URLs with various transformations
 */

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dos0qac90';
const CLOUD_NAME = 'dos0qac90';

interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'jpg' | 'png' | 'avif';
  crop?: 'fill' | 'fit' | 'scale' | 'pad' | 'crop';
  gravity?: 'auto' | 'center' | 'face' | 'faces';
  blur?: number;
  dpr?: number; // Device pixel ratio for retina displays
  effect?: string;
  aspectRatio?: string;
}

/**
 * Generate a Cloudinary transformation string from options
 */
export function buildTransformation(options: ImageTransformOptions): string {
  const transforms: string[] = [];

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.quality) transforms.push(`q_${options.quality}`);
  if (options.format) transforms.push(`f_${options.format}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.gravity) transforms.push(`g_${options.gravity}`);
  if (options.blur) transforms.push(`e_blur:${options.blur}`);
  if (options.dpr) transforms.push(`dpr_${options.dpr}`);
  if (options.effect) transforms.push(`e_${options.effect}`);
  if (options.aspectRatio) transforms.push(`ar_${options.aspectRatio}`);

  return transforms.join(',');
}

/**
 * Generate an optimized Cloudinary URL
 */
export function getCloudinaryUrl(
  publicId: string,
  options: ImageTransformOptions = {}
): string {
  const defaultOptions: ImageTransformOptions = {
    quality: 'auto',
    format: 'auto',
    ...options
  };

  const transformation = buildTransformation(defaultOptions);
  const uploadPath = transformation ? `/upload/${transformation}/` : '/upload/';

  // If it's already a full Cloudinary URL, replace the transformation
  if (publicId.includes('cloudinary.com')) {
    return publicId.replace('/upload/', uploadPath);
  }

  // Otherwise, build the full URL
  return `${CLOUDINARY_BASE_URL}${uploadPath}${publicId}`;
}

/**
 * Generate a blur placeholder URL
 */
export function getBlurPlaceholder(publicId: string): string {
  return getCloudinaryUrl(publicId, {
    width: 50,
    quality: 10,
    blur: 1000,
    format: 'auto'
  });
}

/**
 * Generate a responsive srcSet for multiple screen sizes
 */
export function generateSrcSet(
  publicId: string,
  baseWidth: number,
  options: ImageTransformOptions = {}
): string {
  const multipliers = [0.5, 0.75, 1, 1.5, 2]; // Different screen densities

  return multipliers
    .map(multiplier => {
      const width = Math.round(baseWidth * multiplier);
      const url = getCloudinaryUrl(publicId, { ...options, width });
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints: { maxWidth: number; size: string }[]): string {
  return breakpoints
    .map(bp => `(max-width: ${bp.maxWidth}px) ${bp.size}`)
    .join(', ');
}

/**
 * Get optimized thumbnail URL
 */
export function getThumbnailUrl(
  publicId: string,
  size: 'small' | 'medium' | 'large' = 'medium'
): string {
  const sizes = {
    small: { width: 150, height: 150 },
    medium: { width: 300, height: 300 },
    large: { width: 600, height: 600 }
  };

  return getCloudinaryUrl(publicId, {
    ...sizes[size],
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto'
  });
}

/**
 * Get hero image URL with optimizations
 */
export function getHeroImageUrl(publicId: string, width = 1920): string {
  return getCloudinaryUrl(publicId, {
    width,
    quality: 'auto',
    format: 'auto',
    dpr: 2.0, // Optimize for retina displays
    effect: 'sharpen:100' // Slight sharpening for hero images
  });
}

/**
 * Get gallery image URL with specific aspect ratio
 */
export function getGalleryImageUrl(
  publicId: string,
  width: number,
  aspectRatio = '4:3'
): string {
  return getCloudinaryUrl(publicId, {
    width,
    aspectRatio,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    format: 'auto'
  });
}

/**
 * Batch preload images for better performance
 */
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(url => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to preload ${url}`));
      });
    })
  );
}

/**
 * Check if a URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com') || url.includes(CLOUD_NAME);
}

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicId(url: string): string {
  if (!isCloudinaryUrl(url)) return url;

  const match = url.match(/upload\/(?:.*\/)?(.+)$/);
  return match ? match[1] : url;
}

export default {
  getCloudinaryUrl,
  getBlurPlaceholder,
  generateSrcSet,
  generateSizes,
  getThumbnailUrl,
  getHeroImageUrl,
  getGalleryImageUrl,
  preloadImages,
  isCloudinaryUrl,
  extractPublicId
};
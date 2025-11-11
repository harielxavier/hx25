/**
 * Simple Image Utility Functions
 * 
 * This file contains utility functions for working with images,
 * focusing on reliable local placeholders to prevent loading errors.
 */
// REMOVED FIREBASE: import { ref, uploadBytes, getDownloadURL // REMOVED FIREBASE
// REMOVED FIREBASE: import { storage } from '../firebase/config';

// Default placeholders for different types of content
export const PLACEHOLDERS = {
  DEFAULT: '/images/placeholders/default.jpg',
  WEDDING: '/images/stock/wedding/wedding-2.jpg',
  PORTRAIT: '/images/placeholders/default.jpg',
  FAMILY: '/images/placeholders/default.jpg',
  EVENT: '/images/placeholders/default.jpg',
  LANDSCAPE: '/images/placeholders/default.jpg',
};

/**
 * Get an image URL - simplified to use local placeholders
 * This prevents Firebase Storage loading errors
 * 
 * @param _imageUrlOrPath - The original image URL or Firebase path (ignored)
 * @param category - Optional category for specific placeholder
 * @returns Local placeholder image URL
 */
export const getOptimizedImageUrl = (
  _imageUrlOrPath: string,
  category?: string
): string => {
  // Always use local placeholders to prevent Firebase loading errors
  if (category === 'wedding') {
    return PLACEHOLDERS.WEDDING;
  } else if (category === 'portrait') {
    return PLACEHOLDERS.PORTRAIT;
  } else if (category === 'engagement') {
    return PLACEHOLDERS.DEFAULT;
  } else if (category === 'family') {
    return PLACEHOLDERS.FAMILY;
  } else if (category === 'commercial') {
    return PLACEHOLDERS.DEFAULT;
  } else if (category === 'event') {
    return PLACEHOLDERS.EVENT;
  } else if (category === 'landscape') {
    return PLACEHOLDERS.LANDSCAPE;
  }
  
  return PLACEHOLDERS.DEFAULT;
};

/**
 * Upload an image to Firebase Storage
 * 
 * @param file - The file to upload
 * @param path - The path in Firebase Storage
 * @returns Promise with the download URL
 */
export const uploadImageToFirebase = async (
  file: File,
  path: string
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image to Firebase:', error);
    throw error;
  }
};

/**
 * Upload a local image to Firebase Storage
 * 
 * @param localPath - The local path of the image
 * @param storagePath - The path in Firebase Storage
 * @returns Promise with the download URL
 */
export const uploadLocalImageToFirebase = async (
  localPath: string,
  storagePath: string
): Promise<string> => {
  try {
    // Fetch the local image
    const response = await fetch(localPath);
    const blob = await response.blob();
    const file = new File([blob], localPath.split('/').pop() || 'image.jpg', { type: blob.type });
    
    // Upload to Firebase
    return await uploadImageToFirebase(file, storagePath);
  } catch (error) {
    console.error('Error uploading local image to Firebase:', error);
    throw error;
  }
};

/**
 * Compress an image file to reduce size while maintaining quality
 * 
 * @param file - The original image file
 * @param options - Compression options
 * @returns Promise with the compressed file
 */
interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export const compressImage = async (
  file: File,
  options: CompressOptions = {}
): Promise<Blob> => {
  const { 
    maxWidth = 2000, 
    maxHeight = 2000, 
    quality = 0.8 
  } = options;
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with specified quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
};

/**
 * Generate a responsive image srcset using local placeholders
 * 
 * @param _imageUrl - The original image URL (ignored)
 * @returns Local placeholder URL
 */
export const getResponsiveSrcSet = (
  _imageUrl: string,
  category?: string
): string => {
  const placeholderUrl = getOptimizedImageUrl('', category);
  return `${placeholderUrl} 1200w`;
};

/**
 * Get a social media optimized version of an image
 * 
 * @param _imageUrl - The original image URL (ignored)
 * @returns Local placeholder URL
 */
export const getSocialImageUrl = (
  _imageUrl: string,
  category?: string
): string => {
  return getOptimizedImageUrl('', category);
};

/**
 * Get a watermarked version of an image
 * 
 * @param _imageUrl - The original image URL (ignored)
 * @returns Local placeholder URL
 */
export const getWatermarkedImageUrl = (
  _imageUrl: string,
  category?: string
): string => {
  return getOptimizedImageUrl('', category);
};

/**
 * Get a blur placeholder image URL
 * 
 * @param _imageUrl - The original image URL (ignored)
 * @returns URL for a placeholder image
 */
export const getBlurPlaceholderUrl = (
  _imageUrl: string,
  category?: string
): string => {
  return getOptimizedImageUrl('', category);
};

export default {
  getOptimizedImageUrl,
  getResponsiveSrcSet,
  getSocialImageUrl,
  getWatermarkedImageUrl,
  getBlurPlaceholderUrl,
  uploadImageToFirebase,
  uploadLocalImageToFirebase,
  compressImage,
  PLACEHOLDERS
};

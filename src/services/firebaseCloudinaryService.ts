/**
 * Firebase-Cloudinary Integration Service
 * 
 * This service provides a bridge between Firebase Storage and Cloudinary,
 * optimizing image delivery for client galleries and portfolio sections.
 */

import { storage } from '../firebase/config';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import cloudinaryService from './cloudinaryService';
import { CloudinaryPreset } from './cloudinaryService';

/**
 * Interface for upload progress tracking
 */
export interface UploadProgress {
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  url?: string;
  error?: any;
}

/**
 * Interface for image metadata
 */
export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  exif?: any;
}

/**
 * Upload an image to Firebase Storage and return Cloudinary-optimized URLs
 * 
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'galleries/gallery-id/image.jpg')
 * @param progressCallback - Optional callback for tracking upload progress
 * @returns Promise with optimized image URLs
 */
export const uploadImageWithOptimization = async (
  file: File,
  path: string,
  progressCallback?: (progress: UploadProgress) => void
): Promise<{
  originalUrl: string;
  thumbnailUrl: string;
  optimizedUrl: string;
  blurPlaceholder: string;
  responsiveSrcSet: string;
  metadata: ImageMetadata;
}> => {
  try {
    if (progressCallback) {
      progressCallback({ progress: 0, status: 'pending' });
    }

    // Create a storage reference
    const storageRef = ref(storage, path);
    
    // Upload the file with progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Track upload progress
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progressCallback) {
            progressCallback({ 
              progress, 
              status: 'uploading' 
            });
          }
        },
        (error) => {
          if (progressCallback) {
            progressCallback({ 
              progress: 0, 
              status: 'error',
              error 
            });
          }
          reject(error);
        },
        async () => {
          try {
            if (progressCallback) {
              progressCallback({ 
                progress: 100, 
                status: 'processing' 
              });
            }
            
            // Get the download URL from Firebase
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Generate optimized URLs using Cloudinary
            const optimizedUrl = cloudinaryService.getCloudinaryUrl(
              downloadUrl,
              CloudinaryPreset.GALLERY
            );
            
            const thumbnailUrl = cloudinaryService.getCloudinaryUrl(
              downloadUrl,
              CloudinaryPreset.THUMBNAIL
            );
            
            const blurPlaceholder = cloudinaryService.getBlurPlaceholder(downloadUrl);
            
            const responsiveSrcSet = cloudinaryService.getResponsiveSrcSet(
              downloadUrl,
              [400, 800, 1200, 1600, 2000]
            );
            
            // Extract basic metadata
            const metadata: ImageMetadata = {
              width: 0,
              height: 0,
              format: file.type.split('/')[1] || 'jpeg',
              size: file.size,
            };
            
            // If it's an image, try to get dimensions
            if (file.type.startsWith('image/')) {
              try {
                const img = new Image();
                img.src = URL.createObjectURL(file);
                await new Promise((resolve) => {
                  img.onload = () => {
                    metadata.width = img.width;
                    metadata.height = img.height;
                    URL.revokeObjectURL(img.src);
                    resolve(null);
                  };
                });
              } catch (error) {
                console.warn('Could not extract image dimensions:', error);
              }
            }
            
            if (progressCallback) {
              progressCallback({ 
                progress: 100, 
                status: 'complete',
                url: optimizedUrl
              });
            }
            
            resolve({
              originalUrl: downloadUrl,
              thumbnailUrl,
              optimizedUrl,
              blurPlaceholder,
              responsiveSrcSet,
              metadata
            });
          } catch (error) {
            if (progressCallback) {
              progressCallback({ 
                progress: 0, 
                status: 'error',
                error 
              });
            }
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error uploading image with optimization:', error);
    if (progressCallback) {
      progressCallback({ 
        progress: 0, 
        status: 'error',
        error 
      });
    }
    throw error;
  }
};

/**
 * Get optimized image URLs for an existing Firebase Storage URL
 * 
 * @param firebaseUrl - The Firebase Storage URL
 * @returns Optimized image URLs
 */
export const getOptimizedImageUrls = (firebaseUrl: string) => {
  return {
    originalUrl: firebaseUrl,
    thumbnailUrl: cloudinaryService.getCloudinaryUrl(
      firebaseUrl,
      CloudinaryPreset.THUMBNAIL
    ),
    optimizedUrl: cloudinaryService.getCloudinaryUrl(
      firebaseUrl,
      CloudinaryPreset.GALLERY
    ),
    blurPlaceholder: cloudinaryService.getBlurPlaceholder(firebaseUrl),
    responsiveSrcSet: cloudinaryService.getResponsiveSrcSet(
      firebaseUrl,
      [400, 800, 1200, 1600, 2000]
    )
  };
};

/**
 * Batch optimize existing Firebase Storage URLs
 * 
 * @param firebaseUrls - Array of Firebase Storage URLs
 * @returns Array of optimized image URLs
 */
export const batchOptimizeImages = (firebaseUrls: string[]) => {
  return firebaseUrls.map(url => getOptimizedImageUrls(url));
};

export default {
  uploadImageWithOptimization,
  getOptimizedImageUrls,
  batchOptimizeImages
};

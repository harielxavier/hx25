/**
 * Featured Image Service
 * 
 * This service handles image uploads specifically for featured galleries,
 * ensuring they are optimized, public, and follow a professional workflow.
 * It integrates with Firebase Storage for storage and Cloudinary for optimized delivery.
 */

import { 
  ref, 
  uploadBytes, 
  getDownloadURL
} from 'firebase/storage';
import { storage } from '../firebase/config';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { CloudinaryPreset } from './cloudinaryService';

// Interface for upload options
export interface FeaturedImageUploadOptions {
  file: File;
  path: string;
  coupleName?: string;
  venue?: string;
  location?: string;
  isPublic?: boolean;
  generateSocialImages?: boolean;
  metadata?: Record<string, string>;
}

// Interface for upload result
export interface FeaturedImageUploadResult {
  success: boolean;
  firebaseUrl: string;
  cloudinaryId: string;
  thumbnailUrl?: string;
  socialImageUrl?: string;
  metadata: {
    fileName: string;
    fileSize: number;
    fileType: string;
    width?: number;
    height?: number;
    uploadDate: string;
    coupleName?: string;
    weddingDate?: string;
    venue?: string;
    location?: string;
    isPublic: boolean;
  };
  error?: string;
}

/**
 * Upload a featured image to Firebase Storage and register with Cloudinary
 */
export const uploadFeaturedImage = async (
  options: FeaturedImageUploadOptions
): Promise<FeaturedImageUploadResult> => {
  try {
    // Ensure we have a file to upload
    if (!options.file) {
      throw new Error('No file provided for upload');
    }
    
    // Extract file information
    const fileName = options.file.name;
    
    // Ensure we have a valid path
    const path = options.path || `featured/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    // Default isPublic to true for featured images
    const isPublic = options.isPublic !== undefined ? options.isPublic : true;
    
    console.log(`Uploading featured image: ${fileName}`);
    
    // Upload to Firebase Storage first
    console.log('Uploading image to Firebase Storage:', path);
    const storageRef = ref(storage, path);
    const uploadResult = await uploadBytes(storageRef, options.file, {
      contentType: options.file.type,
      customMetadata: {
        coupleName: options.coupleName || '',
        weddingDate: '',
        venue: options.venue || '',
        location: options.location || '',
        isPublic: isPublic.toString(),
        uploadDate: new Date().toISOString(),
        uploadType: 'featured'
      }
    });
    
    // Get the download URL from Firebase
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    console.log('Firebase download URL:', downloadUrl);
    
    // Upload to Cloudinary for optimization
    // This is just registering the image with Cloudinary, not uploading the bytes again
    const cloudinaryId = await uploadToCloudinary(downloadUrl, path);
    console.log('Cloudinary ID:', cloudinaryId);
    
    // Get image dimensions if available
    let width, height;
    try {
      const img = new Image();
      img.src = URL.createObjectURL(options.file);
      await new Promise((resolve) => {
        img.onload = () => {
          width = img.width;
          height = img.height;
          URL.revokeObjectURL(img.src);
          resolve(null);
        };
      });
    } catch (error) {
      console.warn('Could not determine image dimensions:', error);
    }
    
    // Return the result with all necessary information
    return {
      success: true,
      firebaseUrl: downloadUrl,
      cloudinaryId: cloudinaryId,
      thumbnailUrl: getOptimizedImageUrl(downloadUrl, CloudinaryPreset.THUMBNAIL),
      socialImageUrl: options.generateSocialImages ? getOptimizedImageUrl(downloadUrl, CloudinaryPreset.SOCIAL) : undefined,
      metadata: {
        fileName,
        fileSize: options.file.size,
        fileType: options.file.type,
        width,
        height,
        uploadDate: new Date().toISOString(),
        coupleName: options.coupleName,
        weddingDate: '',
        venue: options.venue,
        location: options.location,
        isPublic: isPublic
      }
    };
  } catch (error) {
    console.error('Error uploading featured image:', error);
    return {
      success: false,
      firebaseUrl: '',
      cloudinaryId: '',
      metadata: {
        fileName: '',
        fileSize: 0,
        fileType: '',
        uploadDate: new Date().toISOString(),
        isPublic: false
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Upload an image to Cloudinary from a URL
 */
const uploadToCloudinary = async (url: string, path: string): Promise<string> => {
  try {
    // Extract a useful public_id from the path
    const pathWithoutExtension = path.substring(0, path.lastIndexOf('.')) || path;
    
    // Configure Cloudinary upload
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    
    // Log the Cloudinary upload attempt
    console.log('Registering image with Cloudinary:', {
      cloudName,
      publicId: pathWithoutExtension,
      url
    });
    
    // For security reasons, we're not doing a direct upload from the frontend
    // Instead, we're just returning the path to use as the Cloudinary ID
    // In a real implementation, you would use a secure backend endpoint to handle this
    
    // Return the path as the Cloudinary ID
    return pathWithoutExtension;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Get a Cloudinary-optimized URL for a featured image
 * 
 * @param imageUrl The Firebase URL or Cloudinary ID of the image
 * @param preset The preset to use for transformations
 * @returns The optimized image URL
 */
export const getFeaturedImageUrl = (
  imageUrl: string,
  preset: CloudinaryPreset = CloudinaryPreset.GALLERY
): string => {
  if (!imageUrl) return '';
  return getOptimizedImageUrl(imageUrl, preset);
};

export default {
  uploadFeaturedImage,
  getFeaturedImageUrl
};

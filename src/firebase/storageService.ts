import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll, getMetadata, updateMetadata } from 'firebase/storage';
import { storage } from './config';
import { nanoid } from 'nanoid';

// Interface for upload progress tracking
export interface UploadProgress {
  progress: number;
  downloadUrl: string | null;
  error: Error | null;
  state: 'running' | 'paused' | 'success' | 'error' | 'canceled';
}

// Interface for storage item metadata
export interface StorageItemMetadata {
  name: string;
  fullPath: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
  md5Hash?: string;
  customMetadata?: Record<string, string>;
}

/**
 * Upload a file to Firebase Storage with progress tracking
 * @param file - The file to upload
 * @param path - The storage path (without filename)
 * @param metadata - Optional metadata for the file
 * @param progressCallback - Optional callback for tracking upload progress
 * @returns Promise with the download URL
 */
export const uploadFile = async (
  file: File,
  path: string,
  metadata?: { [key: string]: any },
  progressCallback?: (progress: UploadProgress) => void
): Promise<string> => {
  // Generate a unique filename to prevent collisions
  const fileExtension = file.name.split('.').pop();
  const uniqueFilename = `${nanoid()}.${fileExtension}`;
  const fullPath = `${path}/${uniqueFilename}`;
  
  // Create storage reference
  const storageRef = ref(storage, fullPath);
  
  // Prepare metadata
  const fileMetadata = {
    contentType: file.type,
    customMetadata: {
      originalFilename: file.name,
      ...metadata?.customMetadata
    },
    ...metadata
  };
  
  return new Promise((resolve, reject) => {
    // Start upload
    const uploadTask = uploadBytesResumable(storageRef, file, fileMetadata);
    
    // Set up progress tracking
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progressCallback) {
          progressCallback({
            progress,
            downloadUrl: null,
            error: null,
            state: snapshot.state
          });
        }
      },
      (error) => {
        // Handle errors
        if (progressCallback) {
          progressCallback({
            progress: 0,
            downloadUrl: null,
            error,
            state: 'error'
          });
        }
        reject(error);
      },
      async () => {
        // Upload completed successfully
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          if (progressCallback) {
            progressCallback({
              progress: 100,
              downloadUrl,
              error: null,
              state: 'success'
            });
          }
          resolve(downloadUrl);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

/**
 * Get the download URL for a file in Firebase Storage
 * @param path - The full path to the file
 * @returns Promise with the download URL
 */
export const getFileUrl = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
};

/**
 * Delete a file from Firebase Storage
 * @param path - The full path to the file
 * @returns Promise that resolves when the file is deleted
 */
export const deleteFile = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path);
  return deleteObject(storageRef);
};

/**
 * List all files in a directory
 * @param path - The directory path
 * @returns Promise with an array of file references
 */
export const listFiles = async (path: string) => {
  const storageRef = ref(storage, path);
  const result = await listAll(storageRef);
  return result.items;
};

/**
 * Get metadata for a file
 * @param path - The full path to the file
 * @returns Promise with the file metadata
 */
export const getFileMetadata = async (path: string): Promise<StorageItemMetadata> => {
  const storageRef = ref(storage, path);
  const metadata = await getMetadata(storageRef);
  return {
    name: metadata.name,
    fullPath: metadata.fullPath,
    size: metadata.size,
    contentType: metadata.contentType || '',
    timeCreated: metadata.timeCreated,
    updated: metadata.updated,
    md5Hash: metadata.md5Hash,
    customMetadata: metadata.customMetadata
  };
};

/**
 * Update metadata for a file
 * @param path - The full path to the file
 * @param metadata - The metadata to update
 * @returns Promise with the updated metadata
 */
export const updateFileMetadata = async (
  path: string, 
  metadata: { [key: string]: any }
): Promise<StorageItemMetadata> => {
  const storageRef = ref(storage, path);
  const updatedMetadata = await updateMetadata(storageRef, metadata);
  return {
    name: updatedMetadata.name,
    fullPath: updatedMetadata.fullPath,
    size: updatedMetadata.size,
    contentType: updatedMetadata.contentType || '',
    timeCreated: updatedMetadata.timeCreated,
    updated: updatedMetadata.updated,
    md5Hash: updatedMetadata.md5Hash,
    customMetadata: updatedMetadata.customMetadata
  };
};

/**
 * Generate a signed URL for temporary access
 * This requires Firebase Functions to implement properly
 * @param path - The full path to the file
 * @param expirationHours - Hours until the URL expires
 * @returns Promise with the signed URL
 */
export const generateSignedUrl = async (
  path: string, 
  expirationHours: number = 24
): Promise<string> => {
  // This is a placeholder - in a real implementation, you would call a Firebase Function
  // that uses the admin SDK to generate a signed URL
  
  // For now, we'll just return the regular download URL with expiration info in console
  console.log(`Generated URL would expire in ${expirationHours} hours`);
  return getFileUrl(path);
};

/**
 * Helper function to organize storage paths
 * @param type - The type of content (e.g., 'galleries', 'profiles', 'blog')
 * @param id - The ID of the parent resource
 * @param subtype - Optional subtype (e.g., 'thumbnails', 'originals')
 * @returns Formatted storage path
 */
export const getStoragePath = (
  type: string,
  id: string,
  subtype?: string
): string => {
  if (subtype) {
    return `${type}/${id}/${subtype}`;
  }
  return `${type}/${id}`;
};

/**
 * Get the gallery storage path
 * @param galleryId - The gallery ID
 * @param subtype - Optional subtype (e.g., 'thumbnails', 'originals')
 * @returns Formatted gallery storage path
 */
export const getGalleryStoragePath = (
  galleryId: string,
  subtype?: string
): string => {
  return getStoragePath('galleries', galleryId, subtype);
};

/**
 * Get the client storage path
 * @param clientId - The client ID
 * @param subtype - Optional subtype (e.g., 'selections', 'downloads')
 * @returns Formatted client storage path
 */
export const getClientStoragePath = (
  clientId: string,
  subtype?: string
): string => {
  return getStoragePath('clients', clientId, subtype);
};

export default {
  uploadFile,
  getFileUrl,
  deleteFile,
  listFiles,
  getFileMetadata,
  updateFileMetadata,
  generateSignedUrl,
  getStoragePath,
  getGalleryStoragePath,
  getClientStoragePath
};

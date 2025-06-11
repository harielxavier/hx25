// Firebase Storage service
import { storage } from './firebase';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata,
  updateMetadata,
  UploadMetadata,
  FullMetadata,
  StorageReference,
  UploadResult
} from 'firebase/storage';

// Default storage paths
const STORAGE_PATHS = {
  GALLERIES: 'galleries',
  BLOG: 'blog',
  PROFILE: 'profile',
  TEMP: 'temp'
};

/**
 * Upload a file to Firebase Storage
 * @param path Path in storage (e.g., 'galleries/gallery-id/image.jpg')
 * @param file File to upload
 * @param metadata Optional metadata for the file
 * @returns Promise with upload result and download URL
 */
export const uploadFile = async (
  path: string,
  file: File | Blob,
  metadata?: UploadMetadata
): Promise<{ result: UploadResult; url: string }> => {
  try {
    // Create a storage reference
    const storageRef = ref(storage, path);
    
    // Default metadata with content type
    const defaultMetadata: UploadMetadata = {
      contentType: file instanceof File ? file.type : 'application/octet-stream',
      customMetadata: {
        originalName: file instanceof File ? file.name : path.split('/').pop() || 'file',
        uploadedAt: new Date().toISOString()
      }
    };
    
    // Merge default metadata with provided metadata
    const finalMetadata = metadata ? { ...defaultMetadata, ...metadata } : defaultMetadata;
    
    // Upload file
    const result = await uploadBytes(storageRef, file, finalMetadata);
    
    // Get download URL
    const url = await getDownloadURL(storageRef);
    
    return { result, url };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * @param path Path to the file
 * @returns Promise<boolean> indicating success
 */
export const deleteFile = async (path: string): Promise<boolean> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Delete a folder and all its contents from Firebase Storage
 * @param path Path to the folder
 * @returns Promise with count of deleted files
 */
export const deleteFolder = async (path: string): Promise<number> => {
  try {
    const folderRef = ref(storage, path);
    const listResult = await listAll(folderRef);
    
    let deletedCount = 0;
    
    // Delete all files in the folder
    for (const item of listResult.items) {
      await deleteObject(item);
      deletedCount++;
    }
    
    // Recursively delete all subfolders
    for (const prefix of listResult.prefixes) {
      const subFolderCount = await deleteFolder(prefix.fullPath);
      deletedCount += subFolderCount;
    }
    
    return deletedCount;
  } catch (error) {
    console.error(`Error deleting folder ${path}:`, error);
    throw error;
  }
};

/**
 * Get metadata for a file
 * @param path Path to the file
 * @returns Promise with file metadata
 */
export const getFileMetadata = async (path: string): Promise<FullMetadata> => {
  try {
    const storageRef = ref(storage, path);
    return await getMetadata(storageRef);
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw error;
  }
};

/**
 * List all files in a folder
 * @param path Path to the folder
 * @returns Promise with storage references to all files
 */
export const listFiles = async (path: string): Promise<StorageReference[]> => {
  try {
    const folderRef = ref(storage, path);
    const listResult = await listAll(folderRef);
    return listResult.items;
  } catch (error) {
    console.error(`Error listing files in ${path}:`, error);
    throw error;
  }
};

/**
 * Get download URLs for all files in a folder
 * @param path Path to the folder
 * @returns Promise with array of {ref, url} objects
 */
export const getDownloadURLsForFolder = async (
  path: string
): Promise<Array<{ ref: StorageReference; url: string }>> => {
  try {
    const files = await listFiles(path);
    const results = await Promise.all(
      files.map(async (fileRef) => {
        const url = await getDownloadURL(fileRef);
        return { ref: fileRef, url };
      })
    );
    return results;
  } catch (error) {
    console.error(`Error getting download URLs for folder ${path}:`, error);
    throw error;
  }
};

/**
 * Generate a unique filename with timestamp
 * @param originalName Original filename
 * @returns Unique filename
 */
export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const safeFileName = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
  return `${timestamp}_${safeFileName}`;
};

/**
 * Get Firebase Storage path for a gallery image
 * @param galleryId Gallery ID
 * @param filename Filename
 * @returns Full storage path
 */
export const getGalleryImagePath = (galleryId: string, filename: string): string => {
  return `${STORAGE_PATHS.GALLERIES}/${galleryId}/${filename}`;
};

/**
 * Get Firebase Storage path for a blog image
 * @param blogId Blog post ID
 * @param filename Filename
 * @returns Full storage path
 */
export const getBlogImagePath = (blogId: string, filename: string): string => {
  return `${STORAGE_PATHS.BLOG}/${blogId}/${filename}`;
};

export const storageService = {
  uploadFile,
  deleteFile,
  deleteFolder,
  getFileMetadata,
  listFiles,
  getDownloadURLsForFolder,
  generateUniqueFilename,
  getGalleryImagePath,
  getBlogImagePath,
  STORAGE_PATHS
};

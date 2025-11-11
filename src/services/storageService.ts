// Comprehensive Firebase Storage service
// REMOVED FIREBASE: import { getStorage // REMOVED FIREBASE
// REMOVED FIREBASE: imports

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
    const storage = getStorage();
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
 * Upload an image with thumbnail generation
 * @param file Image file to upload
 * @param basePath Base path in storage (e.g., 'galleries/gallery-id')
 * @param filename Filename to use (without path)
 * @param metadata Optional metadata
 * @returns Promise with URLs for both original and thumbnail
 */
export const uploadImageWithThumbnail = async (
  file: File,
  basePath: string,
  filename: string,
  metadata?: UploadMetadata
): Promise<{ imageUrl: string; thumbnailUrl: string }> => {
  try {
    // Upload original image
    const imagePath = `${basePath}/${filename}`;
    const { url: imageUrl } = await uploadFile(imagePath, file, metadata);
    
    // Create thumbnail reference
    const thumbnailFilename = `thumb_${filename}`;
    const thumbnailPath = `${basePath}/${thumbnailFilename}`;
    
    try {
      // Create thumbnail blob (this function would need to be implemented)
      const thumbnailBlob = await createThumbnail(file, 400);
      
      // Upload thumbnail
      const thumbnailMetadata: UploadMetadata = {
        contentType: 'image/jpeg',
        customMetadata: {
          originalName: file.name,
          isThumbnail: 'true',
          originalPath: imagePath
        }
      };
      
      const { url: thumbnailUrl } = await uploadFile(
        thumbnailPath,
        new File([thumbnailBlob], thumbnailFilename, { type: 'image/jpeg' }),
        thumbnailMetadata
      );
      
      return { imageUrl, thumbnailUrl };
    } catch (thumbnailError) {
      console.warn('Failed to create thumbnail, using original image:', thumbnailError);
      return { imageUrl, thumbnailUrl: imageUrl };
    }
  } catch (error) {
    console.error('Error uploading image with thumbnail:', error);
    throw error;
  }
};

/**
 * Upload an image and return its download URL
 * @param file Image file to upload
 * @param path Path in storage (e.g., 'venues/venue-image.jpg')
 * @returns Promise with the download URL
 */
export const uploadImage = async (
  file: File,
  path: string
): Promise<string> => {
  try {
    const { url } = await uploadFile(path, file);
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Create a thumbnail from an image file
 * @param file Original image file
 * @param maxWidth Maximum width for the thumbnail
 * @returns Promise with thumbnail as Blob
 */
export const createThumbnail = async (file: File, maxWidth: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Calculate new dimensions
        const aspectRatio = img.height / img.width;
        const width = Math.min(maxWidth, img.width);
        const height = Math.round(width * aspectRatio);
        
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
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create thumbnail blob'));
            }
          },
          'image/jpeg',
          0.85 // Quality
        );
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for thumbnail creation'));
    };
    
    // Load image from file
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Delete a file from Firebase Storage
 * @param path Path to the file
 * @returns Promise<boolean> indicating success
 */
export const deleteFile = async (path: string): Promise<boolean> => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return true;
  } catch (error: any) {
    // Handle object-not-found errors gracefully
    if (error.code === 'storage/object-not-found') {
      console.log(`File not found: ${path} (already deleted or never existed)`);
      // Return true since the end goal (file not existing) is achieved
      return true;
    } else {
      console.error(`Error deleting file: ${path}`, error);
      return false;
    }
  }
};

/**
 * Delete a folder and all its contents from Firebase Storage
 * @param path Path to the folder
 * @returns Promise with count of deleted files
 */
export const deleteFolder = async (path: string): Promise<number> => {
  try {
    const storage = getStorage();
    const folderRef = ref(storage, path);
    const listResult = await listAll(folderRef);
    
    let deletedCount = 0;
    
    // Delete all files in the folder
    for (const item of listResult.items) {
      try {
        await deleteObject(item);
        deletedCount++;
      } catch (error: any) {
        // Handle object-not-found errors gracefully
        if (error.code === 'storage/object-not-found') {
          console.log(`File not found: ${item.fullPath} (already deleted or never existed)`);
          // Still count it as "processed"
          deletedCount++;
        } else {
          console.error(`Error deleting file ${item.fullPath}:`, error);
        }
      }
    }
    
    // Recursively delete all subfolders
    for (const prefix of listResult.prefixes) {
      try {
        const subFolderCount = await deleteFolder(prefix.fullPath);
        deletedCount += subFolderCount;
      } catch (error) {
        console.error(`Error deleting subfolder ${prefix.fullPath}:`, error);
      }
    }
    
    return deletedCount;
  } catch (error: any) {
    // Handle object-not-found errors for the folder itself
    if (error.code === 'storage/object-not-found') {
      console.log(`Folder not found: ${path} (already deleted or never existed)`);
      return 0;
    } else {
      console.error(`Error deleting folder ${path}:`, error);
      throw error;
    }
  }
};

/**
 * Get metadata for a file
 * @param path Path to the file
 * @returns Promise with file metadata
 */
export const getFileMetadata = async (path: string): Promise<FullMetadata> => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    return await getMetadata(storageRef);
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw error;
  }
};

/**
 * Update metadata for a file
 * @param path Path to the file
 * @param metadata Metadata to update
 * @returns Promise with updated metadata
 */
export const updateFileMetadata = async (
  path: string,
  metadata: UploadMetadata
): Promise<FullMetadata> => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    return await updateMetadata(storageRef, metadata);
  } catch (error) {
    console.error('Error updating file metadata:', error);
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
    const storage = getStorage();
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

export default {
  uploadFile,
  uploadImageWithThumbnail,
  uploadImage,
  deleteFile,
  deleteFolder,
  getFileMetadata,
  updateFileMetadata,
  listFiles,
  getDownloadURLsForFolder,
  generateUniqueFilename,
  getGalleryImagePath,
  getBlogImagePath,
  STORAGE_PATHS
};

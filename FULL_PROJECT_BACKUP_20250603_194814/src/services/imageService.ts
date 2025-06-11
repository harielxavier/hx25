// Image service to handle Firebase Storage operations with fallbacks
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from '../firebase/config';
import { 
  doc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  limit,
  Timestamp,
  DocumentData
} from 'firebase/firestore';

// --- New Interface for Site-Wide Images ---
export interface SiteImageData {
  id: string; // Firestore document ID
  identifier: string;
  description?: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  enableLightbox: boolean;
  updatedAt?: Timestamp;
}

const siteImagesCollection = collection(db, 'site_images');
// --- End New Interface ---

// Default placeholder images for different categories
const DEFAULT_PLACEHOLDERS = {
  wedding: '/images/placeholders/wedding.jpg',
  portrait: '/images/placeholders/portrait.jpg',
  landscape: '/images/placeholders/landscape.jpg',
  default: '/images/placeholders/default.jpg'
};

// Interface for image upload options
interface UploadOptions {
  galleryId: string;
  file: File;
  metadata?: {
    title?: string;
    description?: string;
    featured?: boolean;
    order?: number;
    tags?: string[];
  };
}

// Interface for image URL result
interface ImageUrlResult {
  url: string;
  success: boolean;
  fromStorage: boolean;
  error?: string;
}

/**
 * Upload an image to Firebase Storage
 * @param options Upload options including gallery ID, file, and metadata
 * @returns Promise with the download URL
 */
export const uploadImage = async (options: UploadOptions): Promise<string> => {
  try {
    console.log(`Uploading image to gallery ${options.galleryId}:`, options.file.name);
    
    // Create a storage reference
    const storageRef = ref(storage, `galleries/${options.galleryId}/${options.file.name}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, options.file);
    console.log('Image uploaded successfully:', snapshot.metadata.name);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Download URL:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Delete an image from Firebase Storage
 * @param galleryId Gallery ID
 * @param filename Filename to delete
 * @returns Promise<boolean> indicating success
 */
export const deleteImage = async (galleryId: string, filename: string): Promise<boolean> => {
  try {
    console.log(`Deleting image ${filename} from gallery ${galleryId}`);
    
    // Create a storage reference
    const storageRef = ref(storage, `galleries/${galleryId}/${filename}`);
    
    // Delete the file
    await deleteObject(storageRef);
    console.log('Image deleted successfully');
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

/**
 * Get an image URL with fallback to placeholder if needed
 * @param url The original image URL
 * @param category Optional category for specific placeholder
 * @returns Promise with the image URL result
 */
export const getImageUrl = async (url: string, category?: string): Promise<ImageUrlResult> => {
  // If URL is empty or undefined, return placeholder immediately
  if (!url) {
    const placeholder = getPlaceholderImage(category);
    return {
      url: placeholder,
      success: false,
      fromStorage: false,
      error: 'No URL provided'
    };
  }
  
  try {
    // Check if the URL is accessible
    const response = await fetch(url, { method: 'HEAD' });
    
    if (response.ok) {
      return {
        url,
        success: true,
        fromStorage: true
      };
    } else {
      console.warn(`Image URL returned status ${response.status}:`, url);
      return {
        url: getPlaceholderImage(category),
        success: false,
        fromStorage: false,
        error: `HTTP error: ${response.status}`
      };
    }
  } catch (error) {
    console.error('Error checking image URL:', error);
    return {
      url: getPlaceholderImage(category),
      success: false,
      fromStorage: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get a placeholder image based on category
 * @param category Optional category
 * @returns Placeholder image URL
 */
export const getPlaceholderImage = (category?: string): string => {
  if (!category) return DEFAULT_PLACEHOLDERS.default;
  
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('wedding')) return DEFAULT_PLACEHOLDERS.wedding;
  if (lowerCategory.includes('portrait')) return DEFAULT_PLACEHOLDERS.portrait;
  if (lowerCategory.includes('landscape')) return DEFAULT_PLACEHOLDERS.landscape;
  
  return DEFAULT_PLACEHOLDERS.default;
};

/**
 * Update gallery cover image
 * @param galleryId Gallery ID
 * @param imageUrl New cover image URL
 * @returns Promise<boolean> indicating success
 */
export const updateGalleryCoverImage = async (galleryId: string, imageUrl: string): Promise<boolean> => {
  try {
    const galleryRef = doc(db, 'galleries', galleryId);
    await updateDoc(galleryRef, {
      coverImage: imageUrl,
      thumbnailImage: imageUrl
    });
    
    console.log(`Updated gallery ${galleryId} cover image:`, imageUrl);
    return true;
  } catch (error) {
    console.error('Error updating gallery cover image:', error);
    return false;
  }
};

/**
 * Create placeholder directories and images
 * This should be called on app initialization
 */
export const ensurePlaceholderImages = (): void => {
  // Create placeholder directories in public folder if they don't exist
  // This would be done on the server side in a real application
  console.log('Ensuring placeholder images are available');
  
  // In a real implementation, we would check if the files exist and create them if needed
  // For now, we'll just log a message
  console.log('Placeholder images should be placed in the public/images/placeholders directory');
};

// --- New Function for Site-Wide Images ---
/**
 * Fetches a single site image document by its unique identifier.
 * @param identifier - The unique identifier string (e.g., 'homepage.hero.background').
 * @returns The image data object or null if not found.
 */
export const getImageByIdentifier = async (identifier: string): Promise<SiteImageData | null> => {
  if (!identifier) {
    console.error('getImageByIdentifier called with no identifier.');
    return null;
  }

  try {
    const q = query(
      siteImagesCollection, 
      where('identifier', '==', identifier), 
      limit(1) 
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(`No site image found with identifier: ${identifier}`);
      // Optionally, return a default placeholder or specific error object here
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data() as DocumentData; // Cast to allow access

    // Construct the full object including the document ID
    const imageData: SiteImageData = {
      id: doc.id,
      identifier: data.identifier,
      description: data.description,
      src: data.src,
      alt: data.alt,
      width: data.width,
      height: data.height,
      enableLightbox: data.enableLightbox ?? false, // Default to false if undefined
      updatedAt: data.updatedAt,
    };

    return imageData;

  } catch (error) {
    console.error(`Error fetching site image with identifier ${identifier}:`, error);
    // Optionally, return a default placeholder or specific error object here
    return null;
  }
};
// --- End New Function ---

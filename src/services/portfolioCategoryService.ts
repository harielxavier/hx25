import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  orderBy,
  serverTimestamp,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import storageService from '../firebase/storageService';
import cloudinaryService from './cloudinaryService';

// Portfolio Category interface
export interface PortfolioCategory {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  order: number;
  featured: boolean;
  slug: string;
  imageCount?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Portfolio Image interface
export interface PortfolioImage {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  featured: boolean;
  order: number;
  dateCreated: Timestamp;
  tags: string[];
  metadata?: {
    camera?: string;
    lens?: string;
    location?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: number;
    focalLength?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Collection references
const portfolioCategoriesRef = collection(db, 'portfolios');

/**
 * Get all portfolio categories
 * @returns Array of portfolio categories
 */
export const getPortfolioCategories = async (): Promise<PortfolioCategory[]> => {
  try {
    const q = query(
      portfolioCategoriesRef, 
      orderBy('order', 'asc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PortfolioCategory));
  } catch (error) {
    console.error('Error getting portfolio categories:', error);
    return [];
  }
};

/**
 * Get featured portfolio categories
 * @param limit Maximum number of categories to return
 * @returns Array of featured portfolio categories
 */
export const getFeaturedPortfolioCategories = async (limitCount = 6): Promise<PortfolioCategory[]> => {
  try {
    const q = query(
      portfolioCategoriesRef, 
      where('featured', '==', true),
      orderBy('order', 'asc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PortfolioCategory));
  } catch (error) {
    console.error('Error getting featured portfolio categories:', error);
    return [];
  }
};

/**
 * Get a portfolio category by ID
 * @param categoryId Category ID
 * @returns Portfolio category or null
 */
export const getPortfolioCategory = async (categoryId: string): Promise<PortfolioCategory | null> => {
  try {
    const docRef = doc(portfolioCategoriesRef, categoryId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as PortfolioCategory;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting portfolio category:', error);
    return null;
  }
};

/**
 * Get a portfolio category by slug
 * @param slug Category slug
 * @returns Portfolio category or null
 */
export const getPortfolioCategoryBySlug = async (slug: string): Promise<PortfolioCategory | null> => {
  try {
    const q = query(
      portfolioCategoriesRef, 
      where('slug', '==', slug),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as PortfolioCategory;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting portfolio category by slug:', error);
    return null;
  }
};

/**
 * Create a portfolio category
 * @param category Category data
 * @returns Category ID
 */
export const createPortfolioCategory = async (
  category: Omit<PortfolioCategory, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(portfolioCategoriesRef, {
      ...category,
      imageCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating portfolio category:', error);
    throw error;
  }
};

/**
 * Update a portfolio category
 * @param categoryId Category ID
 * @param data Category data to update
 */
export const updatePortfolioCategory = async (
  categoryId: string,
  data: Partial<Omit<PortfolioCategory, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const docRef = doc(portfolioCategoriesRef, categoryId);
    
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating portfolio category:', error);
    throw error;
  }
};

/**
 * Delete a portfolio category
 * @param categoryId Category ID
 */
export const deletePortfolioCategory = async (categoryId: string): Promise<void> => {
  try {
    // Get all images in this category
    const images = await getPortfolioImages(categoryId);
    
    // Delete all images first
    for (const image of images) {
      await deletePortfolioImage(categoryId, image.id);
    }
    
    // Delete the category document
    const docRef = doc(portfolioCategoriesRef, categoryId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting portfolio category:', error);
    throw error;
  }
};

/**
 * Get all images in a portfolio category
 * @param categoryId Category ID
 * @returns Array of portfolio images
 */
export const getPortfolioImages = async (categoryId: string): Promise<PortfolioImage[]> => {
  try {
    const imagesRef = collection(db, 'portfolios', categoryId, 'images');
    const q = query(imagesRef, orderBy('order', 'asc'));
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PortfolioImage));
  } catch (error) {
    console.error('Error getting portfolio images:', error);
    return [];
  }
};

/**
 * Get featured images in a portfolio category
 * @param categoryId Category ID
 * @param limitCount Maximum number of images to return
 * @returns Array of featured portfolio images
 */
export const getFeaturedPortfolioImages = async (
  categoryId: string,
  limitCount = 8
): Promise<PortfolioImage[]> => {
  try {
    const imagesRef = collection(db, 'portfolios', categoryId, 'images');
    const q = query(
      imagesRef, 
      where('featured', '==', true),
      orderBy('order', 'asc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PortfolioImage));
  } catch (error) {
    console.error('Error getting featured portfolio images:', error);
    return [];
  }
};

/**
 * Get a portfolio image by ID
 * @param categoryId Category ID
 * @param imageId Image ID
 * @returns Portfolio image or null
 */
export const getPortfolioImage = async (
  categoryId: string,
  imageId: string
): Promise<PortfolioImage | null> => {
  try {
    const docRef = doc(db, 'portfolios', categoryId, 'images', imageId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as PortfolioImage;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting portfolio image:', error);
    return null;
  }
};

/**
 * Upload an image to a portfolio category
 * @param categoryId Category ID
 * @param file Image file
 * @param metadata Image metadata
 * @returns Image ID
 */
export const uploadPortfolioImage = async (
  categoryId: string,
  file: File,
  metadata: Partial<PortfolioImage>
): Promise<string> => {
  try {
    // Upload the image to Firebase Storage
    const path = `portfolios/${categoryId}`;
    const imageUrl = await storageService.uploadFile(file, path);
    
    // Get image dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise(resolve => {
      img.onload = resolve;
    });
    
    // Create the image document in Firestore
    const imagesRef = collection(db, 'portfolios', categoryId, 'images');
    
    // Get current image count to set order
    const q = query(imagesRef);
    const snapshot = await getDocs(q);
    const order = snapshot.size + 1;
    
    // Create the image document
    const docRef = await addDoc(imagesRef, {
      title: metadata.title || file.name.split('.')[0],
      description: metadata.description || '',
      imagePath: imageUrl,
      thumbnailUrl: cloudinaryService.getCloudinaryUrl(
        imageUrl,
        cloudinaryService.CloudinaryPreset.THUMBNAIL
      ),
      width: img.width,
      height: img.height,
      featured: metadata.featured || false,
      order: metadata.order || order,
      dateCreated: metadata.dateCreated || serverTimestamp(),
      tags: metadata.tags || [],
      metadata: metadata.metadata || {
        camera: '',
        lens: '',
        location: '',
        aperture: '',
        shutterSpeed: '',
        iso: 0,
        focalLength: ''
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Update the category's image count
    const categoryRef = doc(portfolioCategoriesRef, categoryId);
    await updateDoc(categoryRef, {
      imageCount: snapshot.size + 1,
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error uploading portfolio image:', error);
    throw error;
  }
};

/**
 * Update a portfolio image
 * @param categoryId Category ID
 * @param imageId Image ID
 * @param data Image data to update
 */
export const updatePortfolioImage = async (
  categoryId: string,
  imageId: string,
  data: Partial<Omit<PortfolioImage, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const docRef = doc(db, 'portfolios', categoryId, 'images', imageId);
    
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating portfolio image:', error);
    throw error;
  }
};

/**
 * Delete a portfolio image
 * @param categoryId Category ID
 * @param imageId Image ID
 */
export const deletePortfolioImage = async (
  categoryId: string,
  imageId: string
): Promise<void> => {
  try {
    // Get the image document to get the storage path
    const imageDoc = await getPortfolioImage(categoryId, imageId);
    
    if (imageDoc && imageDoc.imagePath) {
      // Extract the storage path from the URL
      // This assumes the URL is a Firebase Storage URL
      try {
        const url = new URL(imageDoc.imagePath);
        const path = decodeURIComponent(url.pathname.split('/o/')[1]);
        
        // Delete the image from Firebase Storage
        await storageService.deleteFile(path);
      } catch (error) {
        console.error('Error parsing image URL:', error);
      }
    }
    
    // Delete the image document
    const docRef = doc(db, 'portfolios', categoryId, 'images', imageId);
    await deleteDoc(docRef);
    
    // Update the category's image count
    const imagesRef = collection(db, 'portfolios', categoryId, 'images');
    const q = query(imagesRef);
    const snapshot = await getDocs(q);
    
    const categoryRef = doc(portfolioCategoriesRef, categoryId);
    await updateDoc(categoryRef, {
      imageCount: snapshot.size,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error deleting portfolio image:', error);
    throw error;
  }
};

/**
 * Get portfolio images by tag
 * @param categoryId Category ID
 * @param tag Tag to filter by
 * @returns Array of portfolio images with the specified tag
 */
export const getPortfolioImagesByTag = async (
  categoryId: string,
  tag: string
): Promise<PortfolioImage[]> => {
  try {
    const imagesRef = collection(db, 'portfolios', categoryId, 'images');
    const q = query(
      imagesRef, 
      where('tags', 'array-contains', tag),
      orderBy('order', 'asc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PortfolioImage));
  } catch (error) {
    console.error('Error getting portfolio images by tag:', error);
    return [];
  }
};

/**
 * Generate a slug from a title
 * @param title Title to convert to slug
 * @returns URL-friendly slug
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

/**
 * Create sample portfolio categories and images (for testing)
 */
export const createSamplePortfolio = async (): Promise<void> => {
  try {
    // Create wedding category
    const weddingId = await createPortfolioCategory({
      title: 'Wedding Photography',
      description: 'Capturing special moments on your big day',
      coverImage: '/sample-images/wedding-cover.jpg',
      order: 1,
      featured: true,
      slug: 'wedding-photography'
    });
    
    // Create portrait category
    const portraitId = await createPortfolioCategory({
      title: 'Portrait Photography',
      description: 'Professional portraits for individuals and families',
      coverImage: '/sample-images/portrait-cover.jpg',
      order: 2,
      featured: true,
      slug: 'portrait-photography'
    });
    
    // Create event category
    const eventId = await createPortfolioCategory({
      title: 'Event Photography',
      description: 'Corporate events, parties, and special occasions',
      coverImage: '/sample-images/event-cover.jpg',
      order: 3,
      featured: false,
      slug: 'event-photography'
    });
    
    console.log('Created sample portfolio categories');
  } catch (error) {
    console.error('Error creating sample portfolio:', error);
  }
};

export default {
  getPortfolioCategories,
  getFeaturedPortfolioCategories,
  getPortfolioCategory,
  getPortfolioCategoryBySlug,
  createPortfolioCategory,
  updatePortfolioCategory,
  deletePortfolioCategory,
  getPortfolioImages,
  getFeaturedPortfolioImages,
  getPortfolioImage,
  uploadPortfolioImage,
  updatePortfolioImage,
  deletePortfolioImage,
  getPortfolioImagesByTag,
  generateSlug,
  createSamplePortfolio
};

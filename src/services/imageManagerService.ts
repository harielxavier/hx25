import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { guaranteedStorage as storage, guaranteedDb as db } from '../firebase/config';

// Image metadata interface
export interface ImageMetadata {
  id?: string;
  name: string;
  path?: string;
  url: string;
  thumbnailUrl?: string;
  size?: number;
  type?: string;
  width?: number;
  height?: number;
  createdAt?: Date;
  updatedAt?: Date;
  category?: string;
  tags?: string[];
  pageAssignments?: string[];
  isPublic?: boolean;
  customMetadata?: Record<string, any>;
  description?: string;
  alt?: string;
}

// Page zone interface
export interface PageZone {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  imageId?: string;
  pagePath?: string;
  selector?: string;
  settings?: {
    width?: string;
    height?: string;
    objectFit?: string;
    objectPosition?: string;
  };
  createdAt?: any;
  updatedAt?: any;
}

// Upload an image to Firebase Storage and save metadata to Firestore
export const uploadImage = async (
  file: File,
  metadata: Partial<ImageMetadata> = {},
  onProgress?: (progress: number) => void
): Promise<ImageMetadata> => {
  try {
    // Create a storage reference
    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    
    // Upload the file
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Return a promise that resolves with the download URL when complete
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          // Handle upload errors
          reject(error);
        },
        async () => {
          // Upload completed successfully, get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Create metadata object
          const imageData: ImageMetadata = {
            name: file.name,
            url: downloadURL,
            size: file.size,
            type: file.type,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...metadata
          };
          
          // Save metadata to Firestore
          const docRef = await addDoc(collection(db, 'images'), {
            ...imageData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          
          // Return the complete image metadata with ID
          resolve({
            ...imageData,
            id: docRef.id
          });
        }
      );
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Get all images, optionally filtered by category and/or tags
export const getImages = async (
  category?: string,
  tags?: string[]
): Promise<ImageMetadata[]> => {
  try {
    let q = query(collection(db, 'images'), orderBy('createdAt', 'desc'));
    
    if (category) {
      q = query(collection(db, 'images'), where('category', '==', category), orderBy('createdAt', 'desc'));
    }
    
    // Note: Firestore doesn't support array-contains-any with other filters
    // For complex filtering, we'll filter tags in memory
    
    const querySnapshot = await getDocs(q);
    const images: ImageMetadata[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as any;
      const imageData: ImageMetadata = {
        id: doc.id,
        name: data.name,
        url: data.url,
        thumbnailUrl: data.thumbnailUrl,
        size: data.size,
        type: data.type,
        width: data.width,
        height: data.height,
        category: data.category,
        tags: data.tags || [],
        description: data.description,
        alt: data.alt
      };
      
      // Convert timestamps to Date objects
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        imageData.createdAt = data.createdAt.toDate();
      }
      
      if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
        imageData.updatedAt = data.updatedAt.toDate();
      }
      
      // Filter by tags if specified
      if (tags && tags.length > 0) {
        if (!imageData.tags || !tags.some(tag => imageData.tags?.includes(tag))) {
          return;
        }
      }
      
      images.push(imageData);
    });
    
    return images;
  } catch (error) {
    console.error('Error getting images:', error);
    throw error;
  }
};

// Get a single image by ID
export const getImageById = async (id: string): Promise<ImageMetadata | null> => {
  try {
    const docRef = doc(db, 'images', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as any;
      const imageData: ImageMetadata = {
        id: docSnap.id,
        name: data.name,
        url: data.url,
        thumbnailUrl: data.thumbnailUrl,
        size: data.size,
        type: data.type,
        width: data.width,
        height: data.height,
        category: data.category,
        tags: data.tags || [],
        description: data.description,
        alt: data.alt
      };
      
      // Convert timestamps to Date objects
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        imageData.createdAt = data.createdAt.toDate();
      }
      
      if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
        imageData.updatedAt = data.updatedAt.toDate();
      }
      
      return imageData;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting image:', error);
    throw error;
  }
};

// Update image metadata
export const updateImageMetadata = async (
  id: string, 
  updates: Partial<ImageMetadata>
): Promise<ImageMetadata> => {
  try {
    const docRef = doc(db, 'images', id);
    
    // Add updated timestamp
    updates.updatedAt = new Date();
    
    await updateDoc(docRef, updates);
    
    // Get the updated document
    const updatedDoc = await getDoc(docRef);
    
    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    } as ImageMetadata;
  } catch (error) {
    console.error('Error updating image metadata:', error);
    throw error;
  }
};

// Delete an image and its metadata
export const deleteImage = async (id: string): Promise<void> => {
  try {
    // Get the image metadata first
    const imageData = await getImageById(id);
    
    if (!imageData) {
      throw new Error('Image not found');
    }
    
    // Delete from Firebase Storage
    const storageRef = ref(storage, imageData.path);
    await deleteObject(storageRef);
    
    // Delete metadata from Firestore
    const docRef = doc(db, 'images', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Get all available categories
export const getCategories = async (): Promise<string[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'images'));
    const categories = new Set<string>();
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.category) {
        categories.add(data.category);
      }
    });
    
    return Array.from(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get all available tags
export const getTags = async (): Promise<string[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'images'));
    const tags = new Set<string>();
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.tags && Array.isArray(data.tags)) {
        data.tags.forEach((tag: string) => tags.add(tag));
      }
    });
    
    return Array.from(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

// Get page zones
export const getPageZones = async (pagePath: string): Promise<PageZone[]> => {
  try {
    const zonesCollection = collection(db, 'pageZones');
    const q = query(
      zonesCollection,
      where('pagePath', '==', pagePath)
    );
    
    const querySnapshot = await getDocs(q);
    const zones: PageZone[] = [];
    
    querySnapshot.forEach((doc) => {
      zones.push({
        ...doc.data() as PageZone,
        id: doc.id
      });
    });
    
    return zones;
  } catch (error) {
    console.error('Error getting page zones:', error);
    throw error;
  }
};

// Assign an image to a zone
export const assignImageToZone = async (
  zoneId: string,
  imageId: string,
  settings?: PageZone['settings']
): Promise<void> => {
  try {
    const zoneRef = doc(db, 'pageZones', zoneId);
    const imageData = await getImageById(imageId);
    
    if (!imageData) {
      throw new Error('Image not found');
    }
    
    await updateDoc(zoneRef, {
      imageId,
      imageUrl: imageData.url,
      settings: settings || {},
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error assigning image to zone:', error);
    throw error;
  }
};

// Remove an image from a zone
export const removeImageFromZone = async (zoneId: string): Promise<void> => {
  try {
    const zoneRef = doc(db, 'pageZones', zoneId);
    
    await updateDoc(zoneRef, {
      imageId: null,
      imageUrl: null,
      settings: {},
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error removing image from zone:', error);
    throw error;
  }
};

// Define or update a page zone
export const definePageZone = async (zone: PageZone): Promise<string> => {
  try {
    if (zone.id) {
      // Update existing zone
      const zoneRef = doc(db, 'pageZones', zone.id);
      await updateDoc(zoneRef, {
        ...zone,
        updatedAt: new Date()
      });
      return zone.id;
    } else {
      // Create new zone
      const docRef = await addDoc(collection(db, 'pageZones'), {
        ...zone,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error defining page zone:', error);
    throw error;
  }
};

// Update a page zone
export const updatePageZone = async (
  id: string, 
  updates: Partial<PageZone>
): Promise<PageZone> => {
  try {
    const docRef = doc(db, 'pageZones', id);
    
    await updateDoc(docRef, updates);
    
    // Get the updated document
    const updatedDoc = await getDoc(docRef);
    
    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    } as PageZone;
  } catch (error) {
    console.error('Error updating page zone:', error);
    throw error;
  }
};

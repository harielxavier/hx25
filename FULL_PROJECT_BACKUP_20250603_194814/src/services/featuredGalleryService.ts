import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface FeaturedGallery {
  id: string;
  galleryId: string;
  title: string;
  description: string;
  imageUrl: string;
  position: 'left' | 'middle' | 'right' | string;
  linkUrl: string;
  displayOrder: number;
  coupleName?: string;
  venue?: string;
  location?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Get featured galleries for the landing page and portfolio
export const getFeaturedGalleries = async (): Promise<FeaturedGallery[]> => {
  try {
    // First try to get from the featuredGalleries collection
    const featuredRef = collection(db, 'featuredGalleries');
    const featuredQuery = query(featuredRef, orderBy('displayOrder', 'asc'));
    
    const snapshot = await getDocs(featuredQuery);
    
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FeaturedGallery));
    }
    
    // Fallback: Get from galleries collection where featured = true
    const galleriesRef = collection(db, 'galleries');
    
    try {
      const q = query(
        galleriesRef, 
        where('featured', '==', true),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          galleryId: doc.id,
          title: data.title || '',
          description: data.description || '',
          imageUrl: data.coverImage || data.thumbnailImage || '',
          position: data.position || 'left',
          linkUrl: `/gallery/${data.slug || doc.id}`,
          displayOrder: data.sortOrder || 0,
          coupleName: data.clientName || data.title || '',
          venue: data.venue || 'Beautiful Venue',
          location: data.location || 'New Jersey',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as FeaturedGallery;
      });
    } catch (error) {
      console.error('Error getting featured galleries with composite index:', error);
      
      // Try without the isPublic filter if the composite index fails
      const simpleQuery = query(
        galleriesRef, 
        where('featured', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const simpleSnapshot = await getDocs(simpleQuery);
      
      return simpleSnapshot.docs
        .filter(doc => doc.data().isPublic === true)
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            galleryId: doc.id,
            title: data.title || '',
            description: data.description || '',
            imageUrl: data.coverImage || data.thumbnailImage || '',
            position: data.position || 'left',
            linkUrl: `/gallery/${data.slug || doc.id}`,
            displayOrder: data.sortOrder || 0,
            coupleName: data.clientName || data.title || '',
            venue: data.venue || 'Beautiful Venue',
            location: data.location || 'New Jersey',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          } as FeaturedGallery;
        });
    }
  } catch (error) {
    console.error('Error getting featured galleries:', error);
    return [];
  }
};

// Update a featured gallery
export const updateFeaturedGallery = async (
  galleryId: string, 
  data: Partial<FeaturedGallery>
): Promise<void> => {
  try {
    const galleryRef = doc(db, 'featuredGalleries', galleryId);
    await getDoc(galleryRef); // Check if exists
    
    // Update with timestamp
    await getDoc(galleryRef);
  } catch (error) {
    console.error('Error updating featured gallery:', error);
    throw error;
  }
};

// Get a single featured gallery by ID
export const getFeaturedGallery = async (
  galleryId: string
): Promise<FeaturedGallery | null> => {
  try {
    const galleryRef = doc(db, 'featuredGalleries', galleryId);
    const gallerySnap = await getDoc(galleryRef);
    
    if (gallerySnap.exists()) {
      return {
        id: gallerySnap.id,
        ...gallerySnap.data()
      } as FeaturedGallery;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting featured gallery:', error);
    return null;
  }
};

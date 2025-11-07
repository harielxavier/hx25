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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { VenueCategory, Venue } from '../types/portfolio';

// Collection references
const venueCategoriesRef = collection(db, 'venueCategories');
const venuesRef = collection(db, 'venues');

// Get all venue categories
export const getVenueCategories = async (): Promise<VenueCategory[]> => {
  try {
    const q = query(venueCategoriesRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as VenueCategory));
  } catch (error) {
    console.error('Error getting venue categories:', error);
    return [];
  }
};

// Get a single venue category by ID
export const getVenueCategory = async (id: string): Promise<VenueCategory | null> => {
  try {
    const docRef = doc(venueCategoriesRef, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as VenueCategory;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting venue category:', error);
    return null;
  }
};

// Create a new venue category
export const createVenueCategory = async (category: Omit<VenueCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(venueCategoriesRef, {
      ...category,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating venue category:', error);
    throw error;
  }
};

// Update a venue category
export const updateVenueCategory = async (id: string, data: Partial<Omit<VenueCategory, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    const docRef = doc(venueCategoriesRef, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating venue category:', error);
    throw error;
  }
};

// Delete a venue category
export const deleteVenueCategory = async (id: string): Promise<void> => {
  try {
    const docRef = doc(venueCategoriesRef, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting venue category:', error);
    throw error;
  }
};

// Get all venues
export const getVenues = async (): Promise<Venue[]> => {
  try {
    const q = query(venuesRef, orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Venue));
  } catch (error) {
    console.error('Error getting venues:', error);
    return [];
  }
};

// Get venues by category
export const getVenuesByCategory = async (categoryId: string): Promise<Venue[]> => {
  try {
    const q = query(
      venuesRef, 
      where('categoryId', '==', categoryId),
      orderBy('name', 'asc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Venue));
  } catch (error) {
    console.error('Error getting venues by category:', error);
    return [];
  }
};

// Get featured venues
export const getFeaturedVenues = async (): Promise<Venue[]> => {
  try {
    const q = query(
      venuesRef, 
      where('featured', '==', true),
      orderBy('name', 'asc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Venue));
  } catch (error) {
    console.error('Error getting featured venues:', error);
    return [];
  }
};

// Get a single venue by ID
export const getVenue = async (id: string): Promise<Venue | null> => {
  try {
    const docRef = doc(venuesRef, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as Venue;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting venue:', error);
    return null;
  }
};

// Create a new venue
export const createVenue = async (venue: Omit<Venue, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(venuesRef, {
      ...venue,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating venue:', error);
    throw error;
  }
};

// Update a venue
export const updateVenue = async (id: string, data: Partial<Omit<Venue, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    const docRef = doc(venuesRef, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating venue:', error);
    throw error;
  }
};

// Delete a venue
export const deleteVenue = async (id: string): Promise<void> => {
  try {
    const docRef = doc(venuesRef, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting venue:', error);
    throw error;
  }
};

// Create sample venue categories and venues (for testing)
export const createSampleVenueData = async (): Promise<void> => {
  try {
    // Create venue categories
    const luxuryCategory = await createVenueCategory({
      name: 'Luxury Ballrooms',
      description: 'Elegant and grand venues for spectacular weddings',
      order: 1
    });
    
    const gardenCategory = await createVenueCategory({
      name: 'Garden & Estate Venues',
      description: 'Beautiful outdoor settings with natural charm',
      order: 2
    });
    
    const beachCategory = await createVenueCategory({
      name: 'Beachfront & Waterfront',
      description: 'Stunning venues with water views',
      order: 3
    });
    
    const historicCategory = await createVenueCategory({
      name: 'Historic Venues',
      description: 'Venues with rich history and character',
      order: 4
    });
    
    // Create venues
    await createVenue({
      name: 'The Legacy Castle',
      location: 'Pompton Plains, NJ',
      categoryId: luxuryCategory,
      thumbnailImage: 'https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600,h_400,c_fill/v1/venues/legacy-castle.jpg',
      gallerySlug: 'smith-wedding',
      featured: true
    });
    
    await createVenue({
      name: 'The Palace',
      location: 'Somerset, NJ',
      categoryId: luxuryCategory,
      thumbnailImage: 'https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600,h_400,c_fill/v1/venues/the-palace.jpg',
      gallerySlug: 'johnson-wedding',
      featured: true
    });
    
    await createVenue({
      name: 'Park Chateau',
      location: 'East Brunswick, NJ',
      categoryId: gardenCategory,
      thumbnailImage: 'https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600,h_400,c_fill/v1/venues/park-chateau.jpg',
      gallerySlug: 'williams-wedding',
      featured: true
    });
    
    await createVenue({
      name: 'Ocean Place Resort',
      location: 'Long Branch, NJ',
      categoryId: beachCategory,
      thumbnailImage: 'https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600,h_400,c_fill/v1/venues/ocean-place.jpg',
      gallerySlug: 'beach-wedding',
      featured: false
    });
    
    await createVenue({
      name: 'The Ashford Estate',
      location: 'Allentown, NJ',
      categoryId: historicCategory,
      thumbnailImage: 'https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600,h_400,c_fill/v1/venues/ashford-estate.jpg',
      gallerySlug: 'historic-wedding',
      featured: true
    });
    
    console.log('Sample venue data created successfully');
  } catch (error) {
    console.error('Error creating sample venue data:', error);
    throw error;
  }
};

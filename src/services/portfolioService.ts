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
import { PortfolioFilter, FilterType } from '../types/portfolio';

// Collection reference
const filtersRef = collection(db, 'portfolioFilters');

// Get all portfolio filters
export const getPortfolioFilters = async (): Promise<PortfolioFilter[]> => {
  try {
    const q = query(filtersRef, orderBy('type'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as PortfolioFilter));
  } catch (error) {
    console.error('Error getting portfolio filters:', error);
    return [];
  }
};

// Get portfolio filters by type
export const getFiltersByType = async (type: FilterType): Promise<PortfolioFilter[]> => {
  try {
    const q = query(
      filtersRef, 
      where('type', '==', type),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as PortfolioFilter));
  } catch (error) {
    console.error(`Error getting ${type} filters:`, error);
    return [];
  }
};

// Get a single filter by ID
export const getPortfolioFilter = async (id: string): Promise<PortfolioFilter | null> => {
  try {
    const docRef = doc(filtersRef, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as PortfolioFilter;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting portfolio filter:', error);
    return null;
  }
};

// Create a new portfolio filter
export const createPortfolioFilter = async (filter: Omit<PortfolioFilter, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(filtersRef, {
      ...filter,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating portfolio filter:', error);
    throw error;
  }
};

// Update a portfolio filter
export const updatePortfolioFilter = async (id: string, data: Partial<Omit<PortfolioFilter, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    const docRef = doc(filtersRef, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating portfolio filter:', error);
    throw error;
  }
};

// Delete a portfolio filter
export const deletePortfolioFilter = async (id: string): Promise<void> => {
  try {
    const docRef = doc(filtersRef, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting portfolio filter:', error);
    throw error;
  }
};

// Create sample portfolio filters (for testing)
export const createSampleFilters = async (): Promise<void> => {
  try {
    // Style filters
    await createPortfolioFilter({
      name: 'Classic',
      type: FilterType.STYLE,
      order: 1
    });
    
    await createPortfolioFilter({
      name: 'Modern',
      type: FilterType.STYLE,
      order: 2
    });
    
    await createPortfolioFilter({
      name: 'Artistic',
      type: FilterType.STYLE,
      order: 3
    });
    
    await createPortfolioFilter({
      name: 'Photojournalistic',
      type: FilterType.STYLE,
      order: 4
    });
    
    // Event type filters
    await createPortfolioFilter({
      name: 'Wedding',
      type: FilterType.EVENT_TYPE,
      order: 1
    });
    
    await createPortfolioFilter({
      name: 'Engagement',
      type: FilterType.EVENT_TYPE,
      order: 2
    });
    
    await createPortfolioFilter({
      name: 'Family',
      type: FilterType.EVENT_TYPE,
      order: 3
    });
    
    await createPortfolioFilter({
      name: 'Corporate',
      type: FilterType.EVENT_TYPE,
      order: 4
    });
    
    // Environment filters
    await createPortfolioFilter({
      name: 'Indoor',
      type: FilterType.ENVIRONMENT,
      order: 1
    });
    
    await createPortfolioFilter({
      name: 'Outdoor',
      type: FilterType.ENVIRONMENT,
      order: 2
    });
    
    await createPortfolioFilter({
      name: 'Urban',
      type: FilterType.ENVIRONMENT,
      order: 3
    });
    
    await createPortfolioFilter({
      name: 'Beach',
      type: FilterType.ENVIRONMENT,
      order: 4
    });
    
    // Season filters
    await createPortfolioFilter({
      name: 'Spring',
      type: FilterType.SEASON,
      order: 1
    });
    
    await createPortfolioFilter({
      name: 'Summer',
      type: FilterType.SEASON,
      order: 2
    });
    
    await createPortfolioFilter({
      name: 'Fall',
      type: FilterType.SEASON,
      order: 3
    });
    
    await createPortfolioFilter({
      name: 'Winter',
      type: FilterType.SEASON,
      order: 4
    });
    
    console.log('Sample portfolio filters created successfully');
  } catch (error) {
    console.error('Error creating sample portfolio filters:', error);
    throw error;
  }
};

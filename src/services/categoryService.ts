import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  post_count: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  post_count: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Convert Firestore document to Category
const convertToCategory = (id: string, data: DocumentData): Category => {
  return {
    id,
    name: data.name || '',
    slug: data.slug || '',
    description: data.description || '',
    post_count: data.post_count || 0,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

// Convert Firestore document to Tag
const convertToTag = (id: string, data: DocumentData): Tag => {
  return {
    id,
    name: data.name || '',
    slug: data.slug || '',
    description: data.description || '',
    post_count: data.post_count || 0,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const categories: Category[] = [];
    querySnapshot.forEach(doc => {
      categories.push(convertToCategory(doc.id, doc.data()));
    });
    
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

// Get a category by ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const docRef = doc(db, 'categories', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return convertToCategory(docSnap.id, docSnap.data());
    }
    
    return null;
  } catch (error) {
    console.error('Error getting category by ID:', error);
    throw error;
  }
};

// Get a category by slug
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return convertToCategory(docSnap.id, docSnap.data());
    }
    
    return null;
  } catch (error) {
    console.error('Error getting category by slug:', error);
    throw error;
  }
};

// Create a new category
export const createCategory = async (categoryData: Omit<Category, 'id' | 'post_count' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    // Generate slug if not provided
    if (!categoryData.slug && categoryData.name) {
      categoryData.slug = categoryData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Check if slug is unique
    const existingCategory = await getCategoryBySlug(categoryData.slug);
    if (existingCategory) {
      // Append random string to make slug unique
      categoryData.slug = `${categoryData.slug}-${Math.random().toString(36).substring(2, 8)}`;
    }
    
    // Set timestamps
    const now = serverTimestamp();
    const newCategory = {
      ...categoryData,
      post_count: 0,
      created_at: now,
      updated_at: now
    };
    
    const docRef = await addDoc(collection(db, 'categories'), newCategory);
    return docRef.id;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Update an existing category
export const updateCategory = async (id: string, categoryData: Partial<Omit<Category, 'id' | 'post_count' | 'created_at' | 'updated_at'>>): Promise<boolean> => {
  try {
    const docRef = doc(db, 'categories', id);
    
    // Generate slug if name is updated but slug is not provided
    if (categoryData.name && !categoryData.slug) {
      categoryData.slug = categoryData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
        
      // Check if slug is unique
      const existingCategory = await getCategoryBySlug(categoryData.slug);
      if (existingCategory && existingCategory.id !== id) {
        // Append random string to make slug unique
        categoryData.slug = `${categoryData.slug}-${Math.random().toString(36).substring(2, 8)}`;
      }
    }
    
    const updateData = {
      ...categoryData,
      updated_at: serverTimestamp()
    };
    
    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating category:', error);
    return false;
  }
};

// Delete a category
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    // First check if there are posts with this category
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('category', '==', id));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Cannot delete category with associated posts');
    }
    
    const docRef = doc(db, 'categories', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
};

// Increment post count for a category
export const incrementCategoryPostCount = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'categories', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return false;
    }
    
    const currentCount = docSnap.data().post_count || 0;
    
    await updateDoc(docRef, {
      post_count: currentCount + 1,
      updated_at: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error incrementing category post count:', error);
    return false;
  }
};

// Decrement post count for a category
export const decrementCategoryPostCount = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'categories', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return false;
    }
    
    const currentCount = docSnap.data().post_count || 0;
    
    await updateDoc(docRef, {
      post_count: Math.max(0, currentCount - 1),
      updated_at: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error decrementing category post count:', error);
    return false;
  }
};

// Get all tags
export const getAllTags = async (): Promise<Tag[]> => {
  try {
    const tagsRef = collection(db, 'tags');
    const q = query(tagsRef, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const tags: Tag[] = [];
    querySnapshot.forEach(doc => {
      tags.push(convertToTag(doc.id, doc.data()));
    });
    
    return tags;
  } catch (error) {
    console.error('Error getting tags:', error);
    throw error;
  }
};

// Get a tag by ID
export const getTagById = async (id: string): Promise<Tag | null> => {
  try {
    const docRef = doc(db, 'tags', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return convertToTag(docSnap.id, docSnap.data());
    }
    
    return null;
  } catch (error) {
    console.error('Error getting tag by ID:', error);
    throw error;
  }
};

// Get a tag by slug
export const getTagBySlug = async (slug: string): Promise<Tag | null> => {
  try {
    const tagsRef = collection(db, 'tags');
    const q = query(tagsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return convertToTag(docSnap.id, docSnap.data());
    }
    
    return null;
  } catch (error) {
    console.error('Error getting tag by slug:', error);
    throw error;
  }
};

// Create a new tag
export const createTag = async (tagData: Omit<Tag, 'id' | 'post_count' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    // Generate slug if not provided
    if (!tagData.slug && tagData.name) {
      tagData.slug = tagData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Check if slug is unique
    const existingTag = await getTagBySlug(tagData.slug);
    if (existingTag) {
      // Append random string to make slug unique
      tagData.slug = `${tagData.slug}-${Math.random().toString(36).substring(2, 8)}`;
    }
    
    // Set timestamps
    const now = serverTimestamp();
    const newTag = {
      ...tagData,
      post_count: 0,
      created_at: now,
      updated_at: now
    };
    
    const docRef = await addDoc(collection(db, 'tags'), newTag);
    return docRef.id;
  } catch (error) {
    console.error('Error creating tag:', error);
    throw error;
  }
};

// Update an existing tag
export const updateTag = async (id: string, tagData: Partial<Omit<Tag, 'id' | 'post_count' | 'created_at' | 'updated_at'>>): Promise<boolean> => {
  try {
    const docRef = doc(db, 'tags', id);
    
    // Generate slug if name is updated but slug is not provided
    if (tagData.name && !tagData.slug) {
      tagData.slug = tagData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
        
      // Check if slug is unique
      const existingTag = await getTagBySlug(tagData.slug);
      if (existingTag && existingTag.id !== id) {
        // Append random string to make slug unique
        tagData.slug = `${tagData.slug}-${Math.random().toString(36).substring(2, 8)}`;
      }
    }
    
    const updateData = {
      ...tagData,
      updated_at: serverTimestamp()
    };
    
    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating tag:', error);
    return false;
  }
};

// Delete a tag
export const deleteTag = async (id: string): Promise<boolean> => {
  try {
    // First check if there are posts with this tag
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('tags', 'array-contains', id));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Cannot delete tag with associated posts');
    }
    
    const docRef = doc(db, 'tags', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting tag:', error);
    return false;
  }
};

// Increment post count for a tag
export const incrementTagPostCount = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'tags', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return false;
    }
    
    const currentCount = docSnap.data().post_count || 0;
    
    await updateDoc(docRef, {
      post_count: currentCount + 1,
      updated_at: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error incrementing tag post count:', error);
    return false;
  }
};

// Decrement post count for a tag
export const decrementTagPostCount = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'tags', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return false;
    }
    
    const currentCount = docSnap.data().post_count || 0;
    
    await updateDoc(docRef, {
      post_count: Math.max(0, currentCount - 1),
      updated_at: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error decrementing tag post count:', error);
    return false;
  }
};

// Get popular categories (with most posts)
export const getPopularCategories = async (limit: number = 5): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, orderBy('post_count', 'desc'), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const categories: Category[] = [];
    querySnapshot.forEach(doc => {
      categories.push(convertToCategory(doc.id, doc.data()));
    });
    
    return categories.slice(0, limit);
  } catch (error) {
    console.error('Error getting popular categories:', error);
    throw error;
  }
};

// Get popular tags (with most posts)
export const getPopularTags = async (limit: number = 10): Promise<Tag[]> => {
  try {
    const tagsRef = collection(db, 'tags');
    const q = query(tagsRef, orderBy('post_count', 'desc'), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const tags: Tag[] = [];
    querySnapshot.forEach(doc => {
      tags.push(convertToTag(doc.id, doc.data()));
    });
    
    return tags.slice(0, limit);
  } catch (error) {
    console.error('Error getting popular tags:', error);
    throw error;
  }
};

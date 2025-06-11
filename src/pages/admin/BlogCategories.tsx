import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, AlertCircle, Check, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { db } from '../../lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  where,
  writeBatch
} from 'firebase/firestore';

interface Category {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
}

export default function BlogCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesRef = collection(db, 'categories');
      const q = query(categoriesRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      const categoriesData: Category[] = [];
      
      for (const categoryDoc of querySnapshot.docs) {
        const category = {
          id: categoryDoc.id,
          ...categoryDoc.data()
        } as Category;
        
        // Count posts for this category
        const postsRef = collection(db, 'posts');
        const postsQuery = query(postsRef, where('category', '==', category.id));
        const postsSnapshot = await getDocs(postsQuery);
        
        category.postCount = postsSnapshot.size;
        categoriesData.push(category);
      }
      
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      setLoading(true);
      const tagsRef = collection(db, 'tags');
      const q = query(tagsRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      const tagsData: Tag[] = [];
      
      for (const tagDoc of querySnapshot.docs) {
        const tag = {
          id: tagDoc.id,
          ...tagDoc.data()
        } as Tag;
        
        // Count posts for this tag
        const postTagsRef = collection(db, 'postTags');
        const postTagsQuery = query(postTagsRef, where('tagId', '==', tag.id));
        const postTagsSnapshot = await getDocs(postTagsQuery);
        
        tag.postCount = postTagsSnapshot.size;
        tagsData.push(tag);
      }
      
      setTags(tagsData);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setError('Failed to load tags. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    try {
      const categoryData = {
        name: newCategory.trim(),
        slug: createSlug(newCategory.trim()),
        createdAt: new Date()
      };
      
      const categoriesRef = collection(db, 'categories');
      await addDoc(categoriesRef, categoryData);
      
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category. Please try again.');
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    
    try {
      const tagData = {
        name: newTag.trim(),
        slug: createSlug(newTag.trim()),
        createdAt: new Date()
      };
      
      const tagsRef = collection(db, 'tags');
      await addDoc(tagsRef, tagData);
      
      setNewTag('');
      fetchTags();
    } catch (error) {
      console.error('Error adding tag:', error);
      setError('Failed to add tag. Please try again.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will affect all posts using this category.')) {
      try {
        // Check if category is in use
        const postsRef = collection(db, 'posts');
        const postsQuery = query(postsRef, where('category', '==', id));
        const postsSnapshot = await getDocs(postsQuery);
        
        if (postsSnapshot.size > 0) {
          if (!window.confirm(`This category is used by ${postsSnapshot.size} posts. Are you absolutely sure you want to delete it?`)) {
            return;
          }
        }
        
        await deleteDoc(doc(db, 'categories', id));
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        setError('Failed to delete category. Please try again.');
      }
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tag? This will remove it from all posts.')) {
      try {
        // Check if tag is in use
        const postTagsRef = collection(db, 'postTags');
        const postTagsQuery = query(postTagsRef, where('tagId', '==', id));
        const postTagsSnapshot = await getDocs(postTagsQuery);
        
        if (postTagsSnapshot.size > 0) {
          if (!window.confirm(`This tag is used by ${postTagsSnapshot.size} posts. Are you absolutely sure you want to delete it?`)) {
            return;
          }
          
          // Delete all post-tag relationships
          const batch = writeBatch(db);
          postTagsSnapshot.docs.forEach((docRef) => {
            batch.delete(docRef.ref);
          });
          await batch.commit();
        }
        
        await deleteDoc(doc(db, 'tags', id));
        fetchTags();
      } catch (error) {
        console.error('Error deleting tag:', error);
        setError('Failed to delete tag. Please try again.');
      }
    }
  };

  const startEditingCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditValue(category.name);
  };

  const startEditingTag = (tag: Tag) => {
    setEditingTagId(tag.id);
    setEditValue(tag.name);
  };

  const cancelEditing = () => {
    setEditingCategoryId(null);
    setEditingTagId(null);
    setEditValue('');
  };

  const saveEditedCategory = async () => {
    if (!editingCategoryId || !editValue.trim()) return;
    
    try {
      const categoryRef = doc(db, 'categories', editingCategoryId);
      await updateDoc(categoryRef, {
        name: editValue.trim(),
        slug: createSlug(editValue.trim()),
        updatedAt: new Date()
      });
      
      setEditingCategoryId(null);
      setEditValue('');
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category. Please try again.');
    }
  };

  const saveEditedTag = async () => {
    if (!editingTagId || !editValue.trim()) return;
    
    try {
      const tagRef = doc(db, 'tags', editingTagId);
      await updateDoc(tagRef, {
        name: editValue.trim(),
        slug: createSlug(editValue.trim()),
        updatedAt: new Date()
      });
      
      setEditingTagId(null);
      setEditValue('');
      fetchTags();
    } catch (error) {
      console.error('Error updating tag:', error);
      setError('Failed to update tag. Please try again.');
    }
  };

  return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Categories & Tags</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle size={18} className="mr-2" />
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            
            <div className="flex mb-4">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name"
                className="flex-1 border border-gray-200 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={handleAddCategory}
                className="bg-black text-white px-4 py-2 rounded-r-lg hover:bg-gray-800 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
              </div>
            ) : categories.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No categories found. Create your first category above.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <li key={category.id} className="py-3">
                    {editingCategoryId === category.id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-1 mr-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <button
                          onClick={saveEditedCategory}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Save"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Cancel"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{category.name}</span>
                          <span className="text-gray-500 text-sm ml-2">({category.postCount || 0} posts)</span>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => startEditingCategory(category)}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Tags Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Tags</h2>
            
            <div className="flex mb-4">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="New tag name"
                className="flex-1 border border-gray-200 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={handleAddTag}
                className="bg-black text-white px-4 py-2 rounded-r-lg hover:bg-gray-800 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
              </div>
            ) : tags.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No tags found. Create your first tag above.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {tags.map((tag) => (
                  <li key={tag.id} className="py-3">
                    {editingTagId === tag.id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-1 mr-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <button
                          onClick={saveEditedTag}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Save"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Cancel"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{tag.name}</span>
                          <span className="text-gray-500 text-sm ml-2">({tag.postCount || 0} posts)</span>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => startEditingTag(tag)}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
  );
}

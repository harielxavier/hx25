import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
// REMOVED FIREBASE: import { collection, query, getDocs, doc, writeBatch // REMOVED FIREBASE
// REMOVED FIREBASE: import { db } from '../../firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { 
  ImageIcon, 
  FileTextIcon, 
  TagIcon, 
  CheckSquare, 
  Filter, 
  RefreshCw, 
  Save
} from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'image' | 'gallery' | 'blog' | 'portfolio';
  title: string;
  description?: string;
  url?: string;
  thumbnailUrl?: string;
  tags?: string[];
  categories?: string[];
  selected: boolean;
}

const BatchEditor: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCount, setSelectedCount] = useState(0);
  const [bulkTags, setBulkTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [bulkCategories, setBulkCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [bulkDescription, setBulkDescription] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch all media items from different collections
  useEffect(() => {
    const fetchAllMedia = async () => {
      setLoading(true);
      try {
        const items: MediaItem[] = [];
        
        // Fetch portfolio images
        const portfolioImagesQuery = query(collection(db, 'portfolioImages'));
        const portfolioSnapshot = await getDocs(portfolioImagesQuery);
        portfolioSnapshot.forEach(doc => {
          const data = doc.data();
          items.push({
            id: doc.id,
            type: 'portfolio',
            title: data.title || 'Untitled',
            description: data.description || '',
            url: data.url || '',
            thumbnailUrl: data.thumbnailUrl || data.url || '',
            tags: data.tags || [],
            categories: data.categories || [],
            selected: false
          });
        });
        
        // Fetch gallery images
        const galleriesQuery = query(collection(db, 'galleries'));
        const galleriesSnapshot = await getDocs(galleriesQuery);
        
        for (const galleryDoc of galleriesSnapshot.docs) {
          const galleryImagesQuery = query(collection(db, `galleries/${galleryDoc.id}/images`));
          const galleryImagesSnapshot = await getDocs(galleryImagesQuery);
          
          galleryImagesSnapshot.forEach(doc => {
            const data = doc.data();
            items.push({
              id: doc.id,
              type: 'gallery',
              title: data.title || 'Untitled',
              description: data.description || '',
              url: data.url || '',
              thumbnailUrl: data.thumbnailUrl || data.url || '',
              tags: data.tags || [],
              categories: [galleryDoc.data().title || 'Uncategorized'],
              selected: false
            });
          });
        }
        
        // Fetch blog images
        const blogPostsQuery = query(collection(db, 'blogPosts'));
        const blogPostsSnapshot = await getDocs(blogPostsQuery);
        
        blogPostsSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.featuredImage) {
            items.push({
              id: doc.id,
              type: 'blog',
              title: data.title || 'Untitled',
              description: data.excerpt || '',
              url: data.featuredImage || '',
              thumbnailUrl: data.featuredImage || '',
              tags: data.tags || [],
              categories: data.categories || [],
              selected: false
            });
          }
        });
        
        setMediaItems(items);
      } catch (error) {
        console.error('Error fetching media:', error);
        setError('Failed to load media items');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllMedia();
  }, []);
  
  // Update selected count when selections change
  useEffect(() => {
    const count = mediaItems.filter(item => item.selected).length;
    setSelectedCount(count);
  }, [mediaItems]);
  
  const handleSelectItem = (id: string) => {
    setMediaItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };
  
  const handleSelectAll = () => {
    const allSelected = mediaItems.every(item => item.selected);
    setMediaItems(prevItems => 
      prevItems.map(item => ({ ...item, selected: !allSelected }))
    );
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !bulkTags.includes(newTag.trim())) {
      setBulkTags([...bulkTags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setBulkTags(bulkTags.filter(t => t !== tag));
  };
  
  const handleAddCategory = () => {
    if (newCategory.trim() && !bulkCategories.includes(newCategory.trim())) {
      setBulkCategories([...bulkCategories, newCategory.trim()]);
      setNewCategory('');
    }
  };
  
  const handleRemoveCategory = (category: string) => {
    setBulkCategories(bulkCategories.filter(c => c !== category));
  };
  
  const handleFilterChange = (value: string) => {
    setFilter(value);
  };
  
  const filteredItems = mediaItems.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });
  
  const applyBulkChanges = async () => {
    const selectedItems = mediaItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      setError('No items selected');
      return;
    }
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const batch = writeBatch(db);
      
      for (const item of selectedItems) {
        let docRef;
        const updateData: any = {};
        
        if (item.type === 'portfolio') {
          docRef = doc(db, 'portfolioImages', item.id);
        } else if (item.type === 'blog') {
          docRef = doc(db, 'blogPosts', item.id);
        } else if (item.type === 'gallery') {
          // Find the gallery this image belongs to
          // This is a simplified approach - you'd need to know which gallery the image belongs to
          const galleryId = item.categories?.[0] || 'unknown';
          docRef = doc(db, `galleries/${galleryId}/images`, item.id);
        }
        
        if (docRef) {
          // Only update fields that have been set in the batch editor
          if (bulkDescription) {
            updateData.description = bulkDescription;
          }
          
          if (bulkTags.length > 0) {
            // Merge existing tags with new ones
            updateData.tags = [...new Set([...(item.tags || []), ...bulkTags])];
          }
          
          if (bulkCategories.length > 0) {
            // Merge existing categories with new ones
            updateData.categories = [...new Set([...(item.categories || []), ...bulkCategories])];
          }
          
          batch.update(docRef, updateData);
        }
      }
      
      await batch.commit();
      
      setSuccess(`Successfully updated ${selectedItems.length} items`);
      
      // Update local state to reflect changes
      setMediaItems(prevItems => 
        prevItems.map(item => {
          if (item.selected) {
            return {
              ...item,
              description: bulkDescription || item.description,
              tags: [...new Set([...(item.tags || []), ...bulkTags])],
              categories: [...new Set([...(item.categories || []), ...bulkCategories])]
            };
          }
          return item;
        })
      );
      
      // Clear bulk edit fields
      setBulkDescription('');
      setBulkTags([]);
      setBulkCategories([]);
      
    } catch (error) {
      console.error('Error applying bulk changes:', error);
      setError('Failed to update items');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Batch Editor</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {selectedCount} items selected
            </div>
            <button 
              onClick={handleSelectAll}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              <CheckSquare className="w-5 h-5" />
              {mediaItems.every(item => item.selected) ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="md:col-span-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Filter</h2>
            <div className="space-y-2">
              <button 
                onClick={() => handleFilterChange('all')}
                className={`w-full text-left px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
              >
                All Media
              </button>
              <button 
                onClick={() => handleFilterChange('portfolio')}
                className={`w-full text-left px-4 py-2 rounded-md ${filter === 'portfolio' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
              >
                Portfolio Images
              </button>
              <button 
                onClick={() => handleFilterChange('gallery')}
                className={`w-full text-left px-4 py-2 rounded-md ${filter === 'gallery' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
              >
                Gallery Images
              </button>
              <button 
                onClick={() => handleFilterChange('blog')}
                className={`w-full text-left px-4 py-2 rounded-md ${filter === 'blog' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
              >
                Blog Images
              </button>
            </div>
          </div>
          
          <div className="md:col-span-3 bg-white rounded-lg shadow">
            <Tabs defaultValue="tags" className="w-full">
              <TabsList className="w-full grid grid-cols-3 p-1">
                <TabsTrigger value="tags" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                  <TagIcon className="w-4 h-4 mr-2" />
                  Tags
                </TabsTrigger>
                <TabsTrigger value="categories" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                  <Filter className="w-4 h-4 mr-2" />
                  Categories
                </TabsTrigger>
                <TabsTrigger value="description" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Description
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tags" className="p-6">
                <h3 className="text-lg font-medium mb-4">Add Tags to Selected Items</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Enter a tag"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <button 
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {bulkTags.map(tag => (
                    <div key={tag} className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {tag}
                      <button 
                        onClick={() => handleRemoveTag(tag)}
                        className="text-blue-800 hover:text-blue-900"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="categories" className="p-6">
                <h3 className="text-lg font-medium mb-4">Add Categories to Selected Items</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter a category"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  />
                  <button 
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {bulkCategories.map(category => (
                    <div key={category} className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                      {category}
                      <button 
                        onClick={() => handleRemoveCategory(category)}
                        className="text-green-800 hover:text-green-900"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="description" className="p-6">
                <h3 className="text-lg font-medium mb-4">Set Description for Selected Items</h3>
                <textarea
                  value={bulkDescription}
                  onChange={(e) => setBulkDescription(e.target.value)}
                  placeholder="Enter a description to apply to all selected items"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                />
              </TabsContent>
              
              <div className="p-6 border-t border-gray-200">
                <button 
                  onClick={applyBulkChanges}
                  disabled={saving || selectedCount === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Applying Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Apply Changes to {selectedCount} Items</span>
                    </>
                  )}
                </button>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
                    {success}
                  </div>
                )}
              </div>
            </Tabs>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Media Items</h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <div 
                    key={item.id} 
                    className={`relative rounded-lg overflow-hidden border ${item.selected ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'}`}
                    onClick={() => handleSelectItem(item.id)}
                  >
                    <div className="aspect-square bg-gray-100 relative">
                      {item.thumbnailUrl ? (
                        <img 
                          src={item.thumbnailUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          item.selected ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 border border-gray-300'
                        }`}>
                          {item.selected && <CheckSquare className="w-4 h-4" />}
                        </div>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.type === 'portfolio' ? 'bg-purple-100 text-purple-800' :
                          item.type === 'gallery' ? 'bg-green-100 text-green-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <h3 className="text-sm font-medium truncate">{item.title}</h3>
                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 2 && (
                            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                              +{item.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-12 text-center text-gray-500">
                  No items match the current filter
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BatchEditor;

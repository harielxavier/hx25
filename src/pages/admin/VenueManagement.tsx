import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  getVenueCategories, 
  getVenues, 
  createVenueCategory, 
  updateVenueCategory,
  deleteVenueCategory,
  createVenue,
  updateVenue,
  deleteVenue
} from '../../services/venueService';
import { VenueCategory, Venue } from '../../types/portfolio';
import { uploadImage } from '../../services/storageService';
import { getPublicGalleries, Gallery } from '../../services/galleryService';

const VenueManagement: React.FC = () => {
  // State for venue categories
  const [categories, setCategories] = useState<VenueCategory[]>([]);
  const [newCategory, setNewCategory] = useState<Omit<VenueCategory, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    order: 0
  });
  const [editingCategory, setEditingCategory] = useState<VenueCategory | null>(null);
  
  // State for venues
  const [venues, setVenues] = useState<Venue[]>([]);
  const [newVenue, setNewVenue] = useState<Omit<Venue, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    location: '',
    categoryId: '',
    thumbnailImage: '',
    gallerySlug: '',
    featured: false
  });
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  
  // State for image upload
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // State for galleries (to link venues to galleries)
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load venue categories and venues
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load venue categories
        const loadedCategories = await getVenueCategories();
        setCategories(loadedCategories);
        
        // Set default order for new category
        if (loadedCategories.length > 0) {
          const maxOrder = Math.max(...loadedCategories.map(c => c.order));
          setNewCategory(prev => ({ ...prev, order: maxOrder + 1 }));
        }
        
        // Load venues
        const loadedVenues = await getVenues();
        setVenues(loadedVenues);
        
        // Load galleries for venue-gallery association
        const loadedGalleries = await getPublicGalleries();
        setGalleries(loadedGalleries);
        
        // Set default selected category
        if (loadedCategories.length > 0) {
          setSelectedCategoryId(loadedCategories[0].id);
          setNewVenue(prev => ({ ...prev, categoryId: loadedCategories[0].id }));
        }
      } catch (error) {
        console.error('Error loading venue data:', error);
        setError('Failed to load venue data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filter venues by selected category
  const filteredVenues = selectedCategoryId 
    ? venues.filter(venue => venue.categoryId === selectedCategoryId)
    : venues;
  
  // Handle category form submission
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Update existing category
        await updateVenueCategory(editingCategory.id, {
          name: editingCategory.name,
          description: editingCategory.description,
          order: editingCategory.order
        });
        
        // Update local state
        setCategories(prev => 
          prev.map(cat => 
            cat.id === editingCategory.id ? editingCategory : cat
          )
        );
        
        // Reset editing state
        setEditingCategory(null);
      } else {
        // Create new category
        const categoryId = await createVenueCategory(newCategory);
        
        // Update local state
        const createdCategory: VenueCategory = {
          id: categoryId,
          ...newCategory,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setCategories(prev => [...prev, createdCategory]);
        
        // Reset form
        setNewCategory({
          name: '',
          description: '',
          order: newCategory.order + 1
        });
      }
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Failed to save category. Please try again.');
    }
  };
  
  // Handle venue form submission
  const handleVenueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      
      // Upload thumbnail image if provided
      let thumbnailUrl = editingVenue?.thumbnailImage || newVenue.thumbnailImage;
      
      if (thumbnailFile) {
        const path = `venues/${Date.now()}_${thumbnailFile.name}`;
        thumbnailUrl = await uploadImage(thumbnailFile, path);
      }
      
      if (editingVenue) {
        // Update existing venue
        await updateVenue(editingVenue.id, {
          name: editingVenue.name,
          location: editingVenue.location,
          categoryId: editingVenue.categoryId,
          thumbnailImage: thumbnailUrl,
          gallerySlug: editingVenue.gallerySlug,
          featured: editingVenue.featured
        });
        
        // Update local state
        setVenues(prev => 
          prev.map(venue => 
            venue.id === editingVenue.id 
              ? { ...editingVenue, thumbnailImage: thumbnailUrl }
              : venue
          )
        );
        
        // Reset editing state
        setEditingVenue(null);
      } else {
        // Create new venue
        const venueId = await createVenue({
          ...newVenue,
          thumbnailImage: thumbnailUrl
        });
        
        // Update local state
        const createdVenue: Venue = {
          id: venueId,
          ...newVenue,
          thumbnailImage: thumbnailUrl,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setVenues(prev => [...prev, createdVenue]);
        
        // Reset form
        setNewVenue({
          name: '',
          location: '',
          categoryId: selectedCategoryId,
          thumbnailImage: '',
          gallerySlug: '',
          featured: false
        });
      }
      
      // Reset file input
      setThumbnailFile(null);
    } catch (error) {
      console.error('Error saving venue:', error);
      setError('Failed to save venue. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  // Handle category deletion
  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category? All associated venues will be orphaned.')) {
      return;
    }
    
    try {
      await deleteVenueCategory(categoryId);
      
      // Update local state
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      
      // If the deleted category was selected, select the first available category
      if (selectedCategoryId === categoryId) {
        const firstCategory = categories.find(cat => cat.id !== categoryId);
        setSelectedCategoryId(firstCategory?.id || '');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category. Please try again.');
    }
  };
  
  // Handle venue deletion
  const handleDeleteVenue = async (venueId: string) => {
    if (!window.confirm('Are you sure you want to delete this venue?')) {
      return;
    }
    
    try {
      await deleteVenue(venueId);
      
      // Update local state
      setVenues(prev => prev.filter(venue => venue.id !== venueId));
    } catch (error) {
      console.error('Error deleting venue:', error);
      setError('Failed to delete venue. Please try again.');
    }
  };
  
  // Handle category reordering
  const handleMoveCategory = async (categoryId: string, direction: 'up' | 'down') => {
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    if (
      (direction === 'up' && categoryIndex === 0) ||
      (direction === 'down' && categoryIndex === categories.length - 1)
    ) {
      return;
    }
    
    const swapIndex = direction === 'up' ? categoryIndex - 1 : categoryIndex + 1;
    const updatedCategories = [...categories];
    
    // Swap order values
    const tempOrder = updatedCategories[categoryIndex].order;
    updatedCategories[categoryIndex].order = updatedCategories[swapIndex].order;
    updatedCategories[swapIndex].order = tempOrder;
    
    // Swap positions in array
    [updatedCategories[categoryIndex], updatedCategories[swapIndex]] = 
      [updatedCategories[swapIndex], updatedCategories[categoryIndex]];
    
    try {
      // Update order in database
      await updateVenueCategory(updatedCategories[categoryIndex].id, {
        order: updatedCategories[categoryIndex].order
      });
      
      await updateVenueCategory(updatedCategories[swapIndex].id, {
        order: updatedCategories[swapIndex].order
      });
      
      // Update local state
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error reordering categories:', error);
      setError('Failed to reorder categories. Please try again.');
    }
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Venue Management</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button 
              className="float-right" 
              onClick={() => setError(null)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Venue Categories Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Venue Categories</h2>
            
            {/* Category Form */}
            <form onSubmit={handleCategorySubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-medium mb-4">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="categoryName">
                  Category Name
                </label>
                <input
                  id="categoryName"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingCategory ? editingCategory.name : newCategory.name}
                  onChange={(e) => 
                    editingCategory 
                      ? setEditingCategory({ ...editingCategory, name: e.target.value })
                      : setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="categoryDescription">
                  Description
                </label>
                <textarea
                  id="categoryDescription"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingCategory ? editingCategory.description : newCategory.description}
                  onChange={(e) => 
                    editingCategory 
                      ? setEditingCategory({ ...editingCategory, description: e.target.value })
                      : setNewCategory({ ...newCategory, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="categoryOrder">
                  Display Order
                </label>
                <input
                  id="categoryOrder"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingCategory ? editingCategory.order : newCategory.order}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    editingCategory 
                      ? setEditingCategory({ ...editingCategory, order: value })
                      : setNewCategory({ ...newCategory, order: value });
                  }}
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                {editingCategory && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    onClick={() => setEditingCategory(null)}
                  >
                    Cancel
                  </button>
                )}
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
            
            {/* Categories List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {loading ? (
                  <li className="p-4 text-center">Loading categories...</li>
                ) : categories.length === 0 ? (
                  <li className="p-4 text-center text-gray-500">No categories found. Add one above.</li>
                ) : (
                  categories.map((category) => (
                    <li key={category.id} className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{category.name}</h4>
                        {category.description && (
                          <p className="text-sm text-gray-600">{category.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMoveCategory(category.id, 'up')}
                          className="p-1 text-gray-600 hover:text-black"
                          disabled={categories.indexOf(category) === 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleMoveCategory(category.id, 'down')}
                          className="p-1 text-gray-600 hover:text-black"
                          disabled={categories.indexOf(category) === categories.length - 1}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="p-1 text-gray-600 hover:text-black"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
          
          {/* Venues Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Venues</h2>
            
            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="categoryFilter">
                Filter by Category
              </label>
              <select
                id="categoryFilter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setNewVenue(prev => ({ ...prev, categoryId: e.target.value }));
                }}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Venue Form */}
            <form onSubmit={handleVenueSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-medium mb-4">
                {editingVenue ? 'Edit Venue' : 'Add New Venue'}
              </h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="venueName">
                  Venue Name
                </label>
                <input
                  id="venueName"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingVenue ? editingVenue.name : newVenue.name}
                  onChange={(e) => 
                    editingVenue 
                      ? setEditingVenue({ ...editingVenue, name: e.target.value })
                      : setNewVenue({ ...newVenue, name: e.target.value })
                  }
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="venueLocation">
                  Location
                </label>
                <input
                  id="venueLocation"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingVenue ? editingVenue.location : newVenue.location}
                  onChange={(e) => 
                    editingVenue 
                      ? setEditingVenue({ ...editingVenue, location: e.target.value })
                      : setNewVenue({ ...newVenue, location: e.target.value })
                  }
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="venueCategory">
                  Category
                </label>
                <select
                  id="venueCategory"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingVenue ? editingVenue.categoryId : newVenue.categoryId}
                  onChange={(e) => 
                    editingVenue 
                      ? setEditingVenue({ ...editingVenue, categoryId: e.target.value })
                      : setNewVenue({ ...newVenue, categoryId: e.target.value })
                  }
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="venueGallery">
                  Associated Gallery
                </label>
                <select
                  id="venueGallery"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingVenue ? editingVenue.gallerySlug : newVenue.gallerySlug}
                  onChange={(e) => 
                    editingVenue 
                      ? setEditingVenue({ ...editingVenue, gallerySlug: e.target.value })
                      : setNewVenue({ ...newVenue, gallerySlug: e.target.value })
                  }
                >
                  <option value="">None</option>
                  {galleries.map(gallery => (
                    <option key={gallery.id} value={gallery.slug}>
                      {gallery.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="venueThumbnail">
                  Thumbnail Image
                </label>
                <input
                  id="venueThumbnail"
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                />
                {(editingVenue?.thumbnailImage || newVenue.thumbnailImage) && !thumbnailFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Current Image:</p>
                    <img 
                      src={editingVenue?.thumbnailImage || newVenue.thumbnailImage} 
                      alt="Venue thumbnail" 
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              
              <div className="mb-4 flex items-center">
                <input
                  id="venueFeatured"
                  type="checkbox"
                  className="mr-2"
                  checked={editingVenue ? editingVenue.featured : newVenue.featured}
                  onChange={(e) => 
                    editingVenue 
                      ? setEditingVenue({ ...editingVenue, featured: e.target.checked })
                      : setNewVenue({ ...newVenue, featured: e.target.checked })
                  }
                />
                <label htmlFor="venueFeatured" className="text-gray-700">
                  Featured Venue
                </label>
              </div>
              
              <div className="flex justify-end gap-2">
                {editingVenue && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    onClick={() => {
                      setEditingVenue(null);
                      setThumbnailFile(null);
                    }}
                  >
                    Cancel
                  </button>
                )}
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingVenue ? 'Update Venue' : 'Add Venue'}
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Venues List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {loading ? (
                  <li className="p-4 text-center">Loading venues...</li>
                ) : filteredVenues.length === 0 ? (
                  <li className="p-4 text-center text-gray-500">
                    {selectedCategoryId 
                      ? 'No venues found in this category. Add one above.' 
                      : 'No venues found. Add one above.'}
                  </li>
                ) : (
                  filteredVenues.map((venue) => (
                    <li key={venue.id} className="p-4 flex items-start gap-4">
                      {venue.thumbnailImage && (
                        <img 
                          src={venue.thumbnailImage} 
                          alt={venue.name} 
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{venue.name}</h4>
                          {venue.featured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{venue.location}</p>
                        {venue.gallerySlug && (
                          <p className="text-sm text-gray-600">
                            Gallery: {galleries.find(g => g.slug === venue.gallerySlug)?.title || venue.gallerySlug}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingVenue(venue)}
                          className="p-1 text-gray-600 hover:text-black"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteVenue(venue.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default VenueManagement;

import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Search, Tag, Trash2, Edit, Eye, Grid, List, Filter } from 'lucide-react';
import { 
  getImages, 
  uploadImage, 
  deleteImage, 
  updateImageMetadata,
  getCategories,
  getTags,
  ImageMetadata
} from '../../services/imageManagerService';

interface ImageLibraryProps {
  onSelectImage?: (image: ImageMetadata) => void;
  selectedImageId?: string;
  showSelectionOnly?: boolean;
}

const ImageLibrary: React.FC<ImageLibraryProps> = ({ 
  onSelectImage, 
  selectedImageId,
  showSelectionOnly = false
}) => {
  // State
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageMetadata[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingImage, setEditingImage] = useState<ImageMetadata | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  // Load images and metadata
  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedImages = await getImages();
      setImages(fetchedImages);
      setFilteredImages(fetchedImages);
      
      // Load categories and tags
      const fetchedCategories = await getCategories();
      const fetchedTags = await getTags();
      
      setCategories(fetchedCategories);
      setTags(fetchedTags);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Filter images when search/filters change
  useEffect(() => {
    let filtered = [...images];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(image => 
        image.name.toLowerCase().includes(term) || 
        image.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(image => image.category === selectedCategory);
    }
    
    // Apply tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(image => 
        selectedTags.some(tag => image.tags.includes(tag))
      );
    }
    
    // Show only selected image if in selection mode
    if (showSelectionOnly && selectedImageId) {
      filtered = filtered.filter(image => image.id === selectedImageId);
    }
    
    setFilteredImages(filtered);
  }, [images, searchTerm, selectedCategory, selectedTags, showSelectionOnly, selectedImageId]);

  // Handle file upload
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setUploading(true);
      
      for (const file of acceptedFiles) {
        // Only accept images
        if (!file.type.startsWith('image/')) {
          console.warn('Skipping non-image file:', file.name);
          continue;
        }
        
        // Upload the image
        await uploadImage(
          file, 
          selectedCategory || 'uncategorized', 
          selectedTags
        );
      }
      
      // Reload images after upload
      await loadImages();
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  }, [loadImages, selectedCategory, selectedTags]);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    }
  });

  // Handle image deletion
  const handleDeleteImage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage(id);
        await loadImages();
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  // Handle image selection
  const handleSelectImage = (image: ImageMetadata) => {
    if (onSelectImage) {
      onSelectImage(image);
    }
  };

  // Handle adding a new category
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setSelectedCategory(newCategory);
      setNewCategory('');
    }
  };

  // Handle adding a new tag
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setSelectedTags([...selectedTags, newTag]);
      setNewTag('');
    }
  };

  // Handle updating image metadata
  const handleUpdateImage = async () => {
    if (editingImage && editingImage.id) {
      try {
        await updateImageMetadata(editingImage.id, {
          name: editingImage.name,
          category: editingImage.category,
          tags: editingImage.tags,
          isPublic: editingImage.isPublic
        });
        
        setEditingImage(null);
        await loadImages();
      } catch (error) {
        console.error('Error updating image:', error);
      }
    }
  };

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Image Library</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
          >
            <Grid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="p-4 border-b">
        <div className="flex mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search images..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="ml-2 px-4 py-2 bg-gray-100 rounded-lg flex items-center"
            onClick={() => {}}
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>
        
        {/* Category filter */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedCategory === '' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedCategory === category ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
            <div className="flex">
              <input
                type="text"
                placeholder="New category..."
                className="px-3 py-1 text-sm border rounded-l-full"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button
                onClick={handleAddCategory}
                className="px-2 py-1 bg-blue-500 text-white rounded-r-full text-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        {/* Tags filter */}
        <div>
          <h3 className="text-sm font-medium mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-sm rounded-full flex items-center ${
                  selectedTags.includes(tag) ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                }`}
              >
                <Tag size={14} className="mr-1" />
                {tag}
              </button>
            ))}
            <div className="flex">
              <input
                type="text"
                placeholder="New tag..."
                className="px-3 py-1 text-sm border rounded-l-full"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button
                onClick={handleAddTag}
                className="px-2 py-1 bg-green-500 text-white rounded-r-full text-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upload area */}
      <div 
        {...getRootProps()} 
        className={`p-6 border-b border-dashed cursor-pointer ${
          isDragActive ? 'bg-blue-50 border-blue-300' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-gray-600 mb-1">
            {isDragActive ? 'Drop images here...' : 'Drag & drop images here, or click to select'}
          </p>
          <p className="text-gray-400 text-sm">
            Supports JPG, PNG, GIF, WEBP up to 10MB
          </p>
        </div>
      </div>
      
      {/* Image gallery */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <p>Loading images...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No images found</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
            {filteredImages.map(image => (
              <div 
                key={image.id} 
                className={`
                  ${viewMode === 'grid' 
                    ? 'relative group border rounded-lg overflow-hidden' 
                    : 'flex items-center border rounded-lg p-2'
                  }
                  ${selectedImageId === image.id ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                {viewMode === 'grid' ? (
                  <>
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleSelectImage(image)}
                          className="p-2 bg-white rounded-full"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => setEditingImage(image)}
                          className="p-2 bg-white rounded-full"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteImage(image.id!)}
                          className="p-2 bg-white rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm truncate">
                      {image.name}
                    </div>
                  </>
                ) : (
                  <>
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium">{image.name}</h3>
                      <p className="text-sm text-gray-500">{image.category}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {image.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {image.tags.length > 3 && (
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                            +{image.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleSelectImage(image)}
                        className="p-2 text-gray-500 hover:text-blue-500"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => setEditingImage(image)}
                        className="p-2 text-gray-500 hover:text-blue-500"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteImage(image.id!)}
                        className="p-2 text-gray-500 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Edit image modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Image</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={editingImage.name}
                onChange={(e) => setEditingImage({...editingImage, name: e.target.value})}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                className="w-full p-2 border rounded"
                value={editingImage.category}
                onChange={(e) => setEditingImage({...editingImage, category: e.target.value})}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editingImage.tags.map(tag => (
                  <div key={tag} className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                    {tag}
                    <button
                      className="ml-2 text-gray-500 hover:text-red-500"
                      onClick={() => setEditingImage({
                        ...editingImage, 
                        tags: editingImage.tags.filter(t => t !== tag)
                      })}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Add tag..."
                  className="flex-1 p-2 border rounded-l"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTag && !editingImage.tags.includes(newTag)) {
                      setEditingImage({
                        ...editingImage,
                        tags: [...editingImage.tags, newTag]
                      });
                      setNewTag('');
                    }
                  }}
                />
                <button
                  className="bg-blue-500 text-white px-4 rounded-r"
                  onClick={() => {
                    if (newTag && !editingImage.tags.includes(newTag)) {
                      setEditingImage({
                        ...editingImage,
                        tags: [...editingImage.tags, newTag]
                      });
                      setNewTag('');
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingImage.isPublic}
                  onChange={(e) => setEditingImage({...editingImage, isPublic: e.target.checked})}
                  className="mr-2"
                />
                <span>Public image</span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setEditingImage(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleUpdateImage}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageLibrary;

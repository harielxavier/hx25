import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  getGallery, 
  getGalleryImages, 
  updateGallery, 
  deleteGallery,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  GalleryMedia as GalleryImage,
  Gallery
} from '../../services/galleryService';
import { processImages, ImageProcessingOptions } from '../../utils/imageProcessor';
import { 
  Trash2, 
  Upload, 
  Star, 
  Image as ImageIcon,
  ArrowLeft,
  Edit3
} from 'lucide-react';

export default function AdminGalleryDetail() {
  const { galleryId } = useParams<{ galleryId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [imageProcessingOptions, setImageProcessingOptions] = useState<ImageProcessingOptions>({
    maxWidth: 2000,
    maxHeight: 2000,
    quality: 0.8,
    namePrefix: '',
    format: 'jpeg'
  });

  // State for editing gallery details
  const [editMode, setEditMode] = useState(false);
  const [editedGallery, setEditedGallery] = useState<Partial<Gallery>>({});
  const [portfolioCategories] = useState<string[]>([
    'Weddings', 'Engagements', 'Portraits', 'Family', 'Events', 'Commercial'
  ]);
  const [clients, setClients] = useState<{id: string, name: string}[]>([]);
  
  // Load gallery and images
  useEffect(() => {
    if (!galleryId) {
      navigate('/admin/galleries');
      return;
    }
    
    const loadGalleryData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get gallery details
        const galleryData = await getGallery(galleryId);
        if (!galleryData) {
          throw new Error('Gallery not found');
        }
        
        // Set default values for new fields if they don't exist
        if (!galleryData.galleryType) {
          galleryData.galleryType = 'portfolio';
        }
        
        setGallery(galleryData);
        
        // Get gallery images
        const imagesData = await getGalleryImages(galleryId);
        console.log(`Loaded ${imagesData.length} images for gallery ${galleryId}`);
        
        // Log image URLs for debugging
        imagesData.forEach((img, index) => {
          console.log(`Image ${index + 1}: ${img.url ? 'Has URL' : 'No URL'} (${img.url?.substring(0, 50)}...)`);
        });
        
        setImages(imagesData);
      } catch (error) {
        console.error('Error loading gallery:', error);
        setError('Failed to load gallery. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadGalleryData();
  }, [galleryId, navigate]);

  // Load clients for the dropdown
  useEffect(() => {
    const loadClients = async () => {
      try {
        // This would be replaced with your actual client loading logic
        const clientsData = await fetch('/api/clients').then(res => res.json());
        setClients(clientsData);
      } catch (error) {
        console.error('Error loading clients:', error);
      }
    };
    
    if (editMode) {
      loadClients();
    }
  }, [editMode]);

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !gallery || !galleryId) return;
    
    try {
      setUploading(true);
      setError(null);
      
      // Convert FileList to Array
      const fileArray = Array.from(files);
      
      // Process all images with the current settings
      const processedImages = await processImages(fileArray, {
        ...imageProcessingOptions,
        namePrefix: imageProcessingOptions.namePrefix || gallery.title || ''
      });
      
      // Total number of images to upload
      const totalImages = processedImages.length;
      
      // Create a queue for uploads to prevent Firebase rate limiting
      const uploadQueue = [...processedImages];
      let successCount = 0;
      let failureCount = 0;
      let currentIndex = 0;
      
      // Process the queue with rate limiting
      const processQueue = async () => {
        if (uploadQueue.length === 0) {
          // Queue is empty, we're done
          finishUpload();
          return;
        }
        
        const processed = uploadQueue.shift();
        if (!processed) return;
        
        try {
          // Upload image with better error handling
          await uploadGalleryImage(galleryId, processed.file, {
            title: processed.name.split('.')[0].replace(/-/g, ' '),
            description: '',
            featured: false,
            tags: []
          });
          
          successCount++;
        } catch (error) {
          console.error('Error uploading image:', error);
          failureCount++;
        } finally {
          currentIndex++;
          
          // Update progress
          const progress = Math.round((currentIndex / totalImages) * 100);
          setUploadProgress(progress);
          
          // Process next item with a small delay to prevent rate limiting
          setTimeout(processQueue, 200);
        }
      };
      
      // Start processing the queue
      processQueue();
      
      // Function to finish the upload process
      const finishUpload = async () => {
        try {
          // Reload images
          const imagesData = await getGalleryImages(galleryId);
          setImages(imagesData);
          
          // Also reload gallery to get updated cover image
          const galleryData = await getGallery(galleryId);
          if (galleryData) {
            setGallery(galleryData);
          }
          
          // Show success message
          if (failureCount === 0) {
            alert(`Successfully uploaded ${successCount} images.`);
          } else {
            alert(`Uploaded ${successCount} images. Failed to upload ${failureCount} images.`);
          }
        } catch (error) {
          console.error('Error reloading data:', error);
        } finally {
          setUploading(false);
          setUploadProgress(0);
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
    } catch (error) {
      console.error('Error processing images:', error);
      setError('Failed to process images. Please try again.');
      setUploading(false);
    }
  };
  
  // Delete an image
  const deleteImage = async (image: GalleryImage) => {
    if (!galleryId) return;
    
    if (!confirm(`Are you sure you want to delete this image? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setUpdating(true);
      setError(null);
      
      // Delete the image
      await deleteGalleryImage(galleryId, image.id);
      
      // Remove from local state
      setImages(prevImages => prevImages.filter(img => img.id !== image.id));
      
      // Reload gallery to get updated cover image
      const galleryData = await getGallery(galleryId);
      if (galleryData) {
        setGallery(galleryData);
      }
      
      alert('Image deleted successfully.');
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image. Please try again.');
    } finally {
      setUpdating(false);
    }
  };
  
  // Toggle featured status for an image
  const toggleImageFeatured = async (image: GalleryImage) => {
    if (!galleryId) return;
    
    try {
      setUpdating(true);
      setError(null);
      
      // Update the image
      await updateGalleryImage(galleryId, image.id, {
        featured: !image.featured
      });
      
      // Update in local state
      setImages(prevImages => 
        prevImages.map(img => 
          img.id === image.id 
            ? { ...img, featured: !img.featured } 
            : img
        )
      );
      
      // If we're setting as featured, show success message
      if (!image.featured) {
        alert('Image set as featured.');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      setError('Failed to update image. Please try again.');
    } finally {
      setUpdating(false);
    }
  };
  
  // Update image processing options
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setImageProcessingOptions(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };
  
  // Set an image as the cover image for the gallery
  const setCoverImage = async (image: GalleryImage) => {
    if (!galleryId || !image.url) return;
    
    try {
      setUpdating(true);
      
      // Update the gallery in Firestore
      await updateGallery(galleryId, {
        coverImage: image.url
      });
      
      // Update local state
      setGallery(prev => prev ? { ...prev, coverImage: image.url } : null);
      
      alert('Cover image updated successfully!');
    } catch (error) {
      console.error('Error setting cover image:', error);
      setError('Failed to set cover image. Please try again.');
    } finally {
      setUpdating(false);
    }
  };
  
  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, imageId: string) => {
    console.error(`Failed to load image ${imageId}`);
    const imgElement = e.currentTarget;
    imgElement.src = '/images/placeholder-image.jpg'; // Fallback image
    imgElement.alt = 'Image failed to load';
    imgElement.className += ' opacity-50'; // Add visual indication
  };
  
  // Start editing gallery
  const startEditing = () => {
    setEditedGallery({...gallery});
    setEditMode(true);
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditedGallery({});
    setEditMode(false);
  };
  
  // Save gallery changes
  const saveGalleryChanges = async () => {
    if (!galleryId) return;
    
    try {
      setUpdating(true);
      setError(null);
      
      await updateGallery(galleryId, editedGallery);
      
      // Update local state
      setGallery(prev => prev ? {...prev, ...editedGallery} : null);
      
      setEditMode(false);
      alert('Gallery updated successfully!');
    } catch (error) {
      console.error('Error updating gallery:', error);
      setError('Failed to update gallery. Please try again.');
    } finally {
      setUpdating(false);
    }
  };
  
  // Handle input change in the edit form
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setEditedGallery(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
  };

  return (
    <div className="space-y-6">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/admin/galleries')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Galleries
        </button>
        
        {/* Gallery Header */}
        {gallery && (
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{gallery.title}</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/admin/galleries/edit/${galleryId}`)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit Gallery
              </button>
              <button
                onClick={async () => {
                  if (!galleryId) return;
                  if (confirm('Are you sure you want to delete this gallery? This action cannot be undone.')) {
                    try {
                      await deleteGallery(galleryId);
                      navigate('/admin/galleries');
                    } catch (error) {
                      console.error('Error deleting gallery:', error);
                      setError('Failed to delete gallery. Please try again.');
                    }
                  }
                }}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete Gallery
              </button>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
            {error}
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading gallery...</p>
          </div>
        )}
        
        {/* Gallery Content */}
        {!loading && gallery && (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Images
              </h2>
              
              {/* Image Processing Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Width (px)
                  </label>
                  <input
                    type="number"
                    name="maxWidth"
                    value={imageProcessingOptions.maxWidth}
                    onChange={handleOptionChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Height (px)
                  </label>
                  <input
                    type="number"
                    name="maxHeight"
                    value={imageProcessingOptions.maxHeight}
                    onChange={handleOptionChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quality (0-1)
                  </label>
                  <input
                    type="number"
                    name="quality"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={imageProcessingOptions.quality}
                    onChange={handleOptionChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name Prefix
                  </label>
                  <input
                    type="text"
                    name="namePrefix"
                    value={imageProcessingOptions.namePrefix}
                    onChange={handleOptionChange}
                    placeholder={gallery.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Format
                  </label>
                  <select
                    name="format"
                    value={imageProcessingOptions.format}
                    onChange={handleOptionChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WebP</option>
                  </select>
                </div>
              </div>
              
              {/* Upload Controls */}
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={uploading}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Select Images
                </button>
                
                {uploading && (
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Uploading: {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Gallery Edit Form */}
            {editMode && (
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Edit3 className="w-5 h-5 mr-2" />
                  Edit Gallery
                </h2>
                
                <form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={editedGallery.title || ''}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={editedGallery.description || ''}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gallery Type
                      </label>
                      <select
                        name="galleryType"
                        value={editedGallery.galleryType || ''}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="portfolio">Portfolio</option>
                        <option value="blog">Blog</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Location
                      </label>
                      <select
                        name="displayLocation"
                        value={editedGallery.displayLocation || ''}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="home">Home</option>
                        <option value="about">About</option>
                        <option value="contact">Contact</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <input
                        type="number"
                        name="position"
                        value={editedGallery.position || 0}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={editedGallery.category || ''}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        {portfolioCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client
                      </label>
                      <select
                        name="clientId"
                        value={editedGallery.clientId || ''}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveGalleryChanges}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Images Grid */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                Gallery Images ({images.length})
              </h2>
              
              {images.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 border border-gray-200 rounded-lg">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No images in this gallery yet.</p>
                  <p className="text-gray-500 text-sm mt-2">Upload images using the form above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map(image => (
                    <div 
                      key={image.id} 
                      className={`relative border rounded-lg overflow-hidden group ${
                        updating ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      {/* Image */}
                      <div className="aspect-w-1 aspect-h-1">
                        <img
                          src={image.url || '/images/placeholder-image.jpg'}
                          alt={image.title || 'Gallery image'}
                          className="object-cover w-full h-full"
                          onError={(e) => handleImageError(e, image.id)}
                        />
                      </div>
                      
                      {/* Featured Badge */}
                      {image.featured && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </div>
                      )}
                      
                      {/* Cover Image Badge */}
                      {gallery.coverImage === image.url && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs flex items-center">
                          <ImageIcon className="w-3 h-3 mr-1" />
                          Cover
                        </div>
                      )}
                      
                      {/* Image Title */}
                      <div className="p-2 bg-white">
                        <p className="text-sm font-medium truncate">{image.title || 'Untitled'}</p>
                      </div>
                      
                      {/* Actions */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleImageFeatured(image)}
                            className={`p-2 rounded-full ${
                              image.featured ? 'bg-yellow-500' : 'bg-gray-200'
                            }`}
                            title={image.featured ? 'Remove from featured' : 'Add to featured'}
                          >
                            <Star className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCoverImage(image)}
                            className={`p-2 rounded-full ${
                              gallery.coverImage === image.url ? 'bg-blue-500' : 'bg-gray-200'
                            }`}
                            title="Set as cover image"
                            disabled={!image.url}
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteImage(image)}
                            className="p-2 bg-red-500 rounded-full"
                            title="Delete image"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Edit Gallery Button */}
        {!editMode && (
          <button
            onClick={startEditing}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Gallery
          </button>
        )}
      </div>
  );
}

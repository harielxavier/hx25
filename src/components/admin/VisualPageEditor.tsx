import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  Edit, 
  X,
  ArrowLeft
} from 'lucide-react';
import { getPageZones, updatePageZone, getImages, ImageMetadata } from '../../services/imageManagerService';
import ImageEditor from './ImageEditor';

interface VisualPageEditorProps {
  pagePath: string;
  pageTitle: string;
}

interface PageZone {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  imageId?: string;
}

const VisualPageEditor: React.FC<VisualPageEditorProps> = ({ pagePath, pageTitle }) => {
  const [zones, setZones] = useState<PageZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedZone, setSelectedZone] = useState<PageZone | null>(null);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  const [draggedImage, setDraggedImage] = useState<ImageMetadata | null>(null);
  const [dragOverZoneId, setDragOverZoneId] = useState<string | null>(null);
  const pagePreviewRef = useRef<HTMLDivElement>(null);

  // Load page zones
  useEffect(() => {
    const loadZones = async () => {
      setLoading(true);
      try {
        const pageZones = await getPageZones(pagePath);
        setZones(pageZones);
      } catch (error) {
        console.error('Error loading page zones:', error);
      } finally {
        setLoading(false);
      }
    };

    loadZones();
  }, [pagePath]);

  // Load images when image selector is shown
  useEffect(() => {
    if (showImageSelector) {
      const loadImages = async () => {
        try {
          const allImages = await getImages();
          setImages(allImages);
          
          // Extract unique categories
          const uniqueCategories = ['all', ...new Set(allImages.map(img => img.category || 'uncategorized'))];
          setCategories(uniqueCategories);
        } catch (error) {
          console.error('Error loading images:', error);
        }
      };
      
      loadImages();
    }
  }, [showImageSelector]);

  const handleSelectZone = (zone: PageZone) => {
    setSelectedZone(zone);
    setShowImageSelector(true);
  };

  const handleAddZone = () => {
    const newZone: PageZone = {
      id: `zone_${Date.now()}`,
      name: `New Zone ${zones.length + 1}`,
      description: 'Click to add an image'
    };
    
    setZones([...zones, newZone]);
    setSelectedZone(newZone);
    setShowImageSelector(true);
  };

  const handleSelectImage = (image: ImageMetadata) => {
    if (!selectedZone) return;
    
    const updatedZones = zones.map(zone => 
      zone.id === selectedZone.id 
        ? { ...zone, imageUrl: image.url, imageId: image.id } 
        : zone
    );
    
    setZones(updatedZones);
    setShowImageSelector(false);
    
    // Save the change immediately
    saveZoneChange({ ...selectedZone, imageUrl: image.url, imageId: image.id });
  };

  const handleRemoveImage = (zoneId: string) => {
    const updatedZones = zones.map(zone => 
      zone.id === zoneId 
        ? { ...zone, imageUrl: undefined, imageId: undefined } 
        : zone
    );
    
    setZones(updatedZones);
    
    // Find the zone and save the change
    const zone = zones.find(z => z.id === zoneId);
    if (zone) {
      saveZoneChange({ ...zone, imageUrl: undefined, imageId: undefined });
    }
  };

  const handleEditImage = (image: ImageMetadata) => {
    setSelectedImage(image);
    setShowImageEditor(true);
    setShowImageSelector(false);
  };

  const handleSaveEdit = (editedImageUrl: string) => {
    if (!selectedZone || !selectedImage) return;
    
    // Update the image in the zone
    const updatedZones = zones.map(zone => 
      zone.id === selectedZone.id 
        ? { ...zone, imageUrl: editedImageUrl } 
        : zone
    );
    
    setZones(updatedZones);
    setShowImageEditor(false);
    
    // Save the change
    saveZoneChange({ ...selectedZone, imageUrl: editedImageUrl });
  };

  const saveZoneChange = async (zone: PageZone) => {
    setSaving(true);
    try {
      await updatePageZone(zone.id, {
        name: zone.name,
        description: zone.description,
        imageUrl: zone.imageUrl,
        imageId: zone.imageId
      });
    } catch (error) {
      console.error('Error saving zone change:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, image: ImageMetadata) => {
    setDraggedImage(image);
    e.dataTransfer.setData('application/json', JSON.stringify(image));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    setDragOverZoneId(zoneId);
  };

  const handleDragLeave = () => {
    setDragOverZoneId(null);
  };

  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    setDragOverZoneId(null);
    
    if (!draggedImage) return;
    
    // Update the zone with the dropped image
    const updatedZones = zones.map(zone => 
      zone.id === zoneId 
        ? { ...zone, imageUrl: draggedImage.url, imageId: draggedImage.id } 
        : zone
    );
    
    setZones(updatedZones);
    
    // Find the zone and save the change
    const zone = zones.find(z => z.id === zoneId);
    if (zone) {
      saveZoneChange({ ...zone, imageUrl: draggedImage.url, imageId: draggedImage.id });
    }
    
    setDraggedImage(null);
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = searchTerm === '' || 
      image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (image.tags && image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'all' || 
      image.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={() => window.history.back()}
            className="mr-3 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-medium">{pageTitle}</h2>
            <p className="text-sm text-gray-500">{pagePath}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {saving && <span className="text-sm text-gray-500">Saving changes...</span>}
          <button
            onClick={handleAddZone}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Add Image Zone
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Page Preview</h3>
          <p className="text-sm text-gray-500 mb-4">
            Click on any image zone to change its image or drag images directly from the library below.
          </p>
          
          <div 
            ref={pagePreviewRef}
            className="border rounded-lg p-6 bg-gray-50 min-h-[300px] relative"
          >
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <p>Loading page zones...</p>
              </div>
            ) : zones.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <ImageIcon size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">No image zones defined for this page</p>
                <button
                  onClick={handleAddZone}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center mt-2"
                >
                  <Plus size={18} className="mr-2" />
                  Add First Image Zone
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zones.map(zone => (
                  <div 
                    key={zone.id}
                    className={`border rounded-lg overflow-hidden bg-white shadow-sm transition-all ${dragOverZoneId === zone.id ? 'ring-2 ring-blue-500 scale-105' : ''}`}
                    onClick={() => handleSelectZone(zone)}
                    onDragOver={(e) => handleDragOver(e, zone.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, zone.id)}
                  >
                    <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                      <span className="font-medium text-sm">{zone.name}</span>
                      <div className="flex space-x-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Logic to rename zone
                          }}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Edit size={16} />
                        </button>
                        {zone.imageUrl && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(zone.id);
                            }}
                            className="p-1 text-gray-500 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="aspect-video relative bg-gray-100 flex items-center justify-center">
                      {zone.imageUrl ? (
                        <img 
                          src={zone.imageUrl} 
                          alt={zone.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500">Click to add an image</p>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                        <button 
                          className="px-3 py-1.5 bg-white rounded-lg shadow text-sm font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectZone(zone);
                          }}
                        >
                          {zone.imageUrl ? 'Change Image' : 'Add Image'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Image Library Quick Access */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-2">Image Library</h3>
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop images directly onto the zones above to place them on the page.
          </p>
          
          <div className="border rounded-lg p-4">
            <div className="flex flex-wrap gap-4 mb-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedCategory === category 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Images' : category}
                </button>
              ))}
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search images by name or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
              {filteredImages.map(image => (
                <div
                  key={image.id}
                  className="border rounded-lg overflow-hidden cursor-move"
                  draggable
                  onDragStart={(e) => handleDragStart(e, image)}
                >
                  <div className="aspect-square bg-gray-100 relative">
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs truncate">{image.name}</p>
                  </div>
                </div>
              ))}
              
              {filteredImages.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No images found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Selector Modal */}
      {showImageSelector && selectedZone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Select Image for {selectedZone.name}</h3>
              <button 
                onClick={() => setShowImageSelector(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex flex-wrap gap-4 mb-4">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      selectedCategory === category 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All Images' : category}
                  </button>
                ))}
              </div>
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search images by name or tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4 max-h-[60vh] overflow-y-auto p-2">
                {filteredImages.map(image => (
                  <div
                    key={image.id}
                    className="border rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => handleSelectImage(image)}
                  >
                    <div className="aspect-square bg-gray-100 relative">
                      <img 
                        src={image.url} 
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                        <div className="flex space-x-2">
                          <button 
                            className="p-2 bg-white rounded-full shadow"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditImage(image);
                            }}
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            className="p-2 bg-blue-500 text-white rounded-full shadow"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectImage(image);
                            }}
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-sm font-medium truncate">{image.name}</p>
                      {image.tags && image.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {image.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                          {image.tags.length > 2 && (
                            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                              +{image.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredImages.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No images found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setShowImageSelector(false)}
                className="px-4 py-2 border rounded-lg mr-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Image Editor Modal */}
      {showImageEditor && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Edit Image</h3>
              <button 
                onClick={() => setShowImageEditor(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <ImageEditor 
              image={selectedImage}
              onSave={handleSaveEdit}
              onCancel={() => setShowImageEditor(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualPageEditor;

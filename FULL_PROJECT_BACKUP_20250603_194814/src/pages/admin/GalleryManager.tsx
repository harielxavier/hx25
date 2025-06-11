import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllGalleries, Gallery } from '../../services/galleryService';
import GalleryUploader from '../../components/admin/GalleryUploader';
import { Loader, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function GalleryManager() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [selectedGalleryId, setSelectedGalleryId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load all galleries
  const loadGalleries = async () => {
    setLoading(true);
    try {
      const allGalleries = await getAllGalleries();
      setGalleries(allGalleries);
      
      // If there are galleries and none is selected, select the first one
      if (allGalleries.length > 0 && !selectedGalleryId) {
        setSelectedGalleryId(allGalleries[0].id);
      }
    } catch (error) {
      console.error('Error loading galleries:', error);
      toast.error('Failed to load galleries');
    } finally {
      setLoading(false);
    }
  };

  // Load galleries on component mount
  useEffect(() => {
    loadGalleries();
  }, []);

  // Handle gallery selection change
  const handleGalleryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGalleryId(e.target.value);
  };

  // Handle upload complete
  const handleUploadComplete = () => {
    toast.success('Gallery updated successfully');
    loadGalleries(); // Refresh the galleries list
  };

  // Navigate to gallery details
  const viewGalleryDetails = () => {
    if (selectedGalleryId) {
      navigate(`/admin/galleries/${selectedGalleryId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gallery Manager</h1>
        <button 
          onClick={loadGalleries}
          className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gallery Selection */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-medium mb-4">Select Gallery</h2>
                
                {galleries.length === 0 ? (
                  <p className="text-gray-500">No galleries found. Create a gallery first.</p>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gallery
                      </label>
                      <select
                        value={selectedGalleryId}
                        onChange={handleGalleryChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        {galleries.map(gallery => (
                          <option key={gallery.id} value={gallery.id}>
                            {gallery.title} ({gallery.imageCount || 0} images)
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        onClick={viewGalleryDetails}
                        disabled={!selectedGalleryId}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        View Gallery Details
                      </button>
                      
                      <button
                        onClick={() => navigate('/admin/galleries/new')}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Create New Gallery
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Gallery Uploader */}
            <div className="md:col-span-2">
              {selectedGalleryId ? (
                <GalleryUploader 
                  galleryId={selectedGalleryId} 
                  onUploadComplete={handleUploadComplete} 
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <p className="text-gray-500">
                    Select a gallery first or create a new one to upload images.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Gallery Information */}
          {selectedGalleryId && (
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Gallery Information</h2>
              <div className="bg-white rounded-lg shadow-md p-4">
                {galleries.filter(g => g.id === selectedGalleryId).map(gallery => (
                  <div key={gallery.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">{gallery.title}</h3>
                      <p className="text-sm text-gray-500">{gallery.description}</p>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Images:</span> {gallery.imageCount || 0}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Status:</span> {gallery.isPublished ? 'Published' : 'Draft'}
                      </p>
                      {gallery.clientName && (
                        <p className="text-sm">
                          <span className="font-medium">Client:</span> {gallery.clientName}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      {gallery.coverImage && (
                        <img 
                          src={gallery.coverImage} 
                          alt={gallery.title} 
                          className="w-full h-40 object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.src = 'https://res.cloudinary.com/dos0qac90/image/upload/v1648123498/hariel-xavier-photography/image-placeholder.jpg';
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGalleryBySlug, getGalleryImages, Gallery, GalleryImage } from '../services/galleryService';

export default function GalleryDebugPage() {
  const { slug } = useParams<{ slug: string }>();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageStatuses, setImageStatuses] = useState<Record<string, 'loading' | 'success' | 'error'>>({});

  // Fetch gallery data and images
  useEffect(() => {
    const fetchGalleryData = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching gallery with slug: ${slug}`);
        const galleryData = await getGalleryBySlug(slug);
        
        if (!galleryData) {
          setError('Gallery not found');
          setLoading(false);
          return;
        }
        
        setGallery(galleryData);
        
        console.log(`Fetching images for gallery: ${galleryData.id}`);
        const galleryImages = await getGalleryImages(galleryData.id);
        console.log(`Fetched ${galleryImages.length} images for gallery: ${galleryData.id}`);
        
        // Initialize all images as loading
        const initialStatuses: Record<string, 'loading' | 'success' | 'error'> = {};
        galleryImages.forEach(img => {
          initialStatuses[img.id] = 'loading';
        });
        setImageStatuses(initialStatuses);
        
        setImages(galleryImages);
      } catch (err) {
        console.error('Error fetching gallery data:', err);
        setError('Failed to load gallery. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGalleryData();
  }, [slug]);

  // Handle image load success
  const handleImageLoad = (imageId: string) => {
    setImageStatuses(prev => ({
      ...prev,
      [imageId]: 'success'
    }));
  };

  // Handle image load error
  const handleImageError = (imageId: string) => {
    setImageStatuses(prev => ({
      ...prev,
      [imageId]: 'error'
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
          <h2 className="text-xl font-medium text-gray-700">Loading gallery...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/portfolio" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
            Return to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Gallery Not Found</h2>
          <p className="text-gray-600 mb-4">The gallery you're looking for doesn't exist or may have been removed.</p>
          <Link to="/portfolio" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
            Browse All Galleries
          </Link>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalImages = images.length;
  const loadedImages = Object.values(imageStatuses).filter(status => status === 'success').length;
  const failedImages = Object.values(imageStatuses).filter(status => status === 'error').length;
  // Using pendingImages to display in the UI
  const pendingImages = totalImages - loadedImages - failedImages;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back to portfolio link */}
      <div className="mb-6">
        <Link 
          to="/portfolio" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Portfolio
        </Link>
      </div>
      
      {/* Gallery Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Debug: {gallery.title}
        </h1>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This is a diagnostic page to help debug image loading issues.
              </p>
            </div>
          </div>
        </div>
        
        {/* Image Loading Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Total Images</h3>
            <p className="text-3xl font-bold text-blue-600">{totalImages}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Successfully Loaded</h3>
            <p className="text-3xl font-bold text-green-600">{loadedImages}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Failed to Load</h3>
            <p className="text-3xl font-bold text-red-600">{failedImages}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div 
            className="bg-blue-600 h-4 rounded-full" 
            style={{ width: `${(loadedImages / totalImages) * 100}%` }}
          ></div>
        </div>
        
        {/* Pending Images */}
        {pendingImages > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {pendingImages} {pendingImages === 1 ? 'image is' : 'images are'} still loading. Please wait...
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Image List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Image Diagnostics</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed information about each image in the gallery.</p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {images.map((image, index) => (
                <li key={image.id} className="px-4 py-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-16 h-16 mr-4">
                      {imageStatuses[image.id] === 'loading' && (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                        </div>
                      )}
                      {imageStatuses[image.id] === 'success' && (
                        <img 
                          src={image.thumbnailUrl || image.url} 
                          alt={image.title || `Image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      {imageStatuses[image.id] === 'error' && (
                        <div className="w-16 h-16 bg-red-100 flex items-center justify-center rounded">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {image.title || image.filename || `Image ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {image.id}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Order: {image.order || index}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 break-all">
                        URL: {image.url}
                      </p>
                      {image.thumbnailUrl && image.thumbnailUrl !== image.url && (
                        <p className="text-xs text-gray-500 mt-1 break-all">
                          Thumbnail: {image.thumbnailUrl}
                        </p>
                      )}
                      <div className="mt-2">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            imageStatuses[image.id] === 'success' ? 'bg-green-100 text-green-800' :
                            imageStatuses[image.id] === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {imageStatuses[image.id] === 'success' ? 'Loaded' :
                           imageStatuses[image.id] === 'error' ? 'Failed' :
                           'Loading'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <button 
                        onClick={() => {
                          // Force reload the image
                          setImageStatuses(prev => ({
                            ...prev,
                            [image.id]: 'loading'
                          }));
                          
                          // Create a new Image to test loading
                          const img = new Image();
                          img.onload = () => handleImageLoad(image.id);
                          img.onerror = () => handleImageError(image.id);
                          img.src = image.url;
                        }}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Test Load
                      </button>
                    </div>
                  </div>
                  
                  {/* Hidden image elements to actually test loading */}
                  <img 
                    src={image.url} 
                    alt="" 
                    className="hidden"
                    onLoad={() => handleImageLoad(image.id)}
                    onError={() => handleImageError(image.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

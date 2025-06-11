import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGalleryBySlug, getGalleryImages, Gallery, GalleryImage } from '../services/galleryService';
import PhotoGallery from '../components/gallery/PhotoGallery';
import { motion } from 'framer-motion';

export default function GalleryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

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
        
        // Process and validate images
        const processedImages = galleryImages
          .filter(img => Boolean(img.url && img.url.trim().length > 0))
          .map((img, index) => ({
            ...img,
            order: img.order || index,
            width: img.width || 1200,
            height: img.height || 800,
            thumbnailUrl: img.thumbnailUrl || img.url,
            title: img.title || img.filename || `Image ${index + 1}`,
            tags: Array.isArray(img.tags) ? img.tags : []
          }));
        
        if (processedImages.length === 0 && galleryImages.length > 0) {
          console.error('No valid image URLs found in gallery images');
          setError('No valid images found in this gallery.');
        }
        
        setImages(processedImages);
        
        // Extract all unique tags from images
        const tags = new Set<string>();
        processedImages.forEach(image => {
          if (image.tags && Array.isArray(image.tags)) {
            image.tags.forEach(tag => tags.add(tag));
          }
        });
        setAllTags(Array.from(tags).sort());
        
      } catch (err) {
        console.error('Error fetching gallery data:', err);
        setError('Failed to load gallery. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGalleryData();
  }, [slug]);

  // Handle tag selection
  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  // Force reload of gallery images
  const handleReloadGallery = useCallback(async () => {
    if (!gallery) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Reloading images for gallery: ${gallery.id}`);
      const galleryImages = await getGalleryImages(gallery.id);
      console.log(`Reloaded ${galleryImages.length} images for gallery: ${gallery.id}`);
      
      // Process and validate images
      const processedImages = galleryImages
        .filter(img => Boolean(img.url && img.url.trim().length > 0))
        .map((img, index) => ({
          ...img,
          order: img.order || index,
          width: img.width || 1200,
          height: img.height || 800,
          thumbnailUrl: img.thumbnailUrl || img.url,
          title: img.title || img.filename || `Image ${index + 1}`,
          tags: Array.isArray(img.tags) ? img.tags : []
        }));
      
      if (processedImages.length === 0 && galleryImages.length > 0) {
        console.error('No valid image URLs found in gallery images');
        setError('No valid images found in this gallery.');
      } else {
        console.log(`Successfully processed ${processedImages.length} valid images`);
      }
      
      setImages(processedImages);
    } catch (err) {
      console.error('Error reloading gallery images:', err);
      setError('Failed to reload images. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [gallery]);

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
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/portfolio" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Return to Portfolio
            </Link>
            {gallery && (
              <button 
                onClick={handleReloadGallery}
                className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
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
        {/* Debug link */}
        <Link 
          to={`/gallery-debug/${slug}`} 
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors ml-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Debug Gallery
        </Link>
      </div>
      
      {/* Gallery Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{gallery.title}</h1>
        
        {gallery.description && (
          <p className="text-lg text-gray-600 mb-4 max-w-3xl">{gallery.description}</p>
        )}
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {gallery.location && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {gallery.location}
            </div>
          )}
          
          {gallery.eventDate && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(gallery.eventDate.toMillis()).toLocaleDateString()}
            </div>
          )}
          
          {gallery.category && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {gallery.category}
            </div>
          )}
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {images.length} photos
          </div>
        </div>
      </motion.div>
      
      {/* Tags filter */}
      {allTags.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-lg font-medium text-gray-800 mb-3">Filter by tag:</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Photo Gallery */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {images.length > 0 ? (
          <PhotoGallery images={images} selectedTag={selectedTag} />
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Images Found</h3>
            <p className="text-gray-500 mb-4">This gallery doesn't have any images yet.</p>
            <button 
              onClick={handleReloadGallery}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reload Gallery
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

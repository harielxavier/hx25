import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Heart } from 'lucide-react';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import SEO from '../components/SEO';
import { getPublicGalleries, getGalleryMedia, GalleryMedia } from '../services/galleryService';

export default function ImagesPage() {
  const [images, setImages] = useState<Array<GalleryMedia & { galleryTitle?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const filters = [
    { id: 'all', label: 'All Images' },
    { id: 'featured', label: 'Featured' },
    { id: 'weddings', label: 'Weddings' },
    { id: 'engagements', label: 'Engagements' },
    { id: 'portrait', label: 'Portrait' }
  ];

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all public galleries
        const galleries = await getPublicGalleries();
        console.log(`Loaded ${galleries.length} public galleries`);
        
        // Create a map of gallery IDs to titles for reference
        const galleryTitles: Record<string, string> = {};
        galleries.forEach(gallery => {
          galleryTitles[gallery.id] = gallery.title;
        });
        
        // Create a map of gallery IDs to categories
        const galleryCategories: Record<string, string> = {};
        galleries.forEach(gallery => {
          galleryCategories[gallery.id] = gallery.category;
        });
        
        // Get images from all galleries
        const allImagesPromises = galleries.map(gallery => 
          getGalleryMedia(gallery.id)
        );
        
        const allGalleryImages = await Promise.all(allImagesPromises);
        
        // Flatten the array of arrays and add gallery titles
        let allImages = allGalleryImages
          .flat()
          .filter(image => image.type === 'image') // Only include images, not videos
          .map(image => ({
            ...image,
            galleryTitle: galleryTitles[image.galleryId],
            category: galleryCategories[image.galleryId]
          }));
        
        // Apply filters if needed
        if (activeFilter === 'featured') {
          allImages = allImages.filter(image => image.featured);
        } else if (activeFilter !== 'all') {
          allImages = allImages.filter(image => image.category === activeFilter);
        }
        
        // Sort by creation date (newest first)
        allImages.sort((a, b) => {
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        });
        
        setImages(allImages);
      } catch (error) {
        console.error('Error loading images:', error);
        setError('Failed to load images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadImages();
  }, [activeFilter]);

  return (
    <>
      <SEO 
        title="Wedding Photography Images | Hariel Xavier Photography"
        description="Browse our collection of stunning wedding, engagement, and portrait photography images. Capturing authentic moments and creating timeless memories."
      />
      <Navigation />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
              alt="Wedding photography"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>
          <div className="relative text-center text-white max-w-3xl px-4">
            <h1 className="font-serif text-5xl md:text-6xl mb-4">Photography Collection</h1>
            <p className="text-xl font-light mb-8">Explore our curated collection of wedding and portrait photography</p>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-4xl text-center mb-6">Image Gallery</h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Browse through our collection of wedding, engagement, and portrait photography. Each image tells a unique story.
            </p>
            
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Image Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">{error}</p>
                <button 
                  onClick={() => setActiveFilter(activeFilter)} 
                  className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No images found for this filter.</p>
                <p className="text-sm text-gray-400">Try selecting a different category or check back later.</p>
              </div>
            ) : (
              <div ref={ref} className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${inView ? 'animate-fadeIn' : 'opacity-0'}`}>
                {images.map((image) => (
                  <div key={image.id} className="group relative overflow-hidden">
                    <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                      <img 
                        src={image.url} 
                        alt={image.caption || 'Wedding photograph'} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/600x800?text=Image+Not+Available';
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <div className="text-white">
                        {image.caption && (
                          <p className="font-medium mb-1">{image.caption}</p>
                        )}
                        <p className="text-sm opacity-80">
                          {image.galleryTitle || 'Photography Collection'}
                        </p>
                        <div className="flex justify-between items-center mt-3">
                          <Link 
                            to={`/gallery/${image.galleryId}`}
                            className="text-white text-sm hover:underline flex items-center"
                          >
                            View Gallery
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Link>
                          {image.featured && (
                            <span className="flex items-center text-sm">
                              <Heart className="w-3 h-3 mr-1 text-red-400" />
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { getPublicGalleries, getAllGalleries, Gallery } from '../services/galleryService';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import SEO from '../components/layout/SEO';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const GalleriesPage: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Get unique categories from galleries
  const categories = galleries.length > 0 
    ? ['all', ...new Set(galleries.map(gallery => gallery.category))]
    : ['all'];

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const galleriesData = await getPublicGalleries().catch(err => {
          // Handle missing index error
          if (err?.code === 'failed-precondition') {
            console.warn('Using fallback for public galleries due to missing index');
            // Fallback to getting all galleries and filtering in memory
            return getAllGalleries().then(galleries => 
              galleries.filter(gallery => gallery.isPublic)
            );
          }
          throw err; // Re-throw if it's not an index issue
        });
        setGalleries(galleriesData);
      } catch (err) {
        console.error('Error fetching galleries:', err);
        setError('Failed to load galleries');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGalleries();
  }, []);

  // Filter galleries by selected category
  const filteredGalleries = selectedCategory === 'all'
    ? galleries
    : galleries.filter(gallery => gallery.category === selectedCategory);

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate();
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEO 
        title="Client Galleries | Hariel Xavier Photography"
        description="Browse our client galleries of weddings, engagements, portraits, and more. Secure access to your professional photos."
      />
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-80 bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-4xl md:text-5xl font-serif mb-4 text-center">Client Galleries</h1>
          <p className="text-lg text-center max-w-3xl">
            Secure access to your professional photos. Browse, download, and share your memories.
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm ${
                    selectedCategory === category
                      ? 'bg-black text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Galleries */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white px-4 py-2"
            >
              Try Again
            </button>
          </div>
        ) : filteredGalleries.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-serif mb-4">No Galleries Found</h2>
            <p className="text-gray-600">
              {selectedCategory === 'all'
                ? "There are no galleries available at the moment."
                : `There are no galleries in the "${selectedCategory}" category.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGalleries.map(gallery => (
              <Link
                key={gallery.id}
                to={`/gallery/${gallery.slug}`}
                className="group block overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative aspect-w-3 aspect-h-2">
                  <img
                    src={gallery.thumbnailImage}
                    alt={gallery.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {gallery.isPasswordProtected && (
                    <div className="absolute top-4 right-4 bg-white p-2 rounded-full">
                      <Lock size={16} />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif mb-2">{gallery.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{gallery.location}</p>
                  <p className="text-gray-500 text-sm">{formatDate(gallery.eventDate)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Private Gallery Access */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif mb-6">Looking for Your Private Gallery?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            If you've been provided with a direct link or password to access your private gallery,
            please use the link sent to you or contact us for assistance.
          </p>
          <Link
            to="/pricing"
            className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800"
          >
            View Pricing
          </Link>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default GalleriesPage;

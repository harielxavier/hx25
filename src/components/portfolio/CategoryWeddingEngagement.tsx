import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Link } from 'react-router-dom';
import { FeaturedWeddingSkeleton, PortfolioGridSkeleton } from './SkeletonLoaders';
import { weddingGalleries as mockWeddingGalleries, engagementGalleries as mockEngagementGalleries } from '../../data/mockPortfolioData';

interface Gallery {
  id: string;
  title: string;
  coupleName: string;
  venueName: string;
  location: string;
  date: string;
  coverImage: string;
  featured: boolean;
  slug: string;
}

interface CategoryWeddingEngagementProps {
  categoryType: 'wedding' | 'engagement';
}

const CategoryWeddingEngagement: React.FC<CategoryWeddingEngagementProps> = ({ categoryType }) => {
  const [featuredGallery, setFeaturedGallery] = useState<Gallery | null>(null);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching ${categoryType} galleries...`);
        
        try {
          // Get featured gallery first
          const featuredQuery = query(
            collection(db, 'galleries'),
            where('type', '==', categoryType),
            where('featured', '==', true),
            orderBy('date', 'desc'),
            limit(1)
          );
          
          const featuredSnapshot = await getDocs(featuredQuery);
          
          let featuredId = '';
          if (!featuredSnapshot.empty) {
            const featuredData = featuredSnapshot.docs[0].data() as Gallery;
            featuredId = featuredSnapshot.docs[0].id;
            setFeaturedGallery({
              ...featuredData,
              id: featuredId
            });
            console.log(`Found featured ${categoryType} gallery: ${featuredData.title}`);
          } else {
            console.log(`No featured ${categoryType} gallery found in Firebase`);
          }
          
          // Get other galleries (excluding the featured one)
          const galleriesQuery = query(
            collection(db, 'galleries'),
            where('type', '==', categoryType),
            orderBy('date', 'desc'),
            limit(6)
          );
          
          const galleriesSnapshot = await getDocs(galleriesQuery);
          
          const galleriesData = galleriesSnapshot.docs
            .filter(doc => doc.id !== featuredId) // Exclude featured gallery
            .map(doc => {
              const data = doc.data() as Gallery;
              return {
                ...data,
                id: doc.id
              };
            });
          
          console.log(`Found ${galleriesData.length} ${categoryType} galleries in Firebase`);
          setGalleries(galleriesData);
        } catch (firebaseErr) {
          console.log(`Using mock ${categoryType} galleries due to Firebase error:`, firebaseErr);
          // Use mock data if Firebase fails
          const mockData = categoryType === 'wedding' ? mockWeddingGalleries : mockEngagementGalleries;
          
          // Set featured gallery
          const featured = mockData.find(gallery => gallery.featured);
          if (featured) {
            setFeaturedGallery(featured);
            console.log(`Using featured mock ${categoryType} gallery: ${featured.title}`);
          }
          
          // Set other galleries - STRICT FILTERING here
          const filteredGalleries = mockData.filter(gallery => !gallery.featured);
          console.log(`Using ${filteredGalleries.length} mock ${categoryType} galleries`);
          setGalleries(filteredGalleries.slice(0, 6));
        }
        
        setLoading(false);
      } catch (err) {
        console.error(`Error in ${categoryType} galleries logic:`, err);
        // Fallback to mock data with STRICT FILTERING
        const mockData = categoryType === 'wedding' ? mockWeddingGalleries : mockEngagementGalleries;
        const featured = mockData.find(gallery => gallery.featured);
        setFeaturedGallery(featured || null);
        
        const filteredGalleries = mockData.filter(gallery => !gallery.featured);
        console.log(`Fallback: Using ${filteredGalleries.length} mock ${categoryType} galleries after error`);
        setGalleries(filteredGalleries.slice(0, 6));
        setLoading(false);
      }
    };
    
    fetchGalleries();
  }, [categoryType]);

  const categoryTitle = categoryType === 'wedding' ? 'Weddings' : 'Engagements';

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Hero Image Section - Full width emotional impact image */}
      <section className="hero-section relative h-[60vh] mb-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url('${categoryType === 'wedding' ? 
              '/MoStuff/Portfolio/hero-wedding.jpg' : 
              '/MoStuff/Portfolio/hero-engagement.jpg'}')`
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="font-display text-4xl md:text-5xl mb-4">{categoryTitle}</h1>
          <p className="font-body text-lg md:text-xl max-w-2xl">
            {categoryType === 'wedding' ? 
              'Complete wedding day stories that capture the emotions, details, and moments that matter most.' :
              'Beautiful engagement portraits that celebrate your journey together before the big day.'}
          </p>
        </div>
      </section>
      
      {/* Featured Gallery Section */}
      {loading ? (
        <FeaturedWeddingSkeleton />
      ) : featuredGallery ? (
        <section className="featured-gallery mb-20 container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl text-center mb-8">Featured {categoryType === 'wedding' ? 'Wedding' : 'Engagement'}</h2>
            
            <Link to={`/gallery/${featuredGallery.slug}`} className="block">
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg shadow-lg mb-6">
                <img 
                  src={featuredGallery.coverImage} 
                  alt={`${featuredGallery.coupleName} - ${featuredGallery.venueName}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    // Fallback for image loading errors
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-image.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-display text-xl md:text-2xl mb-2">{featuredGallery.coupleName}</h3>
                  <p className="font-body text-md">
                    {featuredGallery.venueName} • {featuredGallery.location}
                  </p>
                  <span className="mt-4 inline-block px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-sm text-sm">
                    View Full Gallery
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      ) : null}
      
      {/* Gallery Thumbnails Grid - Exactly 6 galleries */}
      <section className="gallery-grid container mx-auto px-4 mb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-center mb-8">More Wedding Stories</h2>
          
          {loading ? (
            <PortfolioGridSkeleton />
          ) : galleries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {galleries.slice(0, 6).map(gallery => (
                <Link 
                  key={gallery.id} 
                  to={`/gallery/${gallery.slug}`}
                  className="gallery-item block rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={gallery.coverImage} 
                      alt={`${gallery.coupleName} - ${gallery.venueName}`}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      onError={(e) => {
                        // Fallback for image loading errors
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder-image.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all"></div>
                  </div>
                  
                  <div className="p-5 bg-white dark:bg-gray-900">
                    <h3 className="font-display text-lg">{gallery.coupleName}</h3>
                    <p className="font-body text-sm text-gray-600 dark:text-gray-400">
                      {gallery.venueName}, {gallery.location}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p>No {categoryTitle.toLowerCase()} galleries available</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryWeddingEngagement;

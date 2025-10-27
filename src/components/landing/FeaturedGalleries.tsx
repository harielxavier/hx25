import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { PLACEHOLDERS } from '../../utils/imageUtils';
import { Timestamp } from 'firebase/firestore';

// Define the FeaturedGallery interface since we're not importing it anymore
interface FeaturedGallery {
  id: string;
  galleryId: string;
  title: string;
  description: string;
  imageUrl: string;
  position: 'left' | 'middle' | 'right' | string;
  linkUrl: string;
  displayOrder: number;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

// Extended interface to include wedding-specific fields
interface WeddingGallery extends FeaturedGallery {
  coupleName?: string;
  venue?: string;
  location?: string;
}

const FeaturedGalleries: React.FC = () => {
  const [galleries, setGalleries] = useState<WeddingGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    const loadGalleries = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Since we don't have the actual service, we'll use placeholder data
        // This simulates what the getFeaturedGalleries function would return
        const placeholders: WeddingGallery[] = [
          {
            id: 'wedding-gallery-1',
            galleryId: 'wedding-gallery-1',
            title: 'Bianca & Jeffrey\'s Wedding',
            description: 'A beautiful wedding celebration at Park Chateau Estate & Gardens',
            imageUrl: '/MoStuff/Featured Wedding/Bianca & Jeffrey\'s Wedding/The Ceremony/Bianca & Jeff_s Wedding-826.jpg',
            position: 'left',
            linkUrl: '/bianca-jeffrey',
            displayOrder: 1,
            createdAt: null,
            updatedAt: null,
            coupleName: 'Bianca & Jeffrey',
            venue: 'Park Chateau Estate & Gardens',
            location: 'East Brunswick, NJ'
          },
          {
            id: 'wedding-gallery-2',
            galleryId: 'wedding-gallery-2',
            title: 'Jackie & Chris\'s Wedding',
            description: 'An intimate wedding at The Inn at Millrace Pond',
            imageUrl: 'https://res.cloudinary.com/dos0qac90/image/upload/v1761593156/hariel-xavier-photography/MoStuff/Featured_Wedding/Jackie_and_Chriss_Wedding_/jmt__44_of_61_.jpg',
            position: 'middle',
            linkUrl: '/jackie-chris',
            displayOrder: 2,
            createdAt: null,
            updatedAt: null,
            coupleName: 'Jackie & Chris',
            venue: 'The Inn at Millrace Pond',
            location: 'Hope, NJ'
          },
          {
            id: 'wedding-gallery-3',
            galleryId: 'wedding-gallery-3',
            title: 'Ainsimon & Mina\'s Wedding',
            description: 'A breathtaking celebration at Legacy Castle',
            imageUrl: '/view/2.jpg',
            position: 'right',
            linkUrl: '/ansimon-mina',
            displayOrder: 3,
            createdAt: null,
            updatedAt: null,
            coupleName: 'Ainsimon & Mina',
            venue: 'Legacy Castle',
            location: 'Pompton Plains, NJ'
          }
        ];
        
        setGalleries(placeholders);
      } catch (error) {
        console.error('Error loading featured galleries:', error);
        setError('Failed to load featured galleries. Please try again later.');
        
        // Use a simplified version of our main galleries as fallback
        const fallbackGalleries: WeddingGallery[] = [
          {
            id: 'wedding-gallery-1',
            galleryId: 'wedding-gallery-1',
            title: 'Jackie & Chris\'s Wedding',
            description: 'An intimate wedding at The Inn at Millrace Pond',
            imageUrl: PLACEHOLDERS.DEFAULT,
            position: 'left',
            linkUrl: '/jackie-chris',
            displayOrder: 1,
            createdAt: null,
            updatedAt: null,
            coupleName: 'Jackie & Chris',
            venue: 'The Inn at Millrace Pond',
            location: 'Hope, NJ'
          },
          {
            id: 'wedding-gallery-2',
            galleryId: 'wedding-gallery-2',
            title: 'Ansimon & Mina\'s Wedding',
            description: 'A luxurious wedding celebration at The Venetian',
            imageUrl: PLACEHOLDERS.DEFAULT,
            position: 'middle',
            linkUrl: '/ansimon-mina',
            displayOrder: 2,
            createdAt: null,
            updatedAt: null,
            coupleName: 'Ansimon & Mina',
            venue: 'The Venetian',
            location: 'Garfield, NJ'
          },
          {
            id: 'wedding-gallery-3',
            galleryId: 'wedding-gallery-3',
            title: 'Bianca & Jeffrey\'s Wedding',
            description: 'A beautiful wedding celebration at Park Chateau Estate & Gardens',
            imageUrl: PLACEHOLDERS.DEFAULT,
            position: 'right',
            linkUrl: '/bianca-jeffrey',
            displayOrder: 3,
            createdAt: null,
            updatedAt: null,
            coupleName: 'Bianca & Jeffrey',
            venue: 'Park Chateau Estate & Gardens',
            location: 'East Brunswick, NJ'
          }
        ];
        setGalleries(fallbackGalleries);
      } finally {
        setLoading(false);
      }
    };
    
    loadGalleries();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white"
      id="featured-galleries"
      aria-label="Featured Wedding Galleries"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Featured Weddings</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our collection of beautiful wedding photography, including our newest feature: Wedding Gallery 1 at Luxury Wedding Venue.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-rose-300 border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleries.map((gallery, index) => (
              <div
                key={gallery.id}
                className={`group relative overflow-hidden transition-all duration-700 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: `${index * 200}ms`
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg">
                  <img
                    src={gallery.imageUrl}
                    alt={`Gallery: ${gallery.title} at ${gallery.venue || ''}, ${gallery.location || ''}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      console.error(`Failed to load image: ${gallery.imageUrl}`);
                      e.currentTarget.src = '/images/placeholders/default.jpg';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
                  <h3 className="text-2xl font-serif mb-2">{gallery.coupleName}</h3>
                  <div className="flex items-center text-white/80 mb-2">
                    <span className="mr-4">{gallery.venue}</span>
                  </div>
                  <div className="flex items-center text-white/70 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{gallery.location}</span>
                  </div>
                  <Link
                    to={gallery.linkUrl}
                    className="inline-flex items-center text-white border-b border-white pb-1 hover:text-rose-200 hover:border-rose-200 transition-colors"
                  >
                    View Wedding
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* "View All Wedding Galleries" link removed as requested */}
      </div>
    </section>
  );
};

export default FeaturedGalleries;

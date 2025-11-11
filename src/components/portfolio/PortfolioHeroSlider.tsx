import React, { useState, useEffect } from 'react';
// REMOVED FIREBASE: import { collection, getDocs, query, orderBy, limit // REMOVED FIREBASE
// REMOVED FIREBASE: import { db } from '../../firebase/config';
import { transformImageUrl } from '../../utils/imageOptimizationUtils';
import { HeroSkeleton } from './SkeletonLoaders';
import { heroImages as mockHeroImages } from '../../data/mockPortfolioData';

interface HeroImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface PortfolioHeroSliderProps {
  photographerName: string;
  location: string;
}

const PortfolioHeroSlider: React.FC<PortfolioHeroSliderProps> = ({ 
  photographerName, 
  location 
}) => {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error] = useState<string | null>(null);

  // Key for forcing refresh when images are updated
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const forceRefresh = () => setRefreshKey(Date.now());
  
  // Fetch featured hero images from Firebase
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        setLoading(true);
        
        // Get featured hero images (marked as featured and sorted by order)
        const heroImagesRef = query(
          collection(db, 'heroImages'),
          orderBy('order', 'asc'),
          limit(4)
        );
        
        try {
          const imagesSnapshot = await getDocs(heroImagesRef);
          
          if (imagesSnapshot.empty) {
            console.log('No hero images found in Firebase, using local images from hero3 directory');
            // If no images found, use mock data with local hero3 directory images
            setImages(mockHeroImages);
          } else {
            const imagesData = imagesSnapshot.docs.map(doc => {
              const data = doc.data() as HeroImage;
              return {
                ...data,
                id: doc.id
              };
            });
            
            setImages(imagesData);
          }
        } catch (firebaseErr) {
          console.log('Using hero images from local hero3 directory due to Firebase error');
          // Use mock data with local hero3 directory images if Firebase fails
          setImages(mockHeroImages);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in hero images logic:', err);
        // Fallback to mock data
        setImages(mockHeroImages);
        setLoading(false);
      }
    };
    
    fetchHeroImages();
  }, []);

  // Force refresh when component mounts to reload images
  useEffect(() => {
    // Set a small delay to ensure any file system changes are processed
    const refreshTimer = setTimeout(() => {
      forceRefresh();
    }, 100);
    
    // Set up an interval to periodically refresh the component
    const refreshInterval = setInterval(() => {
      forceRefresh();
    }, 5000); // Check for updates every 5 seconds
    
    return () => {
      clearTimeout(refreshTimer);
      clearInterval(refreshInterval);
    };
  }, []);
  
  // Auto-advance slides
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 6000); // Change slide every 6 seconds
    
    return () => clearInterval(interval);
  }, [images.length]);

  // Handle manual navigation
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return <HeroSkeleton />;
  }

  if (error) {
    return (
      <div className="relative h-[85vh] flex items-center justify-center bg-gray-900">
        <p className="text-white text-xl">{error}</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="relative h-[85vh] flex items-center justify-center bg-gray-900">
        <p className="text-white text-xl">No hero images available</p>
      </div>
    );
  }

  return (
    <section className="hero-slider relative h-[65vh] overflow-hidden bg-black">
      {/* Slides */}
      <div className="slides relative h-full">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0 flex justify-center items-center overflow-hidden" 
              style={{ 
                backgroundColor: '#000'
              }}
              data-image-path={image.src}
            >
              <img
                src={`${transformImageUrl(image.src, 1920)}${image.src.includes('?') ? '' : `?refresh=${refreshKey}`}`}
                alt={image.alt}
                className="h-full w-full object-cover"
                style={{
                  objectPosition: 'center 30%'
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 z-10">
        <h1 className="font-display text-3xl md:text-4xl mb-2">{photographerName}</h1>
        <h2 className="font-display text-xl md:text-2xl mb-3">Wedding Photographer</h2>
        <p className="font-body text-base md:text-lg">{location}</p>
      </div>

      {/* Navigation Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PortfolioHeroSlider;

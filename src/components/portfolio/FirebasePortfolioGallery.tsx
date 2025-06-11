import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { transformImageUrl } from '../../utils/imageOptimizationUtils';
import { PortfolioGridSkeleton } from './SkeletonLoaders';
import Lightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import EnhancedGallerySelector from './EnhancedGallerySelector';

interface PortfolioImage {
  id: string;
  src: string;
  alt: string;
  section: string;
  featured: boolean;
  width: number;
  height: number;
  order?: number;
}

interface PortfolioSection {
  id: string;
  title: string;
  description: string;
}

interface Portfolio {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  location: string;
  coverImage: string;
  fallbackImage: string;
  featured: boolean;
  description: string;
  testimonial: string;
  clientName: string;
  packageInfo: string;
  packageDetails: string;
  limitedAvailability: boolean;
  tags: string[];
  imageCount: number;
  sections: PortfolioSection[];
  images?: PortfolioImage[];
}

interface FirebasePortfolioGalleryProps {
  portfolioId: string;
  activeSection?: string | null;
  onImageClick?: (imageId: string) => void;
  enableCoverSelection?: boolean;
  isAdmin?: boolean;
}

const FirebasePortfolioGallery = ({ 
  portfolioId, 
  activeSection = null,
  enableCoverSelection = false,
  isAdmin = false
}: FirebasePortfolioGalleryProps) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCoverSelector, setShowCoverSelector] = useState(false);
  const [showImageNumbers, setShowImageNumbers] = useState(true);

  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get portfolio document
        const portfolioRef = doc(db, 'portfolios', portfolioId);
        const portfolioSnap = await getDoc(portfolioRef);
        
        if (!portfolioSnap.exists()) {
          setError(`Portfolio with ID ${portfolioId} not found`);
          setLoading(false);
          return;
        }
        
        // Get portfolio data
        const portfolioData = portfolioSnap.data() as Portfolio;
        setPortfolio(portfolioData);
        
        // Get portfolio images
        const imagesRef = collection(db, 'portfolios', portfolioId, 'images');
        const imagesSnap = await getDocs(imagesRef);
        
        const imagesData = imagesSnap.docs.map(doc => {
          const data = doc.data() as PortfolioImage;
          return data;
        });
        
        // Sort images by order if available, otherwise by ID
        const sortedImages = imagesData.sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return a.id.localeCompare(b.id);
        });
        
        setImages(sortedImages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPortfolio();
  }, [portfolioId]);

  // Filter images by section if activeSection is provided
  const filteredImages = activeSection
    ? images.filter(img => img.section === activeSection)
    : images;

  if (loading) {
    return <PortfolioGridSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="text-center py-20">
        <p>Portfolio not found</p>
      </div>
    );
  }

  // Initialize PhotoSwipe Lightbox
  useEffect(() => {
    if (loading) return;
    
    // Premium PhotoSwipe configuration
    const lightbox = new Lightbox({
      gallery: '.portfolio-gallery',
      children: 'a',
      pswpModule: () => import('photoswipe'),
      bgOpacity: 0.92,                // Darker, more dramatic background
      showHideOpacity: true,          // Elegant fade transitions
      spacing: 0.12,                  // Increased spacing for premium feel
      loop: true,                     // Seamless browsing experience
      hideAnimationDuration: 500,     // Slower, more refined animations
      showAnimationDuration: 800,
      preload: [1,3],                 // Preload more adjacent images for seamless experience
      paddingFn: () => ({ top: 30, bottom: 30, left: 30, right: 30 }),
      wheelToZoom: true,
      initialZoomLevel: 'fit',
      secondaryZoomLevel: 2,
      maxZoomLevel: 4,
      arrowPrev: true,
      arrowNext: true,
      counter: true,
      zoom: true
    });
    
    lightbox.init();
    
    return () => {
      lightbox.destroy();
    };
  }, [loading, filteredImages]);
  
  return (
    <div className="portfolio-gallery portfolio-grid premium-spacing">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowImageNumbers(!showImageNumbers)}
              className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="mr-2">{showImageNumbers ? 'Hide' : 'Show'} Numbers</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </button>
          </div>
          
          {enableCoverSelection && (
            <button
              onClick={() => setShowCoverSelector(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Set as Album Cover
            </button>
          )}
        </div>
      )}
      
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {filteredImages.map((image, index) => (
          <figure 
            key={image.id}
            className="portfolio-item relative overflow-hidden rounded-sm shadow-md transition-all duration-300 hover:shadow-xl"
          >
            <a 
              href={transformImageUrl(image.src, 1800)}
              data-pswp-width={image.width}
              data-pswp-height={image.height}
              data-cropped="true"
              data-pswp-src={transformImageUrl(image.src, 1800)}
              className="block relative overflow-hidden group"
            >
              {/* Number Identifier */}
              {showImageNumbers && (
                <div className="absolute top-3 left-3 z-10 bg-black bg-opacity-70 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              )}
              
              {/* Current Cover Indicator */}
              {portfolio && portfolio.coverImage === image.src && (
                <div className="absolute top-3 right-3 z-10 bg-green-600 text-white rounded-md px-2 py-1 text-xs font-semibold">
                  Cover
                </div>
              )}
              
              {/* Progressive image loading with blur placeholder */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  src={transformImageUrl(image.src, 600)} 
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = portfolio?.fallbackImage || '/images/placeholder-image.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-500"></div>
              </div>
              
              {/* Image metadata */}
              <div className="p-4 bg-white dark:bg-gray-900">
                <h3 className="text-lg font-display">
                  {showImageNumbers && <span className="text-gray-500 mr-2">#{index + 1}</span>}
                  {image.alt || 'Untitled'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{portfolio?.location}</p>
              </div>
            </a>
          </figure>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="text-center py-20">
          <p>No images found for this section</p>
        </div>
      )}
      
      {/* Cover Image Selector Modal */}
      {showCoverSelector && portfolio && (
        <EnhancedGallerySelector
          portfolioId={portfolioId}
          images={images}
          currentCoverImageId={images.find(img => img.src === portfolio.coverImage)?.id}
          onClose={() => setShowCoverSelector(false)}
        />
      )}
    </div>
  );
};

export default FirebasePortfolioGallery;

import React, { useEffect, useRef, useState } from 'react';
import Lightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { PortfolioGridSkeleton } from './SkeletonLoaders';

interface PortfolioItem {
  id: string;
  thumbnail: string;
  fullImage: string;
  width: number;
  height: number;
  caption: string;
  couple: string;
  location: string;
  category: string;
}

interface CuratedPortfolioGridProps {
  category: string;
}

const CuratedPortfolioGrid: React.FC<CuratedPortfolioGridProps> = ({ category }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  
  // Sample portfolio items - replace with actual data from CMS
  const portfolioItems: PortfolioItem[] = [
    {
      id: '1',
      thumbnail: 'https://source.unsplash.com/random/800x1000/?wedding,editorial',
      fullImage: 'https://source.unsplash.com/random/2400x3000/?wedding,editorial',
      width: 2400,
      height: 3000,
      caption: 'Alexandra & James - Villa Cimbrone, Ravello',
      couple: 'Alexandra & James',
      location: 'Villa Cimbrone, Italy',
      category: 'Editorial'
    },
    {
      id: '2',
      thumbnail: 'https://source.unsplash.com/random/800x600/?wedding,luxury',
      fullImage: 'https://source.unsplash.com/random/2400x1800/?wedding,luxury',
      width: 2400,
      height: 1800,
      caption: 'Olivia & William - Château de Versailles',
      couple: 'Olivia & William',
      location: 'Château de Versailles, France',
      category: 'Destination'
    },
    {
      id: '3',
      thumbnail: 'https://source.unsplash.com/random/800x1200/?wedding,couple',
      fullImage: 'https://source.unsplash.com/random/2400x3600/?wedding,couple',
      width: 2400,
      height: 3600,
      caption: 'Emma & Michael - The Plaza, New York',
      couple: 'Emma & Michael',
      location: 'The Plaza, New York',
      category: 'Black Tie'
    },
    {
      id: '4',
      thumbnail: 'https://source.unsplash.com/random/800x800/?wedding,intimate',
      fullImage: 'https://source.unsplash.com/random/2400x2400/?wedding,intimate',
      width: 2400,
      height: 2400,
      caption: 'Sophia & Ethan - Private Villa, Tuscany',
      couple: 'Sophia & Ethan',
      location: 'Private Villa, Tuscany',
      category: 'Intimate'
    },
    {
      id: '5',
      thumbnail: 'https://source.unsplash.com/random/800x1100/?wedding,editorial',
      fullImage: 'https://source.unsplash.com/random/2400x3300/?wedding,editorial',
      width: 2400,
      height: 3300,
      caption: 'Isabella & Thomas - Lake Como',
      couple: 'Isabella & Thomas',
      location: 'Lake Como, Italy',
      category: 'Editorial'
    },
    {
      id: '6',
      thumbnail: 'https://source.unsplash.com/random/800x900/?wedding,destination',
      fullImage: 'https://source.unsplash.com/random/2400x2700/?wedding,destination',
      width: 2400,
      height: 2700,
      caption: 'Charlotte & Henry - Santorini',
      couple: 'Charlotte & Henry',
      location: 'Santorini, Greece',
      category: 'Destination'
    }
  ];
  
  // Filter items by category if needed
  const filteredItems = category === 'ALL' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === category);
  
  // Simulate loading data from Firebase
  useEffect(() => {
    // Simulate network request
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulate loading time
    
    return () => clearTimeout(timer);
  }, [category]);
  
  // Initialize PhotoSwipe Lightbox
  useEffect(() => {
    if (!gridRef.current || loading) return;
    
    // Premium PhotoSwipe configuration
    const lightbox = new Lightbox({
      gallery: '.portfolio-grid',
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
  }, [filteredItems, category]);
  
  return (
    <>
      {/* PhotoSwipe is now initialized via the Lightbox component */}
      
      {/* Show skeleton loader during loading */}
      {loading ? (
        <PortfolioGridSkeleton />
      ) : (
        /* Portfolio grid */
        <div 
          ref={gridRef}
          className="portfolio-grid premium-spacing grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
        >
        {filteredItems.map((item, index) => (
          <figure 
            key={item.id} 
            className={`grid-item ${item.category.toLowerCase()} relative overflow-hidden rounded-sm shadow-lg`}
            data-index={index}
          >
            <a 
              href={item.fullImage} 
              data-pswp-width={item.width}
              data-pswp-height={item.height}
              data-cropped="true"
              data-pswp-src={item.fullImage}
              className="block relative overflow-hidden group"
            >
              {/* Progressive image loading with blur placeholder */}
              <div 
                className="absolute inset-0 bg-gray-100 dark:bg-gray-800 blur-lg transform scale-105"
                style={{ 
                  backgroundImage: `url(${item.thumbnail}?q=10&w=20)`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center'
                }}
              ></div>
              
              <img 
                src={item.thumbnail} 
                alt={item.caption} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 relative z-10"
                loading="lazy"
              />
              
              {/* Elegant caption reveal on hover */}
              <figcaption className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 text-white">
                <h3 className="font-display text-xl tracking-wide mb-1">{item.couple}</h3>
                <p className="font-body text-sm tracking-wider opacity-90">{item.location}</p>
              </figcaption>
            </a>
          </figure>
        ))}
        </div>
      )}
    </>
  );
};

export default CuratedPortfolioGrid;

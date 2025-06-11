import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Heart } from 'lucide-react';
import Lightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { useEffect, useRef } from 'react';

// Direct image imports to guarantee they work - EXACTLY matching the folder structure
const IMAGES: { id: string; section: string; featured?: boolean }[] = [];

// Create images array with correct path pattern 'cd1.jpg' through 'cd47.jpg'
for (let i = 1; i <= 47; i++) {
  const section = 
    i <= 9 ? 'preparation' :
    i <= 22 ? 'ceremony' : 
    i <= 35 ? 'portraits' : 
    'reception';
    
  IMAGES.push({
    id: `cd${i}`,
    section: section,
    featured: i === 14 // using cd14.jpg as featured based on previous data
  });
}

interface GalleryImage {
  id: string;
  src: string;
  section: string;
  featured?: boolean;
  width: number;
  height: number;
  alt: string;
}

const CrystaDavidGallery: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Format the images with the EXACT path from the screenshot
  const formattedImages: GalleryImage[] = IMAGES.map(img => ({
    id: img.id,
    src: `/crystadavid/${img.id}.jpg`,  // Using the EXACT path from the screenshot
    section: img.section,
    featured: img.featured || false,
    width: 1200,
    height: 800,
    alt: `Crysta & David wedding - ${img.section}`
  }));

  // Initialize PhotoSwipe lightbox
  useEffect(() => {
    if (!galleryRef.current) return;
    
    const lightbox = new Lightbox({
      gallery: '.gallery-grid',
      children: 'a',
      pswpModule: () => import('photoswipe'),
      bgOpacity: 0.92,
      showHideOpacity: true,
      spacing: 0.12,
      loop: true,
      hideAnimationDuration: 500,
      showAnimationDuration: 800,
      preload: [1,3],
      paddingFn: () => ({ top: 30, bottom: 30, left: 30, right: 30 }),
      wheelToZoom: true,
    });
    
    lightbox.init();
    
    return () => {
      lightbox.destroy();
    };
  }, []);
  
  // Get all available sections from the images
  const sections = Array.from(new Set(formattedImages.map(img => img.section)));
  
  // Filter images based on the active section
  const filteredImages = activeSection 
    ? formattedImages.filter(img => img.section === activeSection)
    : formattedImages;
  
  // Used for page loading indicator
  useEffect(() => {
    // Simulate checking if images are loaded
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section with Featured Image */}
      <section className="relative h-[60vh] overflow-hidden">
        <img 
          src={formattedImages.find(img => img.featured)?.src || '/crysta-david/cdw-170.jpg'} 
          alt="Crysta & David Wedding"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            // Try alternate paths
            const target = e.target as HTMLImageElement;
            // First try the encoded path
            const encodedPath = '/Crysta%20%26%20David/cdw-170.jpg';
            console.log(`Image failed, trying: ${encodedPath}`);
            target.src = encodedPath;
            
            // Set up a second error handler for the encoded path
            target.onerror = () => {
              // Then try path with spaces
              const spacePath = '/Crysta & David/cdw-170.jpg';
              console.log(`Encoded path failed, trying: ${spacePath}`);
              target.src = spacePath;
              
              // Final fallback
              target.onerror = () => {
                console.log('All paths failed, using placeholder');
                target.src = '/images/placeholder-image.jpg';
              };
            };
          }}
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">Crysta & David</h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-4 h-4" />
              <span>Skyline Manor, Omaha, NE</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>September 18, 2023</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Gallery Content */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl mb-4">Their Special Day</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Crysta and David's wedding at Skyline Manor was a breathtaking celebration filled with love, laughter, and unforgettable moments. The venue's panoramic views provided a stunning backdrop for their ceremony and reception, perfectly complementing the couple's heartfelt vows and joyous celebration.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              From the intimate moments during preparation to the emotional ceremony and lively reception, every aspect of their day was captured to tell the complete story of their love. The gallery is organized to take you through their journey, showcasing the authentic moments that made their day so special.
            </p>
          </div>
          <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-lg">
            <div className="flex gap-3 items-center mb-4">
              <Heart className="text-rose-500" />
              <h3 className="font-serif text-xl">Venue Highlights</h3>
            </div>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li>• Elegant ballroom with crystal chandeliers</li>
              <li>• Panoramic views of the city skyline</li>
              <li>• Beautiful outdoor ceremony space</li>
              <li>• Stunning garden for portraits</li>
              <li>• Grand staircase for dramatic entrances</li>
            </ul>
          </div>
        </div>
        
        {/* Gallery Sections Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveSection(null)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeSection === null 
                  ? 'bg-black text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'
              }`}
            >
              All Photos
            </button>
            {sections.map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeSection === section 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-rose-200 dark:hover:bg-rose-800'
                }`}
              >
                {section === 'preparation' ? 'Getting Ready' :
                 section === 'ceremony' ? 'The Ceremony' :
                 section === 'portraits' ? 'Couple Portraits' :
                 section === 'reception' ? 'The Celebration' :
                 section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Gallery Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
          </div>
        ) : (
          <div 
            ref={galleryRef}
            className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredImages.map(image => (
              <figure 
                key={image.id}
                className="gallery-item overflow-hidden rounded-md shadow-md hover:shadow-xl transition-all"
              >
                <a 
                  href={image.src}
                  data-pswp-width={image.width}
                  data-pswp-height={image.height}
                  data-cropped="true"
                  data-pswp-src={image.src}
                  className="block relative overflow-hidden aspect-square"
                >
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      console.log(`Image failed to load: ${image.src}`);
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder-image.jpg';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <span className="text-white/90 text-sm">
                      {image.section === 'preparation' ? 'Getting Ready' :
                       image.section === 'ceremony' ? 'The Ceremony' :
                       image.section === 'portraits' ? 'Couple Portraits' :
                       image.section === 'reception' ? 'The Celebration' :
                       image.section.charAt(0).toUpperCase() + image.section.slice(1)}
                    </span>
                  </div>
                </a>
              </figure>
            ))}
          </div>
        )}
      </section>
      
      {/* Call to Action */}
      <div className="text-center py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="font-serif text-2xl md:text-3xl mb-4">Ready to capture your own special day?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">Every wedding tells a unique story. I'd love to help tell yours through beautiful, meaningful photography.</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/contact" 
              className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Check My Availability
            </Link>
            
            <Link 
              to="/portfolio" 
              className="inline-block px-6 py-3 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"
            >
              Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrystaDavidGallery;

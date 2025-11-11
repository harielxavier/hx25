import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
// REMOVED FIREBASE: import { doc, getDoc, collection, getDocs, query, orderBy, where // REMOVED FIREBASE
// REMOVED FIREBASE: import { db } from '../../firebase/config';
import { transformImageUrl } from '../../utils/imageOptimizationUtils';
import { HeroSkeleton, PortfolioGridSkeleton } from './SkeletonLoaders';
import Lightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { crystaDavidImages, crystaDavidGalleryData } from '../../data/crystaDavidGallery';
import { MapPin, Camera, Heart, Sun, BookOpen, Quote } from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  location: string;
  description: string;
  highlightImages: string[];
  website?: string;
  features?: {
    title: string;
    description: string;
  }[];
  photoSpots?: {
    name: string;
    description: string;
  }[];
  images?: string[];
  history?: string;
}

interface Gallery {
  id: string;
  title: string;
  coupleName: string;
  venueName: string;
  venueId: string;
  location: string;
  date: string;
  coverImage: string;
  description: string;
  type: 'wedding' | 'engagement';
  slug: string;
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  section?: string;
  featured?: boolean;
  order?: number;
}

const GalleryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Available sections for filtering
  const [sections, setSections] = useState<string[]>([]);

  useEffect(() => {
    const fetchGalleryData = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // First check if this is Crysta & David's gallery
        if (slug === 'crysta-david-skyline-manor') {
          console.log('Loading Crysta & David gallery from local data');
          setGallery(crystaDavidGalleryData as unknown as Gallery);
          setVenue(crystaDavidGalleryData.venue as unknown as Venue);
          setImages(crystaDavidImages);
          
          // Extract unique sections if they exist
          const uniqueSections = Array.from(
            new Set(crystaDavidImages.map((img: any) => img.section).filter(Boolean) as string[])
          );
          
          setSections(uniqueSections);
          setLoading(false);
          return;
        }
        
        // Otherwise try to find gallery by slug in Firebase
        const galleriesRef = query(
          collection(db, 'galleries'),
          where('slug', '==', slug)
        );
        
        const gallerySnapshot = await getDocs(galleriesRef);
        
        if (gallerySnapshot.empty) {
          // If not found in Firebase and not the local Crysta & David gallery,
          // then it really is not found
          setError(`Gallery not found: ${slug}`);
          setLoading(false);
          return;
        }
        
        // Get gallery data from Firebase
        const galleryData = gallerySnapshot.docs[0].data() as Gallery;
        const galleryId = gallerySnapshot.docs[0].id;
        
        setGallery({
          ...galleryData,
          id: galleryId
        });
        
        // Get venue information
        if (galleryData.venueId) {
          const venueRef = doc(db, 'venues', galleryData.venueId);
          const venueSnap = await getDoc(venueRef);
          
          if (venueSnap.exists()) {
            const venueData = venueSnap.data() as Venue;
            setVenue({
              ...venueData,
              id: venueSnap.id
            });
          }
        }
        
        // Get gallery images
        const imagesRef = query(
          collection(db, 'galleries', galleryId, 'images'),
          orderBy('order', 'asc')
        );
        
        const imagesSnapshot = await getDocs(imagesRef);
        
        if (!imagesSnapshot.empty) {
          const imagesData = imagesSnapshot.docs.map(doc => {
            const data = doc.data() as GalleryImage;
            return {
              ...data,
              id: doc.id
            };
          });
          
          // Extract unique sections
          const uniqueSections = Array.from(
            new Set(imagesData.map(img => img.section).filter(Boolean) as string[])
          );
          
          setSections(uniqueSections);
          setImages(imagesData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching gallery:', err);
        
        // Check if this is Crysta & David's gallery before giving up
        if (slug === 'crysta-david-skyline-manor') {
          console.log('Firebase error - Falling back to local Crysta & David data');
          setGallery(crystaDavidGalleryData as unknown as Gallery);
          setVenue(crystaDavidGalleryData.venue as unknown as Venue);
          setImages(crystaDavidImages);
          
          // Extract unique sections if they exist
          const uniqueSections = Array.from(
            new Set(crystaDavidImages.map((img: any) => img.section).filter(Boolean) as string[])
          );
          
          setSections(uniqueSections);
          setLoading(false);
          return;
        }
        
        setError('Failed to load gallery');
        setLoading(false);
      }
    };
    
    fetchGalleryData();
  }, [slug]);

  // Initialize PhotoSwipe
  useEffect(() => {
    if (loading || !galleryRef.current || images.length === 0) return;
    
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
  }, [loading, images]);

  // Get featured image for hero
  const featuredImage = images.find(img => img.featured === true) || images[0];
  
  // Filter images by section
  const filteredImages = activeSection
    ? images.filter(img => img.section === activeSection)
    : images;

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
        <Link to="/portfolio" className="inline-block mt-4 text-rose-500 hover:underline">
          Return to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="gallery-detail">
      {/* Hero Section - Reduced Size */}
      {loading ? (
        <HeroSkeleton />
      ) : gallery ? (
        <section className="hero-section relative h-[40vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: `url('${featuredImage?.src || gallery.coverImage}')`
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="font-display text-3xl md:text-4xl mb-3">{gallery.coupleName}</h1>
            <p className="font-body text-lg md:text-xl">{gallery.venueName}, {gallery.location}</p>
          </div>
        </section>
      ) : null}
      
      {/* Venue Spotlight Section - Styled like Picatinny Club */}
      {venue && (
        <section className="venue-spotlight py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Venue Header */}
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-4xl mb-4">{venue.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" /> {venue.location}
                </p>
              </div>
              
              {/* Main Venue Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {/* Left Column: Venue Image */}
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img 
                    src={venue.highlightImages?.[0] || gallery?.coverImage} 
                    alt={`${venue.name} - ${venue.location}`}
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
                
                {/* Right Column: Venue Description */}
                <div className="flex flex-col justify-center">
                  <div className="prose dark:prose-invert max-w-none mb-6">
                    <h3 className="font-serif text-2xl mb-4">About the Venue</h3>
                    <p>{venue.description}</p>
                    
                    {venue.history && (
                      <div className="mt-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-rose-500" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium mb-2">History</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {venue.history}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {venue.website && (
                    <a 
                      href={venue.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors mt-4 w-full md:w-auto text-center"
                    >
                      Visit Venue Website
                    </a>
                  )}
                </div>
              </div>
              
              {/* Why We Love This Venue */}
              <div className="mb-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="p-8">
                  <h3 className="font-serif text-2xl mb-6 text-center">Why We Love {venue.name}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature 1 */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center mb-4">
                        <Sun className="w-6 h-6 text-rose-500" />
                      </div>
                      <h4 className="font-medium text-lg mb-2">Perfect Lighting</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {venue.name} offers exceptional natural light that creates stunning, flattering portraits throughout the day.
                      </p>
                    </div>
                    
                    {/* Feature 2 */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center mb-4">
                        <Camera className="w-6 h-6 text-rose-500" />
                      </div>
                      <h4 className="font-medium text-lg mb-2">Versatile Spaces</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        From intimate ceremonies to grand receptions, this venue provides diverse settings for every moment of your wedding day.
                      </p>
                    </div>
                    
                    {/* Feature 3 */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center mb-4">
                        <Heart className="w-6 h-6 text-rose-500" />
                      </div>
                      <h4 className="font-medium text-lg mb-2">Distinctive Architecture</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        The unique design elements create memorable backdrops for truly one-of-a-kind wedding photographs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Perfect Photo Spots */}
              <div className="mb-16">
                <h3 className="font-serif text-2xl mb-6 text-center">Perfect Photo Spots</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {venue.photoSpots ? (
                    venue.photoSpots.map((spot, index) => (
                      <div key={index} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                        <h4 className="font-medium text-lg mb-2">{spot.name}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{spot.description}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                        <h4 className="font-medium text-lg mb-2">Outdoor Ceremony Space</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Natural lighting filtered through trees creates a magical atmosphere for ceremony photos.
                        </p>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                        <h4 className="font-medium text-lg mb-2">Grand Staircase</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Perfect for dramatic portraits and group photos with elegant architectural details.
                        </p>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                        <h4 className="font-medium text-lg mb-2">Garden Pathway</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Secluded spots ideal for intimate couple portraits surrounded by natural beauty.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Venue Highlight Images */}
              {venue.highlightImages && venue.highlightImages.length > 0 && (
                <div>
                  <h3 className="font-serif text-2xl mb-6 text-center">Venue Highlights</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {venue.highlightImages.slice(0, 8).map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={transformImageUrl(image, 600)} 
                          alt={`${venue.name} - Highlight ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      
      {/* Gallery Section */}
      <section className="gallery-section py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center mb-6">
            {gallery?.type === 'wedding' ? 'Wedding' : 'Engagement'} Gallery
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {slug === 'crysta-david-skyline-manor' ? 
              'A stunning September wedding at Skyline Manor featuring our favorite images from Crysta & David\'s special day.' : 
              'Browse through our favorite moments captured at this beautiful celebration.'}
          </p>
          
          {/* Emotional Quote - part of the emotional journey approach */}
          {slug === 'crysta-david-skyline-manor' && (
            <div className="max-w-3xl mx-auto mb-12 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <Quote className="w-10 h-10 text-rose-300 flex-shrink-0" />
                <div>
                  <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-3">
                    "Hariel captured every moment so beautifully - from our nervous excitement getting ready to our first dance. Looking at these photos takes us right back to that perfect day at Skyline Manor."
                  </p>
                  <p className="text-right text-gray-600 dark:text-gray-400 font-medium">— Crysta & David</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Journey Description - context for the emotional story */}
          {slug === 'crysta-david-skyline-manor' && activeSection === null && (
            <div className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              <p>Their wedding day told as a complete story - from the quiet moments of preparation, through their heartfelt ceremony, romantic portraits around the beautiful grounds of Skyline Manor, and into the joyful celebration of their reception.</p>
            </div>
          )}
          
          {/* Section filters - renamed to reflect the emotional journey */}
          {sections.length > 0 && (
            <div className="filters mb-12">
              <p className="text-center mb-4 text-sm text-gray-500 dark:text-gray-400">Follow their wedding day journey</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  className={`px-4 py-2 rounded-md ${
                    activeSection === null 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-rose-200 dark:hover:bg-rose-800'
                  }`}
                  onClick={() => setActiveSection(null)}
                >
                  Complete Story
                </button>
                
                {/* Present sections in logical wedding day order */}
                {['preparation', 'ceremony', 'portraits', 'reception'].filter(s => sections.includes(s)).map(section => (
                  <button
                    key={section}
                    className={`px-4 py-2 rounded-md ${
                      activeSection === section 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-rose-200 dark:hover:bg-rose-800'
                    }`}
                    onClick={() => setActiveSection(section)}
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
          )}
          
          {/* Gallery Grid */}
          {loading ? (
            <PortfolioGridSkeleton />
          ) : filteredImages.length > 0 ? (
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
                    data-pswp-width={image.width || 1200}
                    data-pswp-height={image.height || 800}
                    data-cropped="true"
                    data-pswp-src={image.src}
                    className="block relative overflow-hidden aspect-square"
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt || `${gallery?.coupleName} - ${gallery?.venueName}`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                      onLoad={() => console.log(`Successfully loaded: ${image.src}`)}
                      onError={(e) => {
                        // Log the error to help with debugging
                        console.error(`Failed to load image: ${image.src}`);
                        
                        // Try both path formats as a desperate measure
                        const target = e.target as HTMLImageElement;
                        const altSrc = image.src.includes('crysta-david') 
                          ? image.src.replace('crysta-david', 'Crysta & David')
                          : image.src.replace('Crysta & David', 'crysta-david');
                          
                        console.log(`Trying alternate path: ${altSrc}`);
                        target.src = altSrc;
                        
                        // Add a second error handler for the alternative path
                        target.onerror = () => {
                          console.error(`Alternative path also failed: ${altSrc}`);
                          target.src = '/images/placeholder-image.jpg';
                        };
                      }}
                    />
                    {image.section && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <span className="text-white/90 text-sm">
                          {image.section === 'preparation' ? 'Getting Ready' :
                           image.section === 'ceremony' ? 'The Ceremony' :
                           image.section === 'portraits' ? 'Couple Portraits' :
                           image.section === 'reception' ? 'The Celebration' :
                           image.section.charAt(0).toUpperCase() + image.section.slice(1)}
                        </span>
                      </div>
                    )}
                  </a>
                </figure>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p>No images available in this section</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action & Back Link - strategic booking prompt at emotional high point */}
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

export default GalleryDetailPage;

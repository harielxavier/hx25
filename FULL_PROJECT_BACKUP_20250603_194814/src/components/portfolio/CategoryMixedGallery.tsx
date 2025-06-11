import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { transformImageUrl } from '../../utils/imageOptimizationUtils';
import { PortfolioGridSkeleton } from './SkeletonLoaders';
import Lightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { maternityImages, portraitImages, commercialImages } from '../../data/mockPortfolioData';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category: string;
  subcategory?: string;
  location?: string;
  date?: string;
}

interface CategoryMixedGalleryProps {
  categoryType: 'maternity' | 'portrait' | 'commercial';
  subcategory?: string;
}

const CategoryMixedGallery: React.FC<CategoryMixedGalleryProps> = ({ 
  categoryType,
  subcategory
}) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(subcategory || null);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Get available subcategories for this category
  const [subcategories, setSubcategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching ${categoryType} images...`);
        
        try {
          // Create base query
          let imagesQuery = query(
            collection(db, 'images'),
            where('category', '==', categoryType),
            orderBy('date', 'desc')
          );
          
          // Apply subcategory filter if active
          if (activeFilter) {
            imagesQuery = query(
              collection(db, 'images'),
              where('category', '==', categoryType),
              where('subcategory', '==', activeFilter),
              orderBy('date', 'desc')
            );
            console.log(`Applied subcategory filter: ${activeFilter}`);
          }
          
          const imagesSnapshot = await getDocs(imagesQuery);
          
          if (imagesSnapshot.empty) {
            console.log(`No ${categoryType} images found in Firebase, using mock data`);
            // If no images found, use mock data
            useMockData();
            return;
          }
          
          const imagesData = imagesSnapshot.docs.map(doc => {
            const data = doc.data() as GalleryImage;
            return {
              ...data,
              id: doc.id
            };
          }).filter(img => img.category === categoryType); // STRICT FILTERING: ensure only current category
          
          console.log(`Found ${imagesData.length} ${categoryType} images in Firebase`);
          
          // Extract unique subcategories
          const uniqueSubcategories = Array.from(
            new Set(imagesData.map(img => img.subcategory).filter(Boolean) as string[])
          );
          
          console.log(`Found subcategories: ${uniqueSubcategories.join(', ')}`);
          setSubcategories(uniqueSubcategories);
          setImages(imagesData);
        } catch (firebaseErr) {
          console.log(`Using mock ${categoryType} images due to Firebase error:`, firebaseErr);
          // Use mock data if Firebase fails
          useMockData();
        }
        
        setLoading(false);
      } catch (err) {
        console.error(`Error in ${categoryType} images logic:`, err);
        // Fallback to mock data
        useMockData();
        setLoading(false);
      }
    };
    
    // Helper function to use mock data
    const useMockData = () => {
      let mockData: GalleryImage[] = [];
      
      console.log(`Using mock data for ${categoryType} category`);
      
      // STRICT FILTERING: Only get images for the selected category
      switch(categoryType) {
        case 'maternity':
          mockData = maternityImages.map(img => ({
            ...img,
            category: 'maternity' // Ensure category is set
          }));
          break;
        case 'portrait':
          mockData = portraitImages.map(img => ({
            ...img,
            category: 'portrait' // Ensure category is set
          }));
          break;
        case 'commercial':
          mockData = commercialImages.map(img => ({
            ...img,
            category: 'commercial' // Ensure category is set
          }));
          break;
      }
      
      console.log(`Retrieved ${mockData.length} mock ${categoryType} images`);
      
      // Filter by subcategory if needed
      if (activeFilter) {
        const filteredData = mockData.filter(img => img.subcategory === activeFilter);
        console.log(`Applied subcategory filter '${activeFilter}': ${filteredData.length} images remain`);
        mockData = filteredData;
      }
      
      // Extract unique subcategories
      const uniqueSubcategories = Array.from(
        new Set(mockData.map(img => img.subcategory).filter(Boolean) as string[])
      );
      
      setSubcategories(uniqueSubcategories);
      setImages(mockData);
    };
    
    fetchImages();
  }, [categoryType, activeFilter]);

  // Initialize PhotoSwipe
  useEffect(() => {
    if (loading || !galleryRef.current) return;
    
    const lightbox = new Lightbox({
      gallery: '.mixed-gallery',
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

  // Format category title
  const getCategoryTitle = () => {
    switch(categoryType) {
      case 'maternity':
        return 'Maternity';
      case 'portrait':
        return 'Portraits';
      case 'commercial':
        return 'Commercial';
      default:
        // Handle the case safely - though this shouldn't happen with the prop types
        const type = categoryType as string;
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="category-mixed-gallery">
      <h1 className="font-display text-2xl md:text-3xl text-center mb-6">{getCategoryTitle()}</h1>
      <p className="text-center mb-4 text-sm text-gray-600 dark:text-gray-400">
        {categoryType === 'maternity' && 'Beautiful portraits celebrating the journey to parenthood.'}
        {categoryType === 'portrait' && 'Timeless portraits focusing on authentic expressions and connections.'}
        {categoryType === 'commercial' && 'Professional imagery for brands and businesses with artistic vision.'}
      </p>
      
      {/* Subcategory filters */}
      {subcategories.length > 0 && (
        <div className="filters mb-6">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className={`px-4 py-2 rounded-full border ${
                activeFilter === null 
                  ? 'bg-rose-500 text-white border-rose-500' 
                  : 'bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setActiveFilter(null)}
            >
              All
            </button>
            
            {subcategories.map(subcat => (
              <button
                key={subcat}
                className={`px-4 py-2 rounded-full border ${
                  activeFilter === subcat 
                    ? 'bg-rose-500 text-white border-rose-500' 
                    : 'bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveFilter(subcat)}
              >
                {subcat}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Gallery Grid */}
      {loading ? (
        <PortfolioGridSkeleton />
      ) : images.length > 0 ? (
        <div 
          ref={galleryRef}
          className="mixed-gallery grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
          style={{
            gridTemplateRows: 'masonry',
            gridAutoRows: '0'
          }}
        >
          {images.map(image => (
            <figure 
              key={image.id}
              className="gallery-item overflow-hidden rounded-sm shadow-md hover:shadow-xl transition-all"
            >
              <a 
                href={transformImageUrl(image.src, 1800)}
                data-pswp-width={image.width}
                data-pswp-height={image.height}
                data-cropped="true"
                data-pswp-src={transformImageUrl(image.src, 1800)}
                className="block relative overflow-hidden"
              >
                <img 
                  src={transformImageUrl(image.src, 600)} 
                  alt={image.alt || 'Gallery image'}
                  className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                
                {(image.alt || image.location) && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white">
                    {image.alt && <h3 className="text-base font-medium">{image.alt}</h3>}
                    {image.location && <p className="text-xs opacity-90">{image.location}</p>}
                  </div>
                )}
              </a>
            </figure>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p>No {getCategoryTitle().toLowerCase()} images available</p>
        </div>
      )}
    </div>
  );
};

export default CategoryMixedGallery;

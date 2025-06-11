import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Loader, Filter, X, ZoomIn, Camera, MapPin, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import AdvancedPortfolioFilter, { FilterCategory } from './AdvancedPortfolioFilter';
import enhancedPortfolioService, { FilterOptions, FilterableAttributes } from '../../services/enhancedPortfolioService';
import { PortfolioImage } from '../../services/portfolioCategoryService';
import cloudinaryService from '../../services/cloudinaryService';
import ImageLightbox from '../common/ImageLightbox';

interface EnhancedPortfolioGalleryProps {
  initialCategory?: string;
  initialTag?: string;
  layout?: 'grid' | 'masonry';
  showFilters?: boolean;
  maxImages?: number;
  className?: string;
}

export default function EnhancedPortfolioGallery({
  initialCategory,
  initialTag,
  layout = 'masonry',
  showFilters = true,
  maxImages = 50,
  className = ''
}: EnhancedPortfolioGalleryProps) {
  const router = useRouter();
  
  // State for images and loading
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // State for filters
  const [filterableAttributes, setFilterableAttributes] = useState<FilterableAttributes | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // State for lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Initialize filters from URL parameters
  useEffect(() => {
    const filters: Record<string, string[]> = {};
    
    if (initialCategory) {
      filters.categories = [initialCategory];
    }
    
    if (initialTag) {
      filters.tags = [initialTag];
    }
    
    // Check URL query parameters for filters
    if (router.query) {
      Object.entries(router.query).forEach(([key, value]) => {
        if (key === 'categories' || key === 'tags' || key === 'cameras' || 
            key === 'lenses' || key === 'locations' || key === 'apertures' || 
            key === 'shutterSpeeds' || key === 'isoValues') {
          
          const values = Array.isArray(value) ? value : [value as string];
          filters[key] = values;
        }
      });
    }
    
    setSelectedFilters(filters);
  }, [router.query, initialCategory, initialTag]);
  
  // Load filterable attributes
  useEffect(() => {
    const loadFilterableAttributes = async () => {
      try {
        const attributes = await enhancedPortfolioService.getFilterableAttributes();
        setFilterableAttributes(attributes);
      } catch (error) {
        console.error('Error loading filterable attributes:', error);
        toast.error('Failed to load filter options');
      }
    };
    
    loadFilterableAttributes();
  }, []);
  
  // Load images based on filters
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      
      try {
        // Convert selectedFilters to FilterOptions
        const options: FilterOptions = {
          limit: maxImages
        };
        
        // Add selected filters
        Object.entries(selectedFilters).forEach(([key, values]) => {
          if (values && values.length > 0) {
            options[key as keyof FilterOptions] = values;
          }
        });
        
        const filteredImages = await enhancedPortfolioService.getFilteredPortfolioImages(options);
        setImages(filteredImages);
        setHasMore(filteredImages.length === maxImages);
      } catch (error) {
        console.error('Error loading images:', error);
        toast.error('Failed to load images');
      } finally {
        setLoading(false);
      }
    };
    
    loadImages();
  }, [selectedFilters, maxImages]);
  
  // Load more images
  const loadMoreImages = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    
    try {
      // Get the last image ID for pagination
      const lastImage = images[images.length - 1];
      
      // Convert selectedFilters to FilterOptions
      const options: FilterOptions = {
        ...selectedFilters,
        limit: maxImages,
        startAfter: lastImage.id
      };
      
      const moreImages = await enhancedPortfolioService.getFilteredPortfolioImages(options);
      
      if (moreImages.length > 0) {
        setImages(prev => [...prev, ...moreImages]);
        setHasMore(moreImages.length === maxImages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more images:', error);
      toast.error('Failed to load more images');
    } finally {
      setLoadingMore(false);
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (categoryId: string, selectedOptions: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [categoryId]: selectedOptions
    }));
    
    // Update URL query parameters
    const query = { ...router.query };
    
    if (selectedOptions.length > 0) {
      query[categoryId] = selectedOptions;
    } else {
      delete query[categoryId];
    }
    
    router.push({
      pathname: router.pathname,
      query
    }, undefined, { shallow: true });
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSelectedFilters({});
    
    // Remove all filter query parameters
    router.push({
      pathname: router.pathname
    }, undefined, { shallow: true });
  };
  
  // Open lightbox for an image
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };
  
  // Convert filterable attributes to filter categories
  const filterCategories = useMemo<FilterCategory[]>(() => {
    if (!filterableAttributes) return [];
    
    return [
      {
        id: 'categories',
        label: 'Categories',
        options: filterableAttributes.categories.map(attr => ({
          id: attr.id,
          label: attr.label,
          count: attr.count
        })),
        multiSelect: true
      },
      {
        id: 'tags',
        label: 'Tags',
        options: filterableAttributes.tags.map(attr => ({
          id: attr.id,
          label: attr.label,
          count: attr.count
        })),
        multiSelect: true
      },
      {
        id: 'cameras',
        label: 'Cameras',
        options: filterableAttributes.cameras.map(attr => ({
          id: attr.id,
          label: attr.label,
          count: attr.count
        })),
        multiSelect: true
      },
      {
        id: 'lenses',
        label: 'Lenses',
        options: filterableAttributes.lenses.map(attr => ({
          id: attr.id,
          label: attr.label,
          count: attr.count
        })),
        multiSelect: true
      },
      {
        id: 'locations',
        label: 'Locations',
        options: filterableAttributes.locations.map(attr => ({
          id: attr.id,
          label: attr.label,
          count: attr.count
        })),
        multiSelect: true
      },
      {
        id: 'apertures',
        label: 'Apertures',
        options: filterableAttributes.apertures.map(attr => ({
          id: attr.id,
          label: attr.label,
          count: attr.count
        })),
        multiSelect: true
      },
      {
        id: 'shutterSpeeds',
        label: 'Shutter Speeds',
        options: filterableAttributes.shutterSpeeds.map(attr => ({
          id: attr.id,
          label: attr.label,
          count: attr.count
        })),
        multiSelect: true
      },
      {
        id: 'isoValues',
        label: 'ISO Values',
        options: filterableAttributes.isoValues.map(attr => ({
          id: attr.id,
          label: attr.label,
          count: attr.count
        })),
        multiSelect: true
      }
    ];
  }, [filterableAttributes]);
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-rose-500" />
        <span className="ml-2 text-gray-600">Loading portfolio...</span>
      </div>
    );
  }
  
  // Render masonry layout
  const renderMasonryLayout = () => (
    <div className="masonry-grid columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
      {images.map((image, index) => (
        <div 
          key={image.id} 
          className="break-inside-avoid mb-4 group cursor-pointer relative"
          onClick={() => openLightbox(index)}
        >
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={cloudinaryService.getOptimizedUrl(image.imagePath, {
                width: 600,
                height: 800,
                crop: 'fill',
                quality: 'auto',
                fetchFormat: 'auto'
              })}
              alt={image.title}
              width={600}
              height={Math.round(600 * (image.height / image.width))}
              className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            />
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8" />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white font-medium text-sm truncate">{image.title}</h3>
              
              <div className="flex flex-wrap gap-1 mt-1">
                {image.tags?.slice(0, 3).map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
                
                {image.metadata?.camera && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    <Camera className="w-3 h-3 mr-1" />
                    {image.metadata.camera}
                  </span>
                )}
                
                {image.metadata?.location && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    <MapPin className="w-3 h-3 mr-1" />
                    {image.metadata.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  
  // Render grid layout
  const renderGridLayout = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <div 
          key={image.id} 
          className="group cursor-pointer relative"
          onClick={() => openLightbox(index)}
        >
          <div className="relative overflow-hidden rounded-lg aspect-w-3 aspect-h-4">
            <Image
              src={cloudinaryService.getOptimizedUrl(image.imagePath, {
                width: 600,
                height: 800,
                crop: 'fill',
                quality: 'auto',
                fetchFormat: 'auto'
              })}
              alt={image.title}
              fill
              className="object-cover transform transition-transform duration-500 group-hover:scale-105"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            />
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8" />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white font-medium text-sm truncate">{image.title}</h3>
              
              <div className="flex flex-wrap gap-1 mt-1">
                {image.tags?.slice(0, 3).map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  
  return (
    <div className={`enhanced-portfolio-gallery ${className}`}>
      {/* Filters */}
      {showFilters && filterableAttributes && (
        <div className="mb-6">
          <div className="md:hidden">
            <AdvancedPortfolioFilter
              categories={filterCategories}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              layout="dropdown"
              showCounts={true}
            />
          </div>
          
          <div className="hidden md:block">
            <AdvancedPortfolioFilter
              categories={filterCategories}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              layout="horizontal"
              showCounts={true}
            />
          </div>
        </div>
      )}
      
      {/* Gallery */}
      <div className="portfolio-gallery">
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-rose-100 p-3 mb-4">
              <X className="h-6 w-6 text-rose-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No images found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or browse all images.
            </p>
            <button
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              onClick={handleClearFilters}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Render the appropriate layout */}
            {layout === 'masonry' ? renderMasonryLayout() : renderGridLayout()}
            
            {/* Load more button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  onClick={loadMoreImages}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load more'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <ImageLightbox
            images={images.map(img => ({
              src: cloudinaryService.getOptimizedUrl(img.imagePath, {
                width: 1920,
                height: 1080,
                crop: 'limit',
                quality: 'auto',
                fetchFormat: 'auto'
              }),
              alt: img.title,
              width: img.width,
              height: img.height,
              title: img.title,
              description: img.description,
              metadata: img.metadata
            }))}
            currentIndex={currentImageIndex}
            onClose={() => setLightboxOpen(false)}
            onNavigate={setCurrentImageIndex}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

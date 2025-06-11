import { useState, useEffect, useMemo, useCallback } from 'react';
import { Gallery, Item, type GalleryProps } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import { Loader2 } from 'lucide-react';

export interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  title?: string;
  description?: string;
  tags?: string[];
  featured?: boolean;
  date?: string;
}

interface PhotoSwipeGalleryProps {
  images: GalleryImage[];
  columns?: number;
  gap?: number;
  className?: string;
  sortBy?: 'featured' | 'date' | 'name';
  sortDirection?: 'asc' | 'desc';
  showTags?: boolean;
  onImageClick?: (image: GalleryImage) => void;
}

const PhotoSwipeGallery = ({
  images,
  columns = 3,
  gap = 16,
  className = '',
  sortBy = 'featured',
  sortDirection = 'desc',
  showTags = false,
  onImageClick
}: PhotoSwipeGalleryProps) => {
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'featured') {
        if (a.featured && !b.featured) return sortDirection === 'asc' ? 1 : -1;
        if (!a.featured && b.featured) return sortDirection === 'asc' ? -1 : 1;
        return 0;
      } else if (sortBy === 'name') {
        // Extract meaningful parts from ID to sort chronologically
        // For Bianca & Jeffrey: Sort by prep, firstlook, ceremony, reception
        if (a.id.includes('prep') && !b.id.includes('prep')) return -1;
        if (!a.id.includes('prep') && b.id.includes('prep')) return 1;
        if (a.id.includes('firstlook') && !b.id.includes('firstlook') && !b.id.includes('prep')) return -1;
        if (!a.id.includes('firstlook') && b.id.includes('firstlook') && !a.id.includes('prep')) return 1;
        if (a.id.includes('ceremony') && !b.id.includes('ceremony') && !b.id.includes('prep') && !b.id.includes('firstlook')) return -1;
        if (!a.id.includes('ceremony') && b.id.includes('ceremony') && !a.id.includes('prep') && !a.id.includes('firstlook')) return 1;
        if (a.id.includes('reception') && !b.id.includes('reception')) return 1;
        if (!a.id.includes('reception') && b.id.includes('reception')) return -1;
        
        // For numerical ordering within same category
        const numA = parseInt(a.id.match(/\d+/)?.[0] || '0', 10);
        const numB = parseInt(b.id.match(/\d+/)?.[0] || '0', 10);
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }
      return 0;
    });
  }, [images, sortBy, sortDirection]);

  const visibleImages = useMemo(() => {
    return sortedImages.slice(0, visibleCount);
  }, [sortedImages, visibleCount]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
      setVisibleCount(prevCount => {
        const newCount = prevCount + 12;
        return Math.min(newCount, images.length);
      });
    }
  }, [images.length]);

  const createRenderItemFn = useCallback((image: GalleryImage, isFirst: boolean = false) => {
    return ({ ref, open }: { ref: React.Ref<HTMLDivElement>, open: (e: React.MouseEvent) => void }) => {
      return (
        <div 
          ref={ref as React.RefObject<HTMLDivElement>}
          onClick={(e) => {
            open(e);
            if (onImageClick) onImageClick(image);
          }}
          className={`cursor-pointer h-full w-full overflow-hidden ${isFirst ? 'first-image' : ''}`}
        >
          <img
            src={image.thumbnailUrl || image.url}
            alt={image.title || 'Gallery image'}
            className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${isFirst ? 'first-image-hover' : ''}`}
            loading="lazy"
            decoding="async"
            style={{ 
              objectPosition: 'center center',
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
          />
          {image.featured && (
            <div className="absolute top-2 right-2 bg-white bg-opacity-80 text-gray-800 text-xs font-medium px-2 py-1 rounded">
              Featured
            </div>
          )}
          {showTags && image.tags && image.tags.length > 0 && (
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
              {image.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    };
  }, [onImageClick, showTags]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const styleId = 'masonry-gallery-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .masonry-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: ${gap}px;
        }
        
        @media (min-width: 640px) {
          .masonry-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          .masonry-grid {
            grid-template-columns: repeat(${columns}, 1fr);
          }
        }
        
        .masonry-item {
          break-inside: avoid;
          position: relative;
        }
        
        .masonry-item img {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .masonry-item.featured-item {
          grid-column: 1 / -1;
          max-height: 80vh;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        
        .masonry-item.featured-item img {
          width: 100%;
          height: 80vh;
          object-fit: cover;
        }
        
        .first-image-hover:hover {
          transform: scale(1.03) !important;
        }
        
        .landscape {
          grid-row: span 1;
        }
        
        .portrait {
          grid-row: span 2;
        }
      `;
      document.head.appendChild(style);
    }
  }, [columns, gap]);

  // PhotoSwipe options with proper TypeScript types
  const photoswipeOptions: GalleryProps['options'] = {
    wheelToZoom: true,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No images found in this gallery.
      </div>
    );
  }

  // Get the first image to feature prominently
  const firstImage = visibleImages[0];
  const remainingImages = visibleImages.slice(1);

  return (
    <div className={`${className}`}>
      <Gallery options={photoswipeOptions}>
        {/* Featured first image */}
        {firstImage && (
          <div className="mb-8">
            <div 
              className="masonry-item featured-item relative overflow-hidden rounded-lg shadow-xl transition-transform duration-300 hover:shadow-2xl"
              data-image-id={firstImage.id}
            >
              <Item
                original={firstImage.url}
                thumbnail={firstImage.thumbnailUrl || firstImage.url}
                width={firstImage.width || 1200}
                height={firstImage.height || 800}
                alt={firstImage.title || 'Featured gallery image'}
              >
                {createRenderItemFn(firstImage, true)}
              </Item>
            </div>
          </div>
        )}
        
        {/* Remaining images in grid */}
        <div 
          className="masonry-grid"
          style={{ 
            willChange: 'transform', 
            contain: 'layout style paint'
          }}
        >
          {remainingImages.map((image) => {
            // Determine if image is landscape or portrait based on ID
            // This is a temporary solution - ideally we would load the actual dimensions
            const isLandscape = image.id.includes('landscape') || 
                               (image.width && image.height && image.width > image.height);
            
            const width = isLandscape ? 1200 : 800;
            const height = isLandscape ? 800 : 1200;
            const thumbnailUrl = image.thumbnailUrl || image.url;
            
            return (
              <div 
                key={image.id} 
                className={`masonry-item relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg ${isLandscape ? 'landscape' : 'portrait'}`}
                data-image-id={image.id}
                style={{ 
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <Item
                  original={image.url}
                  thumbnail={thumbnailUrl}
                  width={width}
                  height={height}
                  alt={image.title || 'Gallery image'}
                >
                  {createRenderItemFn(image)}
                </Item>
              </div>
            );
          })}
        </div>
      </Gallery>
      
      {visibleCount < images.length && (
        <div className="text-center mt-8">
          <button 
            onClick={() => setVisibleCount(prev => Math.min(prev + 12, images.length))}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoSwipeGallery;

import React, { useState, useEffect } from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';
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

interface GridGalleryProps {
  images: GalleryImage[];
  className?: string;
  featuredFirst?: boolean;
  onImageClick?: (image: GalleryImage) => void;
}

const GridGallery: React.FC<GridGalleryProps> = ({
  images,
  className = '',
  featuredFirst = true,
  onImageClick
}) => {
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const totalImages = images.length;

  // Sort images to put featured ones first if requested
  const sortedImages = React.useMemo(() => {
    if (!featuredFirst) return images;
    
    return [...images].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [images, featuredFirst]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Preload images
  useEffect(() => {
    let mounted = true;
    
    sortedImages.forEach((image) => {
      const img = new Image();
      img.src = image.thumbnailUrl || image.url;
      img.onload = () => {
        if (mounted) {
          setImagesLoaded(prev => prev + 1);
        }
      };
    });
    
    return () => {
      mounted = false;
    };
  }, [sortedImages]);

  const renderGalleryItem = (image: GalleryImage) => {
    return ({ ref, open }: { ref: React.Ref<HTMLDivElement>, open: (e: React.MouseEvent) => void }) => (
      <div 
        ref={ref as React.RefObject<HTMLDivElement>}
        onClick={(e) => {
          open(e);
          if (onImageClick) onImageClick(image);
        }}
        className="cursor-pointer h-full w-full overflow-hidden"
      >
        <img
          src={image.thumbnailUrl || image.url}
          alt={image.title || 'Gallery image'}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
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

  return (
    <div className={`${className}`}>
      {imagesLoaded < totalImages && (
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${(imagesLoaded / totalImages) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Loading images: {imagesLoaded} of {totalImages}
          </p>
        </div>
      )}
      
      <Gallery>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
          {sortedImages.map((image) => (
            <div 
              key={image.id}
              className="relative aspect-square overflow-hidden"
            >
              <Item
                original={image.url}
                thumbnail={image.thumbnailUrl || image.url}
                width={image.width || 1200}
                height={image.height || 800}
                alt={image.title || 'Gallery image'}
              >
                {renderGalleryItem(image)}
              </Item>
            </div>
          ))}
        </div>
      </Gallery>
    </div>
  );
};

export default GridGallery;

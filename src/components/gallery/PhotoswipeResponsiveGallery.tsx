import React, { useState, useEffect, useMemo } from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import { PLACEHOLDERS } from '../../utils/imageUtils';

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

interface PhotoswipeResponsiveGalleryProps {
  images: GalleryImage[];
  className?: string;
  featuredFirst?: boolean;
  gapSize?: number;
  layout?: 'masonry' | 'justified' | 'columns';
  targetRowHeight?: number;
}

const PhotoswipeResponsiveGallery: React.FC<PhotoswipeResponsiveGalleryProps> = ({
  images,
  className = '',
  featuredFirst = true,
  gapSize = 3,
  layout = 'justified',
  targetRowHeight = 300
}) => {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [imagesErrored, setImagesErrored] = useState(0);
  const totalImages = images.length;
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [imageDimensions, setImageDimensions] = useState<Map<string, { width: number, height: number }>>(new Map());

  // PhotoSwipe options to ensure proper handling of portrait/landscape images
  const photoswipeOptions = useMemo(() => ({
    showHideAnimationType: 'fade' as const,
    wheelToZoom: true,
    initialZoomLevel: 'fit' as const,
    secondaryZoomLevel: 2,
    maxZoomLevel: 4,
    pinchToClose: false,
    closeOnVerticalDrag: true,
    allowPanToNext: true,
    arrowKeys: true,
    returnFocus: true,
    clickToCloseNonZoomable: true,
    bgOpacity: 0.9,
    padding: { top: 20, bottom: 20, left: 20, right: 20 },
    errorMsg: 'The image could not be loaded.',
  }), []);

  // Sort images to put featured ones first if requested
  const sortedImages = useMemo(() => {
    if (!featuredFirst) return images;
    
    return [...images].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [images, featuredFirst]);

  // Get container width for layout calculations
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
      
      const handleResize = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.clientWidth);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Preload images and get their actual dimensions
  useEffect(() => {
    let mounted = true;
    const dimensionsMap = new Map<string, { width: number, height: number }>();
    
    sortedImages.forEach((image) => {
      const img = new Image();
      img.src = image.thumbnailUrl || image.url;
      
      img.onload = () => {
        if (mounted) {
          // Store the actual dimensions
          dimensionsMap.set(image.id, { 
            width: img.naturalWidth, 
            height: img.naturalHeight 
          });
          
          setImageDimensions(new Map(dimensionsMap));
          setImagesLoaded(prev => prev + 1);
        }
      };
      
      img.onerror = () => {
        if (mounted) {
          console.error(`Failed to load image: ${image.url}`);
          // Use default dimensions for errored images
          dimensionsMap.set(image.id, { 
            width: image.width || 1200, 
            height: image.height || 800 
          });
          
          setImageDimensions(new Map(dimensionsMap));
          setImagesErrored(prev => prev + 1);
          setImagesLoaded(prev => prev + 1); // Count as loaded to complete the progress bar
        }
      };
    });
    
    return () => {
      mounted = false;
    };
  }, [sortedImages]);

  // Function to get image dimensions (either from loaded dimensions or fallback)
  const getImageDimensions = (image: GalleryImage) => {
    // If we have loaded the actual dimensions, use those
    if (imageDimensions.has(image.id)) {
      return imageDimensions.get(image.id)!;
    }
    
    // Otherwise use provided dimensions or fallbacks
    // For portrait images (height > width)
    if (image.height && image.width && image.height > image.width) {
      return { width: image.width, height: image.height };
    }
    
    // For landscape or unknown orientation, use defaults that maintain aspect ratio
    return { width: image.width || 1200, height: image.height || 800 };
  };

  // Get image source with fallback for errors
  const getImageSource = (image: GalleryImage) => {
    try {
      return image.thumbnailUrl || image.url;
    } catch (error) {
      console.error(`Error getting image source for ${image.id}:`, error);
      return PLACEHOLDERS.DEFAULT;
    }
  };

  // Calculate justified layout
  const justifiedRows = useMemo(() => {
    if (containerWidth === 0 || layout !== 'justified') return [];
    
    const rows: Array<{ images: GalleryImage[], height: number }> = [];
    let currentRow: GalleryImage[] = [];
    let currentRowWidth = 0;
    
    // Function to calculate the aspect ratio
    const getAspectRatio = (img: GalleryImage) => {
      const { width, height } = getImageDimensions(img);
      return width / height;
    };
    
    // Process each image
    sortedImages.forEach((image, index) => {
      const aspectRatio = getAspectRatio(image);
      const imageWidth = targetRowHeight * aspectRatio;
      
      // If adding this image would exceed container width, create a new row
      if (currentRowWidth + imageWidth > containerWidth && currentRow.length > 0) {
        // Calculate row height to fit the container width
        const totalAspectRatio = currentRow.reduce((sum, img) => sum + getAspectRatio(img), 0);
        const rowHeight = (containerWidth - (currentRow.length - 1) * gapSize) / totalAspectRatio;
        
        rows.push({ images: [...currentRow], height: rowHeight });
        currentRow = [image];
        currentRowWidth = imageWidth;
      } else {
        currentRow.push(image);
        currentRowWidth += imageWidth + (currentRow.length > 1 ? gapSize : 0);
      }
      
      // Handle the last row
      if (index === sortedImages.length - 1 && currentRow.length > 0) {
        const totalAspectRatio = currentRow.reduce((sum, img) => sum + getAspectRatio(img), 0);
        let rowHeight = (containerWidth - (currentRow.length - 1) * gapSize) / totalAspectRatio;
        
        // For the last row, if it's not full, limit the height to the target height
        if (currentRow.length < 3) {
          rowHeight = Math.min(rowHeight, targetRowHeight * 1.5);
        }
        
        rows.push({ images: [...currentRow], height: rowHeight });
      }
    });
    
    return rows;
  }, [containerWidth, sortedImages, gapSize, targetRowHeight, layout, imageDimensions]);

  // Render justified layout
  const renderJustifiedLayout = () => {
    return (
      <Gallery options={photoswipeOptions}>
        <div className="pswp-gallery">
          {justifiedRows.map((row, rowIndex) => (
            <div 
              key={`row-${rowIndex}`} 
              className="flex" 
              style={{ marginBottom: `${gapSize}px` }}
            >
              {row.images.map((image, imageIndex) => {
                const { width, height } = getImageDimensions(image);
                const aspectRatio = width / height;
                const imageWidth = row.height * aspectRatio;
                
                return (
                  <Item
                    key={image.id}
                    original={image.url}
                    thumbnail={getImageSource(image)}
                    width={width}
                    height={height}
                    alt={image.title || 'Gallery image'}
                    cropped={false}
                  >
                    {({ ref, open }) => (
                      <div 
                        ref={ref as any}
                        onClick={open}
                        className="cursor-pointer overflow-hidden"
                        style={{ 
                          width: `${imageWidth}px`,
                          height: `${row.height}px`,
                          marginRight: imageIndex < row.images.length - 1 ? `${gapSize}px` : '0',
                        }}
                      >
                        <img
                          src={getImageSource(image)}
                          alt={image.title || 'Gallery image'}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                          decoding="async"
                          style={{ filter: 'brightness(0.98) contrast(0.98)' }}
                          onError={(e) => {
                            console.error(`Failed to load image: ${image.url}`);
                            e.currentTarget.src = PLACEHOLDERS.DEFAULT;
                          }}
                        />
                      </div>
                    )}
                  </Item>
                );
              })}
            </div>
          ))}
        </div>
      </Gallery>
    );
  };

  // Render columns layout
  const renderColumnsLayout = () => {
    return (
      <Gallery options={photoswipeOptions}>
        <div 
          className="pswp-gallery" 
          style={{ 
            columnCount: containerWidth < 768 ? 2 : containerWidth < 1024 ? 3 : 4,
            columnGap: `${gapSize}px`,
          }}
        >
          {sortedImages.map((image) => {
            const { width, height } = getImageDimensions(image);
            const aspectRatio = width / height;
            
            return (
              <Item
                key={image.id}
                original={image.url}
                thumbnail={getImageSource(image)}
                width={width}
                height={height}
                alt={image.title || 'Gallery image'}
                cropped={false}
              >
                {({ ref, open }) => (
                  <div 
                    ref={ref as any}
                    onClick={open}
                    className="cursor-pointer overflow-hidden"
                    style={{ 
                      position: 'relative',
                      paddingBottom: `${(1 / aspectRatio) * 100}%`,
                      marginBottom: `${gapSize}px`,
                    }}
                  >
                    <img
                      src={getImageSource(image)}
                      alt={image.title || 'Gallery image'}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      style={{ filter: 'brightness(0.98) contrast(0.98)' }}
                      onError={(e) => {
                        console.error(`Failed to load image: ${image.url}`);
                        e.currentTarget.src = PLACEHOLDERS.DEFAULT;
                      }}
                    />
                  </div>
                )}
              </Item>
            );
          })}
        </div>
      </Gallery>
    );
  };

  // Render masonry layout
  const renderMasonryLayout = () => {
    return (
      <Gallery options={photoswipeOptions}>
        <div 
          className="pswp-gallery" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: `${gapSize}px`,
          }}
        >
          {sortedImages.map((image) => {
            const { width, height } = getImageDimensions(image);
            const aspectRatio = width / height;
            
            return (
              <Item
                key={image.id}
                original={image.url}
                thumbnail={getImageSource(image)}
                width={width}
                height={height}
                alt={image.title || 'Gallery image'}
                cropped={false}
              >
                {({ ref, open }) => (
                  <div 
                    ref={ref as any}
                    onClick={open}
                    className="cursor-pointer overflow-hidden"
                    style={{ 
                      position: 'relative',
                      paddingBottom: `${(1 / aspectRatio) * 100}%`,
                    }}
                  >
                    <img
                      src={getImageSource(image)}
                      alt={image.title || 'Gallery image'}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      style={{ filter: 'brightness(0.98) contrast(0.98)' }}
                      onError={(e) => {
                        console.error(`Failed to load image: ${image.url}`);
                        e.currentTarget.src = PLACEHOLDERS.DEFAULT;
                      }}
                    />
                  </div>
                )}
              </Item>
            );
          })}
        </div>
      </Gallery>
    );
  };

  return (
    <div className={`${className}`} ref={containerRef}>
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
            {imagesErrored > 0 && ` (${imagesErrored} failed to load)`}
          </p>
        </div>
      )}
      
      {layout === 'justified' && renderJustifiedLayout()}
      {layout === 'columns' && renderColumnsLayout()}
      {layout === 'masonry' && renderMasonryLayout()}
    </div>
  );
};

export default PhotoswipeResponsiveGallery;

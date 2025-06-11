import { useState, useEffect, useRef } from 'react';
import { PLACEHOLDERS } from '../../utils/imageUtils';
import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery';

// Define the GalleryImage interface
export interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  size?: number;
  type?: string;
  filename?: string;
  originalFilename?: string;
  featured?: boolean;
  tags?: string[];
  clientSelected?: boolean;
  photographerSelected?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
  allowSelection?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  initialSelectedIds?: string[];
  sortBy?: 'featured' | 'newest' | 'oldest';
}

export default function PhotoGallery({
  images,
  allowSelection = false,
  onSelectionChange,
  initialSelectedIds = [],
  sortBy = 'featured'
}: PhotoGalleryProps) {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set(initialSelectedIds));
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Sort images based on the sortBy prop
  const sortedImages = [...images].sort((a, b) => {
    if (sortBy === 'featured') {
      // Featured images first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
    } else if (sortBy === 'newest' || sortBy === 'oldest') {
      // Sort by date
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    }
    return 0;
  });

  // Handle image selection
  const toggleImageSelection = (imageId: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
    
    // Call the onSelectionChange callback if provided
    if (onSelectionChange) {
      onSelectionChange(Array.from(newSelection));
    }
  };

  // Initialize selection from props
  useEffect(() => {
    if (initialSelectedIds && initialSelectedIds.length > 0) {
      setSelectedImages(new Set(initialSelectedIds));
    }
  }, [initialSelectedIds]);

  // Default dimensions for images without width/height
  const defaultWidth = 1200;
  const defaultHeight = 800;

  // Render gallery items with PhotoSwipe
  return (
    <Gallery>
      <div ref={galleryRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedImages.map((image) => (
          <div 
            key={image.id} 
            className={`gallery-item relative ${hoveredImage === image.id ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredImage(image.id)}
            onMouseLeave={() => setHoveredImage(null)}
          >
            <Item
              original={image.url}
              thumbnail={image.thumbnailUrl}
              width={image.width || defaultWidth}
              height={image.height || defaultHeight}
              alt={image.title || 'Gallery image'}
              caption={image.description || image.title || ''}
            >
              {({ ref, open }) => {
                // Use a type assertion to handle the ref properly
                const setRef = (node: HTMLImageElement | null) => {
                  // @ts-ignore - This is necessary because the ref from PhotoSwipe has a different type
                  if (typeof ref === 'function') ref(node);
                };
                
                return (
                  <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg bg-gray-100 cursor-pointer">
                    <img
                      ref={setRef}
                      src={image.thumbnailUrl}
                      alt={image.title || 'Gallery image'}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                      onClick={open}
                      onError={(e) => {
                        console.error(`Failed to load image: ${image.thumbnailUrl}`);
                        e.currentTarget.src = PLACEHOLDERS.DEFAULT;
                      }}
                    />
                    
                    {/* Image overlay with info */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-60 transition-opacity duration-300 flex items-end p-4 opacity-0 hover:opacity-100">
                      <div className="text-white">
                        {image.title && <h3 className="text-lg font-medium">{image.title}</h3>}
                        {image.description && <p className="text-sm text-white/80">{image.description}</p>}
                      </div>
                    </div>
                  </div>
                );
              }}
            </Item>
            
            {allowSelection && (
              <button
                className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  selectedImages.has(image.id) 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
                onClick={() => toggleImageSelection(image.id)}
                aria-label={selectedImages.has(image.id) ? "Deselect image" : "Select image"}
              >
                {selectedImages.has(image.id) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </Gallery>
  );
}
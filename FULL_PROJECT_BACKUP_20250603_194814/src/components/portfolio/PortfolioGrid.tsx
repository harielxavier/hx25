import { useState, useEffect, useRef } from 'react';
import { PortfolioImage } from '../../services/portfolioCategoryService';
import { useInView } from 'react-intersection-observer';
import OptimizedImage from '../common/OptimizedImage';
import './PortfolioGrid.css';

interface PortfolioGridProps {
  images: PortfolioImage[];
  selectedTag?: string | null;
  categoryId: string;
  layout?: 'masonry' | 'grid';
  showDetails?: boolean;
  enableLightbox?: boolean;
}

export default function PortfolioGrid({
  images,
  selectedTag,
  layout = 'masonry',
  showDetails = true,
  enableLightbox = true
}: PortfolioGridProps) {
  const [filteredImages, setFilteredImages] = useState<PortfolioImage[]>([]);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Filter images by selected tag
  useEffect(() => {
    const filtered = selectedTag
      ? images.filter(image => image.tags?.includes(selectedTag))
      : images;
    
    setFilteredImages(filtered);
    setIsLoading(false);
  }, [images, selectedTag]);

  // Image component with lazy loading
  const PortfolioImage = ({ image }: { image: PortfolioImage }) => {
    const { ref, inView } = useInView({
      threshold: 0.1,
      triggerOnce: true
    });

    // Calculate aspect ratio for proper sizing
    const aspectRatio = image.width / image.height || 1.5;

    return (
      <div 
        ref={ref}
        className={`portfolio-item ${layout === 'masonry' ? 'masonry-item' : 'grid-item'}`}
        style={layout === 'masonry' ? { aspectRatio: aspectRatio.toString() } : {}}
        onMouseEnter={() => setHoveredImage(image.id)}
        onMouseLeave={() => setHoveredImage(null)}
      >
        <div className="portfolio-image-container">
          {inView ? (
            <OptimizedImage
              src={image.imagePath}
              alt={image.title || 'Portfolio image'}
              type="gallery"
              className="portfolio-image"
              objectFit="cover"
              width={image.width}
              height={image.height}
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
              priority={false}
            />
          ) : (
            <div 
              className="portfolio-image-placeholder" 
              style={{ aspectRatio: aspectRatio.toString() }}
            />
          )}
          
          {showDetails && (
            <div 
              className={`portfolio-overlay ${hoveredImage === image.id ? 'visible' : ''}`}
            >
              <div className="portfolio-details">
                <h3>{image.title}</h3>
                {image.description && <p>{image.description}</p>}
                {image.metadata?.location && (
                  <p className="portfolio-location">{image.metadata.location}</p>
                )}
                {enableLightbox && (
                  <a 
                    href={image.imagePath}
                    className="view-button"
                    data-pswp-width={image.width}
                    data-pswp-height={image.height}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Larger
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`portfolio-container ${isLoading ? 'loading' : ''}`}>
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div 
          ref={gridRef}
          className={`portfolio-grid ${layout === 'masonry' ? 'masonry-layout' : 'grid-layout'}`}
        >
          {filteredImages.length > 0 ? (
            filteredImages.map(image => (
              <PortfolioImage key={image.id} image={image} />
            ))
          ) : (
            <div className="no-images">
              <p>No images found for the selected filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

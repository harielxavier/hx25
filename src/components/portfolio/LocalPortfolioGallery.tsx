import { useState, useEffect } from 'react';

interface PortfolioImage {
  id: string;
  src: string;
  alt: string;
  section: string;
  featured: boolean;
  width: number;
  height: number;
  order?: number;
}

interface LocalPortfolioGalleryProps {
  portfolioId: string;
  activeSection?: string | null;
  onImageClick?: (imageId: string) => void;
}

const LocalPortfolioGallery = ({ 
  portfolioId, 
  activeSection = null,
  onImageClick 
}: LocalPortfolioGalleryProps) => {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sections for Elena & James wedding using Crysta & David images
  const sections = {
    'preparation': ['cdw-25', 'cdw-55', 'cdw-64'],
    'ceremony': ['cdw-127', 'cdw-160', 'cdw-169', 'cdw-170'],
    'portraits': ['cdw-174', 'cdw-185', 'cdw-186', 'cdw-188', 'cdw-198', 'cdw-203'],
    'reception': [
      'cdw-210', 'cdw-219', 'cdw-225', 'cdw-240', 'cdw-248', 'cdw-255', 
      'cdw-261', 'cdw-265', 'cdw-270', 'cdw-278', 'cdw-290', 'cdw-314', 
      'cdw-322', 'cdw-330', 'cdw-333', 'cdw-377', 'cdw-381', 'cdw-384', 
      'cdw-387', 'cdw-390', 'cdw-391', 'cdw-401', 'cdw-405', 'cdw-414', 
      'cdw-415', 'cdw-425', 'cdw-428'
    ]
  };

  // Load images
  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create image objects from the local files
        const allImages: PortfolioImage[] = [];
        
        // Process each section
        Object.entries(sections).forEach(([sectionId, imageIds], sectionIndex) => {
          // Process each image in the section
          imageIds.forEach((imageId, imageIndex) => {
            const image: PortfolioImage = {
              id: imageId,
              src: `/crysta-david/${imageId}.jpg`,
              alt: `Crysta & David wedding - ${sectionId}`,
              section: sectionId,
              featured: sectionIndex === 0 && imageIndex < 3, // First 3 images of first section are featured
              width: 1200,
              height: 800,
              order: sectionIndex * 100 + imageIndex
            };
            
            allImages.push(image);
          });
        });
        
        // Sort images by order
        const sortedImages = allImages.sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return a.id.localeCompare(b.id);
        });
        
        setImages(sortedImages);
        setLoading(false);
      } catch (err) {
        console.error('Error loading images:', err);
        setError('Failed to load images. Please try again later.');
        setLoading(false);
      }
    };
    
    loadImages();
  }, [portfolioId]);

  // Filter images by section if activeSection is provided
  const filteredImages = activeSection
    ? images.filter(img => img.section === activeSection)
    : images;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="portfolio-gallery">
      {/* Section Navigation */}
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        {Object.keys(sections).map((sectionId) => (
          <button
            key={sectionId}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeSection === sectionId 
                ? 'bg-rose-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-rose-200 dark:hover:bg-rose-800'
            }`}
            onClick={() => {
              // This would be handled by the parent component
              console.log(`Section clicked: ${sectionId}`);
            }}
          >
            {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredImages.map((image) => (
          <div 
            key={image.id}
            className="relative aspect-square overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl cursor-pointer"
            onClick={() => onImageClick && onImageClick(image.id)}
          >
            <img 
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder-image.jpg';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all"></div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="text-center py-20">
          <p>No images found for this section</p>
        </div>
      )}
    </div>
  );
};

export default LocalPortfolioGallery;

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  Pagination,
  useMediaQuery,
  useTheme,
  Paper
} from '@mui/material';
import { Image as ImageIcon } from 'lucide-react';
import OptimizedGalleryImage from './OptimizedGalleryImage';

interface BentoGalleryGridProps {
  galleryId: string;
  images: Array<{
    id: string;
    url: string;
    metadata?: {
      width?: number;
      height?: number;
    };
  }>;
  loading: boolean;
  error: string | null;
  selectedImages: string[];
  onImageSelect: (imageId: string) => void;
  maxSelections?: number;
}

/**
 * BentoGalleryGrid Component
 * 
 * A modern bento-box style grid layout for gallery images.
 * Features:
 * - Visually interesting layout with varying image sizes
 * - Optimized image loading with Cloudinary
 * - Selection capabilities for client galleries
 * - Responsive design for all devices
 */
const BentoGalleryGrid: React.FC<BentoGalleryGridProps> = ({
  galleryId,
  images,
  loading,
  error,
  selectedImages,
  onImageSelect,
  maxSelections
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [page, setPage] = useState(1);
  const imagesPerPage = isMobile ? 8 : isTablet ? 12 : 16;
  
  // Calculate total pages
  const totalPages = Math.ceil(images.length / imagesPerPage);
  
  // Get current page images
  const currentImages = images.slice(
    (page - 1) * imagesPerPage,
    page * imagesPerPage
  );
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    // Scroll to top of grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleImageClick = (imageId: string) => {
    // If max selections is reached and image is not already selected, show warning or prevent selection
    if (
      maxSelections && 
      selectedImages.length >= maxSelections && 
      !selectedImages.includes(imageId)
    ) {
      // You could show a toast or alert here
      return;
    }
    
    onImageSelect(imageId);
  };
  
  if (loading) {
    return (
      <Box className="flex flex-col items-center justify-center py-12">
        <CircularProgress size={40} />
        <Typography variant="body1" className="mt-4">
          Loading gallery images...
        </Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" className="my-4">
        {error}
      </Alert>
    );
  }
  
  if (images.length === 0) {
    return (
      <Box className="flex flex-col items-center justify-center py-12 text-gray-500">
        <ImageIcon size={48} />
        <Typography variant="h6" className="mt-4">
          No images found in this gallery
        </Typography>
      </Box>
    );
  }
  
  // Create a bento grid layout
  // We'll create a pattern that repeats: [big, small, small], [small, small, big], etc.
  const createBentoLayout = () => {
    if (currentImages.length === 0) return null;
    
    // For mobile, we'll use a simpler layout
    if (isMobile) {
      return (
        <Box className="grid grid-cols-1 gap-3">
          {currentImages.map((image, index) => (
            <Paper 
              key={image.id}
              elevation={2} 
              className="overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg"
              sx={{
                transform: 'translateY(0)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <OptimizedGalleryImage
                firebaseUrl={image.url}
                alt={`Gallery image ${image.id}`}
                aspectRatio={
                  image.metadata?.width && image.metadata?.height
                    ? image.metadata.height / image.metadata.width
                    : 3/4
                }
                objectFit="cover"
                selectable={true}
                selected={selectedImages.includes(image.id)}
                onClick={() => handleImageClick(image.id)}
                priority={page === 1 && index < 4}
              />
            </Paper>
          ))}
        </Box>
      );
    }
    
    return (
      <Box className="grid grid-cols-12 gap-4">
        {currentImages.map((image, index) => {
          // Determine if this should be a featured (large) image
          // We'll make every 3rd image featured, alternating between different positions
          const isFeatured = index % 6 === 0 || index % 6 === 5;
          const position = index % 6;
          
          // Determine grid span based on position in the pattern
          let colSpan = 4; // Default for small images
          let rowSpan = 1;
          
          if (isFeatured) {
            colSpan = 8;
            rowSpan = 2;
          }
          
          // For tablet, adjust the spans
          if (isTablet) {
            colSpan = isFeatured ? 8 : 4;
            rowSpan = isFeatured ? 2 : 1;
          }
          
          return (
            <Paper
              key={image.id}
              elevation={2}
              className="overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg"
              sx={{
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
                transform: 'translateY(0)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <OptimizedGalleryImage
                firebaseUrl={image.url}
                alt={`Gallery image ${image.id}`}
                aspectRatio={
                  isFeatured
                    ? (image.metadata?.width && image.metadata?.height
                        ? image.metadata.height / image.metadata.width
                        : 9/16)
                    : (image.metadata?.width && image.metadata?.height
                        ? image.metadata.height / image.metadata.width
                        : 1)
                }
                objectFit="cover"
                selectable={true}
                selected={selectedImages.includes(image.id)}
                onClick={() => handleImageClick(image.id)}
                priority={page === 1 && index < 4}
              />
            </Paper>
          );
        })}
      </Box>
    );
  };
  
  return (
    <Box>
      {createBentoLayout()}
      
      {totalPages > 1 && (
        <Box className="flex justify-center mt-8">
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary"
            size={isMobile ? "small" : "medium"}
          />
        </Box>
      )}
      
      {maxSelections && (
        <Box className="mt-4 text-center">
          <Typography variant="body2" color="textSecondary">
            {selectedImages.length} of {maxSelections} images selected
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BentoGalleryGrid;

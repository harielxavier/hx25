import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  Pagination,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Image as ImageIcon } from 'lucide-react';
import OptimizedGalleryImage from './OptimizedGalleryImage';

interface ClientGalleryGridProps {
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
 * ClientGalleryGrid Component
 * 
 * Displays a responsive grid of gallery images with selection capabilities
 * for client galleries. Includes:
 * - Responsive grid layout for different screen sizes
 * - Image selection with visual feedback
 * - Pagination for large galleries
 * - Loading states and error handling
 */
const ClientGalleryGrid: React.FC<ClientGalleryGridProps> = ({
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
  const imagesPerPage = isMobile ? 12 : isTablet ? 18 : 24;
  
  // Calculate total pages
  const totalPages = Math.ceil(images.length / imagesPerPage);
  
  // Get current page images
  const currentImages = images.slice(
    (page - 1) * imagesPerPage,
    page * imagesPerPage
  );
  
  // Reset to page 1 when gallery changes
  useEffect(() => {
    setPage(1);
  }, [galleryId]);
  
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
  
  return (
    <Box>
      <Grid container spacing={2}>
        {currentImages.map((image) => (
          <Grid 
            item 
            xs={6} 
            sm={4} 
            md={3} 
            key={image.id}
          >
            <OptimizedGalleryImage
              firebaseUrl={image.url}
              alt={`Gallery image ${image.id}`}
              aspectRatio={
                image.metadata?.width && image.metadata?.height
                  ? image.metadata.height / image.metadata.width
                  : 3/4 // Default aspect ratio if metadata not available
              }
              objectFit="cover"
              selectable={true}
              selected={selectedImages.includes(image.id)}
              onClick={() => handleImageClick(image.id)}
              priority={page === 1} // Only prioritize loading for first page
            />
          </Grid>
        ))}
      </Grid>
      
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

export default ClientGalleryGrid;

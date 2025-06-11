import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Divider,
  Button,
  useMediaQuery,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip
} from '@mui/material';
import { 
  ImageIcon, 
  Heart, 
  Check, 
  Download, 
  Share2, 
  Info,
  LayoutGrid,
  Grid3X3
} from 'lucide-react';
import ClientGalleryGrid from './ClientGalleryGrid';
import BentoGalleryGrid from './BentoGalleryGrid';
import ClientSelectionPanel from './ClientSelectionPanel';
import { getGalleryImages } from '../../services/galleryService';
import { hasSelectionDeadlinePassed } from '../../services/clientGalleryService';
import ThemeToggle from '../common/ThemeToggle';

interface ClientGalleryViewerProps {
  galleryId: string;
  galleryData: {
    id: string;
    title: string;
    description?: string;
    coverImage?: string;
    selectionRequired?: number;
    selectionDeadline?: Date | null;
    allowDownloads?: boolean;
    allowSharing?: boolean;
    clientId?: string;
  };
}

/**
 * ClientGalleryViewer Component
 * 
 * A comprehensive gallery viewer for clients that includes:
 * - Optimized image grid with Cloudinary integration
 * - Image selection functionality
 * - Download and sharing options
 * - Selection submission panel
 */
const ClientGalleryViewer: React.FC<ClientGalleryViewerProps> = ({
  galleryId,
  galleryData
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'bento'>('grid');
  const [deadlinePassed, setDeadlinePassed] = useState(false);
  
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        const fetchedImages = await getGalleryImages(galleryId);
        if (fetchedImages && fetchedImages.length > 0) {
          setImages(fetchedImages);
        }
      } catch (error) {
        console.error('Error loading gallery images:', error);
        setError('Failed to load gallery images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadImages();
  }, [galleryId]);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        const galleryImages = await getGalleryImages(galleryId);
        setImages(galleryImages || []);
        
        // Load previously selected images if any
        const preSelectedImages = galleryImages
          ? galleryImages
              .filter(img => img.clientSelected)
              .map(img => img.id)
          : [];
        
        if (preSelectedImages.length > 0) {
          setSelectedImages(preSelectedImages);
        }
        
        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem(`favorites_${galleryId}`);
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
        
        // Check if selection deadline has passed
        if (galleryData.selectionDeadline) {
          const deadlineOver = hasSelectionDeadlinePassed({ 
            selectionDeadline: galleryData.selectionDeadline 
          });
          setDeadlinePassed(deadlineOver);
        }
      } catch (err: any) {
        console.error('Error fetching gallery images:', err);
        setError(err.message || 'Failed to load gallery images');
      } finally {
        setLoading(false);
      }
    };
    
    if (galleryId) {
      fetchGalleryImages();
    }
  }, [galleryId, galleryData.selectionDeadline]);
  
  const handleImageSelect = (imageId: string) => {
    setSelectedImages(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };
  
  const handleFavoriteToggle = (imageId: string) => {
    setFavorites(prev => {
      let newFavorites;
      if (prev.includes(imageId)) {
        newFavorites = prev.filter(id => id !== imageId);
      } else {
        newFavorites = [...prev, imageId];
      }
      
      // Save to localStorage
      localStorage.setItem(`favorites_${galleryId}`, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const handleViewModeChange = (_event: React.MouseEvent<HTMLElement>, newMode: 'grid' | 'bento') => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };
  
  const handleSubmitSuccess = () => {
    // Maybe show a success message or redirect
    console.log('Selections submitted successfully');
  };
  
  // Filter images based on active tab
  const filteredImages = activeTab === 0 
    ? images 
    : activeTab === 1 
      ? images.filter(img => favorites.includes(img.id))
      : images.filter(img => selectedImages.includes(img.id));
  
  // Use deadlinePassed to conditionally render selection panel
  const showSelectionPanel = galleryData.clientId && 
                            galleryData.selectionRequired && 
                            !deadlinePassed;
  
  return (
    <Container maxWidth="xl" className="py-6">
      <Paper elevation={2} className="p-4 md:p-6 rounded-xl mb-6">
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h5" component="h1">
            {galleryData.title}
          </Typography>
          
          <Box className="flex items-center gap-2">
            <ThemeToggle size="small" />
            
            <Tooltip title="Change view mode">
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                aria-label="gallery view mode"
                size="small"
              >
                <ToggleButton value="grid" aria-label="grid view">
                  <Grid3X3 size={18} />
                </ToggleButton>
                <ToggleButton value="bento" aria-label="bento view">
                  <LayoutGrid size={18} />
                </ToggleButton>
              </ToggleButtonGroup>
            </Tooltip>
          </Box>
        </Box>
        
        {galleryData.description && (
          <Typography variant="body1" color="textSecondary" className="mb-4">
            {galleryData.description}
          </Typography>
        )}
        
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant={isMobile ? "fullWidth" : "standard"}
          className="mb-4"
        >
          <Tab 
            icon={<ImageIcon size={16} />} 
            label={isMobile ? "" : "All Images"} 
            iconPosition="start"
          />
          <Tab 
            icon={<Heart size={16} />} 
            label={isMobile ? "" : `Favorites (${favorites.length})`} 
            iconPosition="start"
            onClick={() => {
              if (favorites.length === 0) {
                // Show a message about how to add favorites
                // This uses handleFavoriteToggle indirectly
                console.log('Add favorites by clicking the heart icon on images');
              }
            }}
          />
          <Tab 
            icon={<Check size={16} />} 
            label={isMobile ? "" : `Selected (${selectedImages.length})`} 
            iconPosition="start"
          />
        </Tabs>
        
        <Divider className="mb-4" />
        
        {/* Gallery Actions */}
        <Box className="flex flex-wrap gap-2 mb-4">
          {galleryData.allowDownloads && (
            <Button 
              variant="outlined" 
              startIcon={<Download size={16} />}
              size="small"
            >
              Download
            </Button>
          )}
          
          {galleryData.allowSharing && (
            <Button 
              variant="outlined" 
              startIcon={<Share2 size={16} />}
              size="small"
            >
              Share
            </Button>
          )}
          
          <Button 
            variant="outlined" 
            startIcon={<Info size={16} />}
            size="small"
          >
            Gallery Info
          </Button>
        </Box>
        
        <Box className="flex flex-col md:flex-row gap-6">
          {/* Gallery Grid */}
          <Box className="flex-1">
            {viewMode === 'grid' ? (
              <ClientGalleryGrid
                galleryId={galleryId}
                images={filteredImages}
                loading={loading}
                error={error}
                selectedImages={selectedImages}
                onImageSelect={handleImageSelect}
                maxSelections={galleryData.selectionRequired}
              />
            ) : (
              <BentoGalleryGrid
                galleryId={galleryId}
                images={filteredImages}
                loading={loading}
                error={error}
                selectedImages={selectedImages}
                onImageSelect={handleImageSelect}
                maxSelections={galleryData.selectionRequired}
              />
            )}
          </Box>
          
          {/* Selection Panel (if client has selection rights) */}
          {showSelectionPanel && (
            <Box className="w-full md:w-80">
              <ClientSelectionPanel
                galleryId={galleryId}
                clientId={galleryData.clientId || ''}
                selectionRequired={galleryData.selectionRequired || 0}
                selectionDeadline={galleryData.selectionDeadline || null}
                selections={selectedImages}
                onSelectionsChange={setSelectedImages}
                onSubmitSuccess={handleSubmitSuccess}
              />
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ClientGalleryViewer;

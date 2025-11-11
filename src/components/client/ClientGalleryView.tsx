import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Gallery, GalleryMedia } from '../../services/galleryService';
import { Client, GalleryAccess } from '../../services/clientGalleryService';
import { getGallery, getGalleryMedia } from '../../services/galleryService';
import { getClient, getGalleryAccess, toggleClientSelection, getClientSelections } from '../../services/clientGalleryService';
// REMOVED FIREBASE: import { getOptimizedImageUrls } from '../../services/firebaseCloudinaryService';
import { Box, Typography, Grid, Button, CircularProgress, Chip, Badge, IconButton, Dialog, DialogContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Styled components
const GalleryContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '100%',
  margin: '0 auto',
}));

const ImageGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.02)',
    '& .image-overlay': {
      opacity: 1,
    },
  },
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'rgba(0, 0, 0, 0.6)',
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const SelectionCounter = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 1000,
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const FullscreenImage = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const ClientGalleryView: React.FC = () => {
  const { galleryId, accessCode } = useParams<{ galleryId: string; accessCode: string }>();
  const navigate = useNavigate();
  
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [access, setAccess] = useState<GalleryAccess | null>(null);
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<GalleryMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<GalleryMedia | null>(null);
  const [selectionCount, setSelectionCount] = useState(0);
  
  // Fetch gallery and client data
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        if (!galleryId) {
          setError('Gallery ID is missing');
          setLoading(false);
          return;
        }
        
        // Get gallery data
        const galleryData = await getGallery(galleryId);
        if (!galleryData) {
          setError('Gallery not found');
          setLoading(false);
          return;
        }
        
        setGallery(galleryData);
        
        // Verify access code and get client ID
        let clientId = '';
        if (accessCode) {
          // This would be implemented in your clientGalleryService
          const verifyResult = await verifyGalleryAccessCode(galleryId, accessCode);
          if (!verifyResult) {
            setError('Invalid access code');
            setLoading(false);
            return;
          }
          clientId = verifyResult;
        } else {
          // For development/testing - you would remove this in production
          // and require a valid access code
          const clients = await getGalleryClients(galleryId);
          if (clients.length > 0) {
            clientId = clients[0].id;
          } else {
            setError('No clients associated with this gallery');
            setLoading(false);
            return;
          }
        }
        
        // Get client data
        const clientData = await getClient(clientId);
        if (!clientData) {
          setError('Client not found');
          setLoading(false);
          return;
        }
        
        setClient(clientData);
        
        // Get access details
        const accessData = await getGalleryAccess(galleryId, clientId);
        if (!accessData) {
          setError('No access to this gallery');
          setLoading(false);
          return;
        }
        
        setAccess(accessData);
        setSelectionCount(accessData.selectionCount || 0);
        
        // Get gallery media
        const mediaData = await getGalleryMedia(galleryId);
        setMedia(mediaData);
        
        // Get client selections
        const selections = await getClientSelections(clientId, galleryId);
        setSelectedMedia(selections);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gallery data:', error);
        setError('An error occurred while loading the gallery');
        setLoading(false);
      }
    };
    
    fetchGalleryData();
  }, [galleryId, accessCode]);
  
  // Handle image selection
  const handleToggleSelection = async (mediaItem: GalleryMedia) => {
    try {
      if (!client || !gallery) return;
      
      // Check if we've reached the maximum selections
      if (
        access?.maxSelections && 
        selectionCount >= access.maxSelections && 
        !mediaItem.clientSelected
      ) {
        alert(`You can only select up to ${access.maxSelections} images`);
        return;
      }
      
      // Check if selection deadline has passed
      if (
        access?.selectionDeadline && 
        access.selectionDeadline.toMillis() < Date.now()
      ) {
        alert('The selection deadline has passed');
        return;
      }
      
      const newSelectedState = !mediaItem.clientSelected;
      
      // Update the UI immediately for better UX
      setMedia(prevMedia => 
        prevMedia.map(item => 
          item.id === mediaItem.id 
            ? { ...item, clientSelected: newSelectedState } 
            : item
        )
      );
      
      // Update selection count
      setSelectionCount(prev => newSelectedState ? prev + 1 : prev - 1);
      
      // Update in Firebase
      await toggleClientSelection(
        client.id,
        gallery.id,
        mediaItem.id,
        newSelectedState
      );
      
      // Refresh client selections
      const selections = await getClientSelections(client.id, gallery.id);
      setSelectedMedia(selections);
      
    } catch (error) {
      console.error('Error toggling selection:', error);
      alert('Failed to update selection');
      
      // Revert UI changes on error
      setMedia(prevMedia => 
        prevMedia.map(item => 
          item.id === mediaItem.id 
            ? { ...item, clientSelected: !item.clientSelected } 
            : item
        )
      );
      
      // Revert selection count
      setSelectionCount(prev => mediaItem.clientSelected ? prev + 1 : prev - 1);
    }
  };
  
  // Open fullscreen view
  const openFullscreen = (mediaItem: GalleryMedia) => {
    setFullscreenImage(mediaItem);
  };
  
  // Close fullscreen view
  const closeFullscreen = () => {
    setFullscreenImage(null);
  };
  
  // For development/testing - these functions would be imported from your services
  const verifyGalleryAccessCode = async (galleryId: string, code: string) => {
    // This is a placeholder - implement the actual verification in clientGalleryService
    return 'client-id-placeholder';
  };
  
  const getGalleryClients = async (galleryId: string) => {
    // This is a placeholder - implement the actual client retrieval in clientGalleryService
    return [{ id: 'client-id-placeholder', name: 'Test Client', email: 'test@example.com', galleries: [], createdAt: new Date() as any, updatedAt: new Date() as any }];
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80vh">
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </Box>
    );
  }
  
  return (
    <GalleryContainer>
      {/* Gallery Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {gallery?.title}
        </Typography>
        
        <Typography variant="body1" paragraph>
          {gallery?.description}
        </Typography>
        
        {client && (
          <Typography variant="subtitle1" gutterBottom>
            Welcome, {client.name}
          </Typography>
        )}
        
        {access?.maxSelections && (
          <Chip 
            label={`Select up to ${access.maxSelections} images`} 
            color="primary" 
            variant="outlined" 
          />
        )}
        
        {access?.selectionDeadline && (
          <Chip 
            label={`Selection deadline: ${new Date(access.selectionDeadline.toMillis()).toLocaleDateString()}`} 
            color="secondary" 
            variant="outlined" 
            sx={{ ml: 1 }}
          />
        )}
      </Box>
      
      {/* Image Grid */}
      <ImageGrid container spacing={3}>
        {media.map((mediaItem) => {
          // Get optimized URLs from Cloudinary
          const { thumbnailUrl, optimizedUrl, blurPlaceholder } = getOptimizedImageUrls(mediaItem.url);
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={mediaItem.id}>
              <ImageContainer>
                <LazyLoadImage
                  alt={mediaItem.title || 'Gallery image'}
                  src={thumbnailUrl}
                  effect="blur"
                  placeholderSrc={blurPlaceholder}
                  onClick={() => openFullscreen(mediaItem)}
                  width="100%"
                  style={{ aspectRatio: '3/2', objectFit: 'cover' }}
                />
                
                <ImageOverlay className="image-overlay">
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSelection(mediaItem);
                    }}
                    color={mediaItem.clientSelected ? 'secondary' : 'default'}
                  >
                    {mediaItem.clientSelected ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  
                  {gallery?.allowDownloads && (
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(optimizedUrl, '_blank');
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  )}
                </ImageOverlay>
              </ImageContainer>
            </Grid>
          );
        })}
      </ImageGrid>
      
      {/* Selection Counter */}
      {access?.maxSelections && (
        <SelectionCounter>
          <FavoriteIcon />
          <Typography variant="body2">
            {selectionCount} / {access.maxSelections} selected
          </Typography>
        </SelectionCounter>
      )}
      
      {/* Fullscreen Image Dialog */}
      <Dialog
        open={!!fullscreenImage}
        onClose={closeFullscreen}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          {fullscreenImage && (
            <FullscreenImage>
              <IconButton
                onClick={closeFullscreen}
                sx={{ position: 'absolute', top: 8, right: 8, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
              >
                <CloseIcon />
              </IconButton>
              
              <img
                src={getOptimizedImageUrls(fullscreenImage.url).optimizedUrl}
                alt={fullscreenImage.title || 'Gallery image'}
                style={{ maxWidth: '100%', maxHeight: '80vh' }}
              />
              
              <Box display="flex" justifyContent="space-between" width="100%" p={2}>
                <Typography variant="body1">
                  {fullscreenImage.title || 'Untitled'}
                </Typography>
                
                <Box>
                  <IconButton
                    onClick={() => fullscreenImage && handleToggleSelection(fullscreenImage)}
                    color={fullscreenImage.clientSelected ? 'secondary' : 'default'}
                  >
                    {fullscreenImage.clientSelected ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  
                  {gallery?.allowDownloads && (
                    <IconButton
                      onClick={() => window.open(getOptimizedImageUrls(fullscreenImage.url).optimizedUrl, '_blank')}
                    >
                      <DownloadIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </FullscreenImage>
          )}
        </DialogContent>
      </Dialog>
    </GalleryContainer>
  );
};

export default ClientGalleryView;

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, CardActions, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControlLabel, 
  Switch, IconButton, Chip, CircularProgress, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getAllGalleries, createGallery, updateGallery, deleteGallery, Gallery } from '../../services/galleryService';
import { getAllClients, grantGalleryAccess, revokeGalleryAccess, Client } from '../../services/clientGalleryService';
import GalleryUploader from './GalleryUploader';
// REMOVED FIREBASE: import { Timestamp // REMOVED FIREBASE

const GalleryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const GalleryManager: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openClientDialog, setOpenClientDialog] = useState(false);
  const [openUploaderDialog, setOpenUploaderDialog] = useState(false);
  const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: false,
    isPasswordProtected: false,
    password: '',
    allowDownloads: true,
    allowSharing: true,
    galleryType: 'client',
    expiryDate: null as Date | null,
    selectionDeadline: null as Date | null,
    requiredSelectionCount: 0,
  });
  const [selectedClient, setSelectedClient] = useState('');
  const [accessType, setAccessType] = useState<'view' | 'select' | 'download'>('select');
  const [maxSelections, setMaxSelections] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galleriesData, clientsData] = await Promise.all([
          getAllGalleries(),
          getAllClients()
        ]);
        setGalleries(galleriesData);
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        showSnackbar('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenDialog = (gallery?: Gallery) => {
    if (gallery) {
      setCurrentGallery(gallery);
      setFormData({
        title: gallery.title,
        description: gallery.description,
        isPublic: gallery.isPublic,
        isPasswordProtected: gallery.isPasswordProtected,
        password: gallery.password,
        allowDownloads: gallery.allowDownloads,
        allowSharing: gallery.allowSharing,
        galleryType: gallery.galleryType,
        expiryDate: gallery.expiryDate ? new Date(gallery.expiryDate.toMillis()) : null,
        selectionDeadline: gallery.selectionDeadline ? new Date(gallery.selectionDeadline.toMillis()) : null,
        requiredSelectionCount: gallery.requiredSelectionCount,
      });
    } else {
      setCurrentGallery(null);
      setFormData({
        title: '',
        description: '',
        isPublic: false,
        isPasswordProtected: false,
        password: '',
        allowDownloads: true,
        allowSharing: true,
        galleryType: 'client',
        expiryDate: null,
        selectionDeadline: null,
        requiredSelectionCount: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleDateChange = (name: string, date: Date | null) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const galleryData: Partial<Gallery> = {
        title: formData.title,
        description: formData.description,
        isPublic: formData.isPublic,
        isPasswordProtected: formData.isPasswordProtected,
        password: formData.password,
        allowDownloads: formData.allowDownloads,
        allowSharing: formData.allowSharing,
        galleryType: formData.galleryType,
        expiryDate: formData.expiryDate ? Timestamp.fromDate(formData.expiryDate) : null,
        selectionDeadline: formData.selectionDeadline ? Timestamp.fromDate(formData.selectionDeadline) : null,
        requiredSelectionCount: formData.requiredSelectionCount,
      };

      if (currentGallery) {
        await updateGallery(currentGallery.id, galleryData);
        showSnackbar('Gallery updated successfully');
      } else {
        const newGalleryId = await createGallery(galleryData);
        showSnackbar('Gallery created successfully');
        
        // Open uploader for the new gallery
        setCurrentGallery({
          id: newGalleryId,
          ...galleryData,
          slug: '',
          coverImage: '',
          thumbnailImage: '',
          imageCount: 0,
          clientName: '',
          clientEmail: '',
          watermarkEnabled: false,
          tags: [],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        } as Gallery);
        setOpenDialog(false);
        setOpenUploaderDialog(true);
      }

      // Refresh galleries
      const updatedGalleries = await getAllGalleries();
      setGalleries(updatedGalleries);
    } catch (error) {
      console.error('Error saving gallery:', error);
      showSnackbar('Failed to save gallery', 'error');
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleDeleteGallery = (gallery: Gallery) => {
    setCurrentGallery(gallery);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteGallery = async () => {
    if (!currentGallery) return;
    
    try {
      setLoading(true);
      await deleteGallery(currentGallery.id);
      
      // Update galleries list
      setGalleries(galleries.filter(g => g.id !== currentGallery.id));
      showSnackbar('Gallery deleted successfully');
    } catch (error) {
      console.error('Error deleting gallery:', error);
      showSnackbar('Failed to delete gallery', 'error');
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  const handleOpenClientDialog = (gallery: Gallery) => {
    setCurrentGallery(gallery);
    setOpenClientDialog(true);
  };

  const handleGrantAccess = async () => {
    if (!currentGallery || !selectedClient) return;
    
    try {
      setLoading(true);
      
      const accessData = {
        accessType,
        maxSelections: accessType === 'select' ? maxSelections : null,
        expiryDate: formData.expiryDate ? Timestamp.fromDate(formData.expiryDate) : null,
        selectionDeadline: formData.selectionDeadline ? Timestamp.fromDate(formData.selectionDeadline) : null,
      };
      
      await grantGalleryAccess(currentGallery.id, selectedClient, accessData);
      showSnackbar('Access granted successfully');
    } catch (error) {
      console.error('Error granting access:', error);
      showSnackbar('Failed to grant access', 'error');
    } finally {
      setLoading(false);
      setOpenClientDialog(false);
    }
  };

  const handleOpenUploader = (gallery: Gallery) => {
    setCurrentGallery(gallery);
    setOpenUploaderDialog(true);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && galleries.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Gallery Manager
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create New Gallery
        </Button>
      </Box>

      <Grid container spacing={3}>
        {galleries.map((gallery) => (
          <Grid item xs={12} sm={6} md={4} key={gallery.id}>
            <GalleryCard>
              <CardMedia
                component="img"
                height="140"
                image={gallery.coverImage || 'https://via.placeholder.com/300x140?text=No+Cover+Image'}
                alt={gallery.title}
              />
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {gallery.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {gallery.description}
                </Typography>
                <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                  <Chip 
                    size="small" 
                    label={gallery.galleryType} 
                    color="primary" 
                    variant="outlined" 
                  />
                  {gallery.isPublic && (
                    <Chip 
                      size="small" 
                      label="Public" 
                      color="success" 
                      variant="outlined" 
                    />
                  )}
                  {gallery.isPasswordProtected && (
                    <Chip 
                      size="small" 
                      icon={<LockIcon />} 
                      label="Password Protected" 
                      color="warning" 
                      variant="outlined" 
                    />
                  )}
                </Box>
              </CardContent>
              <CardActions>
                <IconButton size="small" onClick={() => handleOpenDialog(gallery)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleOpenUploader(gallery)}>
                  <AddIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleOpenClientDialog(gallery)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDeleteGallery(gallery)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </GalleryCard>
          </Grid>
        ))}
      </Grid>

      {/* Gallery Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{currentGallery ? 'Edit Gallery' : 'Create New Gallery'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Gallery Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />
            
            <Box mt={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    name="isPublic"
                  />
                }
                label="Public Gallery"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPasswordProtected}
                    onChange={handleInputChange}
                    name="isPasswordProtected"
                  />
                }
                label="Password Protected"
              />
              
              {formData.isPasswordProtected && (
                <TextField
                  margin="normal"
                  fullWidth
                  id="password"
                  label="Gallery Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              )}
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.allowDownloads}
                    onChange={handleInputChange}
                    name="allowDownloads"
                  />
                }
                label="Allow Downloads"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.allowSharing}
                    onChange={handleInputChange}
                    name="allowSharing"
                  />
                }
                label="Allow Sharing"
              />
            </Box>
            
            <Box mt={2}>
              <TextField
                select
                fullWidth
                label="Gallery Type"
                name="galleryType"
                value={formData.galleryType}
                onChange={handleInputChange as any}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="client">Client Gallery</option>
                <option value="portfolio">Portfolio</option>
                <option value="website">Website Gallery</option>
              </TextField>
            </Box>
            
            <Box mt={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Expiry Date (Optional)"
                  value={formData.expiryDate}
                  onChange={(date) => handleDateChange('expiryDate', date)}
                />
              </LocalizationProvider>
            </Box>
            
            <Box mt={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Selection Deadline (Optional)"
                  value={formData.selectionDeadline}
                  onChange={(date) => handleDateChange('selectionDeadline', date)}
                />
              </LocalizationProvider>
            </Box>
            
            <TextField
              margin="normal"
              fullWidth
              id="requiredSelectionCount"
              label="Required Selection Count"
              name="requiredSelectionCount"
              type="number"
              value={formData.requiredSelectionCount}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {currentGallery ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the gallery "{currentGallery?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDeleteGallery} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Client Access Dialog */}
      <Dialog open={openClientDialog} onClose={() => setOpenClientDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Grant Gallery Access</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <TextField
              select
              fullWidth
              label="Select Client"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </option>
              ))}
            </TextField>
          </Box>
          
          <Box mt={2}>
            <TextField
              select
              fullWidth
              label="Access Type"
              value={accessType}
              onChange={(e) => setAccessType(e.target.value as any)}
              SelectProps={{
                native: true,
              }}
            >
              <option value="view">View Only</option>
              <option value="select">Selection</option>
              <option value="download">Download</option>
            </TextField>
          </Box>
          
          {accessType === 'select' && (
            <TextField
              margin="normal"
              fullWidth
              label="Maximum Selections"
              type="number"
              value={maxSelections}
              onChange={(e) => setMaxSelections(parseInt(e.target.value))}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenClientDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleGrantAccess} 
            variant="contained" 
            color="primary"
            disabled={!selectedClient}
          >
            Grant Access
          </Button>
        </DialogActions>
      </Dialog>

      {/* Gallery Uploader Dialog */}
      <Dialog 
        open={openUploaderDialog} 
        onClose={() => setOpenUploaderDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Upload Images to {currentGallery?.title}</DialogTitle>
        <DialogContent>
          {currentGallery && (
            <GalleryUploader galleryId={currentGallery.id} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploaderDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GalleryManager;

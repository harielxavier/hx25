import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { 
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  getGalleryBySlug, 
  verifyGalleryPassword
} from '../services/galleryService';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/layout/Footer';
import SEO from '../components/layout/SEO';
import PasswordProtectedForm from '../components/gallery/PasswordProtectedForm';
import ClientGalleryViewer from '../components/client/ClientGalleryViewer';

/**
 * ClientGalleryPage Component
 * 
 * This page displays a client gallery with optimized images using Cloudinary.
 * Features include:
 * - Password protection
 * - Image selection and favorites
 * - Download options
 * - Sharing functionality
 * - Optimized image loading with Cloudinary
 */
const ClientGalleryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    const fetchGallery = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const galleryData = await getGalleryBySlug(slug);
        
        if (!galleryData) {
          setError('Gallery not found');
          setLoading(false);
          return;
        }
        
        setGallery(galleryData);
        
        // Check if gallery is password protected
        if (!galleryData.isPasswordProtected) {
          setAuthenticated(true);
        }
      } catch (err: any) {
        console.error('Error fetching gallery:', err);
        setError(err.message || 'Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGallery();
  }, [slug]);

  const handlePasswordSubmit = async (password: string) => {
    if (!gallery) return;
    
    try {
      setLoading(true);
      const isValid = await verifyGalleryPassword(gallery.id, password);
      
      if (isValid) {
        setAuthenticated(true);
      } else {
        setError('Invalid password');
      }
    } catch (err: any) {
      console.error('Error verifying password:', err);
      setError(err.message || 'Failed to verify password');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <CircularProgress />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <Container maxWidth="lg" className="flex-grow py-12">
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
          <Button 
            startIcon={<ChevronLeft />}
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </Container>
        <Footer />
      </div>
    );
  }
  
  if (!gallery) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <Container maxWidth="lg" className="flex-grow py-12">
          <Alert severity="warning">
            Gallery not found
          </Alert>
          <Button 
            startIcon={<ChevronLeft />}
            onClick={() => navigate('/')}
            className="mt-4"
          >
            Return to Home
          </Button>
        </Container>
        <Footer />
      </div>
    );
  }
  
  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <Container maxWidth="sm" className="flex-grow py-12">
          <PasswordProtectedForm 
            gallery={gallery.title} 
            onSubmit={handlePasswordSubmit}
            error={error}
            loading={loading}
          />
        </Container>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={`${gallery.title} | Client Gallery`}
        description={gallery.description || `View and select images from ${gallery.title}`}
        image={gallery.coverImage}
      />
      
      <Navigation />
      
      <Box component="main" className="flex-grow py-6">
        <Container maxWidth="xl">
          {/* Breadcrumbs */}
          <Breadcrumbs className="mb-4">
            <Link color="inherit" href="/" underline="hover">
              Home
            </Link>
            <Link color="inherit" href="/galleries" underline="hover">
              Galleries
            </Link>
            <Typography color="textPrimary">{gallery.title}</Typography>
          </Breadcrumbs>
          
          {/* Back Button */}
          <Button 
            startIcon={<ChevronLeft />}
            onClick={() => navigate('/galleries')}
            className="mb-6"
            variant="outlined"
            size="small"
          >
            All Galleries
          </Button>
          
          {/* Gallery Viewer Component */}
          <ClientGalleryViewer 
            galleryId={gallery.id}
            galleryData={{
              id: gallery.id,
              title: gallery.title,
              description: gallery.description,
              coverImage: gallery.coverImage,
              selectionRequired: gallery.selectionRequired,
              selectionDeadline: gallery.selectionDeadline,
              allowDownloads: gallery.allowDownloads,
              allowSharing: gallery.allowSharing,
              clientId: gallery.clientId
            }}
          />
        </Container>
      </Box>
      
      <Footer />
    </div>
  );
};

export default ClientGalleryPage;

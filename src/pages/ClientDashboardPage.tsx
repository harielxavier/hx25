import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea, 
  Divider, 
  Chip, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import { 
  Clock, 
  Calendar, 
  Image, 
  Check, 
  ExternalLink, 
  LogOut, 
  User, 
  Heart 
} from 'lucide-react';
import { getCurrentClient, clientLogout } from '../services/clientAuthService';
import { getClientGalleries, getClientSelections } from '../services/clientGalleryService';
import { formatDate } from '../utils/dateUtils';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/layout/Footer';
import SEO from '../components/layout/SEO';

interface ClientGallery {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  date: any; // Firestore timestamp
  expiresAt: any; // Firestore timestamp
  imageCount: number;
  selectionCount: number;
  selectionRequired: number;
  selectionDeadline: any; // Firestore timestamp
  status: 'active' | 'expired' | 'completed';
  slug: string;
}

const ClientDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [galleries, setGalleries] = useState<ClientGallery[]>([]);
  const [clientName, setClientName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectionStats, setSelectionStats] = useState<{
    total: number;
    pending: number;
    completed: number;
  }>({
    total: 0,
    pending: 0,
    completed: 0
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const client = await getCurrentClient();
        
        if (!client) {
          // Not authenticated, redirect to login
          navigate('/client/login');
          return;
        }
        
        setClientName(client.name || client.email);
        
        // Fetch client galleries
        const clientGalleries = await getClientGalleries(client.id);
        setGalleries(clientGalleries);
        
        // Calculate selection stats
        let total = 0;
        let pending = 0;
        let completed = 0;
        
        for (const gallery of clientGalleries) {
          if (gallery.selectionRequired > 0) {
            total++;
            
            // Check if selection is completed for this gallery
            const selections = await getClientSelections(client.id, gallery.id);
            
            if (selections.length >= gallery.selectionRequired) {
              completed++;
            } else {
              pending++;
            }
          }
        }
        
        setSelectionStats({ total, pending, completed });
      } catch (err) {
        console.error('Error loading client dashboard:', err);
        setError('Failed to load your galleries. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await clientLogout();
      navigate('/client/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to log out. Please try again.');
    }
  };

  const getGalleryStatusChip = (gallery: ClientGallery) => {
    if (gallery.status === 'expired') {
      return <Chip 
        label="Expired" 
        size="small" 
        color="error" 
        icon={<Clock size={14} />} 
      />;
    }
    
    if (gallery.status === 'completed') {
      return <Chip 
        label="Completed" 
        size="small" 
        color="success" 
        icon={<Check size={14} />} 
      />;
    }
    
    // Check if selection deadline is approaching (within 3 days)
    if (gallery.selectionDeadline && gallery.selectionRequired > 0) {
      const deadline = gallery.selectionDeadline.toDate();
      const now = new Date();
      const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysRemaining <= 3 && daysRemaining > 0) {
        return <Chip 
          label={`${daysRemaining} days left`} 
          size="small" 
          color="warning" 
          icon={<Clock size={14} />} 
        />;
      }
    }
    
    return <Chip 
      label="Active" 
      size="small" 
      color="primary" 
      icon={<Check size={14} />} 
    />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <Container className="flex-grow flex items-center justify-center">
          <CircularProgress />
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEO 
        title="Client Dashboard | Hariel Xavier Photography" 
        description="View and manage your photography galleries" 
      />
      
      <Navigation />
      
      <Container maxWidth="lg" className="flex-grow py-12">
        {error && (
          <Alert severity="error" className="mb-6">
            {error}
          </Alert>
        )}
        
        <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome, {clientName}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              View and manage your photography galleries
            </Typography>
          </div>
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LogOut size={18} />}
            onClick={handleLogout}
            className="mt-4 md:mt-0"
          >
            Sign Out
          </Button>
        </Box>
        
        {/* Selection Stats */}
        {selectionStats.total > 0 && (
          <Paper elevation={1} className="p-6 mb-8 rounded-xl">
            <Typography variant="h6" gutterBottom>
              Selection Progress
            </Typography>
            
            <Grid container spacing={4} className="mt-2">
              <Grid item xs={12} sm={4}>
                <Box className="text-center p-3 rounded-lg bg-blue-50">
                  <Typography variant="h5" color="primary">
                    {selectionStats.total}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Galleries
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box className="text-center p-3 rounded-lg bg-amber-50">
                  <Typography variant="h5" color="warning.main">
                    {selectionStats.pending}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Pending Selections
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box className="text-center p-3 rounded-lg bg-green-50">
                  <Typography variant="h5" color="success.main">
                    {selectionStats.completed}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Completed Selections
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}
        
        {/* Galleries */}
        <Typography variant="h5" component="h2" gutterBottom className="mt-8 mb-4">
          Your Galleries
        </Typography>
        
        {galleries.length === 0 ? (
          <Paper elevation={1} className="p-6 text-center rounded-xl">
            <Typography variant="body1" color="textSecondary">
              You don't have any galleries yet.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {galleries.map((gallery) => (
              <Grid item xs={12} sm={6} md={4} key={gallery.id}>
                <Card elevation={2} className="h-full rounded-xl overflow-hidden transition-shadow hover:shadow-lg">
                  <CardActionArea 
                    component={Link} 
                    to={`/client/gallery/${gallery.slug}`}
                    className="h-full flex flex-col"
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={gallery.coverImage || '/images/placeholder-gallery.jpg'}
                      alt={gallery.name}
                      className="h-48 object-cover"
                    />
                    
                    <CardContent className="flex-grow">
                      <Box className="flex justify-between items-start mb-2">
                        <Typography variant="h6" component="h3" noWrap>
                          {gallery.name}
                        </Typography>
                        {getGalleryStatusChip(gallery)}
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        color="textSecondary" 
                        className="line-clamp-2 mb-3"
                        style={{ minHeight: '40px' }}
                      >
                        {gallery.description || 'No description provided'}
                      </Typography>
                      
                      <Divider className="my-3" />
                      
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Box className="flex items-center">
                            <Calendar size={14} className="mr-1 text-gray-500" />
                            <Typography variant="caption" color="textSecondary">
                              {gallery.date ? formatDate(gallery.date.toDate()) : 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Box className="flex items-center">
                            <Image size={14} className="mr-1 text-gray-500" />
                            <Typography variant="caption" color="textSecondary">
                              {gallery.imageCount} images
                            </Typography>
                          </Box>
                        </Grid>
                        
                        {gallery.selectionRequired > 0 && (
                          <Grid item xs={12} className="mt-1">
                            <Box className="flex items-center">
                              <Heart size={14} className="mr-1 text-gray-500" />
                              <Typography variant="caption" color="textSecondary">
                                {gallery.selectionCount}/{gallery.selectionRequired} selections
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      
      <Footer />
    </div>
  );
};

export default ClientDashboardPage;

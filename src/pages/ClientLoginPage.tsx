import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  clientLogin, 
  resetClientPassword, 
  accessGalleryWithCode 
} from '../services/clientAuthService';
import { Container, Typography, TextField, Button, Paper, Box, Grid, Divider, Alert, CircularProgress } from '@mui/material';
import { Lock, Mail, Key } from 'lucide-react';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/layout/Footer';
import SEO from '../components/layout/SEO';

const ClientLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [galleryId, setGalleryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'login' | 'access-code'>('login');
  const [resetSent, setResetSent] = useState(false);

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const gallery = params.get('gallery');
    
    if (code) {
      setAccessCode(code);
      setActiveTab('access-code');
    }
    
    if (gallery) {
      setGalleryId(gallery);
    }
  }, [location]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await clientLogin(email, password);
      
      // Set client data in localStorage
      localStorage.setItem('clientData', JSON.stringify({
        id: response.client.id,
        name: response.client.name,
        email: response.client.email
      }));
      
      setSuccess('Login successful!');
      
      // Redirect to client dashboard or specific gallery if provided
      if (galleryId) {
        navigate(`/client/gallery/${galleryId}`);
      } else {
        navigate('/client/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle different error types
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later.');
      } else {
        setError(err.message || 'An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccessCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!galleryId) {
        setError('Gallery ID is required');
        return;
      }
      
      const result = await accessGalleryWithCode(galleryId, accessCode);
      
      if (result.success) {
        setSuccess('Access granted!');
        
        // Navigate to the gallery page
        if (result.redirectUrl) {
          navigate(result.redirectUrl);
        } else {
          navigate(`/client/gallery/${galleryId}?code=${accessCode}`);
        }
      } else {
        setError(result.message || 'Invalid access code');
      }
    } catch (err: any) {
      console.error('Access code error:', err);
      setError(err.message || 'An error occurred while verifying the access code');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await resetClientPassword(email);
      setResetSent(true);
      setSuccess('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'An error occurred while sending the reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEO 
        title="Client Login | Hariel Xavier Photography" 
        description="Access your private photography gallery" 
      />
      
      <Navigation />
      
      <Container maxWidth="sm" className="flex-grow flex items-center justify-center py-12">
        <Paper elevation={3} className="w-full p-8 rounded-xl">
          <Box className="text-center mb-6">
            <Typography variant="h4" component="h1" gutterBottom>
              Client Access
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Access your private photography gallery
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" className="mb-4">
              {success}
            </Alert>
          )}
          
          <Box className="mb-6">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant={activeTab === 'login' ? 'contained' : 'outlined'}
                  onClick={() => setActiveTab('login')}
                  startIcon={<Mail size={18} />}
                >
                  Email Login
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant={activeTab === 'access-code' ? 'contained' : 'outlined'}
                  onClick={() => setActiveTab('access-code')}
                  startIcon={<Key size={18} />}
                >
                  Access Code
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          {activeTab === 'login' ? (
            <form onSubmit={handleEmailLogin}>
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                margin="normal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <Box className="mt-2 mb-4 text-right">
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={handlePasswordReset}
                  disabled={loading || !email || resetSent}
                >
                  Forgot Password?
                </Button>
              </Box>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Lock size={18} />}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleAccessCodeLogin}>
              <TextField
                label="Gallery ID"
                variant="outlined"
                fullWidth
                margin="normal"
                value={galleryId}
                onChange={(e) => setGalleryId(e.target.value)}
                required
                helperText="Enter the gallery ID provided by your photographer"
              />
              
              <TextField
                label="Access Code"
                variant="outlined"
                fullWidth
                margin="normal"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                required
                helperText="Enter the access code provided by your photographer"
              />
              
              <Box className="mt-6">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Key size={18} />}
                >
                  {loading ? 'Verifying...' : 'Access Gallery'}
                </Button>
              </Box>
            </form>
          )}
          
          <Box className="mt-6 pt-4 border-t border-gray-200">
            <Typography variant="body2" color="textSecondary" align="center">
              Need help accessing your gallery? Contact your photographer directly.
            </Typography>
          </Box>
        </Paper>
      </Container>
      
      <Footer />
    </div>
  );
};

export default ClientLoginPage;

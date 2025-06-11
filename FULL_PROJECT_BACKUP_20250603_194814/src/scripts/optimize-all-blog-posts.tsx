/**
 * Blog Post SEO Optimization Script
 * 
 * This script uses the blogSeoOptimizer utility to:
 * 1. Check all blog posts for SEO optimization
 * 2. Ensure all posts are published
 * 3. Optimize meta descriptions, headings, and content structure
 * 4. Add schema markup for better Google indexing
 * 5. Optimize images with Cloudinary
 */

import React, { useEffect, useState } from 'react';
import { checkAndOptimizeBlogPosts, getBlogPostsSeoStatus } from '../utils/blogSeoOptimizer';
import { Box, Button, Typography, Paper, List, ListItem, ListItemText, Chip, CircularProgress, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate } from 'react-router-dom';

const BlogPostOptimizer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check blog post status on component mount
  useEffect(() => {
    checkBlogPosts();
  }, []);

  // Function to check blog post status
  const checkBlogPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const status = await getBlogPostsSeoStatus();
      setStatus(status);
    } catch (err: any) {
      setError(err.message || 'An error occurred while checking blog posts');
      console.error('Error checking blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to optimize all blog posts
  const optimizeBlogPosts = async () => {
    setOptimizing(true);
    setError(null);
    
    try {
      const results = await checkAndOptimizeBlogPosts();
      setResults(results);
      
      // Refresh status after optimization
      await checkBlogPosts();
    } catch (err: any) {
      setError(err.message || 'An error occurred while optimizing blog posts');
      console.error('Error optimizing blog posts:', err);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Blog Post SEO Optimizer
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            onClick={checkBlogPosts} 
            disabled={loading || optimizing}
            sx={{ mr: 2 }}
          >
            Refresh Status
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={optimizeBlogPosts} 
            disabled={loading || optimizing}
          >
            Optimize All Posts
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {(loading || optimizing) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            {loading ? 'Checking blog posts...' : 'Optimizing blog posts...'}
          </Typography>
        </Box>
      )}

      {results && !loading && !optimizing && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Successfully optimized {results.optimized} of {results.total} blog posts.
        </Alert>
      )}

      {status && !loading && (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Blog Post Status Summary
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Paper elevation={1} sx={{ p: 2, flex: '1 1 200px' }}>
              <Typography variant="h6" color="primary">
                {status.total}
              </Typography>
              <Typography variant="body2">Total Blog Posts</Typography>
            </Paper>
            
            <Paper elevation={1} sx={{ p: 2, flex: '1 1 200px' }}>
              <Typography variant="h6" color={status.published === status.total ? 'success.main' : 'warning.main'}>
                {status.published} / {status.total}
              </Typography>
              <Typography variant="body2">Published</Typography>
            </Paper>
            
            <Paper elevation={1} sx={{ p: 2, flex: '1 1 200px' }}>
              <Typography variant="h6" color={status.optimized === status.total ? 'success.main' : 'warning.main'}>
                {status.optimized} / {status.total}
              </Typography>
              <Typography variant="body2">SEO Optimized</Typography>
            </Paper>
          </Box>

          <Typography variant="h6" component="h3" gutterBottom>
            Blog Posts Details
          </Typography>
          
          <List sx={{ bgcolor: 'background.paper' }}>
            {status.posts.map((post: any) => (
              <ListItem 
                key={post.id}
                secondaryAction={
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => navigate(`/admin/blog/${post.id}`)}
                  >
                    Edit
                  </Button>
                }
                sx={{ 
                  borderLeft: '4px solid', 
                  borderColor: post.isOptimized ? 'success.main' : 'warning.main',
                  mb: 1,
                  bgcolor: 'background.paper'
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {post.isOptimized ? (
                        <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      ) : (
                        <ErrorIcon color="warning" sx={{ mr: 1 }} />
                      )}
                      <Typography variant="subtitle1">{post.title}</Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={post.isPublished ? 'Published' : 'Draft'} 
                        size="small" 
                        color={post.isPublished ? 'success' : 'default'}
                        sx={{ mr: 1, mb: 1 }}
                      />
                      
                      <Chip 
                        label={post.isOptimized ? 'SEO Optimized' : 'Needs Optimization'} 
                        size="small" 
                        color={post.isOptimized ? 'success' : 'warning'}
                        sx={{ mr: 1, mb: 1 }}
                      />
                      
                      {!post.isOptimized && (
                        <Box sx={{ mt: 1 }}>
                          {post.issues.notPublished && (
                            <Typography variant="body2" color="error">• Not published</Typography>
                          )}
                          {post.issues.noExcerpt && (
                            <Typography variant="body2" color="error">• Missing or short excerpt</Typography>
                          )}
                          {post.issues.noTags && (
                            <Typography variant="body2" color="error">• Insufficient tags</Typography>
                          )}
                          {post.issues.noHeadings && (
                            <Typography variant="body2" color="error">• Missing heading structure</Typography>
                          )}
                          {post.issues.noInternalLinks && (
                            <Typography variant="body2" color="error">• No internal links</Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default BlogPostOptimizer;

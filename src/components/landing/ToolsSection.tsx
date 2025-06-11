import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Container, Grid, Card, CardContent, Button } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupsIcon from '@mui/icons-material/Groups';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ToolsSection = () => {
  const tools = [
    {
      id: 'wedding-timeline',
      title: 'Wedding Timeline Designer',
      description: 'Create beautiful, custom timelines for your wedding day with smart suggestions based on venue and lighting.',
      icon: <TimelineIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/wedding-timeline-tool',
      ctaText: 'Create Timeline'
    },
    {
      id: 'multi-photographer',
      title: 'Multi-Photographer Coordinator',
      description: 'Coordinate your photography team with precision: assign tasks, distribute shot lists, and sync equipment.',
      icon: <GroupsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/multi-photographer-tool',
      ctaText: 'Coordinate Team'
    },
    {
      id: 'venue-lighting',
      title: 'Venue Lighting Analyzer',
      description: 'Discover the best times for photos at your venue based on sun position, golden hour, and lighting conditions.',
      icon: <WbSunnyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/venue-lighting-tool',
      ctaText: 'Analyze Venue'
    }
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 6 }}
        >
          Photography Planning Tools
        </Typography>
        
        <Grid container spacing={4}>
          {tools.map((tool) => (
            <Grid item xs={12} md={4} key={tool.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {tool.icon}
                    <Typography variant="h5" component="h3" sx={{ ml: 1, fontWeight: 'bold' }}>
                      {tool.title}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 3, flexGrow: 1 }}>
                    {tool.description}
                  </Typography>
                  
                  <Button 
                    component={Link} 
                    to={tool.path}
                    variant="outlined" 
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    fullWidth
                  >
                    {tool.ctaText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ToolsSection;

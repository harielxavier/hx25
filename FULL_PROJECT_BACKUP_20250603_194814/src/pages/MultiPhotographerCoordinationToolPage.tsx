import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import StarIcon from '@mui/icons-material/Star';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatIcon from '@mui/icons-material/Chat';
import PrintIcon from '@mui/icons-material/Print';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';

// Components
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';

// Images
const heroImage = 'https://res.cloudinary.com/dos0qac90/image/upload/v1717918063/multi-photographer-hero.jpg';
const teamWorkingImage = 'https://res.cloudinary.com/dos0qac90/image/upload/v1717918063/team-working.jpg';
const interface1Image = 'https://res.cloudinary.com/dos0qac90/image/upload/v1717918063/interface-tasks.jpg';
const interface2Image = 'https://res.cloudinary.com/dos0qac90/image/upload/v1717918063/interface-shotlist.jpg';
const interface3Image = 'https://res.cloudinary.com/dos0qac90/image/upload/v1717918063/interface-equipment.jpg';

const MultiPhotographerCoordinationToolPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <Box sx={{
        position: 'relative',
        height: { xs: '90vh', md: '75vh' },
        width: '100%',
        overflow: 'hidden',
        mb: 6,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1
        }
      }}>
        <Box
          component="img"
          src={heroImage}
          alt="Photography team working together at a wedding"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
            display: 'block',
          }}
        />
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: '100%',
          maxWidth: '1200px',
          zIndex: 2,
          color: 'white',
          px: { xs: 2, md: 6 }
        }}>
          <Typography variant="h2" component="h1" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
          }}>
            COORDINATE YOUR PHOTOGRAPHY TEAM<br />
            WITH MILITARY PRECISION
          </Typography>
          <Typography variant="h6" sx={{ 
            maxWidth: '800px', 
            mx: 'auto',
            mb: 4,
            textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
          }}>
            The free tool that elite wedding photographers use to manage second shooters, assign tasks, and never miss a critical shot.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            GET FREE ACCESS
          </Button>
        </Box>
      </Box>
      
      {/* Problem Statement Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 'bold',
            mb: 4
          }}>
            THE MULTI-PHOTOGRAPHER CHALLENGE
          </Typography>
          
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ p: 4 }}>
                <List>
                  {[
                    'Miscommunication between team members',
                    'Duplicate coverage of same moments',
                    'Critical shots missed during key events',
                    'Confusion about equipment needs',
                    'Inconsistent results between photographers',
                    'Time wasted on coordination during events'
                  ].map((item, index) => (
                    <ListItem key={index} sx={{ py: 1 }}>
                      <ListItemIcon>
                        <ErrorIcon color="error" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
                
                <Box sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  p: 3, 
                  borderRadius: 2,
                  mt: 3
                }}>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    "Before using this tool, I was constantly texting my second shooter throughout the day. Now we're perfectly synchronized."
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mt: 1, textAlign: 'right' }}>
                    - Alex Rodriguez, Wedding Photographer
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
      
      {/* Feature Showcase Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 'bold',
            mb: 5,
            textAlign: 'center'
          }}>
            PERFECT COORDINATION IN THREE STEPS
          </Typography>
          
          <Grid container spacing={5} sx={{ mb: 5 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h4" component="h3" sx={{ 
                  fontWeight: 'bold',
                  mb: 2
                }}>
                  1. ASSIGN TASKS WITH PRECISION
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Create parallel timelines for each team member with clear responsibilities, locations, and timing. No more confusion about who shoots what.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
                <Box 
                  component="img"
                  src={interface1Image}
                  alt="Task assignment interface"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
          
          <Grid container spacing={5} sx={{ mb: 5, flexDirection: { xs: 'column-reverse', md: 'row' } }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
                <Box 
                  component="img"
                  src={interface2Image}
                  alt="Shot list distribution interface"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h4" component="h3" sx={{ 
                  fontWeight: 'bold',
                  mb: 2
                }}>
                  2. DISTRIBUTE SHOT LISTS AUTOMATICALLY
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Ensure comprehensive coverage by assigning specific shots to each photographer. Eliminate duplicated effort and missed moments.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
          </Grid>
          
          <Grid container spacing={5} sx={{ mb: 5 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h4" component="h3" sx={{ 
                  fontWeight: 'bold',
                  mb: 2
                }}>
                  3. RECOMMEND PERFECT EQUIPMENT
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Suggest ideal lenses and gear for each segment based on location, lighting, and shot type. Everyone arrives prepared for every scenario.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
                <Box 
                  component="img"
                  src={interface3Image}
                  alt="Equipment recommendation interface"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              sx={{ 
                py: 1.5, 
                px: 4, 
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              TRY IT FREE
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Use Case Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" sx={{ 
          fontWeight: 'bold',
          mb: 5,
          textAlign: 'center'
        }}>
          PERFECT FOR EVERY PHOTOGRAPHY TEAM
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h5" component="h3" sx={{ 
                    fontWeight: 'bold',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <GroupsIcon sx={{ mr: 1 }} color="primary" />
                    WEDDING STUDIOS
                  </Typography>
                  <Typography variant="body1">
                    Manage multiple shooters across parallel events with consistent results every time.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h5" component="h3" sx={{ 
                    fontWeight: 'bold',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <CameraAltIcon sx={{ mr: 1 }} color="primary" />
                    LEAD PHOTOGRAPHERS
                  </Typography>
                  <Typography variant="body1">
                    Train and direct second shooters with clear expectations and specific assignments.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h5" component="h3" sx={{ 
                    fontWeight: 'bold',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <AssignmentIcon sx={{ mr: 1 }} color="primary" />
                    SECOND SHOOTERS
                  </Typography>
                  <Typography variant="body1">
                    Understand exactly what's expected and deliver the perfect complementary coverage.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2, height: '100%' }}>
              <Box 
                component="img"
                src={teamWorkingImage}
                alt="Photography team reviewing assignments"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Testimonial Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 'bold',
            mb: 5,
            textAlign: 'center'
          }}>
            WHAT PHOTOGRAPHERS ARE SAYING
          </Typography>
          
          <Grid container spacing={4}>
            {[
              {
                name: 'Jennifer Williams',
                role: 'Studio Owner',
                text: 'This tool transformed how I work with my team. We capture 30% more unique moments now that everyone knows exactly where to be.'
              },
              {
                name: 'Michael Chen',
                role: 'Second Shooter',
                text: 'As a second shooter, I finally have clarity about what\'s expected. I can focus on creating great images instead of wondering what to do.'
              },
              {
                name: 'Sarah Johnson',
                role: 'Wedding Photographer',
                text: 'The equipment recommendations alone saved me from bringing the wrong lenses to a difficult venue. Worth its weight in gold.'
              }
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: 'warning.main' }} />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3 }}>
                    "{testimonial.text}"
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    - {testimonial.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.role}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Feature Details Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" sx={{ 
          fontWeight: 'bold',
          mb: 5,
          textAlign: 'center'
        }}>
          POWERFUL FEATURES, COMPLETELY FREE
        </Typography>
        
        <Grid container spacing={3}>
          {[
            {
              icon: <AssignmentIcon />,
              title: 'PERSONALIZED TIMELINES',
              description: 'Create custom schedules for each team member with synchronized timing and locations.'
            },
            {
              icon: <FormatListBulletedIcon />,
              title: 'SHOT LIST DISTRIBUTION',
              description: 'Assign specific shots to each photographer to ensure complete coverage without overlap.'
            },
            {
              icon: <SettingsIcon />,
              title: 'EQUIPMENT RECOMMENDATIONS',
              description: 'Get lens and gear suggestions for each timeline segment based on shooting conditions.'
            },
            {
              icon: <ChatIcon />,
              title: 'TEAM COMMUNICATION',
              description: 'Send preset messages and coordinate on-the-fly with our simple messaging system.'
            },
            {
              icon: <PrintIcon />,
              title: 'PRINTABLE ASSIGNMENT SHEETS',
              description: 'Generate PDF assignments for each team member with all their responsibilities in one place.'
            },
            {
              icon: <PhoneAndroidIcon />,
              title: 'MOBILE OPTIMIZATION',
              description: 'Access assignments on any device during the event for seamless coordination.'
            }
          ].map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Box sx={{ color: 'primary.main', mr: 2, mt: 0.5 }}>
                  {feature.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2">
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Call-to-Action Section */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        py: 8 
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 'bold',
            mb: 3
          }}>
            START COORDINATING YOUR TEAM TODAY
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 4 }}>
            Join 5,000+ professional photographers who trust our tool for flawless team coordination.
          </Typography>
          
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontSize: '1.2rem',
              fontWeight: 'bold',
              mb: 3
            }}
          >
            CREATE FREE ACCOUNT
          </Button>
          
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            No credit card required • Unlimited team members
          </Typography>
        </Container>
      </Box>
      
      {/* FAQ Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" sx={{ 
          fontWeight: 'bold',
          mb: 5,
          textAlign: 'center'
        }}>
          FREQUENTLY ASKED QUESTIONS
        </Typography>
        
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {[
            {
              question: 'Is this really free?',
              answer: 'Yes! We\'re offering this tool completely free to help photography teams deliver better results for their clients.'
            },
            {
              question: 'How many team members can I add?',
              answer: 'Add unlimited photographers to your team and assign them to any wedding or event.'
            },
            {
              question: 'Can I use this for other types of photography?',
              answer: 'While optimized for weddings, the tool works great for any multi-photographer event.'
            },
            {
              question: 'Do I need to download anything?',
              answer: 'No, this is a web-based tool that works on any device with an internet connection.'
            },
            {
              question: 'How do I share assignments with my team?',
              answer: 'Send direct links, download PDFs, or invite team members to create their own accounts.'
            }
          ].map((faq, index) => (
            <Accordion key={index} sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
      
      {/* Final Call-to-Action */}
      <Box sx={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 10,
        color: 'white'
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 'bold',
            mb: 3
          }}>
            NEVER MISS A CRITICAL SHOT AGAIN
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 4 }}>
            Join thousands of professional photographers who coordinate their teams with confidence.
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            GET FREE ACCESS
          </Button>
        </Container>
      </Box>
      
      <Footer />
    </>
  );
};

export default MultiPhotographerCoordinationToolPage;

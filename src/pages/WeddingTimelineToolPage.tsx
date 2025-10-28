import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Paper,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  useTheme,
  ListSubheader,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ButtonGroup,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Radio,
  RadioGroup,
  Autocomplete,
  Avatar,
  Badge
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, TimePicker, DatePicker } from '@mui/x-date-pickers';

// Icons
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MapIcon from '@mui/icons-material/Map';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CakeIcon from '@mui/icons-material/Cake';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import TimelineIcon from '@mui/icons-material/Timeline';

// For drag and drop functionality
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// For styling
import { styled } from '@mui/system';

// For date formatting
import { format, addMinutes, parseISO, set, isBefore, isAfter, isSameDay, addHours } from 'date-fns';

// Components
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';

// Utility functions for timeline visualization
const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'preparation':
      return '#8e44ad'; // Purple
    case 'ceremony':
      return '#e74c3c'; // Red
    case 'photo':
      return '#3498db'; // Blue
    case 'reception':
      return '#2ecc71'; // Green
    default:
      return '#95a5a6'; // Gray
  }
};

const getCategoryIcon = (category: string, props?: any) => {
  switch (category) {
    case 'preparation':
      return <PeopleIcon {...props} />;
    case 'ceremony':
      return <FavoriteIcon {...props} />;
    case 'photo':
      return <PhotoCameraIcon {...props} />;
    case 'reception':
      return <MusicNoteIcon {...props} />;
    default:
      return <ScheduleIcon {...props} />;
  }
};

// Type definitions
interface TimelineEvent {
  id: string;
  title: string;
  startTime: string; // ISO string format
  endTime: string; // ISO string format
  location?: string;
  description?: string;
  category: 'preparation' | 'ceremony' | 'photo' | 'reception' | 'other';
  participants?: string[];
  notes?: string;
  isKeyMoment?: boolean;
  photographers?: string[];
  icon?: string;
  color?: string;
}

interface WeddingPartyMember {
  id: string;
  name: string;
  role: string;
  isVIP: boolean;
  preparationLocation?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

interface VendorInfo {
  id: string;
  name: string;
  type: string;
  contactName?: string;
  phone?: string;
  email?: string;
  arrivalTime?: string;
  departureTime?: string;
  notes?: string;
}

interface LocationInfo {
  id: string;
  name: string;
  address: string;
  county?: string;
  travelTimeFromPrevious?: number; // in minutes
  notes?: string;
  type: 'preparation' | 'ceremony' | 'photo' | 'reception' | 'other';
  bestPhotoSpots?: string[];
  sunsetTime?: string;
  goldenHourStart?: string;
  restrictions?: string[];
}

interface TimelineTemplate {
  id: string;
  name: string;
  description: string;
  events: TimelineEvent[];
  ceremonyType: string;
  hasFirstLook: boolean;
  averageDurations: Record<string, number>; // durations in minutes for standard events
  recommendedBufferTime: number; // in minutes
  suitableFor: string[];
}

interface Timeline {
  id: string;
  name: string;
  date: string; // ISO string format
  events: TimelineEvent[];
  venues: LocationInfo[];
  weddingParty: WeddingPartyMember[];
  vendors: VendorInfo[];
  notes?: string[];
  ceremonyType: string;
  hasFirstLook: boolean;
  weddingPartySize: number;
  guestCount: number;
  primaryVenue: string;
  sunsetTime?: string;
  createdAt: string;
  updatedAt: string;
  isTemplate?: boolean;
}

// Predefined timeline templates
const timelineTemplates: TimelineTemplate[] = [
  {
    id: 'classic-with-first-look',
    name: 'Classic Wedding with First Look',
    description: 'Traditional wedding timeline with a first look and portrait session before the ceremony',
    ceremonyType: 'traditional',
    hasFirstLook: true,
    events: [],
    averageDurations: {
      'bridePreparation': 180, // 3 hours
      'groomPreparation': 120, // 2 hours
      'firstLook': 30,
      'portraitSession': 60,
      'weddingPartyPhotos': 45,
      'familyPhotos': 45,
      'ceremony': 30,
      'cocktailHour': 60,
      'reception': 240, // 4 hours
      'sendOff': 15
    },
    recommendedBufferTime: 30,
    suitableFor: ['Traditional weddings', 'Religious ceremonies', 'Large wedding parties']
  },
  {
    id: 'no-first-look',
    name: 'Traditional (No First Look)',
    description: 'Classic timeline where couple sees each other for the first time at the ceremony',
    ceremonyType: 'traditional',
    hasFirstLook: false,
    events: [],
    averageDurations: {
      'bridePreparation': 180, // 3 hours
      'groomPreparation': 120, // 2 hours
      'ceremony': 45,
      'portraitSession': 60,
      'weddingPartyPhotos': 45,
      'familyPhotos': 45,
      'cocktailHour': 60,
      'reception': 240, // 4 hours
      'sendOff': 15
    },
    recommendedBufferTime: 30,
    suitableFor: ['Traditional ceremonies', 'Religious weddings', 'Couples preferring the surprise element']
  },
  {
    id: 'intimate-elopement',
    name: 'Intimate Elopement',
    description: 'Streamlined timeline for elopements or intimate weddings with fewer than 20 guests',
    ceremonyType: 'elopement',
    hasFirstLook: true,
    events: [],
    averageDurations: {
      'preparation': 120, // 2 hours
      'firstLook': 20,
      'ceremony': 20,
      'portraitSession': 90,
      'intimateDinner': 180 // 3 hours
    },
    recommendedBufferTime: 20,
    suitableFor: ['Elopements', 'Intimate weddings', 'Destination weddings', 'Courthouse ceremonies']
  },
  {
    id: 'golden-hour-focus',
    name: 'Golden Hour Focus',
    description: 'Timeline structured around sunset for optimal portrait lighting',
    ceremonyType: 'outdoor',
    hasFirstLook: true,
    events: [],
    averageDurations: {
      'preparation': 150, // 2.5 hours
      'firstLook': 30,
      'earlyPortraits': 30,
      'ceremony': 30,
      'cocktailHour': 60,
      'goldenHourPortraits': 45,
      'reception': 240, // 4 hours
      'nightPortraits': 15
    },
    recommendedBufferTime: 30,
    suitableFor: ['Outdoor weddings', 'Photography-focused couples', 'Summer/fall weddings']
  },
  {
    id: 'same-venue-all-day',
    name: 'Single Venue All-Day',
    description: 'Streamlined timeline for weddings where everything happens at one location',
    ceremonyType: 'all-in-one',
    hasFirstLook: true,
    events: [],
    averageDurations: {
      'preparation': 180, // 3 hours
      'firstLook': 30,
      'portraitSession': 60,
      'weddingPartyPhotos': 45,
      'ceremony': 30,
      'cocktailHour': 60,
      'reception': 240, // 4 hours
      'sendOff': 15
    },
    recommendedBufferTime: 15, // Less buffer needed with no travel
    suitableFor: ['All-inclusive venues', 'Hotels', 'Country clubs', 'Private estates']
  },
  {
    id: 'multi-day-cultural',
    name: 'Multi-Cultural Celebration',
    description: 'Extended timeline for cultural weddings with multiple ceremonies or events',
    ceremonyType: 'cultural',
    hasFirstLook: false,
    events: [],
    averageDurations: {
      'traditionalCeremony': 90,
      'preparation': 180,
      'mainCeremony': 60,
      'culturalRituals': 120,
      'familyPhotos': 60,
      'portraitSession': 60,
      'reception': 300 // 5 hours
    },
    recommendedBufferTime: 45, // Extra buffer for cultural elements
    suitableFor: ['Multi-cultural weddings', 'Indian weddings', 'Jewish ceremonies', 'Asian ceremonies']
  }
];

// Component definition
const WeddingTimelineToolPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ open: boolean, message: string, severity: string }>({ open: false, message: '', severity: 'info' });
  
  // Basic wedding details
  const [weddingDate, setWeddingDate] = useState<Date | null>(null);
  const [sunsetTime, setSunsetTime] = useState<string>('N/A');
  const [primaryVenue, setPrimaryVenue] = useState<string>('');  
  const [selectedVenueData, setSelectedVenueData] = useState<{id: string, name: string, address: string, county: string} | null>(null);
  const [venueOptions, setVenueOptions] = useState<{id: string, name: string, address: string, county: string}[]>([]);
  const [ceremonyType, setCeremonyType] = useState<string>('');
  const [hasFirstLook, setHasFirstLook] = useState<boolean | null>(null);
  const [weddingPartySize, setWeddingPartySize] = useState<number | ''>('');
  const [guestCount, setGuestCount] = useState<number | ''>('');
  
  // Timeline state
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [currentTimeline, setCurrentTimeline] = useState<Timeline | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [timelineName, setTimelineName] = useState<string>('My Wedding Timeline');
  
  // Wedding party and vendors
  const [weddingParty, setWeddingParty] = useState<WeddingPartyMember[]>([]);
  const [vendors, setVendors] = useState<VendorInfo[]>([]);
  
  // Locations/venues
  const [locations, setLocations] = useState<LocationInfo[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  
  // Hero image for the wedding timeline tool
  const heroImage = 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

  // Fetch venues from the VenueLightingTool data
  useEffect(() => {
    // Hard-coded venue data for now since dynamic import has type issues
    // This can be replaced with an API call or direct import in the future
    const venueData = [
      { id: '1', name: 'The Madison Hotel', address: '1 Convent Rd, Morristown, NJ 07960', county: 'Morris' },
      { id: '2', name: 'Park Chateau Estate', address: '678 Cranbury Rd, East Brunswick, NJ 08816', county: 'Middlesex' },
      { id: '3', name: 'The Ashford Estate', address: '637 Province Line Rd, Allentown, NJ 08501', county: 'Mercer' },
      { id: '4', name: 'Nanina\'s in the Park', address: '540 Mill St, Belleville, NJ 07109', county: 'Essex' },
      { id: '5', name: 'The Legacy Castle', address: '141 NJ-23, Pompton Plains, NJ 07444', county: 'Morris' },
      { id: '6', name: 'Crystal Plaza', address: '305 W Northfield Rd, Livingston, NJ 07039', county: 'Essex' },
      { id: '7', name: 'The Grove', address: '691 Pompton Ave, Cedar Grove, NJ 07009', county: 'Essex' },
      { id: '8', name: 'Pleasantdale Chateau', address: '757 Eagle Rock Ave, West Orange, NJ 07052', county: 'Essex' },
      { id: '9', name: 'The Venetian', address: '546 River Dr, Garfield, NJ 07026', county: 'Bergen' },
      { id: '10', name: 'The Rockleigh', address: '26 Paris Ave, Rockleigh, NJ 07647', county: 'Bergen' }
    ];
    setVenueOptions(venueData);
  }, []);

  // Handle venue selection and update related data
  const handleVenueChange = (event: any) => {
    const venueId = event.target.value;
    setPrimaryVenue(venueId);
    
    // Find the selected venue data
    const venue = venueOptions.find(v => v.id === venueId);
    if (venue) {
      setSelectedVenueData(venue);
      
      // Calculate sunset time based on venue location and date
      if (weddingDate) {
        // This would normally call an API to get the actual sunset time
        // For now, we'll use a placeholder calculation
        const month = weddingDate.getMonth();
        let baseTime = '';
        
        // Very simplified sunset time calculation based on month
        if (month >= 4 && month <= 8) { // May through September
          baseTime = '8:15 PM'; // Summer
        } else if (month >= 9 && month <= 10) { // October through November
          baseTime = '6:30 PM'; // Fall
        } else if (month >= 11 || month <= 1) { // December through February
          baseTime = '4:45 PM'; // Winter
        } else { // March through April
          baseTime = '7:00 PM'; // Spring
        }
        
        setSunsetTime(baseTime);
      }
    }
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Generate timeline from template
  const generateTimelineFromTemplate = (template: TimelineTemplate) => {
    // Base ceremony time (default to 4:00 PM if no date selected)
    const weddingDay = weddingDate || new Date();
    const ceremonyTime = new Date(weddingDay);
    ceremonyTime.setHours(16, 0, 0, 0); // 4:00 PM ceremony
    
    // Calculate all other times based on ceremony time and selected template
    const events: TimelineEvent[] = [];
    const timelineId = `timeline-${Date.now()}`;
    
    // Set IDs for the venues
    const venueInfo = selectedVenueData ? {
      id: selectedVenueData.id,
      name: selectedVenueData.name,
      address: selectedVenueData.address,
      county: selectedVenueData.county || '',
      type: 'ceremony' as const,
      notes: 'Primary venue for ceremony and reception'
    } : null;
    
    // Generate venues array
    const venues: LocationInfo[] = venueInfo ? [venueInfo] : [];

    if (template.hasFirstLook) {
      // First Look Timeline
      // Calculate preparation time
      const bridePrep = new Date(ceremonyTime);
      bridePrep.setMinutes(bridePrep.getMinutes() - (template.averageDurations.bridePreparation || 180)); 

      const groomPrep = new Date(ceremonyTime);
      groomPrep.setMinutes(groomPrep.getMinutes() - (template.averageDurations.groomPreparation || 120));

      // First look time
      const firstLook = new Date(ceremonyTime);
      firstLook.setMinutes(firstLook.getMinutes() - 120); // 2 hours before ceremony

      // Photo sessions
      const couplePortraits = new Date(firstLook);
      couplePortraits.setMinutes(couplePortraits.getMinutes() + 30);

      const weddingPartyPhotos = new Date(couplePortraits);
      weddingPartyPhotos.setMinutes(weddingPartyPhotos.getMinutes() + 45);

      const familyPortraits = new Date(weddingPartyPhotos);
      familyPortraits.setMinutes(familyPortraits.getMinutes() + 30);
      
      // Add events for first look timeline
      events.push(
        {
          id: `${timelineId}-1`,
          title: 'Bride & Bridesmaids Preparation',
          startTime: bridePrep.toISOString(),
          endTime: firstLook.toISOString(),
          category: 'preparation',
          description: 'Hair, makeup, and getting dressed at preparation suite',
          isKeyMoment: false,
          icon: 'preparation'
        },
        {
          id: `${timelineId}-2`,
          title: 'Groom & Groomsmen Preparation',
          startTime: groomPrep.toISOString(),
          endTime: firstLook.toISOString(),
          category: 'preparation',
          description: 'Getting ready and pre-ceremony photos',
          isKeyMoment: false,
          icon: 'preparation'
        },
        {
          id: `${timelineId}-3`,
          title: 'First Look',
          startTime: firstLook.toISOString(),
          endTime: couplePortraits.toISOString(),
          category: 'photo',
          description: 'Private first look moment between couple',
          isKeyMoment: true,
          icon: 'photo'
        },
        {
          id: `${timelineId}-4`,
          title: 'Couple Portraits',
          startTime: couplePortraits.toISOString(),
          endTime: weddingPartyPhotos.toISOString(),
          category: 'photo',
          description: 'Romantic portraits of the couple',
          isKeyMoment: false,
          icon: 'photo'
        },
        {
          id: `${timelineId}-5`,
          title: 'Wedding Party Photos',
          startTime: weddingPartyPhotos.toISOString(),
          endTime: familyPortraits.toISOString(),
          category: 'photo',
          description: 'Photos with bridesmaids and groomsmen',
          isKeyMoment: false,
          icon: 'photo'
        },
        {
          id: `${timelineId}-6`,
          title: 'Family Portraits',
          startTime: familyPortraits.toISOString(),
          endTime: new Date(ceremonyTime.getTime() - 30 * 60000).toISOString(),
          category: 'photo',
          description: 'Formal family group photos',
          isKeyMoment: false,
          icon: 'photo'
        }
      );
    } else {
      // Traditional Timeline (No First Look)
      // Calculate preparation time
      const bridePrep = new Date(ceremonyTime);
      bridePrep.setMinutes(bridePrep.getMinutes() - (template.averageDurations.bridePreparation || 180));

      const groomPrep = new Date(ceremonyTime);
      groomPrep.setMinutes(groomPrep.getMinutes() - (template.averageDurations.groomPreparation || 120));
      
      // Add events for traditional timeline
      events.push(
        {
          id: `${timelineId}-1`,
          title: 'Bride & Bridesmaids Preparation',
          startTime: bridePrep.toISOString(),
          endTime: new Date(ceremonyTime.getTime() - 60 * 60000).toISOString(),
          category: 'preparation',
          description: 'Hair, makeup, and getting dressed at preparation suite',
          isKeyMoment: false,
          icon: 'preparation'
        },
        {
          id: `${timelineId}-2`,
          title: 'Groom & Groomsmen Preparation',
          startTime: groomPrep.toISOString(),
          endTime: new Date(ceremonyTime.getTime() - 90 * 60000).toISOString(),
          category: 'preparation',
          description: 'Getting ready and pre-ceremony photos',
          isKeyMoment: false,
          icon: 'preparation'
        }
      );
    }
    
    // Common events for both timeline types
    // Ceremony
    const ceremonyEnd = new Date(ceremonyTime);
    ceremonyEnd.setMinutes(ceremonyTime.getMinutes() + (template.averageDurations.ceremony || 30));
    
    // Cocktail hour
    const cocktailStart = new Date(ceremonyEnd);
    const cocktailEnd = new Date(cocktailStart);
    cocktailEnd.setMinutes(cocktailStart.getMinutes() + 60);
    
    // Reception
    const receptionStart = new Date(cocktailEnd);
    const receptionEnd = new Date(receptionStart);
    receptionEnd.setMinutes(receptionStart.getMinutes() + 240); // 4 hours for reception
    
    // Add post-ceremony events
    events.push(
      {
        id: `${timelineId}-7`,
        title: 'Ceremony',
        startTime: ceremonyTime.toISOString(),
        endTime: ceremonyEnd.toISOString(),
        category: 'ceremony',
        description: 'Wedding ceremony',
        isKeyMoment: true,
        icon: 'ceremony'
      }
    );
    
    // For traditional timeline, add post-ceremony photos
    if (!template.hasFirstLook) {
      const postCeremonyPhotosStart = new Date(ceremonyEnd);
      const familyPhotosEnd = new Date(postCeremonyPhotosStart);
      familyPhotosEnd.setMinutes(postCeremonyPhotosStart.getMinutes() + 30);
      
      const weddingPartyPhotosEnd = new Date(familyPhotosEnd);
      weddingPartyPhotosEnd.setMinutes(familyPhotosEnd.getMinutes() + 30);
      
      const couplePortraitsEnd = new Date(weddingPartyPhotosEnd);
      couplePortraitsEnd.setMinutes(weddingPartyPhotosEnd.getMinutes() + 30);
      
      events.push(
        {
          id: `${timelineId}-8`,
          title: 'Family Portraits',
          startTime: postCeremonyPhotosStart.toISOString(),
          endTime: familyPhotosEnd.toISOString(),
          category: 'photo',
          description: 'Formal family group photos',
          isKeyMoment: false,
          icon: 'photo'
        },
        {
          id: `${timelineId}-9`,
          title: 'Wedding Party Photos',
          startTime: familyPhotosEnd.toISOString(),
          endTime: weddingPartyPhotosEnd.toISOString(),
          category: 'photo',
          description: 'Photos with bridesmaids and groomsmen',
          isKeyMoment: false,
          icon: 'photo'
        },
        {
          id: `${timelineId}-10`,
          title: 'Couple Portraits',
          startTime: weddingPartyPhotosEnd.toISOString(),
          endTime: couplePortraitsEnd.toISOString(),
          category: 'photo',
          description: 'Romantic portraits of the couple',
          isKeyMoment: true,
          icon: 'photo'
        }
      );
    }
    
    // Continue with cocktail hour and reception for both timeline types
    events.push(
      {
        id: `${timelineId}-11`,
        title: 'Cocktail Hour',
        startTime: cocktailStart.toISOString(),
        endTime: cocktailEnd.toISOString(),
        category: 'reception',
        description: 'Drinks and hors d\'oeuvres for guests',
        isKeyMoment: false,
        icon: 'reception'
      },
      {
        id: `${timelineId}-12`,
        title: 'Reception Grand Entrance',
        startTime: receptionStart.toISOString(),
        endTime: new Date(receptionStart.getTime() + 15 * 60000).toISOString(),
        category: 'reception',
        description: 'Couple and wedding party entrance',
        isKeyMoment: true,
        icon: 'reception'
      },
      {
        id: `${timelineId}-13`,
        title: 'First Dance',
        startTime: new Date(receptionStart.getTime() + 15 * 60000).toISOString(),
        endTime: new Date(receptionStart.getTime() + 20 * 60000).toISOString(),
        category: 'reception',
        description: 'Couple\'s first dance',
        isKeyMoment: true,
        icon: 'reception'
      },
      {
        id: `${timelineId}-14`,
        title: 'Dinner Service',
        startTime: new Date(receptionStart.getTime() + 30 * 60000).toISOString(),
        endTime: new Date(receptionStart.getTime() + 90 * 60000).toISOString(),
        category: 'reception',
        description: 'Dinner service for all guests',
        isKeyMoment: false,
        icon: 'reception'
      },
      {
        id: `${timelineId}-15`,
        title: 'Toasts',
        startTime: new Date(receptionStart.getTime() + 90 * 60000).toISOString(),
        endTime: new Date(receptionStart.getTime() + 120 * 60000).toISOString(),
        category: 'reception',
        description: 'Speeches from best man, maid of honor, etc.',
        isKeyMoment: true,
        icon: 'reception'
      },
      {
        id: `${timelineId}-16`,
        title: 'Cake Cutting',
        startTime: new Date(receptionStart.getTime() + 150 * 60000).toISOString(),
        endTime: new Date(receptionStart.getTime() + 165 * 60000).toISOString(),
        category: 'reception',
        description: 'Ceremonial cake cutting',
        isKeyMoment: true,
        icon: 'reception'
      },
      {
        id: `${timelineId}-17`,
        title: 'Open Dancing',
        startTime: new Date(receptionStart.getTime() + 165 * 60000).toISOString(),
        endTime: receptionEnd.toISOString(),
        category: 'reception',
        description: 'Dance floor open for all guests',
        isKeyMoment: false,
        icon: 'reception'
      },
      {
        id: `${timelineId}-18`,
        title: 'Bouquet & Garter Toss',
        startTime: new Date(receptionEnd.getTime() - 60 * 60000).toISOString(),
        endTime: new Date(receptionEnd.getTime() - 45 * 60000).toISOString(),
        category: 'reception',
        description: 'Traditional bouquet and garter toss',
        isKeyMoment: true,
        icon: 'reception'
      },
      {
        id: `${timelineId}-19`,
        title: 'Grand Exit',
        startTime: new Date(receptionEnd.getTime() - 15 * 60000).toISOString(),
        endTime: receptionEnd.toISOString(),
        category: 'reception',
        description: 'Couple\'s ceremonial departure',
        isKeyMoment: true,
        icon: 'reception'
      }
    );
    
    // Create the complete timeline
    const newTimeline: Timeline = {
      id: timelineId,
      name: timelineName,
      date: weddingDate ? weddingDate.toISOString() : new Date().toISOString(),
      events: events,
      venues: venues,
      weddingParty: [], // To be filled in later
      vendors: [], // To be filled in later
      ceremonyType: ceremonyType || template.ceremonyType,
      hasFirstLook: hasFirstLook !== null ? hasFirstLook : template.hasFirstLook,
      weddingPartySize: typeof weddingPartySize === 'number' ? weddingPartySize : 8,
      guestCount: typeof guestCount === 'number' ? guestCount : 100,
      primaryVenue: primaryVenue,
      sunsetTime: sunsetTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Update state with the new timeline
    setCurrentTimeline(newTimeline);
    setTimelineEvents(events);
    showNotification('Timeline generated successfully! Customize it to fit your exact needs.', 'success');
  };
  
  // Show notification
  const showNotification = (message: string, severity: string = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
    
    // Show loading state for a brief period when generating timeline
    if (message.includes('generated')) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1500);
    }
  };

  return (
    <>
      <Navigation />
      
      {/* Hero Section with Wedding Image */}
      <Box sx={{
        position: 'relative',
        height: '60vh',
        width: '100%',
        overflow: 'hidden',
        mb: 4,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }
      }}>
        <Box
          component="img"
          src={heroImage}
          alt="Wedding couple at sunset"
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
          zIndex: 2,
          color: 'white',
          px: 2
        }}>
          <Typography variant="h2" component="h1" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
          }}>
            Wedding Day Timeline Tool
          </Typography>
          <Typography variant="h6" sx={{ 
            maxWidth: '800px', 
            mx: 'auto',
            textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
          }}>
            Plan your perfect wedding day schedule with our professional timeline designer
          </Typography>
        </Box>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          centered
          sx={{ 
            mb: 4,
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
              height: 3
            },
            '& .MuiTab-root': { 
              fontSize: '1rem',
              fontWeight: 500,
              px: 3,
              transition: 'all 0.2s',
              '&:hover': {
                color: 'primary.main',
                opacity: 1
              },
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 'bold'
              }
            }
          }}
        >
          <Tab 
            label="Timeline Designer" 
            icon={<ScheduleIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Photography Tips" 
            icon={<WbSunnyIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Saved Timelines" 
            icon={<BookmarkIcon />} 
            iconPosition="start"
          />
        </Tabs>
        
        {activeTab === 0 && (
          <>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
              Design Your Perfect Wedding Day Timeline
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {/* Left Column: Input Sections */}
              <Box sx={{ width: { xs: '100%', md: '48%' } }}>
                {/* Wedding Details Section */}
                {/* Timeline Templates Section */}
                <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Choose a Timeline Template
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Start with a professionally designed template based on your wedding style
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                    {timelineTemplates.map((template) => (
                      <Card 
                        key={template.id} 
                        sx={{ 
                          width: { xs: '100%', sm: '100%' },
                          mb: 2,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 6
                          }
                        }}
                        onClick={() => generateTimelineFromTemplate(template)}
                      >
                        <CardContent>
                          <Typography variant="subtitle1" component="div" fontWeight="bold">
                            {template.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {template.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Chip 
                              size="small" 
                              color="primary" 
                              label={template.hasFirstLook ? "Includes First Look" : "Traditional (No First Look)"}
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              size="small" 
                              color="secondary" 
                              label={template.ceremonyType || "Any Ceremony Type"}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button 
                              size="small" 
                              startIcon={<VisibilityIcon />}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                // Show preview dialog (to be implemented)
                                showNotification('Timeline preview feature coming soon', 'info');
                              }}
                            >
                              Preview
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              endIcon={<ArrowForwardIcon />}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent duplicate actions
                                generateTimelineFromTemplate(template);
                              }}
                            >
                              Use Template
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Paper>
                
                {/* Wedding Details Section */}
                <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Wedding Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                      <TextField
                        label="Wedding Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={weddingDate ? weddingDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : null;
                          setWeddingDate(date);
                        }}
                      />
                    </Box>
                    <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                      <FormControl fullWidth>
                        <InputLabel id="venue-select-label">Wedding Venue</InputLabel>
                        <Select
                          labelId="venue-select-label"
                          value={primaryVenue}
                          label="Wedding Venue"
                          onChange={handleVenueChange}
                        >
                          <MenuItem value="" disabled>Select a venue</MenuItem>
                          {/* Group venues by county */}
                          {Array.from(new Set(venueOptions.map(venue => venue.county))).map(county => [
                            <ListSubheader key={`header-${county}`}>{county} County</ListSubheader>,
                            ...venueOptions
                              .filter(venue => venue.county === county)
                              .map(venue => (
                                <MenuItem key={venue.id} value={venue.id}>
                                  {venue.name}
                                </MenuItem>
                              ))
                          ])}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <WbSunnyIcon sx={{ color: 'warning.main', mr: 1 }} />
                        <Typography variant="body2">
                          Sunset Time: 
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', ml: 1 }}>
                          {sunsetTime}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ width: { xs: '100%', md: '48%' } }}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LocationOnIcon sx={{ color: 'primary.main', mr: 1 }} />
                            <Typography variant="h6" component="h3">
                              Wedding Venue
                            </Typography>
                          </Box>
                          
                          {selectedVenueData ? (
                            <>
                              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {selectedVenueData.name}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 2 }}>
                                {selectedVenueData.address}
                              </Typography>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                startIcon={<MapIcon />}
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedVenueData.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View on Map
                              </Button>
                            </>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Select a venue to see details
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Box>
                    <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                      <FormControl fullWidth>
                        <InputLabel id="ceremony-type-label">Ceremony Type</InputLabel>
                        <Select
                          labelId="ceremony-type-label"
                          value={ceremonyType}
                          label="Ceremony Type"
                          onChange={(e) => setCeremonyType(e.target.value)}
                        >
                            <MenuItem value="">Select Type</MenuItem>
                            <MenuItem value="religious">Religious</MenuItem>
                            <MenuItem value="civil">Civil</MenuItem>
                            <MenuItem value="non-denominational">Non-Denominational</MenuItem>
                            <MenuItem value="cultural">Cultural</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                      <Typography component="legend" variant="body2">First Look?</Typography>
                      <ToggleButtonGroup
                        value={hasFirstLook}
                        exclusive
                        onChange={(_e, value) => setHasFirstLook(value)}
                        aria-label="first look"
                      >
                        <ToggleButton value={true} aria-label="yes">
                          Yes
                        </ToggleButton>
                        <ToggleButton value={false} aria-label="no">
                          No
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>
                    <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                      <TextField
                        label="Wedding Party Size"
                        type="number"
                        value={weddingPartySize}
                        onChange={(e) => setWeddingPartySize(parseInt(e.target.value) || '')}
                      />
                    </Box>
                    <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                      <TextField
                        label="Guest Count (Approx)"
                        type="number"
                        value={guestCount}
                        onChange={(e) => setGuestCount(parseInt(e.target.value) || '')}
                      />
                    </Box>
                  </Box>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={() => showNotification('Timeline generated successfully!', 'success')}
                    disabled={!primaryVenue || !weddingDate}
                  >
                    Generate Timeline
                  </Button>
                </Box>
              </Box>
              
              {/* Right Column: Timeline Preview */}
              <Box sx={{ width: { xs: '100%', md: '48%' } }}>
                <Paper elevation={3} sx={{ p: 3, height: '100%', position: 'sticky', top: 20 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimelineIcon sx={{ mr: 1 }} />
                    Timeline Preview
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Button 
                      size="small" 
                      startIcon={<PrintIcon />}
                      onClick={() => showNotification('Print functionality coming soon', 'info')}
                    >
                      Print
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<ShareIcon />}
                      onClick={() => showNotification('Share functionality coming soon', 'info')}
                    >
                      Share
                    </Button>
                    <Button 
                      variant="contained" 
                      size="small" 
                      startIcon={<SaveIcon />}
                      onClick={() => showNotification('Timeline saved successfully!', 'success')}
                    >
                      Save
                    </Button>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {weddingDate ? (
                      <>Wedding Date: {format(weddingDate, 'EEEE, MMMM d, yyyy')}</>
                    ) : (
                      <>Wedding Date: Not specified</>
                    )}
                    {selectedVenueData && (
                      <> • Venue: {selectedVenueData.name}</>
                    )}
                  </Typography>
                  
                  {/* Timeline visualization */}
                  {timelineEvents.length > 0 ? (
                    <Box sx={{ 
                      position: 'relative', 
                      mt: 2, 
                      mb: 4, 
                      height: 'calc(100vh - 350px)',
                      maxHeight: '800px',
                      overflowY: 'auto',
                      pr: 1,
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: '4px',
                      },
                    }}>
                      {/* Timeline line */}
                      <Box sx={{ 
                        position: 'absolute', 
                        left: '70px', 
                        top: 0, 
                        bottom: 0, 
                        width: '2px', 
                        bgcolor: 'divider',
                        zIndex: 0
                      }} />
                      
                      {/* Timeline events */}
                      {timelineEvents
                        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                        .map((event, index) => (
                          <Box 
                            key={event.id} 
                            sx={{ 
                              display: 'flex', 
                              mb: 3,
                              position: 'relative',
                              zIndex: 1,
                              opacity: event.isKeyMoment ? 1 : 0.85,
                              transition: 'all 0.2s',
                              '&:hover': {
                                opacity: 1,
                                transform: 'translateX(5px)'
                              }
                            }}
                          >
                            {/* Time */}
                            <Box sx={{ width: '70px', textAlign: 'right', pr: 2, pt: 0.5 }}>
                              <Typography variant="body2" fontWeight="bold">
                                {format(new Date(event.startTime), 'h:mm a')}
                              </Typography>
                            </Box>
                            
                            {/* Event node */}
                            <Box sx={{ 
                              width: '24px', 
                              height: '24px', 
                              borderRadius: '50%', 
                              bgcolor: event.isKeyMoment ? 'primary.main' : 'background.paper',
                              border: '2px solid',
                              borderColor: getCategoryColor(event.category),
                              zIndex: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                              mt: 0.5
                            }}>
                              {getCategoryIcon(event.category, { 
                                fontSize: 'small', 
                                color: event.isKeyMoment ? 'white' : 'inherit' 
                              })}
                            </Box>
                            
                            {/* Event details */}
                            <Box sx={{ 
                              flex: 1, 
                              bgcolor: 'background.paper', 
                              borderRadius: 1, 
                              boxShadow: 1,
                              p: 1.5,
                              border: '1px solid',
                              borderColor: event.isKeyMoment ? 'primary.main' : 'divider'
                            }}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {event.title}
                              </Typography>
                              
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
                                {' • '}
                                {Math.round((new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) / 60000)} min
                              </Typography>
                              
                              {event.description && (
                                <Typography variant="body2">
                                  {event.description}
                                </Typography>
                              )}
                              
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Button 
                                  size="small" 
                                  startIcon={<EditIcon />}
                                  onClick={() => showNotification('Edit feature coming soon', 'info')}
                                >
                                  Edit
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <TimelineIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body1">
                        Select a template to generate your timeline
                      </Typography>
                    </Box>
                  )}
                  {selectedVenueData && (
                    <Box sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 1, 
                      p: 2, 
                      mt: 3,
                      mb: 2,
                      background: 'linear-gradient(to right, #f5f5f5, #ffffff)'
                    }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Photography Insights for {selectedVenueData.name}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • Best photo locations: Garden terrace, grand staircase, fountain area
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • Golden hour begins at {sunsetTime ? `approximately ${sunsetTime}` : 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        • Recommended equipment: Wide angle lens for ballroom, macro lens for detail shots
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>
            </Box>
          </>
        )}
        
        {activeTab === 1 && (
          <Box sx={{ py: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Why Timing Matters for Wedding Photography
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 16px)' } }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <WbSunnyIcon sx={{ color: 'warning.main', mr: 1 }} />
                      <Typography variant="h6">Golden Hour Magic</Typography>
                    </Box>
                    <Typography variant="body2">
                      The hour before sunset provides the most flattering light for portraits, with warm golden tones 
                      and soft shadows that create a romantic atmosphere perfect for wedding photos.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              
              <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 16px)' } }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOnIcon sx={{ color: 'primary.main', mr: 1 }} />
                      <Typography variant="h6">Venue Knowledge</Typography>
                    </Box>
                    <Typography variant="body2">
                      Each venue has unique lighting characteristics. Knowing exactly where and when to capture 
                      key moments results in better photos with less stress on your wedding day.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              
              <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 16px)' } }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ScheduleIcon sx={{ color: 'success.main', mr: 1 }} />
                      <Typography variant="h6">Timeline Planning</Typography>
                    </Box>
                    <Typography variant="body2">
                      Building your wedding timeline around optimal lighting conditions ensures you'll get the 
                      most flattering photos while still enjoying your day to the fullest.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        )}
        
        {activeTab === 2 && (
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Your Saved Timelines
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              You don't have any saved timelines yet. Create your first timeline to save it here.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<ScheduleIcon />}
              onClick={() => setActiveTab(0)}
            >
              Create New Timeline
            </Button>
          </Box>
        )}
      </Container>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={() => setNotification({...notification, open: false})}
      >
        <Alert 
          onClose={() => setNotification({...notification, open: false})} 
          severity={notification.severity as 'success' | 'info' | 'warning' | 'error'} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress color="inherit" size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
            Processing your timeline...
          </Typography>
        </Box>
      </Backdrop>
      
      <Footer />
    </>
  );
};

export default WeddingTimelineToolPage;

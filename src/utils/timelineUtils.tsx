import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { ReactElement, ComponentProps } from 'react';

interface TimelineEvent {
  id: string;
  title: string;
  category: string;
  startTime: string;
  endTime: string;
  location: string;
}

// Utility function to get color for timeline categories
export const getCategoryColor = (category: string): string => {
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

// Utility function to get icon for timeline categories
export const getCategoryIcon = (category: string, props?: ComponentProps<'svg'>): ReactElement => {
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

// Format time range for display
export const formatTimeRange = (startTime: string, endTime: string): string => {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  } catch (error) {
    console.error('Error formatting time range:', error);
    return 'Invalid time range';
  }
};

// Calculate duration between two times in minutes
export const calculateDurationInMinutes = (startTime: string, endTime: string): number => {
  try {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    return Math.round((end - start) / 60000); // Convert milliseconds to minutes
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 0;
  }
};

// Format duration for display
export const formatDuration = (durationInMinutes: number): string => {
  if (durationInMinutes < 60) {
    return `${durationInMinutes} min`;
  }
  
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  
  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} min`;
};

// Generate default timeline events from a template and wedding details
export const generateDefaultEvents = (
  template: Record<string, unknown>, 
  weddingDate: string, 
  primaryVenue: string, 
  ceremonyTime: string, 
  _hasSunsetPhotos: boolean = true,
  _sunsetTime?: string
): TimelineEvent[] => {
  if (!template || !weddingDate || !primaryVenue || !ceremonyTime) {
    return [];
  }
  
  try {
    // Implementation details would go here to generate timeline events
    // This is a placeholder function that would need to be implemented based on the specific templates
    
    return [
      {
        id: 'prep-1',
        title: 'Bride Preparation',
        category: 'preparation',
        startTime: new Date(weddingDate).toISOString(),
        endTime: new Date(weddingDate).toISOString(),
        location: primaryVenue
      },
      // More events would be generated here
    ];
  } catch (error) {
    console.error('Error generating default events:', error);
    return [];
  }
};

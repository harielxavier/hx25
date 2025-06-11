import axios from 'axios';

// Constants
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID;
const USE_MOCK_DATA = !API_KEY || API_KEY === 'YOUR_GOOGLE_API_KEY' || !CALENDAR_ID || CALENDAR_ID === 'YOUR_CALENDAR_ID';

// Types
export interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    date?: string;
  };
  end: {
    dateTime: string;
    date?: string;
  };
  status: string;
}

export interface AvailabilityResponse {
  available: boolean;
  conflictingEvents?: CalendarEvent[];
  message: string;
}

export interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  date: Date;
  message: string;
}

// Mock data for development
const MOCK_BOOKED_DATES = [
  new Date(2025, 2, 5), // March 5, 2025
  new Date(2025, 2, 12), // March 12, 2025
  new Date(2025, 2, 19), // March 19, 2025
  new Date(2025, 2, 26), // March 26, 2025
  new Date(2025, 3, 10), // April 10, 2025
  new Date(2025, 3, 17), // April 17, 2025
  new Date(2025, 3, 24), // April 24, 2025
  new Date(2025, 4, 8),  // May 8, 2025
  new Date(2025, 4, 15), // May 15, 2025
  new Date(2025, 4, 22), // May 22, 2025
];

/**
 * Fetches events from Google Calendar within a date range
 */
export const fetchEvents = async (
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> => {
  if (USE_MOCK_DATA) {
    console.log('Using mock data for calendar events');
    // Return empty array for mock data - we'll use MOCK_BOOKED_DATES instead
    return [];
  }

  try {
    const timeMin = startDate.toISOString();
    const timeMax = endDate.toISOString();
    
    const response = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
      {
        params: {
          key: API_KEY,
          timeMin,
          timeMax,
          singleEvents: true,
          orderBy: 'startTime',
        },
      }
    );
    
    return response.data.items;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw new Error('Failed to fetch calendar events');
  }
};

/**
 * Checks if a specific date is available for booking
 */
export const checkDateAvailability = async (
  date: Date
): Promise<AvailabilityResponse> => {
  if (USE_MOCK_DATA) {
    // Use mock data to determine availability
    const isAvailable = !MOCK_BOOKED_DATES.some(
      bookedDate => 
        bookedDate.getFullYear() === date.getFullYear() && 
        bookedDate.getMonth() === date.getMonth() && 
        bookedDate.getDate() === date.getDate()
    );

    return {
      available: isAvailable,
      message: isAvailable ? 'This date is available for booking' : 'This date is already booked',
    };
  }

  try {
    // Create start and end of the day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    const events = await fetchEvents(startDate, endDate);
    
    // Filter events that are marked as "busy" or are wedding bookings
    const weddingEvents = events.filter(
      (event) => 
        event.status !== 'cancelled' && 
        (event.summary?.toLowerCase().includes('wedding') || 
         event.summary?.toLowerCase().includes('booked') ||
         event.summary?.toLowerCase().includes('unavailable'))
    );
    
    if (weddingEvents.length > 0) {
      return {
        available: false,
        conflictingEvents: weddingEvents,
        message: 'This date is already booked',
      };
    }
    
    return {
      available: true,
      message: 'This date is available for booking',
    };
  } catch (error) {
    console.error('Error checking date availability:', error);
    throw new Error('Failed to check date availability');
  }
};

/**
 * Gets all available dates within a month
 */
export const getMonthAvailability = async (
  year: number,
  month: number
): Promise<{ [date: string]: boolean }> => {
  if (USE_MOCK_DATA) {
    // Generate availability data using mock booked dates
    const result: { [date: string]: boolean } = {};
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      result[currentDate.toISOString().split('T')[0]] = !MOCK_BOOKED_DATES.some(
        bookedDate => 
          bookedDate.getFullYear() === currentDate.getFullYear() && 
          bookedDate.getMonth() === currentDate.getMonth() && 
          bookedDate.getDate() === currentDate.getDate()
      );
    }
    
    return result;
  }

  try {
    // Create first and last day of the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);
    
    const events = await fetchEvents(startDate, endDate);
    
    // Filter events that are marked as "busy" or are wedding bookings
    const weddingEvents = events.filter(
      (event) => 
        event.status !== 'cancelled' && 
        (event.summary?.toLowerCase().includes('wedding') || 
         event.summary?.toLowerCase().includes('booked') ||
         event.summary?.toLowerCase().includes('unavailable'))
    );
    
    // Create a map of dates to availability
    const availability: { [date: string]: boolean } = {};
    
    // Initialize all dates as available
    const daysInMonth = endDate.getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateString = date.toISOString().split('T')[0];
      availability[dateString] = true;
    }
    
    // Mark dates with events as unavailable
    weddingEvents.forEach((event) => {
      const eventDate = event.start.date || event.start.dateTime.split('T')[0];
      if (availability[eventDate] !== undefined) {
        availability[eventDate] = false;
      }
    });
    
    return availability;
  } catch (error) {
    console.error('Error getting month availability:', error);
    throw new Error('Failed to get month availability');
  }
};

/**
 * Creates a new event in the Google Calendar
 * Note: This would typically require OAuth2 authentication
 * For a full implementation, you would need to set up OAuth2 flow
 * This is a simplified version that assumes you have the necessary permissions
 */
export const createBookingEvent = async (
  date: Date,
  clientName: string,
  packageName: string,
  notes?: string
): Promise<CalendarEvent> => {
  if (USE_MOCK_DATA) {
    console.log('Mock booking created:', { date, clientName, packageName, notes });
    return {
      id: 'mock-event-id',
      summary: `Wedding: ${clientName} - ${packageName}`,
      start: {
        dateTime: date.toISOString(),
      },
      end: {
        dateTime: new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
      },
      status: 'confirmed',
    };
  }

  try {
    // This is a placeholder for the actual implementation
    // In a real application, you would use OAuth2 to authenticate and create events
    
    // Return a mock event for now
    return {
      id: 'mock-event-id',
      summary: `Wedding: ${clientName} - ${packageName}`,
      start: {
        dateTime: date.toISOString(),
      },
      end: {
        dateTime: new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
      },
      status: 'confirmed',
    };
  } catch (error) {
    console.error('Error creating booking event:', error);
    throw new Error('Failed to create booking event');
  }
};

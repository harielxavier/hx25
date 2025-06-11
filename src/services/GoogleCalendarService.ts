/**
 * Google Calendar Integration Service
 * 
 * Integrates Google Calendar with Mission Control Analytics
 * to track upcoming sessions, bookings, and calendar-based events.
 */

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  status: 'confirmed' | 'tentative' | 'cancelled';
  htmlLink: string;
  created: string;
  updated: string;
}

interface CalendarMetrics {
  upcomingSessions: CalendarEvent[];
  todaysSessions: CalendarEvent[];
  weeklyBookings: number;
  monthlyBookings: number;
  averageSessionDuration: number;
  clientResponseRate: number;
  busyHours: Array<{ hour: number; count: number }>;
  popularDays: Array<{ day: string; count: number }>;
}

class GoogleCalendarService {
  private accessToken: string | null = null;
  private calendarId: string = 'primary'; // Can be changed to specific calendar
  private isInitialized: boolean = false;

  constructor() {
    this.initializeGoogleAPI();
  }

  private async initializeGoogleAPI() {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
      console.log('Google Calendar API Key:', apiKey ? 'Present' : 'Missing');
      console.log('Google Calendar Client ID:', clientId ? 'Present' : 'Missing');
      console.log('API Key value:', apiKey);
      console.log('Client ID value:', clientId);
      console.log('All env vars:', import.meta.env);
      
      if (!apiKey || !clientId) {
        throw new Error('Google Calendar credentials not configured properly');
      }

      // Load Google API script if not already loaded
      if (!window.gapi) {
        await this.loadGoogleAPIScript();
      }

      // Initialize the API
      await new Promise((resolve) => {
        window.gapi.load('auth2:client', resolve);
      });

      await window.gapi.client.init({
        apiKey: apiKey,
        clientId: clientId,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar.readonly'
      });

      this.isInitialized = true;
      console.log('Google Calendar API initialized successfully');
    } catch (error: any) {
      console.error('Failed to initialize Google Calendar API. Full error object:', error);
      if (error.result && error.result.error) {
        console.error('Detailed Google API Error:', error.result.error);
      }
      if (error.details) {
        console.error('Error details:', error.details);
      }
    }
  }

  private loadGoogleAPIScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="apis.google.com"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.head.appendChild(script);
    });
  }

  public async authenticate(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initializeGoogleAPI();
      }

      const authInstance = window.gapi.auth2.getAuthInstance();
      
      if (authInstance.isSignedIn.get()) {
        this.accessToken = authInstance.currentUser.get().getAuthResponse().access_token;
        return true;
      }

      // Sign in user
      const user = await authInstance.signIn();
      this.accessToken = user.getAuthResponse().access_token;
      
      console.log('Google Calendar authentication successful');
      return true;
    } catch (error) {
      console.error('Google Calendar authentication failed:', error);
      return false;
    }
  }

  public async getUpcomingEvents(maxResults: number = 10): Promise<CalendarEvent[]> {
    try {
      if (!this.accessToken) {
        const authenticated = await this.authenticate();
        if (!authenticated) {
          throw new Error('Authentication failed');
        }
      }

      const now = new Date().toISOString();
      const response = await window.gapi.client.calendar.events.list({
        calendarId: this.calendarId,
        timeMin: now,
        maxResults,
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.result.items || [];
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      return [];
    }
  }

  public async getTodaysEvents(): Promise<CalendarEvent[]> {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const response = await window.gapi.client.calendar.events.list({
        calendarId: this.calendarId,
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.result.items || [];
    } catch (error) {
      console.error('Failed to fetch today\'s events:', error);
      return [];
    }
  }

  public async getCalendarMetrics(): Promise<CalendarMetrics> {
    try {
      // Get events for the past 30 days and next 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const response = await window.gapi.client.calendar.events.list({
        calendarId: this.calendarId,
        timeMin: thirtyDaysAgo.toISOString(),
        timeMax: thirtyDaysFromNow.toISOString(),
        maxResults: 1000,
        singleEvents: true,
        orderBy: 'startTime'
      });

      const events = response.result.items || [];
      const now = new Date();

      // Separate upcoming and past events
      const upcomingEvents = events.filter((event: CalendarEvent) => 
        new Date(event.start.dateTime || event.start.date || '') > now
      );

      const pastEvents = events.filter((event: CalendarEvent) => 
        new Date(event.start.dateTime || event.start.date || '') <= now
      );

      // Calculate metrics
      const upcomingSessions = upcomingEvents.slice(0, 5);
      const todaysSessions = await this.getTodaysEvents();
      
      const weeklyBookings = this.getEventsInRange(events, 7);
      const monthlyBookings = this.getEventsInRange(events, 30);
      
      const averageSessionDuration = this.calculateAverageSessionDuration(pastEvents);
      const clientResponseRate = this.calculateClientResponseRate(pastEvents);
      
      const busyHours = this.analyzeBusyHours(pastEvents);
      const popularDays = this.analyzePopularDays(pastEvents);

      return {
        upcomingSessions,
        todaysSessions,
        weeklyBookings,
        monthlyBookings,
        averageSessionDuration,
        clientResponseRate,
        busyHours,
        popularDays
      };
    } catch (error) {
      console.error('Failed to calculate calendar metrics:', error);
      return {
        upcomingSessions: [],
        todaysSessions: [],
        weeklyBookings: 0,
        monthlyBookings: 0,
        averageSessionDuration: 0,
        clientResponseRate: 0,
        busyHours: [],
        popularDays: []
      };
    }
  }

  private getEventsInRange(events: CalendarEvent[], days: number): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime || event.start.date || '');
      return eventDate >= cutoffDate && eventDate <= new Date();
    }).length;
  }

  private calculateAverageSessionDuration(events: CalendarEvent[]): number {
    const durationsInMinutes = events
      .filter(event => event.start.dateTime && event.end.dateTime)
      .map(event => {
        const start = new Date(event.start.dateTime!);
        const end = new Date(event.end.dateTime!);
        return (end.getTime() - start.getTime()) / (1000 * 60); // Convert to minutes
      });

    if (durationsInMinutes.length === 0) return 0;
    
    const total = durationsInMinutes.reduce((sum, duration) => sum + duration, 0);
    return Math.round(total / durationsInMinutes.length);
  }

  private calculateClientResponseRate(events: CalendarEvent[]): number {
    const eventsWithAttendees = events.filter(event => 
      event.attendees && event.attendees.length > 0
    );

    if (eventsWithAttendees.length === 0) return 0;

    const totalAttendees = eventsWithAttendees.reduce((sum, event) => 
      sum + (event.attendees?.length || 0), 0
    );

    const respondedAttendees = eventsWithAttendees.reduce((sum, event) => 
      sum + (event.attendees?.filter(attendee => 
        attendee.responseStatus !== 'needsAction'
      ).length || 0), 0
    );

    return Math.round((respondedAttendees / totalAttendees) * 100);
  }

  private analyzeBusyHours(events: CalendarEvent[]): Array<{ hour: number; count: number }> {
    const hourCounts: { [hour: number]: number } = {};

    events.forEach(event => {
      if (event.start.dateTime) {
        const hour = new Date(event.start.dateTime).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });

    return Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private analyzePopularDays(events: CalendarEvent[]): Array<{ day: string; count: number }> {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCounts: { [day: string]: number } = {};

    events.forEach(event => {
      if (event.start.dateTime || event.start.date) {
        const date = new Date(event.start.dateTime || event.start.date!);
        const dayName = dayNames[date.getDay()];
        dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
      }
    });

    return Object.entries(dayCounts)
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => b.count - a.count);
  }

  public async createEvent(eventData: {
    summary: string;
    description?: string;
    start: string;
    end: string;
    location?: string;
    attendees?: string[];
  }): Promise<CalendarEvent | null> {
    try {
      if (!this.accessToken) {
        const authenticated = await this.authenticate();
        if (!authenticated) {
          throw new Error('Authentication failed');
        }
      }

      const event = {
        summary: eventData.summary,
        description: eventData.description,
        start: {
          dateTime: eventData.start,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: eventData.end,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        location: eventData.location,
        attendees: eventData.attendees?.map(email => ({ email }))
      };

      const response = await window.gapi.client.calendar.events.insert({
        calendarId: this.calendarId,
        resource: event
      });

      console.log('Calendar event created successfully:', response.result);
      return response.result;
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      return null;
    }
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  public async signOut(): Promise<void> {
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      this.accessToken = null;
      console.log('Google Calendar signed out successfully');
    } catch (error) {
      console.error('Failed to sign out from Google Calendar:', error);
    }
  }
}

// Singleton instance
export const googleCalendarService = new GoogleCalendarService();

// Export types for use in components
export type { CalendarEvent, CalendarMetrics };

// Extend window object for TypeScript
declare global {
  interface Window {
    gapi: any;
  }
}

// src/services/SmartSchedulerService.ts

import { Timestamp, getFirestore, collection, query, where, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { app } from '../firebase/config'; // Firebase app instance

// Interfaces for our booking system
export interface BookingSlot {
  startTime: Timestamp;
  endTime: Timestamp;
  isAvailable: boolean;
  priceModifier?: number; // For dynamic pricing
}

export interface BookingRequest {
  userId: string;
  selectedSlot: BookingSlot;
  sessionType: string; // e.g., 'wedding', 'portrait', 'consultation'
  clientName: string;
  clientEmail: string;
  clientNotes?: string;
}

export interface BookingConfirmation {
  bookingId: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  zoomLink?: string;
  googleCalendarEventId?: string;
  confirmationEmailSent: boolean;
}

export interface WeatherData {
  temperature: number;
  condition: string; // e.g., 'sunny', 'cloudy', 'rain'
  precipitationChance: number;
}

export interface AISessionSuggestion {
  sessionType: string;
  suggestedDate: Timestamp;
  reasoning: string;
}

class SmartSchedulerService {
  private db;
  
  constructor() {
    this.db = getFirestore(app);
    console.log('SmartSchedulerService initialized with Firestore');
  }

  /**
   * Fetches available booking slots for a given date range.
   * This will integrate with Google Calendar API.
   * @param startDate - The start date for availability check.
   * @param endDate - The end date for availability check.
   * @param sessionType - Optional: filter by session type for specific availability rules.
   * @returns A promise that resolves to an array of BookingSlot.
   */
  async getAvailability(startDate: Date, endDate: Date, sessionType?: string): Promise<BookingSlot[]> {
    console.log(`Fetching availability from ${startDate} to ${endDate} for session type: ${sessionType || 'any'}`);
    
    // Query existing bookings in the date range
    const bookingsRef = collection(this.db, 'bookings');
    const q = query(
      bookingsRef,
      where('startTime', '>=', Timestamp.fromDate(startDate)),
      where('startTime', '<=', Timestamp.fromDate(endDate)),
      where('status', '==', 'confirmed')
    );
    
    const querySnapshot = await getDocs(q);
    const bookedSlots = querySnapshot.docs.map(doc => doc.data());
    
    // Generate available slots (this is simplified - would need actual business logic)
    const slotDuration = 2 * 60 * 60 * 1000; // 2 hours in ms
    const availableSlots: BookingSlot[] = [];
    
    // Generate slots for each day in range
    for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
      // Business hours: 9am to 5pm
      for (let hour = 9; hour <= 17; hour += 2) {
        const slotStart = new Date(day);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + slotDuration);
        
        // Check if slot is already booked
        const isBooked = bookedSlots.some(booking => 
          booking.startTime.toDate() <= slotEnd && 
          booking.endTime.toDate() >= slotStart
        );
        
        if (!isBooked) {
          availableSlots.push({
            startTime: Timestamp.fromDate(slotStart),
            endTime: Timestamp.fromDate(slotEnd),
            isAvailable: true,
            priceModifier: hour === 9 ? 0.9 : 1.0 // Example dynamic pricing
          });
        }
      }
    }
    
    return availableSlots;
  }

  /**
   * Creates a new booking.
   * This will involve:
   * - Saving the booking to Firestore.
   * - Creating a Google Calendar event.
   * - Creating a Zoom meeting.
   * - Sending a confirmation email.
   * @param bookingRequest - The details of the booking request.
   * @returns A promise that resolves to a BookingConfirmation.
   */
  async createBooking(bookingRequest: BookingRequest): Promise<BookingConfirmation> {
    console.log('Creating booking for:', bookingRequest.clientName, bookingRequest.selectedSlot.startTime.toDate());
    
    // Double-check availability
    const isAvailable = (await this.getAvailability(
      bookingRequest.selectedSlot.startTime.toDate(),
      bookingRequest.selectedSlot.endTime.toDate()
    )).some(slot => 
      slot.startTime.isEqual(bookingRequest.selectedSlot.startTime) && 
      slot.isAvailable
    );
    
    if (!isAvailable) {
      throw new Error('Selected slot is no longer available');
    }
    
    // Create booking document
    const bookingRef = await addDoc(collection(this.db, 'bookings'), {
      userId: bookingRequest.userId,
      startTime: bookingRequest.selectedSlot.startTime,
      endTime: bookingRequest.selectedSlot.endTime,
      sessionType: bookingRequest.sessionType,
      clientName: bookingRequest.clientName,
      clientEmail: bookingRequest.clientEmail,
      clientNotes: bookingRequest.clientNotes || '',
      status: 'confirmed',
      createdAt: Timestamp.now()
    });
    
    // In a real app, you would also:
    // 1. Create Google Calendar event
    // 2. Create Zoom meeting
    // 3. Send confirmation email
    
    return {
      bookingId: bookingRef.id,
      status: 'confirmed',
      zoomLink: 'https://zoom.us/j/realmeetingid', // Would be real in production
      googleCalendarEventId: 'realgcalid', // Would be real in production
      confirmationEmailSent: true,
    };
  }

  /**
   * Fetches weather forecast for a given date and location.
   * @param date - The date for the weather forecast.
   * @param location - The location (e.g., "New York, NY").
   * @returns A promise that resolves to WeatherData.
   */
  async getWeatherForecast(date: Date, location: string): Promise<WeatherData> {
    console.log(`Fetching weather for ${date} at ${location}`);
    // Placeholder: Implement OpenWeatherMap API (or similar) integration
    return {
      temperature: 25, // Celsius
      condition: 'sunny',
      precipitationChance: 0.1, // 10%
    };
  }

  /**
   * Provides AI-powered session suggestions based on client history or preferences.
   * @param clientId - The ID of the client.
   * @returns A promise that resolves to an AISessionSuggestion.
   */
  async getAISessionSuggestion(clientId: string): Promise<AISessionSuggestion> {
    console.log(`Generating AI session suggestion for client: ${clientId}`);
    // Placeholder: Implement AI logic
    // This could involve:
    // 1. Fetching client's past booking history.
    // 2. Analyzing preferences or notes.
    // 3. Using a simple model or rules to suggest a session type and date.
    return {
      sessionType: 'Follow-up Portrait Session',
      suggestedDate: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days from now
      reasoning: 'Based on your previous family portrait session, a follow-up around this time of year captures seasonal changes beautifully.',
    };
  }

  /**
   * Cancels an existing booking.
   * @param bookingId - The ID of the booking to cancel.
   * @param reason - Optional reason for cancellation.
   * @returns A promise that resolves to a boolean indicating success.
   */
  async cancelBooking(bookingId: string, reason?: string): Promise<boolean> {
    console.log(`Cancelling booking: ${bookingId}. Reason: ${reason || 'N/A'}`);
    
    await updateDoc(doc(this.db, 'bookings', bookingId), {
      status: 'cancelled',
      cancelledAt: Timestamp.now(),
      cancellationReason: reason || ''
    });
    
    // In a real app, you would also:
    // 1. Delete/cancel Google Calendar event
    // 2. Send cancellation emails
    
    return true;
  }
}

// Export a singleton instance of the service
export const smartSchedulerService = new SmartSchedulerService();

// src/components/booking/BookingWidget.tsx
import React, { useState, useEffect } from 'react';
import { smartSchedulerService, BookingSlot, BookingRequest, BookingConfirmation, WeatherData, AISessionSuggestion } from '../../services/SmartSchedulerService';
// REMOVED FIREBASE: import { Timestamp // REMOVED FIREBASE

interface BookingWidgetProps {
  userId: string; // Assuming the user is logged in and we have their ID
}

const calculateInitialEndDate = (): Date => {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  return nextWeek;
};

const BookingWidget: React.FC<BookingWidgetProps> = ({ userId }) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(calculateInitialEndDate());
  const [sessionType, setSessionType] = useState<string>('consultation');
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // AI & Weather features (optional display)
  const [weatherInfo, setWeatherInfo] = useState<WeatherData | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<AISessionSuggestion | null>(null);

  useEffect(() => {
    fetchAvailability();
  }, [startDate, endDate, sessionType]);

  const fetchAvailability = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const slots = await smartSchedulerService.getAvailability(startDate, endDate, sessionType);
      setAvailableSlots(slots);
    } catch (err) {
      console.error("Error fetching availability:", err);
      setError('Failed to fetch available slots. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !clientName || !clientEmail) {
      setError('Please select a slot and fill in your name and email.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setBookingConfirmation(null);

    const bookingRequest: BookingRequest = {
      userId,
      selectedSlot,
      sessionType,
      clientName,
      clientEmail,
      clientNotes,
    };

    try {
      const confirmation = await smartSchedulerService.createBooking(bookingRequest);
      setBookingConfirmation(confirmation);
      // Optionally fetch weather or AI suggestion post-booking or pre-booking
      // fetchWeatherForSlot(selectedSlot.startTime.toDate()); 
      // fetchAISuggestion();
    } catch (err) {
      console.error("Error creating booking:", err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Optional: Fetch weather for a selected slot
  const fetchWeatherForSlot = async (date: Date, location: string = "New York, NY") => {
    try {
      const weather = await smartSchedulerService.getWeatherForecast(date, location);
      setWeatherInfo(weather);
    } catch (err) {
      console.warn("Could not fetch weather:", err);
    }
  };

  // Optional: Fetch AI suggestion
  const fetchAISuggestion = async () => {
    try {
      const suggestion = await smartSchedulerService.getAISessionSuggestion(userId);
      setAiSuggestion(suggestion);
    } catch (err) {
      console.warn("Could not fetch AI suggestion:", err);
    }
  };


  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Book a Session</h2>

      {/* Date and Session Type Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Start Date:
          <input type="date" value={startDate.toISOString().split('T')[0]} onChange={(e) => setStartDate(new Date(e.target.value))} style={{ marginLeft: '10px', padding: '8px' }} />
        </label>
        <label style={{ marginLeft: '20px' }}>
          End Date:
          <input type="date" value={endDate.toISOString().split('T')[0]} onChange={(e) => setEndDate(new Date(e.target.value))} style={{ marginLeft: '10px', padding: '8px' }} />
        </label>
        <br />
        <label style={{ marginTop: '10px', display: 'block' }}>
          Session Type:
          <select value={sessionType} onChange={(e) => setSessionType(e.target.value)} style={{ marginLeft: '10px', padding: '8px' }}>
            <option value="consultation">Consultation</option>
            <option value="wedding">Wedding Photography</option>
            <option value="portrait">Portrait Session</option>
          </select>
        </label>
      </div>

      {isLoading && <p>Loading slots...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Available Slots */}
      {!isLoading && availableSlots.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Available Slots:</h3>
          {availableSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedSlot(slot);
                // fetchWeatherForSlot(slot.startTime.toDate()); // Example: fetch weather on slot selection
              }}
              style={{
                padding: '10px 15px',
                margin: '5px',
                border: selectedSlot === slot ? '2px solid #007bff' : '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: selectedSlot === slot ? '#e7f3ff' : (slot.isAvailable ? 'white' : '#f0f0f0'),
                color: slot.isAvailable ? 'black' : '#aaa',
                textDecoration: slot.isAvailable ? 'none' : 'line-through'
              }}
              disabled={!slot.isAvailable}
            >
              {slot.startTime.toDate().toLocaleString()} (Price Mod: {slot.priceModifier || 1})
            </button>
          ))}
        </div>
      )}
      {!isLoading && availableSlots.length === 0 && !error && <p>No slots available for the selected criteria.</p>}
      
      {/* AI Suggestion Example */}
      {/* <button onClick={fetchAISuggestion}>Get AI Suggestion</button>
      {aiSuggestion && (
        <div style={{ border: '1px dashed blue', padding: '10px', margin: '10px 0' }}>
          <h4>AI Suggestion:</h4>
          <p>Type: {aiSuggestion.sessionType}</p>
          <p>Date: {aiSuggestion.suggestedDate.toDate().toLocaleDateString()}</p>
          <p>Reason: {aiSuggestion.reasoning}</p>
        </div>
      )} */}

      {/* Booking Form */}
      {selectedSlot && (
        <form onSubmit={handleBookingSubmit}>
          <h3>Confirm Booking for: {selectedSlot.startTime.toDate().toLocaleString()}</h3>
          {weatherInfo && (
            <div style={{ fontStyle: 'italic', marginBottom: '10px', padding: '5px', background: '#f9f9f9' }}>
              Weather on {selectedSlot.startTime.toDate().toLocaleDateString()}: {weatherInfo.condition}, {weatherInfo.temperature}°C, {weatherInfo.precipitationChance * 100}% chance of rain.
            </div>
          )}
          <div style={{ marginBottom: '10px' }}>
            <label>
              Name:
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required style={{ marginLeft: '10px', padding: '8px', width: 'calc(100% - 70px)' }} />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Email:
              <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} required style={{ marginLeft: '10px', padding: '8px', width: 'calc(100% - 70px)' }} />
            </label>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label>
              Notes (optional):
              <textarea value={clientNotes} onChange={(e) => setClientNotes(e.target.value)} style={{ marginLeft: '10px', padding: '8px', width: 'calc(100% - 70px)', minHeight: '60px' }} />
            </label>
          </div>
          <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {isLoading ? 'Booking...' : 'Book Now'}
          </button>
        </form>
      )}

      {/* Booking Confirmation */}
      {bookingConfirmation && (
        <div style={{ marginTop: '20px', padding: '15px', border: `2px solid ${bookingConfirmation.status === 'confirmed' ? 'green' : 'orange'}`, borderRadius: '4px' }}>
          <h3>Booking {bookingConfirmation.status}!</h3>
          <p>Booking ID: {bookingConfirmation.bookingId}</p>
          {bookingConfirmation.zoomLink && <p>Zoom Link: <a href={bookingConfirmation.zoomLink} target="_blank" rel="noopener noreferrer">{bookingConfirmation.zoomLink}</a></p>}
          {bookingConfirmation.googleCalendarEventId && <p>Calendar Event ID: {bookingConfirmation.googleCalendarEventId}</p>}
          <p>A confirmation email has {bookingConfirmation.confirmationEmailSent ? '' : 'not yet '}been sent.</p>
        </div>
      )}
    </div>
  );
};

export default BookingWidget;

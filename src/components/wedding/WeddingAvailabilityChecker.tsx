import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './WeddingAvailabilityChecker.css';
import { checkDateAvailability, getMonthAvailability } from '../../services/calendarService';

interface DateAvailability {
  [date: string]: boolean;
}

const WeddingAvailabilityChecker: React.FC = () => {
  const [availabilityData, setAvailabilityData] = useState<DateAvailability>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkingDate, setCheckingDate] = useState<boolean>(false);
  const [currentYearMonth, setCurrentYearMonth] = useState<{year: number, month: number}>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  // Fetch availability data for the current month
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        const { year, month } = currentYearMonth;
        const availability = await getMonthAvailability(year, month);
        setAvailabilityData(prev => ({ ...prev, ...availability }));
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailability();
  }, [currentYearMonth]);
  
  // Handle date change in calendar
  const handleDateChange = async (date: Date) => {
    setSelectedDate(date);
    setCheckingDate(true);
    
    try {
      const response = await checkDateAvailability(date);
      setIsAvailable(response.available);
    } catch (error) {
      console.error("Error checking date:", error);
    } finally {
      setCheckingDate(false);
    }
  };
  
  // Handle calendar navigation (month change)
  const handleActiveStartDateChange = ({ activeStartDate }: { activeStartDate: Date }) => {
    if (activeStartDate) {
      setCurrentYearMonth({
        year: activeStartDate.getFullYear(),
        month: activeStartDate.getMonth() + 1
      });
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically submit the form data to your backend
    console.log("Form submitted:", { ...formData, date: selectedDate });
    alert("Thank you! We'll be in touch soon to confirm your booking.");
  };
  
  // Custom class for calendar tiles
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const dateString = date.toISOString().split('T')[0];
    
    // If we have availability data for this date
    if (availabilityData[dateString] !== undefined) {
      return availabilityData[dateString] ? 'available-date' : 'booked-date';
    }
    
    return null;
  };
  
  return (
    <div className="wedding-availability-container">
      <h2>Check My Availability For Your Wedding</h2>
      <p>Select a date to see if I'm available to capture your special day</p>
      
      <div className="availability-checker">
        <div className="calendar-container">
          {loading && !checkingDate ? (
            <div className="loading-spinner">Loading calendar data...</div>
          ) : (
            <Calendar 
              onChange={handleDateChange} 
              value={selectedDate}
              tileClassName={tileClassName}
              minDate={new Date()}
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 2))}
              onActiveStartDateChange={handleActiveStartDateChange}
            />
          )}
          
          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-color available-date"></span>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <span className="legend-color booked-date"></span>
              <span>Already Booked</span>
            </div>
          </div>
        </div>
        
        <div className="availability-result">
          {checkingDate ? (
            <div className="loading-spinner">Checking availability...</div>
          ) : selectedDate ? (
            <div className={`date-result ${isAvailable ? 'available' : 'unavailable'}`}>
              <h3>{selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</h3>
              
              {isAvailable ? (
                <>
                  <div className="available-message">
                    <span className="availability-icon">✓</span>
                    <span>I'm available on your date!</span>
                  </div>
                  <p>Complete the form below to reserve this date before another couple books it.</p>
                  
                  <form onSubmit={handleSubmit} className="booking-form">
                    <div className="form-group">
                      <label htmlFor="name">Your Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message">Tell me about your wedding</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        value={formData.message} 
                        onChange={handleInputChange} 
                        rows={4}
                      />
                    </div>
                    
                    <button type="submit" className="book-now-button">Reserve This Date</button>
                  </form>
                </>
              ) : (
                <>
                  <div className="unavailable-message">
                    <span className="availability-icon">✗</span>
                    <span>I'm already booked</span>
                  </div>
                  <p>I'm sorry, I'm already committed to another wedding on this date.</p>
                  <p>Please select another date or contact me to recommend trusted colleagues who might be available.</p>
                  <button className="contact-button">Contact Me</button>
                </>
              )}
            </div>
          ) : (
            <div className="select-prompt">
              <p>Select a date on the calendar to check availability</p>
              <p className="availability-tip">Tip: I book weddings 12-18 months in advance for peak season dates (May-October)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeddingAvailabilityChecker;

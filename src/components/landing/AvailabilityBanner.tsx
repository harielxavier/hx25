import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AvailabilityBanner: React.FC = () => {
  // Current year for wedding season
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  
  // Popular months for weddings
  const popularMonths = ['June', 'July', 'August', 'September', 'October'];
  
  // Calculate available dates for popular months (realistic numbers)
  const [availableDates, setAvailableDates] = useState<Record<string, number>>({});
  
  // Recent bookings counter - starts with a realistic number and increments occasionally
  const [recentBookings, setRecentBookings] = useState<number>(3);
  
  // Early booking discount expiration
  const discountEndDate = new Date();
  discountEndDate.setDate(discountEndDate.getDate() + 14); // 2 weeks from now
  
  useEffect(() => {
    // Set realistic availability for popular months
    const availability: Record<string, number> = {};
    
    popularMonths.forEach(month => {
      // Different availability based on month popularity
      if (month === 'June' || month === 'September') {
        availability[month] = 1; // Very limited
      } else if (month === 'July' || month === 'August') {
        availability[month] = 2; // Limited
      } else {
        availability[month] = 3; // More available
      }
    });
    
    setAvailableDates(availability);
    
    // Simulate occasional new bookings (approximately every 2-4 days)
    const bookingInterval = setInterval(() => {
      const shouldIncrement = Math.random() > 0.7; // 30% chance
      if (shouldIncrement) {
        setRecentBookings(prev => prev + 1);
      }
    }, 1000 * 60 * 60 * 24 * 3); // Check every 3 days (simulated in milliseconds)
    
    return () => clearInterval(bookingInterval);
  }, []);
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-black text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Limited Dates Section */}
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-rose-300 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-rose-300">Limited {currentYear} Availability</h3>
              <p className="text-sm text-gray-300">
                {popularMonths.map((month, index) => (
                  <span key={month}>
                    {month}: <span className="font-semibold">{availableDates[month] || 0} dates left</span>
                    {index < popularMonths.length - 1 ? ' • ' : ''}
                  </span>
                ))}
              </p>
            </div>
          </div>
          
          {/* Recent Bookings */}
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-rose-300 rounded-full flex items-center justify-center text-black font-bold flex-shrink-0">
              {recentBookings}
            </div>
            <div>
              <h3 className="font-medium">Recent Bookings This Month</h3>
              <p className="text-sm text-gray-300">
                {nextYear} dates are now available for booking
              </p>
            </div>
          </div>
          
          {/* Early Booking Discount */}
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-rose-300 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Early Booking Discount</h3>
              <p className="text-sm text-gray-300">
                Save 10% when you book by {formatDate(discountEndDate)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <Link 
            to="/contact" 
            className="inline-flex items-center justify-center text-sm font-medium text-rose-300 hover:text-rose-200 transition-colors"
          >
            Check your date availability →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityBanner;

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, MapPin, Users, Sparkles } from 'lucide-react';
import { googleCalendarService } from '../../services/GoogleCalendarService';

interface AvailabilityData {
  date: string;
  available: boolean;
  timeSlots?: string[];
  bookingType?: 'wedding' | 'elopement' | 'engagement';
  location?: string;
}

interface CalendarAvailabilityProps {
  onDateSelect?: (date: string, type: 'wedding' | 'elopement') => void;
  selectedPackage?: string;
  showScarcityMessages?: boolean;
}

export default function CalendarAvailability({ 
  onDateSelect, 
  selectedPackage,
  showScarcityMessages = true 
}: CalendarAvailabilityProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bookingStats, setBookingStats] = useState({
    totalWeekends: 0,
    bookedWeekends: 0,
    availableWeekends: 0,
    bookingPercentage: 0
  });

  useEffect(() => {
    loadAvailabilityData();
  }, [currentMonth]);

  const loadAvailabilityData = async () => {
    setLoading(true);
    try {
      // Always use mock data for now to prevent crashes
      console.log('Loading calendar availability data...');
      const mockData = generateMockAvailability(currentMonth);
      setAvailabilityData(mockData);
      
      // Calculate booking statistics
      const stats = calculateBookingStats(mockData);
      setBookingStats(stats);
      
    } catch (error) {
      console.error('Error loading availability:', error);
      // Fallback to basic mock data
      const mockData = generateMockAvailability(currentMonth);
      setAvailabilityData(mockData);
      setBookingStats({
        totalWeekends: 8,
        bookedWeekends: 5,
        availableWeekends: 3,
        bookingPercentage: 63
      });
    }
    setLoading(false);
  };

  const generateMonthAvailability = (month: Date, events: any[]): AvailabilityData[] => {
    const availability: AvailabilityData[] = [];
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    
    // Get booked dates from events
    const bookedDates = events.map(event => {
      const eventDate = new Date(event.start?.dateTime || event.start?.date);
      return eventDate.toDateString();
    });
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const dateString = date.toDateString();
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isBooked = bookedDates.includes(dateString);
      const isPast = date < new Date();
      
      if (isWeekend && !isPast) {
        availability.push({
          date: date.toISOString().split('T')[0],
          available: !isBooked,
          timeSlots: isBooked ? [] : ['10:00 AM', '2:00 PM', '4:00 PM'],
          bookingType: Math.random() > 0.7 ? 'elopement' : 'wedding'
        });
      }
    }
    
    return availability;
  };

  const generateMockAvailability = (month: Date): AvailabilityData[] => {
    const availability: AvailabilityData[] = [];
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isPast = date < new Date();
      
      if (isWeekend && !isPast) {
        const isAvailable = Math.random() > 0.4; // 60% availability
        availability.push({
          date: date.toISOString().split('T')[0],
          available: isAvailable,
          timeSlots: isAvailable ? ['10:00 AM', '2:00 PM', '4:00 PM'] : [],
          bookingType: Math.random() > 0.7 ? 'elopement' : 'wedding'
        });
      }
    }
    
    return availability;
  };

  const calculateBookingStats = (data: AvailabilityData[]) => {
    const totalWeekends = data.length;
    const bookedWeekends = data.filter(d => !d.available).length;
    const availableWeekends = totalWeekends - bookedWeekends;
    const bookingPercentage = totalWeekends > 0 ? Math.round((bookedWeekends / totalWeekends) * 100) : 0;
    
    return {
      totalWeekends,
      bookedWeekends,
      availableWeekends,
      bookingPercentage
    };
  };

  const handleDateClick = (date: string, available: boolean) => {
    if (!available) return;
    
    setSelectedDate(date);
    const bookingType = selectedPackage?.includes('elopement') ? 'elopement' : 'wedding';
    onDateSelect?.(date, bookingType);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getScarcityMessage = () => {
    if (bookingStats.bookingPercentage > 80) {
      return {
        message: `Only ${bookingStats.availableWeekends} weekend dates left!`,
        urgency: 'high',
        icon: AlertCircle,
        color: 'text-red-600 bg-red-50 border-red-200'
      };
    } else if (bookingStats.bookingPercentage > 60) {
      return {
        message: `Calendar filling fast - ${bookingStats.bookingPercentage}% booked!`,
        urgency: 'medium',
        icon: Clock,
        color: 'text-orange-600 bg-orange-50 border-orange-200'
      };
    } else {
      return {
        message: `Great availability - ${bookingStats.availableWeekends} dates open!`,
        urgency: 'low',
        icon: CheckCircle,
        color: 'text-green-600 bg-green-50 border-green-200'
      };
    }
  };

  const scarcityInfo = getScarcityMessage();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Check Availability</h3>
            <p className="text-gray-600">Select your perfect wedding date</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-semibold text-gray-900">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {showScarcityMessages && (
          <div className={`flex items-center p-4 rounded-xl border ${scarcityInfo.color} mb-6`}>
            <scarcityInfo.icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{scarcityInfo.message}</p>
              <p className="text-sm opacity-75 mt-1">
                {bookingStats.totalWeekends} total weekend dates this month
              </p>
            </div>
            {scarcityInfo.urgency === 'high' && (
              <Sparkles className="w-5 h-5 ml-3 animate-pulse" />
            )}
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Next →
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading availability...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availabilityData.map((day) => (
              <div
                key={day.date}
                onClick={() => handleDateClick(day.date, day.available)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  day.available
                    ? selectedDate === day.date
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold text-gray-900">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    day.available ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
                
                {day.available ? (
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {day.timeSlots?.length} time slots
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {day.timeSlots?.slice(0, 2).map((time, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {time}
                        </span>
                      ))}
                      {(day.timeSlots?.length || 0) > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{(day.timeSlots?.length || 0) - 2}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Unavailable
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDate && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Selected Date</h4>
              <p className="text-blue-700 font-medium">{formatDate(selectedDate)}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-gray-600" />
              <span className="text-sm text-gray-700">
                {selectedPackage?.includes('elopement') ? 'Elopement' : 'Wedding'} Package
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-600" />
              <span className="text-sm text-gray-700">Multiple time slots available</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-gray-600" />
              <span className="text-sm text-gray-700">New Jersey & surrounding areas</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg">
              Book This Date - $500 Deposit
            </button>
            <button className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors">
              Hold for 24 Hours
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {bookingStats.availableWeekends}
          </div>
          <div className="text-sm text-gray-600">Available Dates</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {bookingStats.bookingPercentage}%
          </div>
          <div className="text-sm text-gray-600">Calendar Booked</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <div className="text-2xl font-bold text-green-600 mb-1">
            24/7
          </div>
          <div className="text-sm text-gray-600">Booking Available</div>
        </div>
      </div>
    </div>
  );
}

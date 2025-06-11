import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Camera, User, Mail, Phone, ChevronRight, Check } from 'lucide-react';
import { format, addDays, isSameDay, isAfter, isBefore, addMonths } from 'date-fns';

// Session types with durations and prices
const SESSION_TYPES = [
  { id: 'wedding', name: 'Wedding Photography', duration: 480, price: 2500, color: 'bg-pink-100 text-pink-800' },
  { id: 'engagement', name: 'Engagement Session', duration: 120, price: 450, color: 'bg-purple-100 text-purple-800' },
  { id: 'family', name: 'Family Portrait', duration: 90, price: 350, color: 'bg-blue-100 text-blue-800' },
  { id: 'newborn', name: 'Newborn Session', duration: 120, price: 400, color: 'bg-green-100 text-green-800' },
  { id: 'event', name: 'Event Coverage', duration: 240, price: 800, color: 'bg-yellow-100 text-yellow-800' },
  { id: 'portrait', name: 'Portrait Session', duration: 60, price: 250, color: 'bg-indigo-100 text-indigo-800' }
];

// Location options
const LOCATIONS = [
  { id: 'studio', name: 'Studio', address: '123 Photography Lane, New York, NY' },
  { id: 'outdoor', name: 'Outdoor (Client Choice)', address: 'To be determined with client' },
  { id: 'client', name: 'Client Location', address: 'Client will provide address' }
];

// Available time slots
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

// Mock unavailable dates (would come from your backend)
const UNAVAILABLE_DATES = [
  new Date(2025, 3, 5),
  new Date(2025, 3, 12),
  new Date(2025, 3, 15),
  new Date(2025, 3, 18),
  new Date(2025, 3, 25)
];

interface ClientBookingWidgetProps {
  onBookingComplete?: (bookingData: any) => void;
  initialSessionType?: string;
}

const ClientBookingWidget: React.FC<ClientBookingWidgetProps> = ({ 
  onBookingComplete,
  initialSessionType
}) => {
  // Multi-step form state
  const [step, setStep] = useState(1);
  const [sessionType, setSessionType] = useState(initialSessionType || '');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  // Generate days for the calendar
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Check if a date is unavailable
  const isDateUnavailable = (date: Date) => {
    // Don't allow past dates
    if (isBefore(date, new Date())) return true;
    
    // Don't allow dates more than 3 months in the future
    if (isAfter(date, addMonths(new Date(), 3))) return true;
    
    // Check against unavailable dates
    return UNAVAILABLE_DATES.some(unavailableDate => 
      isSameDay(unavailableDate, date)
    );
  };

  // Get available time slots for a date based on session type
  const getAvailableTimeSlots = (date: Date, sessionTypeId: string) => {
    // This would normally come from your backend
    // For now, we'll just filter out some times based on the date
    const selectedSessionType = SESSION_TYPES.find(type => type.id === sessionTypeId);
    const durationHours = selectedSessionType ? Math.ceil(selectedSessionType.duration / 60) : 1;
    
    // Filter time slots based on session duration and day of week
    return TIME_SLOTS.filter((slot, index) => {
      // For longer sessions, ensure there's enough time in the day
      if (durationHours > 2 && index > TIME_SLOTS.length - durationHours) {
        return false;
      }
      
      // For weekends, limit early morning slots
      const dayOfWeek = date.getDay();
      if ((dayOfWeek === 0 || dayOfWeek === 6) && slot === '9:00 AM') {
        return false;
      }
      
      return true;
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // This would normally be an API call to your backend
      // For now, we'll just simulate a successful booking
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a booking reference
      const reference = `BK-${Date.now().toString().slice(-6)}`;
      setBookingReference(reference);
      setBookingComplete(true);
      
      // Call the callback if provided
      if (onBookingComplete) {
        const selectedSessionType = SESSION_TYPES.find(type => type.id === sessionType);
        const bookingData = {
          reference,
          sessionType: selectedSessionType?.name,
          date: selectedDate,
          time: selectedTime,
          location: LOCATIONS.find(loc => loc.id === selectedLocation)?.name,
          clientInfo,
          status: 'pending',
          createdAt: new Date()
        };
        onBookingComplete(bookingData);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      // Handle error state
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render session type selection step
  const renderSessionTypeStep = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Select Session Type</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SESSION_TYPES.map(type => (
          <button
            key={type.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              sessionType === type.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => {
              setSessionType(type.id);
              setStep(2);
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{type.name}</h4>
                <p className="text-sm text-gray-500">{type.duration} min</p>
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${type.color}`}>
                ${type.price}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Render date selection step
  const renderDateSelectionStep = () => {
    const calendarDays = generateCalendarDays();
    const selectedSessionType = SESSION_TYPES.find(type => type.id === sessionType);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            onClick={() => setStep(1)}
          >
            ← Back to Session Types
          </button>
          <h3 className="text-xl font-semibold text-gray-800">Select Date</h3>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Calendar header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button 
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            >
              <ChevronRight className="w-5 h-5 transform rotate-180" />
            </button>
            <h4 className="font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </h4>
            <button 
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-gray-50 py-2 text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="bg-white h-14 md:h-20"></div>;
              }
              
              const isUnavailable = isDateUnavailable(day);
              const isSelected = selectedDate && isSameDay(selectedDate, day);
              
              return (
                <div 
                  key={day.toISOString()} 
                  className={`bg-white h-14 md:h-20 p-1 relative ${
                    isUnavailable 
                      ? 'bg-gray-50 cursor-not-allowed' 
                      : 'cursor-pointer hover:bg-blue-50'
                  } ${isSelected ? 'bg-blue-100' : ''}`}
                  onClick={() => {
                    if (!isUnavailable) {
                      setSelectedDate(day);
                      setSelectedTime('');
                    }
                  }}
                >
                  <div className={`text-sm ${
                    isUnavailable ? 'text-gray-400' : 'text-gray-700'
                  } ${isSelected ? 'font-semibold' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Dot indicator for unavailable dates */}
                  {isUnavailable && (
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-red-500 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Time slot selection */}
        {selectedDate && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-800 mb-3">
              Available Times for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {getAvailableTimeSlots(selectedDate, sessionType).map(time => (
                <button
                  key={time}
                  className={`py-2 px-3 text-sm rounded-md border transition-colors ${
                    selectedTime === time 
                      ? 'bg-blue-100 border-blue-500 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                disabled={!selectedTime}
                onClick={() => selectedTime && setStep(3)}
              >
                Continue
                <ChevronRight className="ml-1 w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Session info sidebar */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2">Session Details</h4>
          <div className="space-y-2">
            <div className="flex items-start">
              <Camera className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
              <div>
                <p className="text-gray-700">{selectedSessionType?.name}</p>
                <p className="text-sm text-gray-500">{selectedSessionType?.duration} minutes</p>
              </div>
            </div>
            {selectedDate && (
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-gray-700">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                  {selectedTime && <p className="text-sm text-gray-500">{selectedTime}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render location and client info step
  const renderClientInfoStep = () => {
    const selectedSessionType = SESSION_TYPES.find(type => type.id === sessionType);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            onClick={() => setStep(2)}
          >
            ← Back to Date Selection
          </button>
          <h3 className="text-xl font-semibold text-gray-800">Your Information</h3>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>
        
        {/* Location selection */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800">Select Location</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LOCATIONS.map(location => (
              <button
                key={location.id}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedLocation === location.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedLocation(location.id)}
              >
                <h5 className="font-medium text-gray-900">{location.name}</h5>
                <p className="text-sm text-gray-500">{location.address}</p>
              </button>
            ))}
          </div>
        </div>
        
        {/* Client information form */}
        <div className="space-y-4 mt-6">
          <h4 className="font-medium text-gray-800">Your Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Your full name"
                  value={clientInfo.name}
                  onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="(123) 456-7890"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Information (Optional)
            </label>
            <textarea
              id="message"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Tell us any additional details that might help us prepare for your session..."
              value={clientInfo.message}
              onChange={(e) => setClientInfo({...clientInfo, message: e.target.value})}
            />
          </div>
        </div>
        
        {/* Session summary */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mt-6">
          <h4 className="font-medium text-gray-800 mb-3">Booking Summary</h4>
          <div className="space-y-3">
            <div className="flex items-start">
              <Camera className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
              <div>
                <p className="text-gray-700">{selectedSessionType?.name}</p>
                <p className="text-sm text-gray-500">{selectedSessionType?.duration} minutes</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
              <div>
                <p className="text-gray-700">{selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : ''}</p>
                <p className="text-sm text-gray-500">{selectedTime}</p>
              </div>
            </div>
            
            {selectedLocation && (
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-gray-700">
                    {LOCATIONS.find(loc => loc.id === selectedLocation)?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {LOCATIONS.find(loc => loc.id === selectedLocation)?.address}
                  </p>
                </div>
              </div>
            )}
            
            <div className="pt-2 border-t border-gray-200 mt-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Total</span>
                <span className="font-medium text-gray-900">${selectedSessionType?.price}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                A 50% deposit will be required to confirm your booking
              </p>
            </div>
          </div>
        </div>
        
        {/* Submit button */}
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            disabled={!clientInfo.name || !clientInfo.email || !clientInfo.phone || !selectedLocation || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>Processing...</>
            ) : (
              <>
                Complete Booking
                <ChevronRight className="ml-1 w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  // Render booking confirmation step
  const renderConfirmationStep = () => (
    <div className="text-center py-8">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
        <Check className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Request Submitted!</h3>
      <p className="text-gray-600 mb-6">
        Your booking reference is: <span className="font-medium text-gray-900">{bookingReference}</span>
      </p>
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 max-w-md mx-auto text-left">
        <h4 className="font-medium text-gray-800 mb-3">What happens next?</h4>
        <ol className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 font-medium text-xs mr-2 mt-0.5">1</span>
            <span>We'll review your booking request and confirm availability</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 font-medium text-xs mr-2 mt-0.5">2</span>
            <span>You'll receive a confirmation email with payment instructions for the deposit</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 font-medium text-xs mr-2 mt-0.5">3</span>
            <span>Once your deposit is received, your booking will be confirmed</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 font-medium text-xs mr-2 mt-0.5">4</span>
            <span>We'll reach out to discuss any specific details for your session</span>
          </li>
        </ol>
      </div>
      <p className="mt-6 text-gray-600">
        We've sent a confirmation email to <span className="font-medium">{clientInfo.email}</span>
      </p>
      <div className="mt-8">
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => {
            // Reset the form
            setStep(1);
            setSessionType('');
            setSelectedDate(null);
            setSelectedTime('');
            setSelectedLocation('');
            setClientInfo({
              name: '',
              email: '',
              phone: '',
              message: ''
            });
            setBookingComplete(false);
            setBookingReference('');
          }}
        >
          Book Another Session
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Progress indicator */}
      {!bookingComplete && (
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              step >= 2 ? 'bg-blue-600' : 'bg-gray-200'
            }`}></div>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              step >= 3 ? 'bg-blue-600' : 'bg-gray-200'
            }`}></div>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>
      )}
      
      {/* Form content */}
      <div className="p-6">
        {bookingComplete ? renderConfirmationStep() : (
          <>
            {step === 1 && renderSessionTypeStep()}
            {step === 2 && renderDateSelectionStep()}
            {step === 3 && renderClientInfoStep()}
          </>
        )}
      </div>
    </div>
  );
};

export default ClientBookingWidget;

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter, Download, Grid, List, Users, MapPin, Clock, DollarSign, Camera, Check, X, AlertCircle, MoreHorizontal } from 'lucide-react';

const BookingsCalendar: React.FC = () => {
  // State for view mode (calendar, list)
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  
  // State for current month/year
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // State for selected date
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // State for filter options
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Mock data for bookings
  const bookings = [
    {
      id: 1,
      client: 'Johnson Family',
      type: 'Family Portrait',
      date: new Date(2025, 3, 2), // April 2, 2025
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      location: 'Central Park, NYC',
      status: 'confirmed',
      payment: 'paid',
      notes: 'Family of 5, including 3 children under 10. Requested natural setting.'
    },
    {
      id: 2,
      client: 'Emily & Michael',
      type: 'Engagement',
      date: new Date(2025, 3, 5), // April 5, 2025
      startTime: '4:00 PM',
      endTime: '6:00 PM',
      location: 'Brooklyn Bridge',
      status: 'confirmed',
      payment: 'deposit',
      notes: 'Sunset shoot. Couple requested urban setting with skyline views.'
    },
    {
      id: 3,
      client: 'Smith Wedding',
      type: 'Wedding',
      date: new Date(2025, 3, 12), // April 12, 2025
      startTime: '2:00 PM',
      endTime: '10:00 PM',
      location: 'The Grand Hotel',
      status: 'confirmed',
      payment: 'paid',
      notes: 'Full day coverage. Second shooter confirmed.'
    },
    {
      id: 4,
      client: 'ABC Corporation',
      type: 'Corporate Event',
      date: new Date(2025, 3, 15), // April 15, 2025
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      location: 'ABC Headquarters',
      status: 'pending',
      payment: 'invoice sent',
      notes: 'Annual company meeting. Headshots for 15 executives in the morning.'
    },
    {
      id: 5,
      client: 'Davis Newborn',
      type: 'Newborn',
      date: new Date(2025, 3, 18), // April 18, 2025
      startTime: '11:00 AM',
      endTime: '1:00 PM',
      location: 'Client Home',
      status: 'confirmed',
      payment: 'paid',
      notes: 'Baby is due April 10th. Session may need to be rescheduled based on actual birth date.'
    },
    {
      id: 6,
      client: 'Wilson Family',
      type: 'Family Portrait',
      date: new Date(2025, 3, 20), // April 20, 2025
      startTime: '3:00 PM',
      endTime: '5:00 PM',
      location: 'Riverside Park',
      status: 'tentative',
      payment: 'not paid',
      notes: 'Waiting for final confirmation. Family of 4 with teenage children.'
    },
    {
      id: 7,
      client: 'Martinez Quinceañera',
      type: 'Event',
      date: new Date(2025, 3, 25), // April 25, 2025
      startTime: '4:00 PM',
      endTime: '9:00 PM',
      location: 'Plaza Event Center',
      status: 'confirmed',
      payment: 'deposit',
      notes: 'Coverage includes family portraits before the event and full event coverage.'
    }
  ];

  // Filter bookings based on selected filters
  const filteredBookings = bookings.filter(booking => {
    const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
    const typeMatch = typeFilter === 'all' || booking.type === typeFilter;
    return statusMatch && typeMatch;
  });

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    return filteredBookings.filter(booking => 
      booking.date.getDate() === date.getDate() &&
      booking.date.getMonth() === date.getMonth() &&
      booking.date.getFullYear() === date.getFullYear()
    );
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Format month and year for display
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Get status badge based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center"><Check className="w-3 h-3 mr-1" /> Confirmed</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Pending</span>;
      case 'tentative':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center"><Clock className="w-3 h-3 mr-1" /> Tentative</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center"><X className="w-3 h-3 mr-1" /> Cancelled</span>;
      default:
        return null;
    }
  };

  // Get payment badge based on payment status
  const getPaymentBadge = (payment: string) => {
    switch (payment) {
      case 'paid':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center"><DollarSign className="w-3 h-3 mr-1" /> Paid</span>;
      case 'deposit':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center"><DollarSign className="w-3 h-3 mr-1" /> Deposit</span>;
      case 'invoice sent':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs flex items-center"><DollarSign className="w-3 h-3 mr-1" /> Invoice Sent</span>;
      case 'not paid':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center"><DollarSign className="w-3 h-3 mr-1" /> Not Paid</span>;
      default:
        return null;
    }
  };

  // Get session type icon
  const getSessionTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'wedding':
        return <Camera className="w-5 h-5 text-pink-500" />;
      case 'engagement':
        return <Camera className="w-5 h-5 text-blue-500" />;
      case 'family portrait':
        return <Users className="w-5 h-5 text-green-500" />;
      case 'newborn':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'corporate event':
        return <Users className="w-5 h-5 text-gray-500" />;
      case 'event':
        return <Camera className="w-5 h-5 text-orange-500" />;
      default:
        return <Camera className="w-5 h-5 text-gray-500" />;
    }
  };

  // Render calendar view
  const renderCalendarView = () => {
    const days = generateCalendarDays();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Calendar header */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {weekdays.map((day, index) => (
            <div key={index} className="p-2 text-center text-sm font-medium text-gray-700 bg-gray-100">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="min-h-[120px] bg-gray-50" />;
            }
            
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
            const dayBookings = getBookingsForDate(day);
            
            return (
              <div 
                key={`day-${index}`} 
                className={`min-h-[120px] p-1 bg-white ${isToday ? 'bg-blue-50' : ''} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className={`text-right p-1 ${isToday ? 'font-bold text-blue-600' : ''}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayBookings.map(booking => (
                    <div 
                      key={booking.id} 
                      className="p-1 text-xs rounded bg-blue-100 text-blue-800 truncate cursor-pointer hover:bg-blue-200"
                      title={`${booking.client} - ${booking.type}`}
                    >
                      {booking.startTime} - {booking.client}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render list view
  const renderListView = () => {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <div key={booking.id} className="p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {getSessionTypeIcon(booking.type)}
                    <h3 className="text-lg font-medium text-gray-800 ml-2">{booking.client}</h3>
                    <span className="ml-3 text-sm text-gray-500">{booking.type}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-start">
                      <CalendarIcon className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Date</p>
                        <p className="text-sm text-gray-600">{formatDate(booking.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Time</p>
                        <p className="text-sm text-gray-600">{booking.startTime} - {booking.endTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Location</p>
                        <p className="text-sm text-gray-600">{booking.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Notes</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{booking.notes}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-6 flex flex-col items-end space-y-2">
                  {getStatusBadge(booking.status)}
                  {getPaymentBadge(booking.payment)}
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                      <CalendarIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-green-600 transition-colors">
                      <Check className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-900 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No bookings match your current filters.
          </div>
        )}
      </div>
    );
  };

  // Render selected date details
  const renderSelectedDateDetails = () => {
    if (!selectedDate) return null;
    
    const bookingsForDate = getBookingsForDate(selectedDate);
    
    return (
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {formatDate(selectedDate)}
        </h3>
        
        {bookingsForDate.length > 0 ? (
          <div className="space-y-4">
            {bookingsForDate.map(booking => (
              <div key={booking.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">{booking.client}</h4>
                    <p className="text-sm text-gray-600">{booking.type}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {booking.startTime} - {booking.endTime}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {booking.location}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(booking.status)}
                    {getPaymentBadge(booking.payment)}
                  </div>
                </div>
                
                {booking.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{booking.notes}</p>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    Reschedule
                  </button>
                  <button className="px-3 py-1 text-xs bg-white border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No bookings scheduled for this date.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center mx-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Booking
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bookings & Calendar</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </button>
      </div>
      
      {/* Calendar Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={goToPreviousMonth}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-medium text-gray-800 w-40 text-center">
              {formatMonthYear(currentDate)}
            </h2>
            <button 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={goToNextMonth}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              onClick={goToToday}
            >
              Today
            </button>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button 
                className={`p-2 ${viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setViewMode('calendar')}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button 
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setViewMode('list')}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            
            <select
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="tentative">Tentative</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Wedding">Wedding</option>
              <option value="Engagement">Engagement</option>
              <option value="Family Portrait">Family Portrait</option>
              <option value="Newborn">Newborn</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Event">Event</option>
            </select>
            
            <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center text-sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Calendar or List View */}
      {viewMode === 'calendar' ? renderCalendarView() : renderListView()}
      
      {/* Selected Date Details (only show in calendar view) */}
      {viewMode === 'calendar' && selectedDate && renderSelectedDateDetails()}
      
      {/* Export Options */}
      <div className="mt-6 flex justify-end">
        <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
          <Download className="h-4 w-4 mr-1" />
          Export Calendar
        </button>
      </div>
    </div>
  );
};

export default BookingsCalendar;

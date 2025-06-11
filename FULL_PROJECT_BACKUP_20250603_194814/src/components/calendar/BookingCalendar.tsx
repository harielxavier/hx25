import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, User } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

interface Event {
  id: string;
  title: string;
  clientName: string;
  time: string;
  location: string;
  type: 'wedding' | 'portrait' | 'event';
}

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Mock events - would come from your database
  const events: Record<string, Event[]> = {
    '2024-03-15': [
      {
        id: '1',
        title: 'Wedding Shoot',
        clientName: 'Sarah & John',
        time: '14:00',
        location: 'Central Park',
        type: 'wedding'
      }
    ]
  };

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowBookingModal(true);
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light text-gold">{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <button 
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-[#333] rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gold" />
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-2 hover:bg-[#333] rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gold" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-4 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-light text-[#888]">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayEvents = events[dateKey] || [];
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <button
              key={i}
              onClick={() => handleDateClick(day)}
              className={`
                aspect-square p-2 border border-[#333] hover:bg-[#333] transition-colors relative
                ${isCurrentMonth ? 'text-white' : 'text-[#666]'}
                ${isToday(day) ? 'border-gold' : ''}
              `}
            >
              <span className="text-sm">{format(day, 'd')}</span>
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 left-1 right-1">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className="text-xs px-1 py-0.5 rounded bg-gold text-black truncate"
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-light text-gold mb-4">
              New Booking for {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-light text-[#888] mb-1">Client</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666] w-5 h-5" />
                  <input
                    type="text"
                    className="w-full bg-[#222] border border-[#333] rounded-lg py-2 pl-10 pr-3 text-white placeholder-[#666] focus:border-gold focus:ring-1 focus:ring-gold"
                    placeholder="Select or create client"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-[#888] mb-1">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666] w-5 h-5" />
                  <input
                    type="time"
                    className="w-full bg-[#222] border border-[#333] rounded-lg py-2 pl-10 pr-3 text-white focus:border-gold focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-[#888] mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666] w-5 h-5" />
                  <input
                    type="text"
                    className="w-full bg-[#222] border border-[#333] rounded-lg py-2 pl-10 pr-3 text-white placeholder-[#666] focus:border-gold focus:ring-1 focus:ring-gold"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 text-[#888] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold text-black rounded-lg hover:bg-[#d4af37] transition-colors"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
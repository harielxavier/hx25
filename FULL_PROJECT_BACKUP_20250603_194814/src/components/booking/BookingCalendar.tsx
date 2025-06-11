import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { BookingSlot, getAvailableSlots } from '../../lib/booking';

interface BookingCalendarProps {
  serviceId?: string;
  onSlotSelect: (slot: BookingSlot) => void;
  selectedSlot?: BookingSlot;
}

export default function BookingCalendar({ serviceId, onSlotSelect, selectedSlot }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAvailableSlots();
  }, [currentDate, serviceId]);

  async function loadAvailableSlots() {
    try {
      setLoading(true);
      const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');

      const slots = await getAvailableSlots(startDate, endDate, serviceId);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading available slots:', error);
    } finally {
      setLoading(false);
    }
  }

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const getSlotsForDay = (date: Date): BookingSlot[] => {
    return availableSlots.filter(slot => 
      isSameDay(new Date(slot.date), date)
    );
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-100 h-96 rounded-lg" />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">{format(currentDate, 'MMMM yyyy')}</h3>
          <div className="flex gap-2">
            <button 
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const daySlots = getSlotsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div
                key={i}
                className={`aspect-square p-1 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className={`text-sm mb-1 ${
                  isToday(day) ? 'font-bold' : ''
                } ${
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {format(day, 'd')}
                </div>

                <div className="space-y-1">
                  {daySlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => onSlotSelect(slot)}
                      className={`w-full text-xs px-2 py-1 rounded ${
                        selectedSlot?.id === slot.id
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      {format(new Date(`2000-01-01T${slot.start_time}`), 'h:mm a')}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedSlot && (
        <div className="p-6 bg-gray-50">
          <h4 className="font-medium mb-4">Selected Time Slot</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <span>{format(new Date(selectedSlot.date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>
                {format(new Date(`2000-01-01T${selectedSlot.start_time}`), 'h:mm a')} -
                {format(new Date(`2000-01-01T${selectedSlot.end_time}`), 'h:mm a')}
              </span>
            </div>
            {selectedSlot.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{selectedSlot.location}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface Availability {
  date: Date;
  available: boolean;
}

interface AvailabilityCheckerProps {
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
  availableDates?: Availability[];
}

export default function AvailabilityChecker({ onDateSelect, selectedDate, availableDates = [] }: AvailabilityCheckerProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const isDateAvailable = (date: Date) => {
    const availability = availableDates.find(a => isSameDay(a.date, date));
    return availability ? availability.available : false;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium">Check Availability</h2>
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

      <div className="mb-6">
        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const isAvailable = isDateAvailable(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            return (
              <button
                key={i}
                onClick={() => isAvailable && onDateSelect(day)}
                disabled={!isAvailable}
                className={`
                  aspect-square p-2 rounded-lg flex items-center justify-center relative
                  ${!isSameMonth(day, currentDate) ? 'text-gray-300' : 'text-gray-900'}
                  ${isAvailable ? 'hover:bg-gray-100' : 'cursor-not-allowed opacity-50'}
                  ${isSelected ? 'bg-black text-white hover:bg-black' : ''}
                  ${isToday(day) ? 'font-bold' : ''}
                `}
              >
                <span className="text-sm">{format(day, 'd')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <CalendarIcon className="w-6 h-6 animate-spin" />
        </div>
      )}
    </div>
  );
}
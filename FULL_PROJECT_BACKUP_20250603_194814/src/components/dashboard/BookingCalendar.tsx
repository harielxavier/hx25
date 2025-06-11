import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function BookingCalendar() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Upcoming Bookings</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          View Calendar
        </button>
      </div>
      
      <div className="space-y-4">
        {[
          {
            client: 'Sarah & John',
            type: 'Wedding',
            date: '2024-03-20',
            time: '14:00',
            location: 'Central Park'
          },
          {
            client: 'Emma Davis',
            type: 'Engagement',
            date: '2024-03-22',
            time: '10:00',
            location: 'Brooklyn Bridge'
          }
        ].map((booking, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">{booking.client}</p>
                <p className="text-sm text-gray-500">{booking.type}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{booking.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
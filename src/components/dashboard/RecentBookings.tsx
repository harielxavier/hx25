import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { formatDate, formatTime } from '../../lib/utils';

interface Booking {
  id: string;
  clientName: string;
  serviceName: string;
  date: Date;
  location: string;
  status: string;
}

export default function RecentBookings() {
  // This would fetch from your API
  const bookings: Booking[] = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      serviceName: 'Wedding Package',
      date: new Date('2024-03-20T14:00:00'),
      location: 'Central Park, NY',
      status: 'confirmed'
    },
    // Add more sample data
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="font-medium text-gray-900">{booking.clientName}</h3>
              <p className="text-sm text-gray-600">{booking.serviceName}</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(booking.date)} at {formatTime(booking.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{booking.location}</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full text-blue-600 hover:text-blue-700 text-sm font-medium">
        View All Bookings →
      </button>
    </div>
  );
}
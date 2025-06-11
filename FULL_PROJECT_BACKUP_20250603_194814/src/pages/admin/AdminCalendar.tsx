import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Calendar, Clock, MapPin, Plus, Search, Filter } from 'lucide-react';

export default function AdminCalendar() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light mb-1">Calendar</h1>
            <p className="text-gray-500">Manage your appointments and sessions</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            New Booking
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Types</option>
            <option>Weddings</option>
            <option>Engagements</option>
            <option>Portraits</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">March 2024</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">Today</button>
                <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">Month</button>
                <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">Week</button>
                <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">Day</button>
              </div>
            </div>

            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-4 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i + 1;
                const hasEvent = [5, 12, 15, 20].includes(day);
                
                return (
                  <div 
                    key={i}
                    className={`aspect-square p-2 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${
                      hasEvent ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                    }`}
                  >
                    <span className="block text-sm mb-1">{day}</span>
                    {hasEvent && (
                      <div className="text-xs bg-blue-500 text-white rounded px-1 py-0.5">
                        2 Events
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {[
                {
                  client: 'Sarah & John',
                  type: 'Wedding',
                  time: '2:00 PM',
                  location: 'Central Park'
                },
                {
                  client: 'Emma Davis',
                  type: 'Engagement',
                  time: '10:00 AM',
                  location: 'Brooklyn Bridge'
                }
              ].map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{event.client}</p>
                      <p className="text-sm text-gray-500">{event.type}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
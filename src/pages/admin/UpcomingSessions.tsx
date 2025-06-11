import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Camera, DollarSign, Check, X, AlertCircle } from 'lucide-react';

const UpcomingSessions: React.FC = () => {
  // Mock data for upcoming sessions - in a real app, this would come from your Firebase database
  const [sessions] = useState([
    {
      id: 1,
      client: 'Johnson Family',
      type: 'Family Portrait',
      date: '2025-04-02',
      time: '10:00 AM - 12:00 PM',
      location: 'Central Park, NYC',
      status: 'confirmed',
      payment: 'paid',
      notes: 'Family of 5, including 3 children under 10. Requested natural setting.'
    },
    {
      id: 2,
      client: 'Emily & Michael',
      type: 'Engagement',
      date: '2025-04-05',
      time: '4:00 PM - 6:00 PM',
      location: 'Brooklyn Bridge',
      status: 'confirmed',
      payment: 'deposit',
      notes: 'Sunset shoot. Couple requested urban setting with skyline views.'
    },
    {
      id: 3,
      client: 'Smith Wedding',
      type: 'Wedding',
      date: '2025-04-12',
      time: '2:00 PM - 10:00 PM',
      location: 'The Grand Hotel',
      status: 'confirmed',
      payment: 'paid',
      notes: 'Full day coverage. Second shooter confirmed. Bride requested extra attention to detail shots.'
    },
    {
      id: 4,
      client: 'ABC Corporation',
      type: 'Corporate Event',
      date: '2025-04-15',
      time: '9:00 AM - 5:00 PM',
      location: 'ABC Headquarters',
      status: 'pending',
      payment: 'invoice sent',
      notes: 'Annual company meeting. Headshots for 15 executives in the morning, event coverage in the afternoon.'
    },
    {
      id: 5,
      client: 'Davis Newborn',
      type: 'Newborn',
      date: '2025-04-18',
      time: '11:00 AM - 1:00 PM',
      location: 'Client Home',
      status: 'confirmed',
      payment: 'paid',
      notes: 'Baby is due April 10th. Session may need to be rescheduled based on actual birth date.'
    },
    {
      id: 6,
      client: 'Wilson Family',
      type: 'Family Portrait',
      date: '2025-04-20',
      time: '3:00 PM - 5:00 PM',
      location: 'Riverside Park',
      status: 'tentative',
      payment: 'not paid',
      notes: 'Waiting for final confirmation. Family of 4 with teenage children.'
    },
    {
      id: 7,
      client: 'Martinez Quinceañera',
      type: 'Event',
      date: '2025-04-25',
      time: '4:00 PM - 9:00 PM',
      location: 'Plaza Event Center',
      status: 'confirmed',
      payment: 'deposit',
      notes: 'Coverage includes family portraits before the event and full event coverage.'
    }
  ]);

  // Filter options
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Filter and sort sessions
  const filteredSessions = [...sessions]
    .filter(session => {
      if (filter === 'all') return true;
      return session.status === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'client') {
        return a.client.localeCompare(b.client);
      } else if (sortBy === 'type') {
        return a.type.localeCompare(b.type);
      }
      return 0;
    });

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

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Upcoming Sessions</h1>
        <div className="flex space-x-4">
          <select 
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Sessions</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="tentative">Tentative</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select 
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="client">Sort by Client</option>
            <option value="type">Sort by Type</option>
          </select>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Add Session
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredSessions.length > 0 ? (
          filteredSessions.map(session => (
            <div key={session.id} className="p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {getSessionTypeIcon(session.type)}
                    <h3 className="text-lg font-medium text-gray-800 ml-2">{session.client}</h3>
                    <span className="ml-3 text-sm text-gray-500">{session.type}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Date</p>
                        <p className="text-sm text-gray-600">{formatDate(session.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Time</p>
                        <p className="text-sm text-gray-600">{session.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Location</p>
                        <p className="text-sm text-gray-600">{session.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Notes</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{session.notes}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-6 flex flex-col items-end space-y-2">
                  {getStatusBadge(session.status)}
                  {getPaymentBadge(session.payment)}
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                      <Calendar className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-green-600 transition-colors">
                      <Check className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No upcoming sessions match your current filters.
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-500">Showing {filteredSessions.length} of {sessions.length} sessions</p>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Export Calendar
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Print Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingSessions;

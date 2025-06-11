import React, { useState } from 'react';
import { Activity, Camera, FileText, MessageSquare, Users, Download, Edit, Eye, Calendar, CreditCard } from 'lucide-react';

const RecentActivities: React.FC = () => {
  // Mock data for recent activities - in a real app, this would come from your Firebase database
  const [activities] = useState([
    { 
      id: 1, 
      type: 'upload', 
      icon: <Camera className="w-5 h-5 text-green-500" />, 
      message: 'New images uploaded to "Smith Wedding"', 
      time: '10 minutes ago',
      user: 'You'
    },
    { 
      id: 2, 
      type: 'edit', 
      icon: <Edit className="w-5 h-5 text-blue-500" />, 
      message: 'Gallery "Johnson Engagement" edited', 
      time: '2 hours ago',
      user: 'You'
    },
    { 
      id: 3, 
      type: 'view', 
      icon: <Eye className="w-5 h-5 text-purple-500" />, 
      message: 'Client viewed "Davis Family Session"', 
      time: '5 hours ago',
      user: 'Sarah Davis'
    },
    { 
      id: 4, 
      type: 'download', 
      icon: <Download className="w-5 h-5 text-orange-500" />, 
      message: 'Client downloaded images from "Taylor Wedding"', 
      time: 'Yesterday',
      user: 'Mike Taylor'
    },
    { 
      id: 5, 
      type: 'message', 
      icon: <MessageSquare className="w-5 h-5 text-indigo-500" />, 
      message: 'New message from "Johnson" regarding their engagement photos', 
      time: 'Yesterday',
      user: 'Emily Johnson'
    },
    { 
      id: 6, 
      type: 'booking', 
      icon: <Calendar className="w-5 h-5 text-red-500" />, 
      message: 'New booking request for "Family Portrait Session"', 
      time: '2 days ago',
      user: 'Robert Williams'
    },
    { 
      id: 7, 
      type: 'payment', 
      icon: <CreditCard className="w-5 h-5 text-green-500" />, 
      message: 'Payment received for "Brown Wedding"', 
      time: '3 days ago',
      user: 'Jennifer Brown'
    },
    { 
      id: 8, 
      type: 'client', 
      icon: <Users className="w-5 h-5 text-blue-500" />, 
      message: 'New client registered', 
      time: '4 days ago',
      user: 'Thomas Anderson'
    },
    { 
      id: 9, 
      type: 'contract', 
      icon: <FileText className="w-5 h-5 text-gray-500" />, 
      message: 'Contract signed for "Martinez Wedding"', 
      time: '5 days ago',
      user: 'Maria Martinez'
    },
    { 
      id: 10, 
      type: 'upload', 
      icon: <Camera className="w-5 h-5 text-green-500" />, 
      message: 'New images uploaded to "Corporate Event - ABC Inc."', 
      time: '1 week ago',
      user: 'You'
    }
  ]);

  // Filter options
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');

  // Filter activities based on selected options
  const filteredActivities = activities.filter(activity => {
    // Filter by type
    if (filter !== 'all' && activity.type !== filter) return false;
    
    // Filter by time range (simplified for demo)
    if (timeRange === 'today' && !activity.time.includes('minutes ago') && !activity.time.includes('hours ago')) return false;
    if (timeRange === 'week' && activity.time.includes('week ago')) return false;
    
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Recent Activities</h1>
        <div className="flex space-x-4">
          <select 
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Activities</option>
            <option value="upload">Uploads</option>
            <option value="edit">Edits</option>
            <option value="view">Views</option>
            <option value="download">Downloads</option>
            <option value="message">Messages</option>
            <option value="booking">Bookings</option>
            <option value="payment">Payments</option>
            <option value="client">Clients</option>
            <option value="contract">Contracts</option>
          </select>
          
          <select 
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredActivities.length > 0 ? (
            filteredActivities.map(activity => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start">
                  <div className="p-2 bg-gray-100 rounded-full mr-4">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.message}</p>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500">By: {activity.user}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <Activity className="w-4 h-4 text-gray-400 ml-2" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No activities match your current filters.
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-500">Showing {filteredActivities.length} of {activities.length} activities</p>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;

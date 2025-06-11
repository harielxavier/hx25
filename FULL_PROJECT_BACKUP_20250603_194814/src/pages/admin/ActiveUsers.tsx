import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Users, Clock, Globe, Smartphone, AlertCircle } from 'lucide-react';

export default function ActiveUsers() {
  const [timeRange, setTimeRange] = useState('last-30-min');
  
  // Sample data for demonstration
  const activeUserStats = {
    current: 42,
    change: '+8%',
    peak: 78,
    average: 35
  };
  
  const activeUsersByPage = [
    { page: '/home', users: 18, percentage: 43 },
    { page: '/products', users: 12, percentage: 29 },
    { page: '/about', users: 7, percentage: 17 },
    { page: '/contact', users: 3, percentage: 7 },
    { page: '/blog', users: 2, percentage: 4 }
  ];
  
  const activeUsersByLocation = [
    { location: 'United States', users: 22, percentage: 52 },
    { location: 'United Kingdom', users: 8, percentage: 19 },
    { location: 'Canada', users: 5, percentage: 12 },
    { location: 'Germany', users: 4, percentage: 10 },
    { location: 'Australia', users: 3, percentage: 7 }
  ];
  
  const activeUsersByDevice = [
    { device: 'Mobile', users: 26, percentage: 62 },
    { device: 'Desktop', users: 12, percentage: 29 },
    { device: 'Tablet', users: 4, percentage: 9 }
  ];

  return (
    <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Active Users</h1>
          
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:border-black transition-colors"
            >
              <option value="last-5-min">Last 5 minutes</option>
              <option value="last-15-min">Last 15 minutes</option>
              <option value="last-30-min">Last 30 minutes</option>
              <option value="last-60-min">Last hour</option>
            </select>
            
            <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Refresh
            </button>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertCircle size={18} className="mr-2" />
          <div>
            <p className="font-medium">Demo Data</p>
            <p className="text-sm">This page currently displays sample data. Connect your analytics account for real data.</p>
          </div>
        </div>
        
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Current Active Users</p>
                <h3 className="text-3xl font-semibold">{activeUserStats.current}</h3>
              </div>
              <div className="flex items-center text-green-500">
                <span className="text-sm ml-1">{activeUserStats.change}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Peak Active Users</p>
            <h3 className="text-3xl font-semibold">{activeUserStats.peak}</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Average Active Users</p>
            <h3 className="text-3xl font-semibold">{activeUserStats.average}</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Current Session Duration</p>
            <h3 className="text-3xl font-semibold">3:24</h3>
          </div>
        </div>
        
        {/* Active Users Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Users size={20} className="mr-2" />
            Active Users Over Time
          </h2>
          
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Active Users Line Chart Visualization</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Users by Page */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Clock size={20} className="mr-2" />
              Active Users by Page
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                    <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                    <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                  </tr>
                </thead>
                <tbody>
                  {activeUsersByPage.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-sm text-gray-900">{item.page}</td>
                      <td className="py-3 text-sm text-gray-500 text-right">{item.users}</td>
                      <td className="py-3 text-sm text-gray-500 text-right">{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Active Users by Location */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Globe size={20} className="mr-2" />
              Active Users by Location
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                    <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                  </tr>
                </thead>
                <tbody>
                  {activeUsersByLocation.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-sm text-gray-900">{item.location}</td>
                      <td className="py-3 text-sm text-gray-500 text-right">{item.users}</td>
                      <td className="py-3 text-sm text-gray-500 text-right">{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Active Users by Device */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Smartphone size={20} className="mr-2" />
              Active Users by Device
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                    <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                    <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                  </tr>
                </thead>
                <tbody>
                  {activeUsersByDevice.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-sm text-gray-900">{item.device}</td>
                      <td className="py-3 text-sm text-gray-500 text-right">{item.users}</td>
                      <td className="py-3 text-sm text-gray-500 text-right">{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 h-32 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Device Distribution Pie Chart</p>
            </div>
          </div>
        </div>
      </div>
  );
}

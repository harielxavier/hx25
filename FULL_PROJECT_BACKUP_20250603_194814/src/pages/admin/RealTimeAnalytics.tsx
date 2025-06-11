import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Clock, 
  Users, 
  Globe, 
  MousePointer, 
  ArrowRight,
  RefreshCw,
  Map,
  Smartphone,
  Laptop,
  Tablet,
  AlertCircle
} from 'lucide-react';

export default function RealTimeAnalytics() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  
  // Reset all metrics to zero as requested
  const activeUsers = 0;
  const pageViews = 0;
  const avgSessionDuration = '0:00';
  const bounceRate = '0%';
  
  // Current page views (reset to zero)
  const currentPageViews = [
    { page: 'Home Page', path: '/', views: 0, activeUsers: 0 },
    { page: 'Portfolio', path: '/portfolio', views: 0, activeUsers: 0 },
    { page: 'About Us', path: '/about', views: 0, activeUsers: 0 },
    { page: 'Contact', path: '/contact', views: 0, activeUsers: 0 },
    { page: 'Blog', path: '/blog', views: 0, activeUsers: 0 }
  ];
  
  // Traffic sources (reset to zero)
  const trafficSources = [
    { source: 'Direct', users: 0, percentage: 0 },
    { source: 'Organic Search', users: 0, percentage: 0 },
    { source: 'Social Media', users: 0, percentage: 0 },
    { source: 'Referral', users: 0, percentage: 0 },
    { source: 'Email', users: 0, percentage: 0 }
  ];
  
  // Device types (reset to zero)
  const deviceTypes = [
    { type: 'Desktop', icon: Laptop, users: 0, percentage: 0 },
    { type: 'Mobile', icon: Smartphone, users: 0, percentage: 0 },
    { type: 'Tablet', icon: Tablet, users: 0, percentage: 0 }
  ];
  
  // Locations (reset to zero)
  const locations = [
    { country: 'United States', users: 0, percentage: 0 },
    { country: 'Canada', users: 0, percentage: 0 },
    { country: 'United Kingdom', users: 0, percentage: 0 },
    { country: 'Germany', users: 0, percentage: 0 },
    { country: 'France', users: 0, percentage: 0 }
  ];
  
  // Auto refresh effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoRefresh) {
      interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoRefresh]);
  
  // Manual refresh
  const handleRefresh = () => {
    setLastUpdated(new Date());
  };
  
  return (
    <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Real-time Analytics</h1>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            
            <button 
              onClick={handleRefresh}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              title="Refresh data"
            >
              <RefreshCw size={18} />
            </button>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Auto-refresh</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isAutoRefresh}
                  onChange={() => setIsAutoRefresh(!isAutoRefresh)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertCircle size={18} className="mr-2" />
          <div>
            <p className="font-medium">Demo Data</p>
            <p className="text-sm">This page currently displays sample data. Connect your analytics account for real data.</p>
          </div>
        </div>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Active Users</p>
              <Users size={20} className="text-blue-500" />
            </div>
            <h3 className="text-3xl font-semibold mt-2">{activeUsers}</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Page Views</p>
              <Globe size={20} className="text-green-500" />
            </div>
            <h3 className="text-3xl font-semibold mt-2">{pageViews}</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Avg. Session Duration</p>
              <Clock size={20} className="text-purple-500" />
            </div>
            <h3 className="text-3xl font-semibold mt-2">{avgSessionDuration}</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Bounce Rate</p>
              <MousePointer size={20} className="text-orange-500" />
            </div>
            <h3 className="text-3xl font-semibold mt-2">{bounceRate}</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Current Page Views */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Globe size={20} className="mr-2 text-blue-500" />
              Current Page Views
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Active Users</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPageViews.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.page}</div>
                        <div className="text-xs text-gray-500">{item.path}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {item.views}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {item.activeUsers}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Traffic Sources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <ArrowRight size={20} className="mr-2 text-green-500" />
              Traffic Sources
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trafficSources.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.source}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {item.users}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {item.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Types */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Smartphone size={20} className="mr-2 text-purple-500" />
              Device Types
            </h2>
            
            <div className="space-y-4">
              {deviceTypes.map((device, index) => {
                const DeviceIcon = device.icon;
                return (
                  <div key={index} className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                      <DeviceIcon size={20} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{device.type}</span>
                        <span className="text-sm text-gray-500">{device.users} ({device.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${device.percentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Locations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Map size={20} className="mr-2 text-orange-500" />
              Top Locations
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {locations.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.country}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {item.users}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {item.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
}

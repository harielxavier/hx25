import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Users, ArrowRight, Filter, AlertCircle } from 'lucide-react';

export default function UserFlow() {
  const [dateRange, setDateRange] = useState('last-30-days');
  
  // Sample data for demonstration
  const topFlowPaths = [
    { path: 'Home → Portfolio → Contact', sessions: 1245, conversionRate: '8.2%', avgTime: '4:32' },
    { path: 'Home → Services → Pricing → Contact', sessions: 876, conversionRate: '12.5%', avgTime: '6:15' },
    { path: 'Home → Blog → Portfolio → Contact', sessions: 654, conversionRate: '7.8%', avgTime: '5:20' },
    { path: 'Home → About → Contact', sessions: 543, conversionRate: '9.1%', avgTime: '3:45' },
    { path: 'Blog → Portfolio → Contact', sessions: 432, conversionRate: '6.5%', avgTime: '4:10' }
  ];
  
  // Entry point data
  const entryPoints = [
    { page: 'Home', sessions: 5432, percentage: 42 },
    { page: 'Blog', sessions: 1876, percentage: 15 },
    { page: 'Portfolio', sessions: 1543, percentage: 12 },
    { page: 'About', sessions: 1321, percentage: 10 },
    { page: 'Services', sessions: 987, percentage: 8 },
    { page: 'Contact', sessions: 765, percentage: 6 },
    { page: 'Other', sessions: 975, percentage: 7 }
  ];
  
  // Exit point data
  const exitPoints = [
    { page: 'Contact', sessions: 3210, percentage: 25 },
    { page: 'Home', sessions: 2543, percentage: 20 },
    { page: 'Portfolio', sessions: 1987, percentage: 15 },
    { page: 'Blog', sessions: 1654, percentage: 13 },
    { page: 'About', sessions: 1432, percentage: 11 },
    { page: 'Services', sessions: 1210, percentage: 9 },
    { page: 'Other', sessions: 964, percentage: 7 }
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Flow</h1>
          
          <div className="flex items-center space-x-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:border-black transition-colors"
            >
              <option value="last-7-days">Last 7 days</option>
              <option value="last-30-days">Last 30 days</option>
              <option value="last-90-days">Last 90 days</option>
              <option value="year-to-date">Year to date</option>
            </select>
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
            <p className="text-sm text-gray-500 mb-1">Total Sessions</p>
            <h3 className="text-3xl font-semibold">12,899</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Avg. Pages Per Session</p>
            <h3 className="text-3xl font-semibold">3.2</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
            <h3 className="text-3xl font-semibold">8.5%</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Bounce Rate</p>
            <h3 className="text-3xl font-semibold">38%</h3>
          </div>
        </div>
        
        {/* User Flow Visualization */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Users size={20} className="mr-2" />
            User Flow Visualization
          </h2>
          
          <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">User Flow Sankey Diagram Visualization</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Entry Points */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4">Entry Points</h2>
            
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-400">Entry Points Pie Chart</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entryPoints.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.page}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {item.sessions.toLocaleString()}
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
          
          {/* Exit Points */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4">Exit Points</h2>
            
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-400">Exit Points Pie Chart</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {exitPoints.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.page}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {item.sessions.toLocaleString()}
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
        
        {/* Top Flow Paths */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-4">Top User Flow Paths</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topFlowPaths.map((path, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        {path.path.split(' → ').map((step, i, arr) => (
                          <React.Fragment key={i}>
                            <span className="font-medium">{step}</span>
                            {i < arr.length - 1 && (
                              <ArrowRight size={14} className="mx-2 text-gray-400" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {path.sessions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {path.conversionRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {path.avgTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Custom Flow Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-lg font-medium mb-4">Custom Flow Analysis</h2>
          <p className="text-gray-500 mb-4">Select a starting page to analyze specific user flows.</p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <select className="border border-gray-200 rounded-lg px-3 py-2 focus:border-black transition-colors">
              <option value="">Select starting page...</option>
              <option value="home">Home</option>
              <option value="blog">Blog</option>
              <option value="portfolio">Portfolio</option>
              <option value="about">About</option>
              <option value="services">Services</option>
              <option value="contact">Contact</option>
            </select>
            
            <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Analyze Flow
            </button>
          </div>
          
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Custom Flow Analysis Visualization</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

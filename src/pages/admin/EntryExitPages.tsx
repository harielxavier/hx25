import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { BarChart2, LogIn, LogOut, Filter, AlertCircle } from 'lucide-react';

export default function EntryExitPages() {
  const [dateRange, setDateRange] = useState('last-30-days');
  
  // Sample data for demonstration
  const entryPages = [
    { title: 'Home Page', path: '/', sessions: 5432, percentage: 42, bounceRate: '38%' },
    { title: 'Blog Post: "10 Photography Tips"', path: '/blog/photography-tips', sessions: 1876, percentage: 15, bounceRate: '45%' },
    { title: 'About Us', path: '/about', sessions: 1543, percentage: 12, bounceRate: '32%' },
    { title: 'Services', path: '/services', sessions: 1321, percentage: 10, bounceRate: '35%' },
    { title: 'Portfolio', path: '/portfolio', sessions: 987, percentage: 8, bounceRate: '28%' },
    { title: 'Contact Us', path: '/contact', sessions: 765, percentage: 6, bounceRate: '42%' },
    { title: 'Pricing', path: '/pricing', sessions: 543, percentage: 4, bounceRate: '40%' },
    { title: 'FAQ', path: '/faq', sessions: 432, percentage: 3, bounceRate: '44%' }
  ];
  
  const exitPages = [
    { title: 'Contact Us', path: '/contact', sessions: 3210, percentage: 25, avgTimeBeforeExit: '4:12' },
    { title: 'Home Page', path: '/', sessions: 2543, percentage: 20, avgTimeBeforeExit: '2:34' },
    { title: 'Pricing', path: '/pricing', sessions: 1987, percentage: 15, avgTimeBeforeExit: '3:45' },
    { title: 'Blog Post: "10 Photography Tips"', path: '/blog/photography-tips', sessions: 1654, percentage: 13, avgTimeBeforeExit: '5:20' },
    { title: 'About Us', path: '/about', sessions: 1432, percentage: 11, avgTimeBeforeExit: '3:10' },
    { title: 'Portfolio', path: '/portfolio', sessions: 987, percentage: 8, avgTimeBeforeExit: '4:35' },
    { title: 'Services', path: '/services', sessions: 765, percentage: 6, avgTimeBeforeExit: '2:50' },
    { title: 'FAQ', path: '/faq', sessions: 321, percentage: 2, avgTimeBeforeExit: '1:45' }
  ];

  return (
    <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Entry & Exit Pages</h1>
          
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
            <p className="text-sm text-gray-500 mb-1">Avg. Session Duration</p>
            <h3 className="text-3xl font-semibold">4:12</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Bounce Rate</p>
            <h3 className="text-3xl font-semibold">38%</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Entry Pages Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <LogIn size={20} className="mr-2" />
              Top Entry Pages
            </h2>
            
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-400">Entry Pages Pie Chart Visualization</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Bounce Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entryPages.map((page, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{page.title}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{page.path}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {page.sessions.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {page.percentage}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {page.bounceRate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Exit Pages Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <LogOut size={20} className="mr-2" />
              Top Exit Pages
            </h2>
            
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-400">Exit Pages Pie Chart Visualization</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Time Before Exit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {exitPages.map((page, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{page.title}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{page.path}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {page.sessions.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {page.percentage}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {page.avgTimeBeforeExit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* User Flow Visualization */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-4">User Flow Visualization</h2>
          
          <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">User Flow Sankey Diagram Visualization</p>
          </div>
        </div>
      </div>
  );
}

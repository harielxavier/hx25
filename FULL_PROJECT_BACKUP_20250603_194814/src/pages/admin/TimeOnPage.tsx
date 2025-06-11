import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Clock, BarChart2, Filter, AlertCircle } from 'lucide-react';

export default function TimeOnPage() {
  const [dateRange, setDateRange] = useState('last-30-days');
  
  // Reset data to zero
  const pageTimeData = [
    { title: 'Portfolio', path: '/portfolio', avgTime: '0:00', pageViews: 0, uniqueViews: 0, readRate: '0%' },
    { title: 'About Us', path: '/about', avgTime: '0:00', pageViews: 0, uniqueViews: 0, readRate: '0%' },
    { title: 'Blog Post: "10 Photography Tips"', path: '/blog/photography-tips', avgTime: '0:00', pageViews: 0, uniqueViews: 0, readRate: '0%' },
    { title: 'Services', path: '/services', avgTime: '0:00', pageViews: 0, uniqueViews: 0, readRate: '0%' },
    { title: 'Home Page', path: '/', avgTime: '0:00', pageViews: 0, uniqueViews: 0, readRate: '0%' },
    { title: 'Contact Us', path: '/contact', avgTime: '0:00', pageViews: 0, uniqueViews: 0, readRate: '0%' },
    { title: 'Pricing', path: '/pricing', avgTime: '0:00', pageViews: 0, uniqueViews: 0, readRate: '0%' },
    { title: 'FAQ', path: '/faq', avgTime: '0:00', pageViews: 0, uniqueViews: 0, readRate: '0%' },
    { title: 'Blog Post: "Wedding Photography"', path: '/blog/wedding-photography', avgTime: '0:00', pageViews: 0, uniqueViews: 0, readRate: '0%' },
    { title: 'Blog Post: "Portrait Photography"', path: '/blog/portrait-photography', avgTime: '0:00', pageViews: 0, uniqueViews: 0, readRate: '0%' }
  ];
  
  // Time distribution data
  const timeDistribution = [
    { range: '0-10 seconds', percentage: 0 },
    { range: '11-30 seconds', percentage: 0 },
    { range: '31-60 seconds', percentage: 0 },
    { range: '1-3 minutes', percentage: 0 },
    { range: '3+ minutes', percentage: 0 }
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Time on Page</h1>
          
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
            <p className="text-sm text-gray-500 mb-1">Avg. Time on Site</p>
            <h3 className="text-3xl font-semibold">0:00</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Avg. Page Views per Session</p>
            <h3 className="text-3xl font-semibold">0.0</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Avg. Time per Page</p>
            <h3 className="text-3xl font-semibold">0:00</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Avg. Read Rate</p>
            <h3 className="text-3xl font-semibold">0%</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Pages by Time */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Clock size={20} className="mr-2" />
              Top Pages by Time Spent
            </h2>
            
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Time on Page Bar Chart Visualization</p>
            </div>
          </div>
          
          {/* Time Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <BarChart2 size={20} className="mr-2" />
              Time Distribution
            </h2>
            
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-400">Time Distribution Pie Chart</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Range</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timeDistribution.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.range}
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
        
        {/* Page Time Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">All Pages</h2>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-black transition-colors"
                >
                  <option value="time">Sort by Time</option>
                  <option value="views">Sort by Views</option>
                  <option value="readRate">Sort by Read Rate</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Page Views</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Views</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Read Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pageTimeData.map((page, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{page.title}</div>
                      <div className="text-sm text-gray-500">{page.path}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {page.avgTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {page.pageViews.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {page.uniqueViews.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {page.readRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

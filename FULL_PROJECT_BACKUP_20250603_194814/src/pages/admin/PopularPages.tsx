import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { BarChart2, ArrowUp, ArrowDown, Filter, AlertCircle } from 'lucide-react';

export default function PopularPages() {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [sortBy, setSortBy] = useState('views');
  
  // Sample data for demonstration
  const popularPages = [
    { title: 'Home Page', path: '/', views: 12845, uniqueVisitors: 8976, avgTime: '2:34', bounceRate: '32%', trend: '+15%' },
    { title: 'About Us', path: '/about', views: 6543, uniqueVisitors: 4321, avgTime: '3:12', bounceRate: '28%', trend: '+8%' },
    { title: 'Services', path: '/services', views: 5432, uniqueVisitors: 3654, avgTime: '2:45', bounceRate: '35%', trend: '+5%' },
    { title: 'Portfolio', path: '/portfolio', views: 4321, uniqueVisitors: 2987, avgTime: '4:10', bounceRate: '25%', trend: '+23%' },
    { title: 'Contact Us', path: '/contact', views: 3210, uniqueVisitors: 2543, avgTime: '1:45', bounceRate: '40%', trend: '-3%' },
    { title: 'Blog', path: '/blog', views: 2987, uniqueVisitors: 1876, avgTime: '3:30', bounceRate: '30%', trend: '+12%' },
    { title: 'Pricing', path: '/pricing', views: 2543, uniqueVisitors: 1654, avgTime: '2:15', bounceRate: '38%', trend: '+7%' },
    { title: 'FAQ', path: '/faq', views: 1987, uniqueVisitors: 1432, avgTime: '2:05', bounceRate: '42%', trend: '-5%' },
    { title: 'Terms & Conditions', path: '/terms', views: 876, uniqueVisitors: 765, avgTime: '1:20', bounceRate: '65%', trend: '-8%' },
    { title: 'Privacy Policy', path: '/privacy', views: 765, uniqueVisitors: 654, avgTime: '1:10', bounceRate: '70%', trend: '-10%' }
  ];

  return (
    <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Popular Pages</h1>
          
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
            <p className="text-sm text-gray-500 mb-1">Total Page Views</p>
            <h3 className="text-3xl font-semibold">41,509</h3>
            <p className="text-sm text-green-500 mt-2 flex items-center">
              <ArrowUp size={14} className="mr-1" />
              12% vs previous period
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Unique Visitors</p>
            <h3 className="text-3xl font-semibold">28,862</h3>
            <p className="text-sm text-green-500 mt-2 flex items-center">
              <ArrowUp size={14} className="mr-1" />
              8% vs previous period
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Avg. Time on Page</p>
            <h3 className="text-3xl font-semibold">2:42</h3>
            <p className="text-sm text-green-500 mt-2 flex items-center">
              <ArrowUp size={14} className="mr-1" />
              5% vs previous period
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Avg. Bounce Rate</p>
            <h3 className="text-3xl font-semibold">36%</h3>
            <p className="text-sm text-red-500 mt-2 flex items-center">
              <ArrowDown size={14} className="mr-1" />
              2% vs previous period
            </p>
          </div>
        </div>
        
        {/* Popular Pages Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <BarChart2 size={20} className="mr-2" />
            Top 5 Pages by Views
          </h2>
          
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Popular Pages Bar Chart Visualization</p>
          </div>
        </div>
        
        {/* Popular Pages Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">All Pages</h2>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-black transition-colors"
                >
                  <option value="views">Sort by Views</option>
                  <option value="visitors">Sort by Visitors</option>
                  <option value="time">Sort by Avg. Time</option>
                  <option value="bounce">Sort by Bounce Rate</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Visitors</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Bounce Rate</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {popularPages.map((page, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{page.title}</div>
                      <div className="text-sm text-gray-500">{page.path}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {page.uniqueVisitors.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {page.avgTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {page.bounceRate}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      page.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {page.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}

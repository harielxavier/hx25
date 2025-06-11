import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { BarChart2, Filter, AlertCircle } from 'lucide-react';

export default function ScrollDepth() {
  const [dateRange, setDateRange] = useState('last-30-days');
  
  // Sample data for demonstration
  const pageScrollData = [
    { title: 'Blog Post: "10 Photography Tips"', path: '/blog/photography-tips', avgDepth: '85%', views: 2987, readToEnd: '72%', dropOffPoint: 'After section 3' },
    { title: 'Portfolio', path: '/portfolio', avgDepth: '78%', views: 4321, readToEnd: '65%', dropOffPoint: 'After 8th image' },
    { title: 'About Us', path: '/about', avgDepth: '92%', views: 3654, readToEnd: '88%', dropOffPoint: 'Near the end' },
    { title: 'Blog Post: "Wedding Photography"', path: '/blog/wedding-photography', avgDepth: '76%', views: 1210, readToEnd: '62%', dropOffPoint: 'After section 2' },
    { title: 'Services', path: '/services', avgDepth: '65%', views: 2543, readToEnd: '54%', dropOffPoint: 'After pricing section' },
    { title: 'Home Page', path: '/', avgDepth: '60%', views: 12845, readToEnd: '42%', dropOffPoint: 'After hero section' },
    { title: 'Contact Us', path: '/contact', avgDepth: '95%', views: 1876, readToEnd: '90%', dropOffPoint: 'Near the end' },
    { title: 'Pricing', path: '/pricing', avgDepth: '70%', views: 1654, readToEnd: '58%', dropOffPoint: 'After second tier' },
    { title: 'Blog Post: "Portrait Photography"', path: '/blog/portrait-photography', avgDepth: '82%', views: 987, readToEnd: '75%', dropOffPoint: 'After section 4' },
    { title: 'FAQ', path: '/faq', avgDepth: '68%', views: 1432, readToEnd: '52%', dropOffPoint: 'After 5th question' }
  ];
  
  // Scroll depth breakdown
  const scrollBreakdown = [
    { depth: '0-25%', percentage: 100 },
    { depth: '26-50%', percentage: 85 },
    { depth: '51-75%', percentage: 65 },
    { depth: '76-90%', percentage: 45 },
    { depth: '91-100%', percentage: 35 }
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Scroll Depth</h1>
          
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
            <p className="text-sm text-gray-500 mb-1">Avg. Scroll Depth</p>
            <h3 className="text-3xl font-semibold">76%</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Read to End Rate</p>
            <h3 className="text-3xl font-semibold">62%</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Avg. Content Length</p>
            <h3 className="text-3xl font-semibold">1,450 px</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Bounce Before 50%</p>
            <h3 className="text-3xl font-semibold">15%</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Pages by Scroll Depth */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <BarChart2 size={20} className="mr-2" />
              Top Pages by Scroll Depth
            </h2>
            
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Scroll Depth Bar Chart Visualization</p>
            </div>
          </div>
          
          {/* Scroll Depth Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <BarChart2 size={20} className="mr-2" />
              Scroll Depth Breakdown
            </h2>
            
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-400">Scroll Depth Funnel Visualization</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scroll Depth</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage of Users</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scrollBreakdown.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.depth}
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
        
        {/* Page Scroll Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">All Pages</h2>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-black transition-colors"
                >
                  <option value="depth">Sort by Depth</option>
                  <option value="views">Sort by Views</option>
                  <option value="readToEnd">Sort by Read to End</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Depth</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Page Views</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Read to End</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Drop-off Point</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pageScrollData.map((page, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{page.title}</div>
                      <div className="text-sm text-gray-500">{page.path}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {page.avgDepth}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {page.readToEnd}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {page.dropOffPoint}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Heatmap Visualization */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-lg font-medium mb-4">Page Scroll Heatmap</h2>
          <p className="text-gray-500 mb-4">Select a page to view its scroll depth heatmap visualization.</p>
          
          <div className="flex justify-center mb-4">
            <select className="w-full max-w-md border border-gray-200 rounded-lg px-3 py-2 focus:border-black transition-colors">
              <option value="">Select a page...</option>
              {pageScrollData.map((page, index) => (
                <option key={index} value={page.path}>{page.title}</option>
              ))}
            </select>
          </div>
          
          <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Page Scroll Heatmap Visualization</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Target, PlusCircle, Edit2, Trash2, Filter, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

export default function ConversionGoals() {
  const [dateRange, setDateRange] = useState('last-30-days');
  
  // Sample data for demonstration
  const conversionGoals = [
    { 
      id: 1,
      name: 'Contact Form Submissions',
      type: 'Form Submission',
      target: '/contact',
      conversions: 1125,
      conversionRate: '9%',
      trend: '+2.5%',
      status: 'active'
    },
    { 
      id: 2,
      name: 'Photography Booking',
      type: 'Button Click',
      target: '/booking',
      conversions: 656,
      conversionRate: '7.5%',
      trend: '+1.2%',
      status: 'active'
    },
    { 
      id: 3,
      name: 'Newsletter Signup',
      type: 'Form Submission',
      target: '/newsletter',
      conversions: 2800,
      conversionRate: '11.2%',
      trend: '-0.8%',
      status: 'active'
    },
    { 
      id: 4,
      name: 'Portfolio Views',
      type: 'Page View',
      target: '/portfolio',
      conversions: 4325,
      conversionRate: '34.5%',
      trend: '+5.2%',
      status: 'active'
    },
    { 
      id: 5,
      name: 'Price List Download',
      type: 'File Download',
      target: '/pricing/download',
      conversions: 875,
      conversionRate: '8.3%',
      trend: '+0.7%',
      status: 'active'
    },
    { 
      id: 6,
      name: 'Wedding Package Inquiry',
      type: 'Form Submission',
      target: '/services/wedding/inquiry',
      conversions: 432,
      conversionRate: '6.8%',
      trend: '+1.5%',
      status: 'active'
    },
    { 
      id: 7,
      name: 'Blog Subscription',
      type: 'Form Submission',
      target: '/blog/subscribe',
      conversions: 1250,
      conversionRate: '5.2%',
      trend: '-1.3%',
      status: 'inactive'
    }
  ];
  
  // Monthly trend data
  const monthlyTrends = [
    { month: 'Jan', conversions: 980, rate: '8.1%' },
    { month: 'Feb', conversions: 1050, rate: '8.5%' },
    { month: 'Mar', conversions: 1120, rate: '8.7%' },
    { month: 'Apr', conversions: 1200, rate: '8.9%' },
    { month: 'May', conversions: 1350, rate: '9.2%' },
    { month: 'Jun', conversions: 1450, rate: '9.5%' }
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Conversion Goals</h1>
          
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
            <p className="text-sm text-gray-500 mb-1">Total Conversions</p>
            <h3 className="text-3xl font-semibold">11,463</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Avg. Conversion Rate</p>
            <h3 className="text-3xl font-semibold">9.2%</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Active Goals</p>
            <h3 className="text-3xl font-semibold">6</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Top Performing Goal</p>
            <h3 className="text-xl font-semibold truncate">Portfolio Views</h3>
          </div>
        </div>
        
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Target size={20} className="mr-2" />
            Conversion Trends
          </h2>
          
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
            <p className="text-gray-400">Conversion Trends Line Chart</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  {monthlyTrends.map((month) => (
                    <th key={month.month} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {month.month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    Conversions
                  </td>
                  {monthlyTrends.map((month) => (
                    <td key={month.month} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                      {month.conversions.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rate
                  </td>
                  {monthlyTrends.map((month) => (
                    <td key={month.month} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                      {month.rate}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Conversion Goals Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">All Conversion Goals</h2>
            
            <button className="flex items-center text-sm px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <PlusCircle size={16} className="mr-1" />
              Create New Goal
            </button>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-black transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="form">Form Submission</option>
                  <option value="click">Button Click</option>
                  <option value="view">Page View</option>
                  <option value="download">File Download</option>
                </select>
              </div>
              
              <div className="relative">
                <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-black transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search goals..."
                className="pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:border-black transition-colors"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {conversionGoals.map((goal) => (
                  <tr key={goal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{goal.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {goal.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {goal.target}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {goal.conversions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {goal.conversionRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex items-center justify-end">
                        {goal.trend.startsWith('+') ? (
                          <TrendingUp size={16} className="text-green-500 mr-1" />
                        ) : (
                          <TrendingDown size={16} className="text-red-500 mr-1" />
                        )}
                        <span className={goal.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                          {goal.trend}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        goal.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {goal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-500 mx-1">
                        <Edit2 size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-red-500 mx-1">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Goal Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-lg font-medium mb-4">Goal Details</h2>
          <p className="text-gray-500 mb-4">Select a goal from the table above to view detailed analytics.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium mb-3">Conversion Path</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Conversion Path Visualization</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-3">Performance by Device</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Device Performance Chart</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

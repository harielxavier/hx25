import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Filter, PlusCircle, Edit2, Trash2, AlertCircle } from 'lucide-react';

export default function ConversionFunnels() {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [activeFunnel, setActiveFunnel] = useState('contact');
  
  // Sample data for demonstration
  const funnels = [
    { 
      id: 'contact',
      name: 'Contact Form Submissions',
      steps: [
        { name: 'View Homepage', visitors: 12500, conversionRate: '100%' },
        { name: 'Visit Contact Page', visitors: 3750, conversionRate: '30%' },
        { name: 'Start Contact Form', visitors: 1875, conversionRate: '50%' },
        { name: 'Submit Form', visitors: 1125, conversionRate: '60%' }
      ],
      overallConversion: '9%',
      trend: '+2.5%'
    },
    { 
      id: 'booking',
      name: 'Photography Booking',
      steps: [
        { name: 'View Services', visitors: 8750, conversionRate: '100%' },
        { name: 'View Pricing', visitors: 4375, conversionRate: '50%' },
        { name: 'View Portfolio', visitors: 2625, conversionRate: '60%' },
        { name: 'Visit Booking Page', visitors: 1312, conversionRate: '50%' },
        { name: 'Complete Booking', visitors: 656, conversionRate: '50%' }
      ],
      overallConversion: '7.5%',
      trend: '+1.2%'
    },
    { 
      id: 'newsletter',
      name: 'Newsletter Signup',
      steps: [
        { name: 'View Any Page', visitors: 25000, conversionRate: '100%' },
        { name: 'View Signup Form', visitors: 10000, conversionRate: '40%' },
        { name: 'Enter Email', visitors: 3500, conversionRate: '35%' },
        { name: 'Confirm Subscription', visitors: 2800, conversionRate: '80%' }
      ],
      overallConversion: '11.2%',
      trend: '-0.8%'
    }
  ];
  
  const activeFunnelData = funnels.find(f => f.id === activeFunnel);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Conversion Funnels</h1>
          
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
            <h3 className="text-3xl font-semibold">4,581</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Avg. Conversion Rate</p>
            <h3 className="text-3xl font-semibold">9.2%</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Top Performing Funnel</p>
            <h3 className="text-3xl font-semibold">Newsletter</h3>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Conversion Trend</p>
            <h3 className="text-3xl font-semibold text-green-500">+1.5%</h3>
          </div>
        </div>
        
        {/* Funnel Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Conversion Funnels</h2>
            
            <button className="flex items-center text-sm px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <PlusCircle size={16} className="mr-1" />
              Create New Funnel
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funnel Name</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Steps</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Conversion</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {funnels.map((funnel) => (
                  <tr 
                    key={funnel.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${activeFunnel === funnel.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setActiveFunnel(funnel.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{funnel.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {funnel.steps.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {funnel.overallConversion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className={funnel.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                        {funnel.trend}
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
        
        {/* Active Funnel Visualization */}
        {activeFunnelData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">{activeFunnelData.name} Funnel</h2>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Overall Conversion: {activeFunnelData.overallConversion}</div>
                <div className={`text-sm ${activeFunnelData.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {activeFunnelData.trend} vs previous period
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-stretch gap-2">
                {activeFunnelData.steps.map((step, index) => {
                  const nextStep = activeFunnelData.steps[index + 1];
                  const dropoffRate = nextStep ? (100 - parseInt(nextStep.conversionRate)) : 0;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col">
                      <div className="bg-gray-100 p-4 rounded-t-lg">
                        <div className="font-medium text-sm mb-1">{step.name}</div>
                        <div className="text-2xl font-bold">{step.visitors.toLocaleString()}</div>
                        {index > 0 && (
                          <div className="text-sm text-gray-500">
                            {step.conversionRate} of previous step
                          </div>
                        )}
                      </div>
                      
                      {index < activeFunnelData.steps.length - 1 && (
                        <div className="flex items-center justify-center py-2 bg-gray-50">
                          <div className="flex flex-col items-center">
                            <div className="text-sm text-gray-500">Dropoff: {dropoffRate}%</div>
                            <div className="w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-gray-300 border-r-8 border-r-transparent mt-1"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-400">Funnel Visualization Chart</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium mb-3">Top Drop-off Points</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    {activeFunnelData.steps.slice(0, -1).map((step, index) => {
                      const nextStep = activeFunnelData.steps[index + 1];
                      const dropoffRate = nextStep ? (100 - parseInt(nextStep.conversionRate)) : 0;
                      const dropoffCount = step.visitors - (nextStep ? nextStep.visitors : 0);
                      
                      return (
                        <li key={index} className="flex justify-between items-center">
                          <span className="text-sm">{step.name} → {activeFunnelData.steps[index + 1].name}</span>
                          <span className="text-sm">
                            {dropoffCount.toLocaleString()} ({dropoffRate}%)
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-3">Improvement Suggestions</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Add clearer CTAs between {activeFunnelData.steps[0].name} and {activeFunnelData.steps[1].name}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Simplify the form on {activeFunnelData.steps[activeFunnelData.steps.length - 2].name}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Add testimonials to increase trust</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Optimize page load time for all funnel steps</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Funnel Comparison */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-4">Funnel Comparison</h2>
          
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Funnel Comparison Chart</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

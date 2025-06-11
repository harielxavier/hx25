import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { TrendingUp, Globe, AlertCircle } from 'lucide-react';

export default function TrafficSources() {
  // Sample data for demonstration
  const trafficSources = [
    { source: 'Google', visits: 6543, percentage: 42, change: '+15%' },
    { source: 'Direct', visits: 3210, percentage: 21, change: '+8%' },
    { source: 'Social Media', visits: 2876, percentage: 19, change: '+23%' },
    { source: 'Referral', visits: 1654, percentage: 11, change: '-5%' },
    { source: 'Email', visits: 987, percentage: 7, change: '+12%' }
  ];

  const socialBreakdown = [
    { platform: 'Instagram', visits: 1245, percentage: 43 },
    { platform: 'Facebook', visits: 876, percentage: 30 },
    { platform: 'Twitter', visits: 432, percentage: 15 },
    { platform: 'LinkedIn', visits: 214, percentage: 7 },
    { platform: 'Pinterest', visits: 109, percentage: 5 }
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Traffic Sources</h1>
        
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertCircle size={18} className="mr-2" />
          <div>
            <p className="font-medium">Demo Data</p>
            <p className="text-sm">This page currently displays sample data. Connect your analytics account for real data.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Main Traffic Sources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Globe size={20} className="mr-2" />
              Main Traffic Sources
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Visits</th>
                    <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                    <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {trafficSources.map((source, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-sm text-gray-900">{source.source}</td>
                      <td className="py-3 text-sm text-gray-500 text-right">{source.visits.toLocaleString()}</td>
                      <td className="py-3 text-sm text-gray-500 text-right">{source.percentage}%</td>
                      <td className={`py-3 text-sm text-right ${source.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {source.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Visualization */}
            <div className="mt-6 h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Traffic Sources Pie Chart Visualization</p>
            </div>
          </div>
          
          {/* Social Media Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <TrendingUp size={20} className="mr-2" />
              Social Media Breakdown
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                    <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Visits</th>
                    <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                  </tr>
                </thead>
                <tbody>
                  {socialBreakdown.map((platform, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-sm text-gray-900">{platform.platform}</td>
                      <td className="py-3 text-sm text-gray-500 text-right">{platform.visits.toLocaleString()}</td>
                      <td className="py-3 text-sm text-gray-500 text-right">{platform.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Visualization */}
            <div className="mt-6 h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Social Media Breakdown Bar Chart</p>
            </div>
          </div>
        </div>
        
        {/* Referral Traffic */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-4">Top Referral Sources</h2>
          
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Referral Traffic Visualization</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

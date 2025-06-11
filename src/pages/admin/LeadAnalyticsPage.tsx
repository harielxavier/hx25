import { useState, useEffect, Suspense, startTransition } from 'react';
import { Helmet } from 'react-helmet-async';
import LeadGenerationMetrics from '../../components/dashboard/LeadGenerationMetrics';
import WebsiteAnalytics from '../../components/dashboard/WebsiteAnalytics';
import { Download, RefreshCw } from 'lucide-react';

export default function LeadAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Here you would fetch the latest analytics data
      // This is a placeholder for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    refreshData();
  }, []);
  
  const exportData = () => {
    // This would generate a CSV or Excel file with the analytics data
    alert('Analytics data export functionality will be implemented here');
  };
  
  const [activeTab, setActiveTab] = useState('lead-metrics');
  
  // Use startTransition to prevent suspense errors during tab switching
  const handleTabChange = (tabId: string) => {
    startTransition(() => {
      setActiveTab(tabId);
    });
  };
  
  return (
    <>
      <Helmet>
        <title>Lead Analytics | Hariel Xavier Photography</title>
      </Helmet>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Lead Analytics Dashboard</h1>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <button 
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        {lastUpdated && (
          <p className="text-sm text-gray-500 mb-6">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        )}
        
        <div className="mb-6 border-b border-gray-200">
          <button 
            className={`px-4 py-2 mr-2 ${activeTab === 'lead-metrics' ? 'bg-black text-white' : 'bg-gray-100'} rounded-t-lg`}
            onClick={() => handleTabChange('lead-metrics')}
          >
            Lead Generation
          </button>
          <button 
            className={`px-4 py-2 mr-2 ${activeTab === 'website-metrics' ? 'bg-black text-white' : 'bg-gray-100'} rounded-t-lg`}
            onClick={() => handleTabChange('website-metrics')}
          >
            Website Performance
          </button>
          <button 
            className={`px-4 py-2 mr-2 ${activeTab === 'conversion-funnel' ? 'bg-black text-white' : 'bg-gray-100'} rounded-t-lg`}
            onClick={() => handleTabChange('conversion-funnel')}
          >
            Conversion Funnel
          </button>
          <button 
            className={`px-4 py-2 mr-2 ${activeTab === 'source-analysis' ? 'bg-black text-white' : 'bg-gray-100'} rounded-t-lg`}
            onClick={() => handleTabChange('source-analysis')}
          >
            Lead Sources
          </button>
        </div>
          
        <Suspense fallback={<div className="p-12 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div></div>}>
          {activeTab === 'lead-metrics' && (
            <LeadGenerationMetrics />
          )}
          
          {activeTab === 'website-metrics' && (
            <>
              <WebsiteAnalytics />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">Top Landing Pages</h3>
                    <p className="text-sm text-gray-500">Pages with the highest visitor-to-lead conversion rates</p>
                  </div>
                  <div>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Page</th>
                          <th className="text-right py-2">Visitors</th>
                          <th className="text-right py-2">Leads</th>
                          <th className="text-right py-2">Conversion</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">/wedding-photography</td>
                          <td className="text-right py-2"></td>
                          <td className="text-right py-2"></td>
                          <td className="text-right py-2 text-green-600"></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">/wedding-tools</td>
                          <td className="text-right py-2"></td>
                          <td className="text-right py-2"></td>
                          <td className="text-right py-2 text-green-600"></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">/pricing</td>
                          <td className="text-right py-2"></td>
                          <td className="text-right py-2"></td>
                          <td className="text-right py-2 text-green-600"></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">/portfolio</td>
                          <td className="text-right py-2"></td>
                          <td className="text-right py-2"></td>
                          <td className="text-right py-2 text-green-600"></td>
                        </tr>
                        <tr>
                          <td className="py-2">/contact</td>
                          <td className="text-right py-2"></td>
                          <td className="text-right py-2"></td>
                          <td className="text-right py-2 text-green-600"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">Engagement by Device</h3>
                    <p className="text-sm text-gray-500">How different devices affect lead generation</p>
                  </div>
                  <div>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Device</th>
                          <th className="text-right py-2">Visitors</th>
                          <th className="text-right py-2">Avg. Time</th>
                          <th className="text-right py-2">Conversion</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Desktop</td>
                          <td className="text-right py-2"></td>
                          <td className="text-right py-2"></td>
                          <td className="text-right py-2 text-green-600"></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Mobile</td>
                          <td className="text-right py-2"></td>
                          <td className="text-right py-2"></td>
                          <td className="text-right py-2 text-green-600"></td>
                        </tr>
                        <tr>
                          <td className="py-2">Tablet</td>
                          <td className="text-right py-2"></td>
                          <td className="text-right py-2"></td>
                          <td className="text-right py-2 text-green-600"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'conversion-funnel' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Conversion Funnel</h3>
                <p className="text-sm text-gray-500">Visitor journey through the conversion process</p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full max-w-md bg-gray-50 p-4 rounded-lg text-center">
                  <p className="font-medium">Website Visitors</p>
                  <p className="text-2xl font-bold"></p>
                </div>
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-300"></div>
                <div className="w-full max-w-md bg-gray-50 p-4 rounded-lg text-center">
                  <p className="font-medium">Gallery Views</p>
                  <p className="text-2xl font-bold"></p>
                </div>
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-300"></div>
                <div className="w-full max-w-md bg-gray-50 p-4 rounded-lg text-center">
                  <p className="font-medium">Contact Form Views</p>
                  <p className="text-2xl font-bold"></p>
                </div>
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-300"></div>
                <div className="w-full max-w-md bg-gray-50 p-4 rounded-lg text-center">
                  <p className="font-medium">Form Submissions</p>
                  <p className="text-2xl font-bold"></p>
                </div>
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-300"></div>
                <div className="w-full max-w-md bg-green-50 p-4 rounded-lg text-center">
                  <p className="font-medium">Bookings</p>
                  <p className="text-2xl font-bold"></p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'source-analysis' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Lead Sources Analysis</h3>
                <p className="text-sm text-gray-500">Breakdown of where your leads are coming from</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Source</th>
                        <th className="text-right py-2">Visitors</th>
                        <th className="text-right py-2">Leads</th>
                        <th className="text-right py-2">Conversion</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Google Search</td>
                        <td className="text-right py-2"></td>
                        <td className="text-right py-2"></td>
                        <td className="text-right py-2"></td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Instagram</td>
                        <td className="text-right py-2"></td>
                        <td className="text-right py-2"></td>
                        <td className="text-right py-2"></td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Facebook</td>
                        <td className="text-right py-2"></td>
                        <td className="text-right py-2"></td>
                        <td className="text-right py-2"></td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Direct</td>
                        <td className="text-right py-2"></td>
                        <td className="text-right py-2"></td>
                        <td className="text-right py-2"></td>
                      </tr>
                      <tr>
                        <td className="py-2">Referral</td>
                        <td className="text-right py-2"></td>
                        <td className="text-right py-2"></td>
                        <td className="text-right py-2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-full max-w-xs p-4 text-center">
                    <p className="text-sm text-gray-500 mb-4">Lead Source Distribution</p>
                    <div className="aspect-square rounded-full border-8 border-gray-200 relative flex items-center justify-center">
                      <p className="text-sm text-gray-500">No data yet</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Suspense>
      </div>
    </>
  );
}

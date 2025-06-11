import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, BarChart2, Link, ExternalLink, Plus, Edit, Trash2, AlertCircle, CheckCircle, Target, Lightbulb, Award, Settings, FileText, Activity } from 'lucide-react';
import { seoService, SEOAnalysis, KeywordData, SEORecommendation, SEOIssue } from '../../services/seoService'; // Assuming types are exported

const SeoTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'performance' | 'recommendations' | 'content'>('overview');
  const [seoData, setSeoData] = useState<SEOAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [recommendations, setRecommendations] = useState<SEORecommendation[]>([]);
  const [issues, setIssues] = useState<SEOIssue[]>([]);
  const [contentSuggestions, setContentSuggestions] = useState<string[]>([]);

  useEffect(() => {
    loadSEOData();
  }, []);

  const loadSEOData = async () => {
    try {
      setLoading(true);
      const [analysis, keywordData, localRecs, contentIdeas, identifiedIssues] = await Promise.all([
        seoService.analyzeSEOPerformance(),
        seoService.getPhotographyKeywords(),
        seoService.getLocalSEORecommendations(),
        seoService.getContentSuggestions(),
        seoService.identifySEOIssues() // Added this call
      ]);
      setSeoData(analysis);
      setKeywords(keywordData);
      setRecommendations(localRecs);
      setContentSuggestions(contentIdeas);
      setIssues(identifiedIssues); // Set the issues
    } catch (error) {
      console.error('Failed to load SEO data:', error);
      // Consider adding user-facing error display here
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Loading SEO Dashboard...</p>
      </div>
    );
  }

  if (!seoData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Error Loading SEO Data</h2>
        <p className="text-gray-600 mb-4">Could not retrieve SEO performance data. Please try again later.</p>
        <button 
          onClick={loadSEOData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Overall SEO Score" value={`${seoData.score}/100`} icon={<Award className="text-green-500" />} trendValue="+5%" trendDirection="up" />
      <StatCard title="Organic Keywords" value={keywords.length.toString()} icon={<Target className="text-blue-500" />} trendValue={`${keywords.filter(k => k.position && k.position <= 10).length} in Top 10`} />
      <StatCard title="Page Speed (Mobile)" value={`${seoData.performance.pageSpeed}/100`} icon={<Activity className="text-purple-500" />} trendValue={seoData.performance.coreWebVitals.lcp + "s LCP"} />
      <StatCard title="Critical Issues" value={issues.filter(i => i.type === 'critical').length.toString()} icon={<AlertCircle className="text-red-500" />} trendValue={`${issues.length} total issues`} />
    </div>
  );

  const renderKeywordsTab = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-medium">Tracked Keywords</h3>
        <button className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
          <Plus className="w-4 h-4" /> Add Keyword
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Keyword', 'Volume', 'Difficulty', 'Position', 'Trend', 'Opportunities'].map(header => (
                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {keywords.map((keyword) => (
              <tr key={keyword.keyword}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{keyword.keyword}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{keyword.volume.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{keyword.difficulty}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{keyword.position || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`capitalize px-2 py-1 rounded-full text-xs font-semibold ${keyword.trend === 'up' ? 'bg-green-100 text-green-700' : keyword.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                    {keyword.trend}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{keyword.opportunities.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="bg-white shadow rounded-md p-6">
      <h3 className="text-lg font-medium mb-4">Website Performance Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricDisplay title="Page Speed Score" value={`${seoData.performance.pageSpeed}/100`} />
        <MetricDisplay title="Largest Contentful Paint (LCP)" value={`${seoData.performance.coreWebVitals.lcp}s`} />
        <MetricDisplay title="First Input Delay (FID)" value={`${seoData.performance.coreWebVitals.fid}ms`} />
        <MetricDisplay title="Cumulative Layout Shift (CLS)" value={`${seoData.performance.coreWebVitals.cls}`} />
        <MetricDisplay title="Mobile Usability Score" value={`${seoData.performance.mobileUsability}/100`} />
        <MetricDisplay title="Indexability Score" value={`${seoData.performance.indexability}/100`} />
      </div>
      <div className="mt-6">
        <h4 className="text-md font-medium mb-2">Performance Chart (Placeholder)</h4>
        <div className="h-64 border border-gray-200 rounded-md p-4 flex items-center justify-center bg-gray-50">
          <BarChart2 className="h-12 w-12 text-gray-300" />
          <p className="ml-2 text-gray-400">Performance visualization would appear here.</p>
        </div>
      </div>
    </div>
  );

  const renderRecommendationsTab = () => (
    <div className="space-y-4">
      {recommendations.map((rec, index) => (
        <div key={index} className="bg-white shadow rounded-md p-4">
          <div className="flex items-center mb-2">
            <Lightbulb className={`h-5 w-5 mr-2 ${rec.priority === 'high' ? 'text-red-500' : rec.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />
            <h4 className="text-md font-semibold">{rec.title}</h4>
            <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
              rec.priority === 'high' ? 'bg-red-100 text-red-700' : 
              rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
              'bg-green-100 text-green-700'
            }`}>
              {rec.priority} Priority
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{rec.description}</p>
          <p className="text-xs text-gray-500">Category: <span className="font-medium capitalize">{rec.category}</span></p>
        </div>
      ))}
    </div>
  );

  const renderContentSuggestionsTab = () => (
    <div className="bg-white shadow rounded-md p-6">
      <h3 className="text-lg font-medium mb-4">Content Suggestions</h3>
      <ul className="space-y-3">
        {contentSuggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start p-3 border rounded-md hover:bg-gray-50">
            <FileText className="h-5 w-5 mr-3 mt-1 text-blue-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Advanced SEO Dashboard</h1>
        <button 
          onClick={loadSEOData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Settings className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { name: 'Overview', tab: 'overview' },
            { name: 'Keywords', tab: 'keywords' },
            { name: 'Performance', tab: 'performance' },
            { name: 'Recommendations', tab: 'recommendations' },
            { name: 'Content Ideas', tab: 'content' }
          ].map(item => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab as any)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === item.tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>
      
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'keywords' && renderKeywordsTab()}
      {activeTab === 'performance' && renderPerformanceTab()}
      {activeTab === 'recommendations' && renderRecommendationsTab()}
      {activeTab === 'content' && renderContentSuggestionsTab()}
    </div>
  );
};

// Helper components for consistent styling
const StatCard: React.FC<{title: string, value: string, icon: React.ReactNode, trendValue?: string, trendDirection?: 'up' | 'down'}> = 
  ({ title, value, icon, trendValue, trendDirection }) => (
  <div className="bg-white p-5 rounded-lg shadow-lg">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-gray-100 mr-4">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
    {trendValue && (
      <div className={`mt-2 text-xs flex items-center ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        <TrendingUp className={`h-4 w-4 mr-1 ${trendDirection === 'down' ? 'transform rotate-180' : ''}`} />
        {trendValue}
      </div>
    )}
  </div>
);

const MetricDisplay: React.FC<{title: string, value: string | number}> = ({ title, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-semibold text-gray-800">{value}</p>
  </div>
);

export default SeoTools;

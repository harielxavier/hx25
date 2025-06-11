/**
 * Enterprise SEO Dashboard - Complete SEO Management Interface
 * 
 * A comprehensive dashboard for managing all SEO operations including:
 * - Real-time SEO monitoring and alerts
 * - Comprehensive audit results and recommendations
 * - Keyword tracking and competitor analysis
 * - Content optimization tools
 * - Performance monitoring and Core Web Vitals
 * - Schema markup management
 * - Local SEO optimization
 * - Automated reporting and insights
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Link,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Target,
  Lightbulb,
  Award,
  Settings,
  FileText,
  Activity,
  Globe,
  Smartphone,
  Shield,
  Zap,
  Users,
  MapPin,
  Star,
  Eye,
  Clock,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

// Mock data for demonstration - in real implementation, this would come from the SEO platform
const mockSEOData = {
  overallScore: 87,
  auditDate: new Date().toISOString(),
  technicalSEO: {
    score: 92,
    crawlability: { score: 95, robotsTxtValid: true, xmlSitemapPresent: true },
    indexability: { score: 88, indexablePages: 45, nonIndexablePages: 3 },
    siteStructure: { score: 90, urlStructureScore: 85, navigationDepth: 3 },
    mobileOptimization: { score: 94, mobileResponsive: true, mobileFriendlyScore: 92 },
    securityAudit: { score: 96, httpsImplemented: true, sslCertificateValid: true }
  },
  onPageSEO: {
    score: 85,
    titleTags: { score: 88, totalPages: 48, missingTitles: [], duplicateTitles: ['Contact', 'About'] },
    metaDescriptions: { score: 82, totalPages: 48, missingDescriptions: ['blog/post-1', 'gallery/sample'] },
    headingStructure: { score: 90, totalPages: 48, missingH1: [], multipleH1: [] },
    internalLinking: { score: 78, totalInternalLinks: 234, orphanedPages: [] },
    imageOptimization: { score: 85, totalImages: 156, missingAltText: ['img1.jpg', 'img2.jpg'] }
  },
  contentSEO: {
    score: 83,
    keywordOptimization: { score: 85, targetKeywords: ['wedding photographer sparta nj', 'new jersey wedding photography'] },
    contentQuality: { score: 88, averageWordCount: 650, thinContentPages: [] },
    contentFreshness: { score: 75, lastUpdated: '2025-01-15', staleContentPages: ['old-blog-post'] },
    duplicateContent: { score: 92, duplicatePages: [], nearDuplicatePages: [] },
    readabilityScore: { score: 86, fleschKincaidScore: 65, averageSentenceLength: 18 }
  },
  localSEO: {
    score: 89,
    googleMyBusiness: { score: 92, profileComplete: true, reviewCount: 47, averageRating: 4.8 },
    localCitations: { score: 85, totalCitations: 23, consistentNAP: true },
    reviewsAndRatings: { score: 91, totalReviews: 47, averageRating: 4.8, responseRate: 95 },
    localKeywords: { score: 87, localKeywords: ['sparta nj photographer', 'morris county wedding'] },
    schemaMarkup: { score: 88, implementedSchemas: ['LocalBusiness', 'ImageGallery'] }
  },
  performanceSEO: {
    score: 81,
    coreWebVitals: { score: 78, lcp: 2.1, fid: 45, cls: 0.08, grade: 'needs-improvement' },
    pageSpeed: { score: 85, desktopScore: 92, mobileScore: 78 },
    mobilePerformance: { score: 82, mobileUsabilityScore: 89, mobileFriendlyPages: 45 },
    serverResponse: { score: 88, averageResponseTime: 450, uptime: 99.8 }
  },
  keywordRankings: [
    { keyword: 'wedding photographer sparta nj', position: 3, previousPosition: 5, change: 2, searchVolume: 1200, difficulty: 45 },
    { keyword: 'new jersey wedding photography', position: 8, previousPosition: 12, change: 4, searchVolume: 2100, difficulty: 62 },
    { keyword: 'engagement photographer near me', position: 15, previousPosition: 18, change: 3, searchVolume: 890, difficulty: 38 },
    { keyword: 'bridal portraits sparta', position: 7, previousPosition: 7, change: 0, searchVolume: 320, difficulty: 28 },
    { keyword: 'wedding venues new jersey', position: 22, previousPosition: 19, change: -3, searchVolume: 3200, difficulty: 78 }
  ],
  recommendations: [
    {
      id: '1',
      title: 'Optimize Core Web Vitals',
      description: 'Improve Largest Contentful Paint (LCP) by optimizing image loading and server response times.',
      category: 'performance',
      priority: 'high',
      impact: 'high',
      effort: 'medium',
      estimatedTimeToComplete: '2-3 weeks'
    },
    {
      id: '2',
      title: 'Add Missing Meta Descriptions',
      description: 'Create compelling meta descriptions for 2 pages to improve click-through rates.',
      category: 'content',
      priority: 'medium',
      impact: 'medium',
      effort: 'low',
      estimatedTimeToComplete: '1-2 days'
    },
    {
      id: '3',
      title: 'Implement FAQ Schema',
      description: 'Add FAQ schema markup to service pages to enhance rich snippets.',
      category: 'technical',
      priority: 'medium',
      impact: 'medium',
      effort: 'low',
      estimatedTimeToComplete: '3-5 days'
    }
  ],
  criticalIssues: [
    {
      id: '1',
      type: 'warning',
      title: 'Mobile Page Speed Below Threshold',
      description: 'Mobile page speed score of 78 is below the recommended 85+ threshold.',
      impact: 'high',
      affectedPages: ['/gallery/crysta-david', '/gallery/ana-jose']
    }
  ],
  competitorAnalysis: {
    competitors: [
      { domain: 'competitor1.com', organicKeywords: 1250, organicTraffic: 15000, domainAuthority: 45 },
      { domain: 'competitor2.com', organicKeywords: 890, organicTraffic: 12000, domainAuthority: 38 },
      { domain: 'competitor3.com', organicKeywords: 2100, organicTraffic: 25000, domainAuthority: 52 }
    ],
    keywordGaps: [
      { keyword: 'outdoor wedding photography nj', competitorPosition: 5, ourPosition: null, opportunity: 'high', searchVolume: 1800 },
      { keyword: 'rustic wedding venues morris county', competitorPosition: 3, ourPosition: null, opportunity: 'medium', searchVolume: 950 }
    ]
  }
};

const EnterpriseSEODashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'performance' | 'content' | 'local' | 'competitors' | 'recommendations'>('overview');
  const [loading, setLoading] = useState(false);
  const [seoData, setSeoData] = useState(mockSEOData);
  const [dateRange, setDateRange] = useState('30d');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        refreshSEOData();
      }, 300000); // Refresh every 5 minutes
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const refreshSEOData = useCallback(async () => {
    setLoading(true);
    try {
      // In real implementation, this would call the SEO platform API
      await new Promise(resolve => setTimeout(resolve, 2000));
      // setSeoData(await seoService.performComprehensiveAudit());
    } catch (error) {
      console.error('Failed to refresh SEO data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportReport = () => {
    // Generate and download comprehensive SEO report
    const reportData = {
      ...seoData,
      generatedAt: new Date().toISOString(),
      reportType: 'comprehensive'
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Overall SEO Score"
          value={`${seoData.overallScore}/100`}
          icon={<Award className="text-green-500" />}
          trend={{ value: "+5%", direction: "up" }}
          grade={seoData.overallScore >= 90 ? 'excellent' : seoData.overallScore >= 80 ? 'good' : seoData.overallScore >= 70 ? 'fair' : 'poor'}
        />
        <MetricCard
          title="Organic Keywords"
          value={seoData.keywordRankings.length.toString()}
          icon={<Target className="text-blue-500" />}
          trend={{ value: `${seoData.keywordRankings.filter(k => k.position <= 10).length} in Top 10`, direction: "up" }}
        />
        <MetricCard
          title="Core Web Vitals"
          value={seoData.performanceSEO.coreWebVitals.grade}
          icon={<Zap className="text-purple-500" />}
          trend={{ value: `LCP: ${seoData.performanceSEO.coreWebVitals.lcp}s`, direction: seoData.performanceSEO.coreWebVitals.lcp <= 2.5 ? "up" : "down" }}
        />
        <MetricCard
          title="Critical Issues"
          value={seoData.criticalIssues.filter(i => i.type === 'critical').length.toString()}
          icon={<AlertCircle className="text-red-500" />}
          trend={{ value: `${seoData.criticalIssues.length} total issues`, direction: "stable" }}
        />
      </div>

      {/* SEO Categories Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-blue-500" />
            SEO Category Scores
          </h3>
          <div className="space-y-4">
            <ScoreBar label="Technical SEO" score={seoData.technicalSEO.score} color="blue" />
            <ScoreBar label="On-Page SEO" score={seoData.onPageSEO.score} color="green" />
            <ScoreBar label="Content SEO" score={seoData.contentSEO.score} color="purple" />
            <ScoreBar label="Local SEO" score={seoData.localSEO.score} color="orange" />
            <ScoreBar label="Performance SEO" score={seoData.performanceSEO.score} color="red" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Top Keyword Rankings
          </h3>
          <div className="space-y-3">
            {seoData.keywordRankings.slice(0, 5).map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{keyword.keyword}</p>
                  <p className="text-xs text-gray-500">Volume: {keyword.searchVolume.toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold">#{keyword.position}</span>
                  {keyword.change !== 0 && (
                    <span className={`flex items-center text-xs ${keyword.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {keyword.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {Math.abs(keyword.change)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Recommendations */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
          Priority Recommendations
        </h3>
        <div className="space-y-4">
          {seoData.recommendations.slice(0, 3).map((rec, index) => (
            <RecommendationCard key={index} recommendation={rec} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderKeywordsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Keyword Performance</h3>
        <div className="flex space-x-2">
          <button className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            <Plus className="w-4 h-4" /> Add Keywords
          </button>
          <button className="flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Keyword', 'Position', 'Change', 'Volume', 'Difficulty', 'Trend'].map(header => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {seoData.keywordRankings.map((keyword, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{keyword.keyword}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-bold">#{keyword.position}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {keyword.change !== 0 ? (
                      <span className={`flex items-center ${keyword.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {keyword.change > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                        {Math.abs(keyword.change)}
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-500">
                        <Minus className="w-4 h-4 mr-1" />
                        0
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {keyword.searchVolume.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <DifficultyBadge difficulty={keyword.difficulty} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TrendIndicator change={keyword.change} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Web Vitals */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-purple-500" />
            Core Web Vitals
          </h3>
          <div className="space-y-4">
            <CoreWebVitalMetric
              name="Largest Contentful Paint (LCP)"
              value={`${seoData.performanceSEO.coreWebVitals.lcp}s`}
              threshold={2.5}
              current={seoData.performanceSEO.coreWebVitals.lcp}
              unit="s"
            />
            <CoreWebVitalMetric
              name="First Input Delay (FID)"
              value={`${seoData.performanceSEO.coreWebVitals.fid}ms`}
              threshold={100}
              current={seoData.performanceSEO.coreWebVitals.fid}
              unit="ms"
            />
            <CoreWebVitalMetric
              name="Cumulative Layout Shift (CLS)"
              value={seoData.performanceSEO.coreWebVitals.cls.toString()}
              threshold={0.1}
              current={seoData.performanceSEO.coreWebVitals.cls}
              unit=""
            />
          </div>
        </div>

        {/* Page Speed Scores */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            Page Speed Scores
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-gray-500" />
                <span>Desktop</span>
              </div>
              <div className="flex items-center">
                <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: `${seoData.performanceSEO.pageSpeed.desktopScore}%` }}
                  ></div>
                </div>
                <span className="font-bold">{seoData.performanceSEO.pageSpeed.desktopScore}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-gray-500" />
                <span>Mobile</span>
              </div>
              <div className="flex items-center">
                <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                  <div 
                    className="h-2 bg-yellow-500 rounded-full" 
                    style={{ width: `${seoData.performanceSEO.pageSpeed.mobileScore}%` }}
                  ></div>
                </div>
                <span className="font-bold">{seoData.performanceSEO.pageSpeed.mobileScore}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Issues */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Issues & Recommendations</h3>
        <div className="space-y-4">
          {seoData.criticalIssues.map((issue, index) => (
            <IssueCard key={index} issue={issue} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompetitorsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-500" />
          Competitor Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Domain', 'Organic Keywords', 'Organic Traffic', 'Domain Authority'].map(header => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {seoData.competitorAnalysis.competitors.map((competitor, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {competitor.domain}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {competitor.organicKeywords.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {competitor.organicTraffic.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {competitor.domainAuthority}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Keyword Opportunities</h3>
        <div className="space-y-4">
          {seoData.competitorAnalysis.keywordGaps.map((gap, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{gap.keyword}</p>
                <p className="text-sm text-gray-500">
                  Volume: {gap.searchVolume.toLocaleString()} | Competitor Position: #{gap.competitorPosition}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                gap.opportunity === 'high' ? 'bg-red-100 text-red-700' :
                gap.opportunity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {gap.opportunity} opportunity
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Enterprise SEO Dashboard</h1>
          <p className="text-gray-600">Last updated: {new Date(seoData.auditDate).toLocaleString()}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Auto-refresh:</label>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoRefresh ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoRefresh ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <button
            onClick={refreshSEOData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { name: 'Overview', tab: 'overview', icon: BarChart2 },
            { name: 'Keywords', tab: 'keywords', icon: Target },
            { name: 'Performance', tab: 'performance', icon: Zap },
            { name: 'Content', tab: 'content', icon: FileText },
            { name: 'Local SEO', tab: 'local', icon: MapPin },
            { name: 'Competitors', tab: 'competitors', icon: Users },
            { name: 'Recommendations', tab: 'recommendations', icon: Lightbulb }
          ].map(item => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab as any)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === item.tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'keywords' && renderKeywordsTab()}
      {activeTab === 'performance' && renderPerformanceTab()}
      {activeTab === 'competitors' && renderCompetitorsTab()}
      {/* Add other tab renderers as needed */}
    </div>
  );
};

// Helper Components
const MetricCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: { value: string; direction: 'up' | 'down' | 'stable' };
  grade?: 'excellent' | 'good' | 'fair' | 'poor';
}> = ({ title, value, icon, trend, grade }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="flex items-center justify-between">
      <div className="p-3 rounded-full bg-gray-100">{icon}</div>
      {grade && (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          grade === 'excellent' ? 'bg-green-100 text-green-700' :

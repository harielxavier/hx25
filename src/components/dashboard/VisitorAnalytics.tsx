import React from 'react';
import { Globe, Clock, Users, ArrowDown, ArrowUp, Map, Link as LinkIcon } from 'lucide-react';
// REMOVED FIREBASE: import { db } from '../../firebase/config';
// REMOVED FIREBASE: import { collection, getDocs, query, where, Timestamp // REMOVED FIREBASE

interface VisitorMetrics {
  total_visitors: number;
  unique_visitors: number;
  avg_session_duration: number;
  bounce_rate: number;
  top_pages: Array<{
    page_path: string;
    views: number;
    avg_time: number;
  }>;
  top_locations: Array<{
    country: string;
    visits: number;
  }>;
  top_sources: Array<{
    source: string;
    visits: number;
  }>;
}

export default function VisitorAnalytics() {
  const [metrics, setMetrics] = React.useState<VisitorMetrics | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [timeframe, setTimeframe] = React.useState('7d'); // 7d, 30d, 90d

  React.useEffect(() => {
    loadMetrics();
  }, [timeframe]);

  async function loadMetrics() {
    try {
      setLoading(true);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeframe));

      // For now, use mock data since we're migrating from Supabase
      const mockMetrics = {
        total_visitors: 1250,
        unique_visitors: 980,
        avg_session_duration: 180,
        bounce_rate: 35.2,
        top_pages: [
          { page_path: '/', views: 450, avg_time: 120 },
          { page_path: '/portfolio', views: 320, avg_time: 240 },
          { page_path: '/about', views: 180, avg_time: 90 },
          { page_path: '/contact', views: 150, avg_time: 60 },
          { page_path: '/pricing', views: 120, avg_time: 180 }
        ],
        top_locations: [
          { country: 'United States', visits: 850 },
          { country: 'Canada', visits: 120 },
          { country: 'United Kingdom', visits: 80 },
          { country: 'Australia', visits: 60 },
          { country: 'Germany', visits: 45 }
        ],
        top_sources: [
          { source: 'Google', visits: 650 },
          { source: 'Instagram', visits: 280 },
          { source: 'Direct', visits: 180 },
          { source: 'Facebook', visits: 90 },
          { source: 'Pinterest', visits: 50 }
        ]
      };

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error loading visitor metrics:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  if (loading) {
    return <div className="animate-pulse bg-gray-100 h-96 rounded-lg" />;
  }

  if (!metrics) {
    return <div>No data available</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Visitor Analytics</h3>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Users className="w-4 h-4" />
              <span>Total Visitors</span>
            </div>
            <p className="text-2xl font-light">{metrics.total_visitors}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Users className="w-4 h-4" />
              <span>Unique Visitors</span>
            </div>
            <p className="text-2xl font-light">{metrics.unique_visitors}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Clock className="w-4 h-4" />
              <span>Avg. Session Duration</span>
            </div>
            <p className="text-2xl font-light">{formatDuration(metrics.avg_session_duration)}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <ArrowDown className="w-4 h-4" />
              <span>Bounce Rate</span>
            </div>
            <p className="text-2xl font-light">{metrics.bounce_rate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-3 divide-x divide-gray-200">
        {/* Top Pages */}
        <div className="p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-4">Top Pages</h4>
          <div className="space-y-4">
            {metrics.top_pages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium truncate" title={page.page_path}>
                    {page.page_path}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDuration(page.avg_time)} avg. time
                  </p>
                </div>
                <span className="text-sm font-medium">{page.views}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Locations */}
        <div className="p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-4">Top Locations</h4>
          <div className="space-y-4">
            {metrics.top_locations.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{location.country}</span>
                </div>
                <span className="text-sm font-medium">{location.visits}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sources */}
        <div className="p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-4">Top Sources</h4>
          <div className="space-y-4">
            {metrics.top_sources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{source.source}</span>
                </div>
                <span className="text-sm font-medium">{source.visits}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

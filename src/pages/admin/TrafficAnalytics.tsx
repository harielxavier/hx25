import { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  Users,
  Eye,
  Activity,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  Clock,
} from 'lucide-react';
import {
  getAnalyticsSummary,
  getRecentVisitors,
  getTrafficChartData,
  getActiveUsers,
  WebHit,
} from '../../services/supabaseAnalyticsService';
import { subDays } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TrafficAnalytics() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<7 | 30 | 90>(30);
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentVisitors, setRecentVisitors] = useState<WebHit[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  useEffect(() => {
    // Poll for active users every 30 seconds
    loadActiveUsers();
    const interval = setInterval(loadActiveUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadActiveUsers = async () => {
    const count = await getActiveUsers();
    setActiveUsers(count);
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, dateRange);

      const [summary, visitors, traffic] = await Promise.all([
        getAnalyticsSummary(startDate, endDate),
        getRecentVisitors(100),
        getTrafficChartData(dateRange),
      ]);

      setAnalytics(summary);
      setRecentVisitors(visitors);
      setChartData(traffic);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Traffic trend chart
  const trafficChartConfig = chartData
    ? {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Page Views',
            data: chartData.pageViews,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Unique Visitors',
            data: chartData.uniqueVisitors,
            borderColor: 'rgb(168, 85, 247)',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      }
    : null;

  // Device breakdown chart
  const deviceChartConfig = analytics
    ? {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [
          {
            data: [
              analytics.deviceBreakdown.desktop,
              analytics.deviceBreakdown.mobile,
              analytics.deviceBreakdown.tablet,
            ],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(168, 85, 247, 0.8)',
              'rgba(234, 179, 8, 0.8)',
            ],
            borderWidth: 0,
          },
        ],
      }
    : null;

  if (loading && !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Traffic Analytics</h1>
        <p className="text-gray-600">Real-time website traffic and visitor insights</p>
      </div>

      {/* Date Range Selector */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setDateRange(7)}
          className={`px-4 py-2 rounded-lg ${
            dateRange === 7 ? 'bg-black text-white' : 'bg-gray-100'
          }`}
        >
          Last 7 Days
        </button>
        <button
          onClick={() => setDateRange(30)}
          className={`px-4 py-2 rounded-lg ${
            dateRange === 30 ? 'bg-black text-white' : 'bg-gray-100'
          }`}
        >
          Last 30 Days
        </button>
        <button
          onClick={() => setDateRange(90)}
          className={`px-4 py-2 rounded-lg ${
            dateRange === 90 ? 'bg-black text-white' : 'bg-gray-100'
          }`}
        >
          Last 90 Days
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Active Users */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8" />
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Live
            </span>
          </div>
          <p className="text-sm opacity-90 mb-1">Active Now</p>
          <p className="text-4xl font-bold">{activeUsers}</p>
        </div>

        {/* Total Visitors */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
          <Users className="w-8 h-8 mb-4" />
          <p className="text-sm opacity-90 mb-1">Total Visitors</p>
          <p className="text-4xl font-bold">{analytics?.totalVisitors || 0}</p>
        </div>

        {/* Page Views */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <Eye className="w-8 h-8 mb-4" />
          <p className="text-sm opacity-90 mb-1">Page Views</p>
          <p className="text-4xl font-bold">{analytics?.totalPageViews || 0}</p>
        </div>

        {/* Sessions */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <Clock className="w-8 h-8 mb-4" />
          <p className="text-sm opacity-90 mb-1">Total Sessions</p>
          <p className="text-4xl font-bold">{analytics?.totalSessions || 0}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Traffic Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Traffic Trend</h3>
          {trafficChartConfig && <Line data={trafficChartConfig} options={{ maintainAspectRatio: true }} />}
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
          {deviceChartConfig && <Pie data={deviceChartConfig} />}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Monitor className="w-4 h-4" /> Desktop
              </span>
              <span className="font-medium">{analytics?.deviceBreakdown.desktop || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> Mobile
              </span>
              <span className="font-medium">{analytics?.deviceBreakdown.mobile || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Tablet className="w-4 h-4" /> Tablet
              </span>
              <span className="font-medium">{analytics?.deviceBreakdown.tablet || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Pages */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
          <div className="space-y-3">
            {analytics?.topPages?.slice(0, 10).map((page: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{page.path}</p>
                  <p className="text-xs text-gray-500">{page.unique_visitors} unique visitors</p>
                </div>
                <span className="ml-2 text-sm font-semibold">{page.views} views</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Top Referrers</h3>
          <div className="space-y-3">
            {analytics?.topReferrers?.slice(0, 10).map((ref: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate flex items-center gap-2">
                    {ref.referrer !== 'Direct' && <ExternalLink className="w-3 h-3" />}
                    {ref.referrer}
                  </p>
                  <p className="text-xs text-gray-500">{ref.unique_visitors} unique visitors</p>
                </div>
                <span className="ml-2 text-sm font-semibold">{ref.visits} visits</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Visitors */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Visitors</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left text-sm text-gray-600">
                <th className="pb-3">Time</th>
                <th className="pb-3">Page</th>
                <th className="pb-3">IP Address</th>
                <th className="pb-3">Referrer</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentVisitors.slice(0, 20).map((visitor) => (
                <tr key={visitor.id} className="border-b last:border-0">
                  <td className="py-3">
                    {new Date(visitor.ts).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 font-mono text-xs">{visitor.path}</td>
                  <td className="py-3 font-mono text-xs">{visitor.ip}</td>
                  <td className="py-3 text-xs text-gray-600 truncate max-w-xs">
                    {visitor.ref || 'Direct'}
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

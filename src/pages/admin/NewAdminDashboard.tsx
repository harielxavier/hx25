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
  Users, Eye, Clock, TrendingUp, Globe, Smartphone, MapPin,
  Calendar, DollarSign, Mail, Phone, Star, Target
} from 'lucide-react';
import { getAnalyticsSummary, getRecentVisitors, VisitorData } from '../../services/analyticsService';
import AIChatbot from '../../components/admin/AIChatbot';
import { format, subDays } from 'date-fns';

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

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

export default function NewAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentVisitors, setRecentVisitors] = useState<VisitorData[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const endDate = new Date();
      const startDate = subDays(endDate, days);

      const [summary, visitors] = await Promise.all([
        getAnalyticsSummary(startDate, endDate),
        getRecentVisitors(50),
      ]);

      setAnalytics(summary);
      setRecentVisitors(visitors);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Stats cards data
  const stats: StatCard[] = [
    {
      title: 'Total Visitors',
      value: analytics?.totalVisitors || 0,
      change: '+12.5%',
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Page Views',
      value: analytics?.totalPageViews || 0,
      change: '+8.2%',
      trend: 'up',
      icon: <Eye className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Avg. Session',
      value: formatDuration(analytics?.avgSessionDuration || 0),
      change: '+2.3%',
      trend: 'up',
      icon: <Clock className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Bounce Rate',
      value: `${(analytics?.bounceRate || 0).toFixed(1)}%`,
      change: '-3.1%',
      trend: 'down',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
    },
  ];

  // Chart data for traffic over time
  const trafficChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Visitors',
        data: [65, 78, 90, 81, 96, 55, 72],
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: 'rgb(99, 102, 241)',
        tension: 0.4,
      },
      {
        label: 'Page Views',
        data: [120, 145, 167, 150, 178, 102, 134],
        fill: true,
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        borderColor: 'rgb(236, 72, 153)',
        tension: 0.4,
      },
    ],
  };

  // Device breakdown
  const deviceData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [
          analytics?.deviceBreakdown.desktop || 0,
          analytics?.deviceBreakdown.mobile || 0,
          analytics?.deviceBreakdown.tablet || 0,
        ],
        backgroundColor: ['#6366f1', '#ec4899', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  // Top pages data
  const topPagesData = {
    labels: analytics?.topPages.slice(0, 5).map((p: any) => p.path) || [],
    datasets: [
      {
        label: 'Views',
        data: analytics?.topPages.slice(0, 5).map((p: any) => p.views) || [],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Real-time insights for Hariel Xavier Photography</p>
          </div>
          
          {/* Date Range Selector */}
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-md">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-md transition-all ${
                  dateRange === range
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl text-white`}>
                {stat.icon}
              </div>
              <span
                className={`text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Traffic Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Traffic Overview</h3>
          <Line
            data={trafficChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Top Pages</h3>
          <Bar
            data={topPagesData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      </div>

      {/* Device & Location Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Device Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Device Breakdown
          </h3>
          <Pie
            data={deviceData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
              },
            }}
          />
        </div>

        {/* Top Locations */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Top Locations
          </h3>
          <div className="space-y-3">
            {analytics?.topLocations.slice(0, 5).map((location: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{location.city}</p>
                    <p className="text-sm text-gray-500">{location.country}</p>
                  </div>
                </div>
                <span className="font-bold text-purple-600">{location.count} visitors</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Visitors Table */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Recent Visitors
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">IP Address</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Location</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Device</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Pages Visited</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Duration</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentVisitors.slice(0, 10).map((visitor, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-mono text-gray-900">{visitor.ipAddress}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {visitor.location.city}, {visitor.location.country}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      visitor.device.type === 'desktop' ? 'bg-blue-100 text-blue-700' :
                      visitor.device.type === 'mobile' ? 'bg-pink-100 text-pink-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {visitor.device.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{visitor.pages?.length || 0} pages</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatDuration(visitor.totalDuration || 0)}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {format(visitor.sessionStart, 'MMM d, h:mm a')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Chatbot */}
      <AIChatbot analyticsData={analytics} />
    </div>
  );
}

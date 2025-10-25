/**
 * COMPREHENSIVE ANALYTICS DASHBOARD
 * 
 * ALL your website traffic in ONE place!
 * - Real-time visitors
 * - Session duration
 * - Page views
 * - Traffic sources
 * - Device breakdown
 * - Geographic data
 * - Top pages
 * - Everything you need!
 */

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Users,
  Eye,
  Clock,
  FileText,
  TrendingUp,
  Globe,
  Smartphone,
  MapPin,
  BarChart3,
  Activity,
  RefreshCw
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardStats {
  liveUsers: number;
  todayVisitors: number;
  todayPageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
}

interface TopPage {
  page_path: string;
  views: number;
  avg_time_seconds: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

export default function ComprehensiveAnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    liveUsers: 0,
    todayVisitors: 0,
    todayPageViews: 0,
    avgSessionDuration: 0,
    bounceRate: 0
  });

  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [trafficOverTime, setTrafficOverTime] = useState<any>({ labels: [], datasets: [] });
  const [recentVisitors, setRecentVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchAllAnalytics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAllAnalytics();
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchRealtimeStats(),
        fetchTopPages(),
        fetchTrafficSources(),
        fetchDeviceBreakdown(),
        fetchTrafficOverTime(),
        fetchRecentVisitors()
      ]);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimeStats = async () => {
    try {
      // Live users (last 5 minutes)
      const { data: liveData } = await supabase
        .from('analytics_page_views')
        .select('session_id')
        .gte('viewed_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());

      const liveUsers = new Set(liveData?.map(v => v.session_id)).size;

      // Today's stats
      const todayStart = startOfDay(new Date()).toISOString();
      
      const { data: sessions } = await supabase
        .from('analytics_sessions')
        .select('*')
        .gte('started_at', todayStart);

      const todayVisitors = sessions?.length || 0;
      
      const { data: pageViews } = await supabase
        .from('analytics_page_views')
        .select('*')
        .gte('viewed_at', todayStart);

      const todayPageViews = pageViews?.length || 0;

      const avgDuration = sessions && sessions.length > 0
        ? sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / sessions.length
        : 0;

      const bounces = sessions?.filter(s => s.is_bounce).length || 0;
      const bounceRate = sessions && sessions.length > 0 ? (bounces / sessions.length) * 100 : 0;

      setStats({
        liveUsers,
        todayVisitors,
        todayPageViews,
        avgSessionDuration: Math.round(avgDuration),
        bounceRate: Math.round(bounceRate)
      });
    } catch (error) {
      console.error('Error fetching realtime stats:', error);
    }
  };

  const fetchTopPages = async () => {
    try {
      const todayStart = startOfDay(new Date()).toISOString();
      
      const { data } = await supabase
        .from('analytics_page_views')
        .select('page_path, time_on_page_seconds')
        .gte('viewed_at', todayStart);

      if (data) {
        const pageMap = new Map<string, { views: number; totalTime: number }>();
        
        data.forEach(view => {
          const existing = pageMap.get(view.page_path) || { views: 0, totalTime: 0 };
          pageMap.set(view.page_path, {
            views: existing.views + 1,
            totalTime: existing.totalTime + (view.time_on_page_seconds || 0)
          });
        });

        const pages = Array.from(pageMap.entries())
          .map(([path, stats]) => ({
            page_path: path,
            views: stats.views,
            avg_time_seconds: stats.views > 0 ? Math.round(stats.totalTime / stats.views) : 0
          }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 10);

        setTopPages(pages);
      }
    } catch (error) {
      console.error('Error fetching top pages:', error);
    }
  };

  const fetchTrafficSources = async () => {
    try {
      const todayStart = startOfDay(new Date()).toISOString();
      
      const { data } = await supabase
        .from('analytics_sessions')
        .select('utm_source, referrer')
        .gte('started_at', todayStart);

      if (data) {
        const sourceMap = new Map<string, number>();
        
        data.forEach(session => {
          const source = session.utm_source || (session.referrer?.includes('google') ? 'Google' : 'Direct');
          sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
        });

        const total = data.length;
        const sources = Array.from(sourceMap.entries())
          .map(([source, count]) => ({
            source,
            visitors: count,
            percentage: Math.round((count / total) * 100)
          }))
          .sort((a, b) => b.visitors - a.visitors);

        setTrafficSources(sources);
      }
    } catch (error) {
      console.error('Error fetching traffic sources:', error);
    }
  };

  const fetchDeviceBreakdown = async () => {
    try {
      const todayStart = startOfDay(new Date()).toISOString();
      
      const { data } = await supabase
        .from('analytics_sessions')
        .select('device_type')
        .gte('started_at', todayStart);

      if (data) {
        const deviceMap = new Map<string, number>();
        data.forEach(session => {
          const device = session.device_type || 'Unknown';
          deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
        });

        const devices = Array.from(deviceMap.entries()).map(([name, value]) => ({ name, value }));
        setDeviceData(devices);
      }
    } catch (error) {
      console.error('Error fetching device breakdown:', error);
    }
  };

  const fetchTrafficOverTime = async () => {
    try {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
          date,
          label: format(date, 'MMM dd'),
          start: startOfDay(date).toISOString(),
          end: endOfDay(date).toISOString()
        };
      });

      const dailyData = await Promise.all(
        last7Days.map(async day => {
          const { data } = await supabase
            .from('analytics_sessions')
            .select('id')
            .gte('started_at', day.start)
            .lte('started_at', day.end);

          return data?.length || 0;
        })
      );

      setTrafficOverTime({
        labels: last7Days.map(d => d.label),
        datasets: [
          {
            label: 'Visitors',
            data: dailyData,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching traffic over time:', error);
    }
  };

  const fetchRecentVisitors = async () => {
    try {
      const { data } = await supabase
        .from('analytics_page_views')
        .select(`
          session_id,
          page_path,
          viewed_at,
          time_on_page_seconds,
          analytics_sessions (
            city,
            country,
            device_type
          )
        `)
        .order('viewed_at', { ascending: false })
        .limit(10);

      setRecentVisitors(data || []);
    } catch (error) {
      console.error('Error fetching recent visitors:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading && topPages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">All your website traffic in one place</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Last updated: {format(lastUpdate, 'h:mm:ss a')}
          </span>
          <button
            onClick={() => fetchAllAnalytics()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Real-Time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 opacity-80" />
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs">LIVE</span>
          </div>
          <div className="text-3xl font-bold">{stats.liveUsers}</div>
          <div className="text-green-100 text-sm">Active Now</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <Users className="w-8 h-8 opacity-80 mb-2" />
          <div className="text-3xl font-bold">{stats.todayVisitors}</div>
          <div className="text-blue-100 text-sm">Visitors Today</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <Eye className="w-8 h-8 opacity-80 mb-2" />
          <div className="text-3xl font-bold">{stats.todayPageViews}</div>
          <div className="text-purple-100 text-sm">Page Views</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <Clock className="w-8 h-8 opacity-80 mb-2" />
          <div className="text-3xl font-bold">{formatDuration(stats.avgSessionDuration)}</div>
          <div className="text-orange-100 text-sm">Avg. Session</div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl shadow-lg">
          <TrendingUp className="w-8 h-8 opacity-80 mb-2" />
          <div className="text-3xl font-bold">{stats.bounceRate}%</div>
          <div className="text-pink-100 text-sm">Bounce Rate</div>
        </div>
      </div>

      {/* Traffic Over Time */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Traffic Last 7 Days
        </h2>
        <div className="h-80">
          <Line
            data={trafficOverTime}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: { beginAtZero: true }
              }
            }}
          />
        </div>
      </div>

      {/* Grid: Top Pages, Traffic Sources, Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Top Pages
          </h3>
          <div className="space-y-3">
            {topPages.slice(0, 8).map((page, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex-1 truncate">
                  <div className="font-medium text-gray-900 truncate">{page.page_path}</div>
                  <div className="text-gray-500 text-xs">
                    {formatDuration(page.avg_time_seconds)} avg
                  </div>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold ml-3">
                  {page.views}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Traffic Sources
          </h3>
          <div className="h-64">
            <Doughnut
              data={{
                labels: trafficSources.map(s => s.source),
                datasets: [{
                  data: trafficSources.map(s => s.visitors),
                  backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                    '#ec4899'
                  ]
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Devices */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Device Breakdown
          </h3>
          <div className="h-64">
            <Pie
              data={{
                labels: deviceData.map(d => d.name),
                datasets: [{
                  data: deviceData.map(d => d.value),
                  backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Visitors */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Recent Visitor Activity (Real-Time)
        </h3>
        <div className="space-y-2">
          {recentVisitors.length > 0 ? (
            recentVisitors.map((visitor, index) => (
              <div key={index} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {visitor.analytics_sessions?.city || 'Unknown'}, {visitor.analytics_sessions?.country || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {visitor.page_path} • {visitor.analytics_sessions?.device_type || 'desktop'}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {format(new Date(visitor.viewed_at), 'h:mm a')}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent activity. Tracking will start once visitors arrive!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


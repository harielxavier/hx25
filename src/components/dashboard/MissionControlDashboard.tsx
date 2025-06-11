/**
 * Mission Control Dashboard
 * 
 * Like Mission Control at Cape Canaveral - every blink of light tells a story.
 * Transforms 20 high-impact signals into actionable business intelligence.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Globe,
  Clock,
  TrendingUp,
  AlertTriangle,
  Eye,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  Zap,
  Target,
  Activity,
  MapPin,
  BarChart3,
  PieChart,
  LineChart,
  Gauge,
  Bell,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { missionControl, VisitorSignal, LiveMetrics } from '../../services/MissionControlAnalytics';
import CalendarDashboard from './CalendarDashboard';

// Real-time metrics hook
const useRealtimeMetrics = () => {
  const [metrics, setMetrics] = useState<LiveMetrics>({
    totalLiveUsers: 0,
    conversionRate: 0,
    averageLoadTime: 0,
    topCountries: [],
    topPages: [],
    realtimeEvents: []
  });

  const [currentSession, setCurrentSession] = useState<VisitorSignal | null>(null);

  useEffect(() => {
    // Get current session data
    setCurrentSession(missionControl.getCurrentSession());

    // Simulate real-time updates (in production, this would be WebSocket data)
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalLiveUsers: Math.floor(Math.random() * 50) + 10,
        conversionRate: Math.random() * 15 + 2,
        averageLoadTime: Math.random() * 2000 + 500,
        topCountries: [
          { country: 'United States', sessions: 245, revenue: 12500 },
          { country: 'Canada', sessions: 89, revenue: 4200 },
          { country: 'United Kingdom', sessions: 67, revenue: 3100 },
          { country: 'Australia', sessions: 34, revenue: 1800 }
        ],
        topPages: [
          { page: '/pricing', views: 156, avgTime: 180 },
          { page: '/', views: 134, avgTime: 95 },
          { page: '/showcase', views: 89, avgTime: 240 },
          { page: '/about', views: 67, avgTime: 120 }
        ]
      }));

      setCurrentSession(missionControl.getCurrentSession());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { metrics, currentSession };
};

// Hero KPI Cards
const HeroKPICard = ({ 
  title, 
  value, 
  unit = '', 
  trend, 
  icon: Icon, 
  color = 'blue',
  pulse = false 
}: {
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: any;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  pulse?: boolean;
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  const trendIcons = {
    up: <ArrowUp className="w-4 h-4 text-green-500" />,
    down: <ArrowDown className="w-4 h-4 text-red-500" />,
    neutral: <Minus className="w-4 h-4 text-gray-500" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg border-2 ${colorClasses[color]} ${pulse ? 'animate-pulse' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8" />
        {trend && trendIcons[trend]}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-3xl font-bold">
          {value}
          <span className="text-lg font-normal ml-1">{unit}</span>
        </p>
      </div>
    </motion.div>
  );
};

// Conversion Rate Gauge
const ConversionGauge = ({ rate }: { rate: number }) => {
  const getColor = (rate: number) => {
    if (rate >= 10) return 'text-green-500';
    if (rate >= 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (rate / 15) * circumference;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-1000 ${getColor(rate)}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-2xl font-bold ${getColor(rate)}`}>
            {rate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">CVR</div>
        </div>
      </div>
    </div>
  );
};

// World Map Component (simplified)
const WorldMap = ({ countries }: { countries: Array<{country: string, sessions: number, revenue: number}> }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 h-64 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Globe className="w-16 h-16 text-gray-400 mx-auto" />
        <div className="space-y-2">
          {countries.slice(0, 3).map((country, index) => (
            <div key={country.country} className="flex items-center justify-between text-sm">
              <span className="font-medium">{country.country}</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{country.sessions} sessions</span>
                <span className="text-green-600 font-medium">${country.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Engagement Heat Tabs
const EngagementHeatTabs = ({ session }: { session: VisitorSignal | null }) => {
  const [activeTab, setActiveTab] = useState('scroll');

  const tabs = [
    { id: 'scroll', label: 'Scroll Depth', icon: Activity },
    { id: 'clicks', label: 'Click Heatmap', icon: MousePointer },
    { id: 'exits', label: 'Exit Pages', icon: Eye }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-6">
        {activeTab === 'scroll' && (
          <div className="space-y-4">
            <h3 className="font-medium">Scroll Depth Distribution</h3>
            <div className="space-y-2">
              {[25, 50, 75, 100].map((depth) => (
                <div key={depth} className="flex items-center space-x-3">
                  <span className="text-sm w-8">{depth}%</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.random() * 80 + 20}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{Math.floor(Math.random() * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'clicks' && (
          <div className="text-center py-8">
            <MousePointer className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Click heatmap visualization</p>
            <p className="text-sm text-gray-500 mt-2">
              {session?.clickHeatmapPoints?.length || 0} clicks recorded this session
            </p>
          </div>
        )}
        
        {activeTab === 'exits' && (
          <div className="space-y-3">
            <h3 className="font-medium">Top Exit Pages</h3>
            {[
              { page: '/pricing', exits: 23, rate: '12%' },
              { page: '/contact', exits: 18, rate: '8%' },
              { page: '/showcase', exits: 15, rate: '6%' }
            ].map((page) => (
              <div key={page.page} className="flex items-center justify-between py-2">
                <span className="font-medium">{page.page}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{page.exits} exits</span>
                  <span className="text-sm text-red-600">{page.rate}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Performance Watchtower
const PerformanceWatchtower = ({ session }: { session: VisitorSignal | null }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-medium mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5" />
          <span>Load Time by Device</span>
        </h3>
        <div className="space-y-3">
          {[
            { device: 'Desktop', time: 1200, icon: Monitor },
            { device: 'Mobile', time: 1800, icon: Smartphone },
            { device: 'Tablet', time: 1500, icon: Tablet }
          ].map((item) => (
            <div key={item.device} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <item.icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{item.device}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(item.time / 3000) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{item.time}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-medium mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <span>JavaScript Errors</span>
        </h3>
        <div className="space-y-2">
          {session?.jsErrors?.slice(0, 3).map((error, index) => (
            <div key={index} className="text-sm">
              <div className="font-medium text-red-600 truncate">{error.message}</div>
              <div className="text-gray-500 text-xs">
                {new Date(error.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )) || (
            <div className="text-center py-4">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No errors detected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Alert & Recommendation Sidebar
const AlertSidebar = ({ session }: { session: VisitorSignal | null }) => {
  const alerts = [
    {
      type: 'warning',
      message: 'Bounce rate up 7% on iOS Safari after latest deploy',
      action: 'View Fix',
      priority: 'high'
    },
    {
      type: 'info',
      message: 'High engagement detected on pricing page',
      action: 'Analyze',
      priority: 'medium'
    },
    {
      type: 'success',
      message: 'Conversion rate improved 12% this week',
      action: 'View Report',
      priority: 'low'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center space-x-2">
        <Bell className="w-5 h-5" />
        <span>Alerts & Recommendations</span>
      </h3>
      
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-start space-x-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                <div className="mt-2 flex space-x-2">
                  <button className="text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800">
                    {alert.action}
                  </button>
                  <button className="text-xs text-gray-500 hover:text-gray-700">
                    Ignore
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function MissionControlDashboard() {
  const { metrics, currentSession } = useRealtimeMetrics();
  const [activeTab, setActiveTab] = useState('analytics');

  const tabs = [
    { id: 'analytics', label: 'Website Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar Analytics', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Mission Control</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every blink of light tells a story. Transform visitor signals into actionable business intelligence.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'calendar' ? (
          <CalendarDashboard />
        ) : (
          <>
            {/* Hero KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <HeroKPICard
            title="Live Users"
            value={metrics.totalLiveUsers}
            icon={Users}
            color="blue"
            pulse={metrics.totalLiveUsers > 0}
            trend="up"
          />
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-4">Conversion Rate</p>
              <ConversionGauge rate={metrics.conversionRate} />
            </div>
          </div>
          <HeroKPICard
            title="Avg Load Time"
            value={Math.round(metrics.averageLoadTime)}
            unit="ms"
            icon={Clock}
            color={metrics.averageLoadTime > 2000 ? 'red' : metrics.averageLoadTime > 1000 ? 'yellow' : 'green'}
            trend={metrics.averageLoadTime > 2000 ? 'down' : 'up'}
          />
          <HeroKPICard
            title="Engagement Score"
            value={currentSession?.engagementScore || 0}
            unit="/100"
            icon={Target}
            color="purple"
            trend="up"
          />
        </div>

        {/* Geo-Insight Panel */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <Globe className="w-6 h-6" />
            <span>Geographic Intelligence</span>
          </h2>
          <WorldMap countries={metrics.topCountries} />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Engagement & Behavior */}
          <div className="lg:col-span-2 space-y-6">
            <EngagementHeatTabs session={currentSession} />
            <PerformanceWatchtower session={currentSession} />
          </div>

          {/* Right Column - Alerts & Session Info */}
          <div className="space-y-6">
            <AlertSidebar session={currentSession} />
            
            {/* Current Session Info */}
            {currentSession && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-medium mb-4">Current Session</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Device:</span>
                    <span className="font-medium">{currentSession.deviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{currentSession.city}, {currentSession.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pages:</span>
                    <span className="font-medium">{currentSession.pagesPerSession}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scroll:</span>
                    <span className="font-medium">{currentSession.scrollDepthPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Source:</span>
                    <span className="font-medium truncate">{currentSession.referrerSource || 'Direct'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
}

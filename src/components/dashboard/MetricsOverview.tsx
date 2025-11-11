import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Calendar, Camera, Mail, Eye, MousePointer } from 'lucide-react';
// REMOVED FIREBASE: import { db } from '../../firebase/config';
// REMOVED FIREBASE: import { collection, getDocs, query, where, orderBy, Timestamp // REMOVED FIREBASE

interface MetricsData {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  projects: {
    active: number;
    completed: number;
    total: number;
  };
  leads: {
    total: number;
    converted: number;
    conversion_rate: number;
  };
  website: {
    visitors: number;
    page_views: number;
    bounce_rate: number;
  };
}

export default function MetricsOverview() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    loadMetrics();
  }, [timeframe]);

  async function loadMetrics() {
    try {
      setLoading(true);
      
      // For now, use mock data since we're migrating from Supabase
      const mockMetrics: MetricsData = {
        revenue: {
          current: 15750,
          previous: 12300,
          change: 28.0
        },
        projects: {
          active: 8,
          completed: 12,
          total: 20
        },
        leads: {
          total: 45,
          converted: 18,
          conversion_rate: 40.0
        },
        website: {
          visitors: 1250,
          page_views: 3200,
          bounce_rate: 35.2
        }
      };

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  function formatPercentage(value: number) {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  }

  if (loading) {
    return <div className="animate-pulse bg-gray-100 h-96 rounded-lg" />;
  }

  if (!metrics) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light">Business Overview</h2>
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

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className={`text-sm font-medium ${
              metrics.revenue.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPercentage(metrics.revenue.change)}
            </span>
          </div>
          <div>
            <p className="text-2xl font-light mb-1">{formatCurrency(metrics.revenue.current)}</p>
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-xs text-gray-400 mt-1">
              vs {formatCurrency(metrics.revenue.previous)} last period
            </p>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Camera className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">
              {metrics.projects.total} total
            </span>
          </div>
          <div>
            <p className="text-2xl font-light mb-1">{metrics.projects.active}</p>
            <p className="text-sm text-gray-500">Active Projects</p>
            <p className="text-xs text-gray-400 mt-1">
              {metrics.projects.completed} completed
            </p>
          </div>
        </div>

        {/* Lead Conversion */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-600">
              {metrics.leads.conversion_rate.toFixed(1)}%
            </span>
          </div>
          <div>
            <p className="text-2xl font-light mb-1">{metrics.leads.converted}</p>
            <p className="text-sm text-gray-500">Converted Leads</p>
            <p className="text-xs text-gray-400 mt-1">
              of {metrics.leads.total} total leads
            </p>
          </div>
        </div>

        {/* Website Traffic */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">
              {metrics.website.bounce_rate.toFixed(1)}% bounce
            </span>
          </div>
          <div>
            <p className="text-2xl font-light mb-1">{metrics.website.visitors}</p>
            <p className="text-sm text-gray-500">Visitors</p>
            <p className="text-xs text-gray-400 mt-1">
              {metrics.website.page_views} page views
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="font-medium">Growth Rate</h3>
          </div>
          <p className="text-xl font-light text-green-600">+{metrics.revenue.change.toFixed(1)}%</p>
          <p className="text-sm text-gray-500">Month over month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">Booking Rate</h3>
          </div>
          <p className="text-xl font-light text-blue-600">{metrics.leads.conversion_rate.toFixed(1)}%</p>
          <p className="text-sm text-gray-500">Lead to booking</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <MousePointer className="w-5 h-5 text-purple-500" />
            <h3 className="font-medium">Engagement</h3>
          </div>
          <p className="text-xl font-light text-purple-600">{(100 - metrics.website.bounce_rate).toFixed(1)}%</p>
          <p className="text-sm text-gray-500">Site engagement</p>
        </div>
      </div>
    </div>
  );
}

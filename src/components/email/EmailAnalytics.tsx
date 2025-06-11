import React, { useState, useEffect } from 'react';
import { Mail, Eye, MousePointerClick, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { EmailLog, getEmailLogs } from '../../lib/email';

interface EmailMetrics {
  total_sent: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  trends: {
    sent: number;
    opens: number;
    clicks: number;
  };
}

export default function EmailAnalytics() {
  const [metrics, setMetrics] = useState<EmailMetrics>({
    total_sent: 0,
    open_rate: 0,
    click_rate: 0,
    bounce_rate: 0,
    trends: {
      sent: 0,
      opens: 0,
      clicks:  0
    }
  });
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d'); // 7d, 30d, 90d

  useEffect(() => {
    loadEmailMetrics();
  }, [timeframe]);

  async function loadEmailMetrics() {
    try {
      setLoading(true);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeframe));

      const logs = await getEmailLogs({
        start_date: startDate.toISOString()
      });

      // Calculate metrics
      const total = logs.length;
      const opens = logs.filter(log => log.status === 'opened').length;
      const clicks = logs.filter(log => log.status === 'clicked').length;
      const bounces = logs.filter(log => log.status === 'bounced').length;

      setMetrics({
        total_sent: total,
        open_rate: total ? (opens / total) * 100 : 0,
        click_rate: total ? (clicks / total) * 100 : 0,
        bounce_rate: total ? (bounces / total) * 100 : 0,
        trends: {
          sent: 15, // Mock trend data
          opens: 8,
          clicks: 5
        }
      });

      setLogs(logs);
    } catch (error) {
      console.error('Error loading email metrics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="animate-pulse bg-gray-100 h-96 rounded-lg" />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Email Analytics</h3>
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

        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Mail className="w-4 h-4" />
              <span>Emails Sent</span>
            </div>
            <p className="text-2xl font-light">{metrics.total_sent}</p>
            <div className="flex items-center gap-1 mt-1 text-sm text-green-500">
              <ArrowUp className="w-4 h-4" />
              <span>{metrics.trends.sent}% from last period</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Eye className="w-4 h-4" />
              <span>Open Rate</span>
            </div>
            <p className="text-2xl font-light">{metrics.open_rate.toFixed(1)}%</p>
            <div className="flex items-center gap-1 mt-1 text-sm text-green-500">
              <ArrowUp className="w-4 h-4" />
              <span>{metrics.trends.opens}% from last period</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <MousePointerClick className="w-4 h-4" />
              <span>Click Rate</span>
            </div>
            <p className="text-2xl font-light">{metrics.click_rate.toFixed(1)}%</p>
            <div className="flex items-center gap-1 mt-1 text-sm text-green-500">
              <ArrowUp className="w-4 h-4" />
              <span>{metrics.trends.clicks}% from last period</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <AlertCircle className="w-4 h-4" />
              <span>Bounce Rate</span>
            </div>
            <p className="text-2xl font-light">{metrics.bounce_rate.toFixed(1)}%</p>
            <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
              <ArrowDown className="w-4 h-4" />
              <span>2% from last period</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h4 className="text-sm font-medium text-gray-500 mb-4">Recent Activity</h4>
        <div className="space-y-4">
          {logs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{log.subject}</p>
                <p className="text-sm text-gray-500">{log.recipient_email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium capitalize">{log.status}</p>
                <p className="text-xs text-gray-500">
                  {new Date(log.sent_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
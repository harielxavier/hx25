import { supabase } from '../lib/supabase';

export interface WebHit {
  id: number;
  ts: string;
  ip: string;
  ua: string;
  path: string;
  ref: string;
  session_id: string;
  created_at: string;
}

export interface DailyStats {
  date: string;
  unique_visitors: number;
  page_views: number;
  sessions: number;
}

export interface TopPage {
  path: string;
  views: number;
  unique_visitors: number;
  sessions: number;
}

export interface TopReferrer {
  referrer: string;
  visits: number;
  unique_visitors: number;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  totalPageViews: number;
  totalSessions: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: TopPage[];
  topReferrers: TopReferrer[];
  dailyStats: DailyStats[];
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

/**
 * Get analytics summary for a date range
 */
export async function getAnalyticsSummary(
  startDate: Date,
  endDate: Date
): Promise<AnalyticsSummary> {
  try {
    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();

    // Get all hits in date range
    const { data: hits, error: hitsError } = await supabase
      .from('web_hits')
      .select('*')
      .gte('ts', startISO)
      .lte('ts', endISO);

    if (hitsError) throw hitsError;

    // Get daily stats
    const { data: dailyStats, error: dailyError } = await supabase
      .from('analytics_daily')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (dailyError) throw dailyError;

    // Get top pages
    const { data: topPages, error: pagesError } = await supabase
      .from('analytics_top_pages')
      .select('*')
      .limit(10);

    if (pagesError) throw pagesError;

    // Get top referrers
    const { data: topReferrers, error: referrersError } = await supabase
      .from('analytics_top_referrers')
      .select('*')
      .limit(10);

    if (referrersError) throw referrersError;

    // Calculate metrics from hits
    const uniqueIPs = new Set((hits || []).map(h => h.ip));
    const uniqueSessions = new Set((hits || []).map(h => h.session_id));

    // Detect device types from user agents
    const deviceBreakdown = {
      desktop: 0,
      mobile: 0,
      tablet: 0,
    };

    (hits || []).forEach(hit => {
      const ua = hit.ua || '';
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        deviceBreakdown.tablet++;
      } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle/.test(ua)) {
        deviceBreakdown.mobile++;
      } else {
        deviceBreakdown.desktop++;
      }
    });

    return {
      totalVisitors: uniqueIPs.size,
      totalPageViews: hits?.length || 0,
      totalSessions: uniqueSessions.size,
      avgSessionDuration: 0, // TODO: Calculate from session data
      bounceRate: 0, // TODO: Calculate bounce rate
      topPages: topPages || [],
      topReferrers: topReferrers || [],
      dailyStats: dailyStats || [],
      deviceBreakdown,
    };
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return {
      totalVisitors: 0,
      totalPageViews: 0,
      totalSessions: 0,
      avgSessionDuration: 0,
      bounceRate: 0,
      topPages: [],
      topReferrers: [],
      dailyStats: [],
      deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
    };
  }
}

/**
 * Get recent visitors
 */
export async function getRecentVisitors(limit: number = 50): Promise<WebHit[]> {
  try {
    const { data, error } = await supabase
      .from('web_hits')
      .select('*')
      .order('ts', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent visitors:', error);
    return [];
  }
}

/**
 * Get traffic data for charts (last N days)
 */
export async function getTrafficChartData(days: number = 30) {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics_daily')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) throw error;

    return {
      labels: (data || []).map(d => d.date),
      uniqueVisitors: (data || []).map(d => d.unique_visitors),
      pageViews: (data || []).map(d => d.page_views),
      sessions: (data || []).map(d => d.sessions),
    };
  } catch (error) {
    console.error('Error fetching traffic chart data:', error);
    return {
      labels: [],
      uniqueVisitors: [],
      pageViews: [],
      sessions: [],
    };
  }
}

/**
 * Get real-time active users (last 5 minutes)
 */
export async function getActiveUsers(): Promise<number> {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('web_hits')
      .select('ip')
      .gte('ts', fiveMinutesAgo);

    if (error) throw error;

    const uniqueIPs = new Set((data || []).map(d => d.ip));
    return uniqueIPs.size;
  } catch (error) {
    console.error('Error fetching active users:', error);
    return 0;
  }
}

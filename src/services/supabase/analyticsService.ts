import { supabase } from '../../lib/supabase';

export interface VisitorData {
  id: string;
  visitor_id: string;
  page_url: string;
  referrer?: string;
  device?: string;
  browser?: string;
  country?: string;
  city?: string;
  duration?: number;
  timestamp: string;
}

export const analyticsService = {
  /**
   * Track a page visit
   */
  async trackVisit(data: Omit<VisitorData, 'id' | 'timestamp'>): Promise<void> {
    const { error } = await supabase
      .from('visitors')
      .insert([{
        ...data,
        timestamp: new Date().toISOString(),
      }]);

    if (error) {
      console.error('Error tracking visit:', error);
      // Don't throw - analytics shouldn't break the app
    }
  },

  /**
   * Get visitor analytics for a date range
   */
  async getAnalyticsSummary(startDate: Date, endDate: Date) {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())
      .order('timestamp', { ascending: false });

    if (error) throw error;

    // Calculate metrics
    const totalVisitors = new Set(data.map(v => v.visitor_id)).size;
    const totalPageViews = data.length;
    const avgDuration = data.reduce((sum, v) => sum + (v.duration || 0), 0) / data.length;

    // Get top pages
    const pageViews: { [key: string]: number } = {};
    data.forEach(v => {
      pageViews[v.page_url] = (pageViews[v.page_url] || 0) + 1;
    });

    const topPages = Object.entries(pageViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([url, views]) => ({ url, views }));

    // Get device breakdown
    const deviceBreakdown: { [key: string]: number } = {};
    data.forEach(v => {
      const device = v.device || 'Unknown';
      deviceBreakdown[device] = (deviceBreakdown[device] || 0) + 1;
    });

    // Get location data
    const locationData: { [key: string]: number } = {};
    data.forEach(v => {
      const location = v.country || 'Unknown';
      locationData[location] = (locationData[location] || 0) + 1;
    });

    return {
      totalVisitors,
      totalPageViews,
      avgDuration: Math.round(avgDuration),
      topPages,
      deviceBreakdown,
      locationData,
      rawData: data,
    };
  },

  /**
   * Get recent visitors
   */
  async getRecentVisitors(limit: number = 50): Promise<VisitorData[]> {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get unique visitors count for today
   */
  async getTodayVisitors(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('visitors')
      .select('visitor_id')
      .gte('timestamp', today.toISOString());

    if (error) throw error;

    const uniqueVisitors = new Set(data.map(v => v.visitor_id));
    return uniqueVisitors.size;
  },
};

export default analyticsService;

import { supabase } from '../lib/supabase';

export interface VisitorData {
  id?: string;
  ipAddress: string;
  location: {
    city?: string;
    region?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    os?: string;
    browser?: string;
  };
  pages: Array<{
    path: string;
    title: string;
    timestamp: Date;
    duration: number;
  }>;
  sessionStart: Date;
  sessionEnd?: Date;
  totalDuration: number;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  totalPageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ path: string; views: number }>;
  topLocations: Array<{ country: string; city: string; count: number }>;
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
  trafficSources: Array<{ source: string; count: number }>;
}

// Get IP and location data
export async function getVisitorLocation(): Promise<{ ip: string; location: any }> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      ip: data.ip,
      location: {
        city: data.city,
        region: data.region,
        country: data.country_name,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    };
  } catch (error) {
    console.error('Error fetching location:', error);
    return {
      ip: 'unknown',
      location: {},
    };
  }
}

// Detect device type
export function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

// Get browser and OS info
export function getDeviceInfo() {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';

  // Detect browser
  if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
  else if (ua.indexOf('SamsungBrowser') > -1) browser = 'Samsung Internet';
  else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) browser = 'Opera';
  else if (ua.indexOf('Trident') > -1) browser = 'Internet Explorer';
  else if (ua.indexOf('Edge') > -1) browser = 'Edge';
  else if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
  else if (ua.indexOf('Safari') > -1) browser = 'Safari';

  // Detect OS
  if (ua.indexOf('Windows') > -1) os = 'Windows';
  else if (ua.indexOf('Mac') > -1) os = 'macOS';
  else if (ua.indexOf('Linux') > -1) os = 'Linux';
  else if (ua.indexOf('Android') > -1) os = 'Android';
  else if (ua.indexOf('iOS') > -1) os = 'iOS';

  return { browser, os };
}

// Track page view to Supabase
export async function trackPageView(pagePath: string, pageTitle: string): Promise<void> {
  try {
    const { ip, location } = await getVisitorLocation();
    const deviceType = getDeviceType();
    const { browser, os } = getDeviceInfo();

    const now = new Date().toISOString();

    await supabase.from('visitors').insert([{
      visitor_id: generateVisitorId(),
      page_url: pagePath,
      referrer: document.referrer || null,
      device: deviceType,
      browser: browser,
      country: location.country || null,
      city: location.city || null,
      duration: 0,
      timestamp: now
    }]);

    console.log('✅ Page view tracked to Supabase');
  } catch (error) {
    console.error('❌ Error tracking page view:', error);
  }
}

// Generate or retrieve visitor ID
function generateVisitorId(): string {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
}

// Track custom event
export async function trackEvent(eventName: string, eventData?: Record<string, any>): Promise<void> {
  try {
    const now = new Date().toISOString();

    await supabase.from('analytics_events').insert([{
      event_type: 'custom',
      event_name: eventName,
      visitor_id: generateVisitorId(),
      page_url: window.location.pathname,
      timestamp: now,
      metadata: eventData || {}
    }]);

    console.log(`✅ Event tracked: ${eventName}`);
  } catch (error) {
    console.error('❌ Error tracking event:', error);
  }
}

// Get analytics summary from Supabase
export async function getAnalyticsSummary(startDate?: Date, endDate?: Date): Promise<AnalyticsSummary> {
  try {
    let query = supabase.from('visitors').select('*');

    if (startDate) {
      query = query.gte('timestamp', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('timestamp', endDate.toISOString());
    }

    const { data: visitors, error } = await query;

    if (error) throw error;

    // Calculate metrics
    const totalVisitors = new Set(visitors?.map(v => v.visitor_id) || []).size;
    const totalPageViews = visitors?.length || 0;

    const avgDuration = visitors?.reduce((sum, v) => sum + (v.duration || 0), 0) / (totalPageViews || 1);
    const avgSessionDuration = Math.round(avgDuration);

    // Calculate bounce rate (visitors with only 1 page view)
    const visitorPageCounts = new Map<string, number>();
    visitors?.forEach(v => {
      const count = visitorPageCounts.get(v.visitor_id) || 0;
      visitorPageCounts.set(v.visitor_id, count + 1);
    });
    const bounced = Array.from(visitorPageCounts.values()).filter(count => count === 1).length;
    const bounceRate = totalVisitors > 0 ? Math.round((bounced / totalVisitors) * 100) : 0;

    // Top pages
    const pageCounts = new Map<string, number>();
    visitors?.forEach(v => {
      const count = pageCounts.get(v.page_url) || 0;
      pageCounts.set(v.page_url, count + 1);
    });
    const topPages = Array.from(pageCounts.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Top locations
    const locationCounts = new Map<string, number>();
    visitors?.forEach(v => {
      if (v.country) {
        const key = `${v.country}|${v.city || 'Unknown'}`;
        const count = locationCounts.get(key) || 0;
        locationCounts.set(key, count + 1);
      }
    });
    const topLocations = Array.from(locationCounts.entries())
      .map(([key, count]) => {
        const [country, city] = key.split('|');
        return { country, city, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Device breakdown
    const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };
    visitors?.forEach(v => {
      if (v.device in deviceCounts) {
        deviceCounts[v.device as keyof typeof deviceCounts]++;
      }
    });

    // Traffic sources (from referrer)
    const sourceCounts = new Map<string, number>();
    visitors?.forEach(v => {
      if (v.referrer) {
        try {
          const url = new URL(v.referrer);
          const source = url.hostname;
          const count = sourceCounts.get(source) || 0;
          sourceCounts.set(source, count + 1);
        } catch {
          // Invalid URL, skip
        }
      } else {
        const count = sourceCounts.get('direct') || 0;
        sourceCounts.set('direct', count + 1);
      }
    });
    const trafficSources = Array.from(sourceCounts.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalVisitors,
      totalPageViews,
      avgSessionDuration,
      bounceRate,
      topPages,
      topLocations,
      deviceBreakdown: deviceCounts,
      trafficSources,
    };
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    return {
      totalVisitors: 0,
      totalPageViews: 0,
      avgSessionDuration: 0,
      bounceRate: 0,
      topPages: [],
      topLocations: [],
      deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
      trafficSources: [],
    };
  }
}

// Initialize analytics (call on app load)
export function initAnalytics(): void {
  // Track initial page view
  trackPageView(window.location.pathname, document.title);

  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // User left the page
      trackEvent('page_hidden');
    } else {
      // User returned to the page
      trackEvent('page_visible');
    }
  });

  console.log('✅ Supabase Analytics initialized');
}

// Export for backward compatibility
export default {
  trackPageView,
  trackEvent,
  getAnalyticsSummary,
  initAnalytics,
  getVisitorLocation,
  getDeviceType,
  getDeviceInfo,
};

export async function getRecentVisitors(limit: number = 10): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting recent visitors:', error);
    return [];
  }
}

// Track visitor session
export async function trackVisitorSession(sessionData: any): Promise<string> {
  try {
    const visitorId = generateVisitorId();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('visitors')
      .insert([{
        visitor_id: visitorId,
        page_url: sessionData.pagePath || window.location.pathname,
        referrer: sessionData.referrer || document.referrer || null,
        device: sessionData.device?.type || getDeviceType(),
        browser: sessionData.device?.browser || getDeviceInfo().browser,
        country: sessionData.location?.country || null,
        city: sessionData.location?.city || null,
        duration: 0,
        timestamp: now
      }])
      .select('id')
      .single();

    if (error) throw error;
    return data?.id || visitorId;
  } catch (error) {
    console.error('❌ Error tracking visitor session:', error);
    return generateVisitorId();
  }
}

// Update session with page duration
export async function updateSession(
  sessionId: string,
  pageData: { path: string; title: string; duration: number }
): Promise<void> {
  try {
    // Just track the page view with duration - Supabase schema doesn't support session updates
    await supabase.from('visitors').insert([{
      visitor_id: sessionId,
      page_url: pageData.path,
      referrer: document.referrer || null,
      device: getDeviceType(),
      browser: getDeviceInfo().browser,
      duration: pageData.duration,
      timestamp: new Date().toISOString()
    }]);

    console.log(`✅ Session updated for ${pageData.path}: ${pageData.duration}s`);
  } catch (error) {
    console.error('❌ Error updating session:', error);
  }
}

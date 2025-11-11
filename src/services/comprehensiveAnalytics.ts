/**
 * Comprehensive Analytics Service
 * Tracks ALL website traffic and sends to Supabase
 * - Real-time visitors
 * - Session duration
 * - Page views
 * - Device/browser data
 * - Geographic location
 * - Traffic sources
 */

import { supabase } from '../lib/supabase';

interface SessionData {
  sessionId: string;
  deviceType: string;
  browser: string;
  os: string;
  screenWidth: number;
  screenHeight: number;
  country?: string;
  city?: string;
  ip_address?: string;
  referrer: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  landing_page: string;
  started_at: string;
}

interface PageViewData {
  sessionId: string;
  page_path: string;
  page_title: string;
  timeOnPageSeconds: number;
  scrollDepthPercent: number;
  clicksCount: number;
  loadTimeMs?: number;
}

class ComprehensiveAnalytics {
  private sessionId: string;
  private sessionStart: number;
  private currentPageStart: number;
  private currentPagePath: string;
  private maxScrollDepth: number;
  private clicksCount: number;
  private sessionSaved: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = Date.now();
    this.currentPageStart = Date.now();
    this.currentPagePath = window.location.pathname;
    this.maxScrollDepth = 0;
    this.clicksCount = 0;
    this.sessionSaved = false;

    this.initialize();
  }

  private generateSessionId(): string {
    const existing = sessionStorage.getItem('analytics_session_id');
    if (existing) return existing;
    
    const newId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', newId);
    return newId;
  }

  private async initialize() {
    // Start session tracking
    await this.startSession();

    // Track initial page view
    await this.trackPageView();

    // Setup event listeners
    this.setupScrollTracking();
    this.setupClickTracking();
    this.setupPageUnloadTracking();
    this.setupVisibilityTracking();
  }

  private getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
    return 'desktop';
  }

  private getBrowser(): { browser: string; version: string } {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let version = '';

    if (ua.indexOf('Firefox') > -1) {
      browser = 'Firefox';
      version = ua.match(/Firefox\/(\d+)/)?.[1] || '';
    } else if (ua.indexOf('Chrome') > -1) {
      browser = 'Chrome';
      version = ua.match(/Chrome\/(\d+)/)?.[1] || '';
    } else if (ua.indexOf('Safari') > -1) {
      browser = 'Safari';
      version = ua.match(/Version\/(\d+)/)?.[1] || '';
    } else if (ua.indexOf('Edge') > -1) {
      browser = 'Edge';
      version = ua.match(/Edge\/(\d+)/)?.[1] || '';
    }

    return { browser, version };
  }

  private getOS(): string {
    const ua = navigator.userAgent;
    if (ua.indexOf('Win') > -1) return 'Windows';
    if (ua.indexOf('Mac') > -1) return 'macOS';
    if (ua.indexOf('Linux') > -1) return 'Linux';
    if (ua.indexOf('Android') > -1) return 'Android';
    if (ua.indexOf('iOS') > -1) return 'iOS';
    return 'Unknown';
  }

  private getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_term: params.get('utm_term') || undefined,
      utm_content: params.get('utm_content') || undefined
    };
  }

  private async startSession() {
    // TEMPORARILY DISABLED: Supabase analytics tables don't exist yet
    return;

    /* Uncomment when analytics tables are created in Supabase:
    if (this.sessionSaved) return;

    const { browser, version } = this.getBrowser();
    const utm = this.getUTMParams();

    const sessionData: any = {
      session_id: this.sessionId,
      user_agent: navigator.userAgent,
      device_type: this.getDeviceType(),
      browser,
      browser_version: version,
      os: this.getOS(),
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      referrer: document.referrer || 'Direct',
      ...utm,
      landing_page: window.location.pathname,
      started_at: new Date(this.sessionStart).toISOString(),
      is_new_visitor: !localStorage.getItem('returning_visitor')
    };

    try {
      const { error } = await supabase
        .from('analytics_sessions')
        .upsert(sessionData, { onConflict: 'session_id' });

      if (!error) {
        this.sessionSaved = true;
        localStorage.setItem('returning_visitor', 'true');
        console.log('📊 Analytics session started');
      }
    } catch (error) {
      console.error('Analytics session error:', error);
    }
  }

  private async trackPageView() {
    // TEMPORARILY DISABLED: Supabase analytics tables don't exist yet
    return;

    /* Uncomment when analytics tables are created in Supabase:
    const pageViewData: any = {
      session_id: this.sessionId,
      page_path: window.location.pathname,
      page_title: document.title,
      page_url: window.location.href,
      viewed_at: new Date().toISOString(),
      load_time_ms: performance.timing?.loadEventEnd - performance.timing?.navigationStart
    };

    try {
      await supabase.from('analytics_page_views').insert([pageViewData]);

      // Update session page_views count
      await supabase.rpc('increment', {
        table_name: 'analytics_sessions',
        row_id: this.sessionId,
        column_name: 'page_views'
      });

      console.log('📄 Page view tracked:', window.location.pathname);
    } catch (error) {
      console.error('Page view tracking error:', error);
    }
    */
  }

  private setupScrollTracking() {
    let ticking = false;

    const updateScrollDepth = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const scrollPercent = Math.round((scrolled / scrollHeight) * 100);
      
      if (scrollPercent > this.maxScrollDepth) {
        this.maxScrollDepth = scrollPercent;
      }
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDepth);
        ticking = true;
      }
    });
  }

  private setupClickTracking() {
    document.addEventListener('click', () => {
      this.clicksCount++;
    });
  }

  private async savePageExit() {
    // TEMPORARILY DISABLED: Supabase analytics tables don't exist yet
    return;

    /* Uncomment when analytics tables are created in Supabase:
    const timeOnPage = Math.round((Date.now() - this.currentPageStart) / 1000);

    try {
      // Find the most recent page view for this session and update it
      const { data: recentPageViews } = await supabase
        .from('analytics_page_views')
        .select('id')
        .eq('session_id', this.sessionId)
        .eq('page_path', this.currentPagePath)
        .order('viewed_at', { ascending: false })
        .limit(1);

      if (recentPageViews && recentPageViews.length > 0) {
        await supabase
          .from('analytics_page_views')
          .update({
            time_on_page_seconds: timeOnPage,
            scroll_depth_percent: this.maxScrollDepth,
            clicks_count: this.clicksCount,
            exit_at: new Date().toISOString()
          })
          .eq('id', recentPageViews[0].id);
      }

      // Update session duration
      const totalDuration = Math.round((Date.now() - this.sessionStart) / 1000);
      await supabase
        .from('analytics_sessions')
        .update({
          duration_seconds: totalDuration,
          ended_at: new Date().toISOString()
        })
        .eq('session_id', this.sessionId);

      console.log(`📊 Page exit saved: ${timeOnPage}s on ${this.currentPagePath}`);
    } catch (error) {
      console.error('Page exit tracking error:', error);
    }
    */
  }

  private setupPageUnloadTracking() {
    window.addEventListener('beforeunload', () => {
      this.savePageExit();
    });

    // Also save when navigating to another page
    window.addEventListener('pagehide', () => {
      this.savePageExit();
    });
  }

  private setupVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.savePageExit();
      } else {
        // User came back, reset page start time
        this.currentPageStart = Date.now();
        this.maxScrollDepth = 0;
        this.clicksCount = 0;
      }
    });
  }

  // Public method to track custom events
  public async trackEvent(eventType: string, eventData: any = {}) {
    // TEMPORARILY DISABLED: Supabase analytics tables don't exist yet
    return;

    /* Uncomment when analytics tables are created in Supabase:
    try {
      await supabase.from('analytics_events').insert([{
        session_id: this.sessionId,
        event_type: eventType,
        event_category: eventData.category,
        event_action: eventData.action,
        event_label: eventData.label,
        event_value: eventData.value,
        page_path: window.location.pathname,
        event_data: eventData
      }]);

      console.log(`📌 Event tracked: ${eventType}`);
    } catch (error) {
      console.error('Event tracking error:', error);
    }
    */
  }

  // Public method to track page change (for SPAs)
  public async onPageChange(newPath: string) {
    // Save data for previous page
    await this.savePageExit();
    
    // Reset for new page
    this.currentPagePath = newPath;
    this.currentPageStart = Date.now();
    this.maxScrollDepth = 0;
    this.clicksCount = 0;
    
    // Track new page view
    await this.trackPageView();
  }
}

// Export singleton instance
let analyticsInstance: ComprehensiveAnalytics | null = null;

export const initializeAnalytics = () => {
  if (!analyticsInstance && typeof window !== 'undefined') {
    analyticsInstance = new ComprehensiveAnalytics();
  }
  return analyticsInstance;
};

export const trackEvent = (eventType: string, eventData: any = {}) => {
  analyticsInstance?.trackEvent(eventType, eventData);
};

export const trackPageChange = async (newPath: string) => {
  await analyticsInstance?.onPageChange(newPath);
};

export default { initializeAnalytics, trackEvent, trackPageChange };


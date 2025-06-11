/**
 * Mission Control Analytics Service
 * 
 * Captures 20 high-impact signals to turn website visitors into actionable insights.
 * Like Mission Control at Cape Canaveral - every blink of light tells a story.
 */

interface VisitorSignal {
  // Core Identity
  sessionId: string;
  ipAddress: string;
  fingerprint: string;
  
  // Geographic Intelligence
  country: string;
  city: string;
  timezone: string;
  localTime: string;
  
  // Device & Browser Intelligence
  deviceType: 'desktop' | 'tablet' | 'mobile';
  operatingSystem: string;
  browser: string;
  browserVersion: string;
  screenResolution: string;
  
  // Traffic Source Intelligence
  referrerSource: string;
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmContent?: string;
  utmTerm?: string;
  
  // Behavioral Intelligence
  sessionDuration: number;
  pagesPerSession: number;
  scrollDepthPercent: number;
  clickHeatmapPoints: Array<{x: number, y: number, page: string, timestamp: number}>;
  firstTouchPage: string;
  lastTouchPage: string;
  bounceRate: number;
  
  // Performance Intelligence
  loadTimeMs: number;
  jsErrors: Array<{message: string, stack: string, timestamp: number}>;
  
  // Engagement Intelligence
  isNewVisitor: boolean;
  engagementScore: number;
  conversionEvents: Array<{event: string, value?: number, timestamp: number}>;
  
  // Timestamps
  sessionStart: number;
  lastActivity: number;
}

interface LiveMetrics {
  totalLiveUsers: number;
  conversionRate: number;
  averageLoadTime: number;
  topCountries: Array<{country: string, sessions: number, revenue: number}>;
  topPages: Array<{page: string, views: number, avgTime: number}>;
  realtimeEvents: Array<{type: string, data: any, timestamp: number}>;
}

class MissionControlAnalytics {
  private sessionData: VisitorSignal | null = null;
  private eventQueue: Array<any> = [];
  private sessionId: string;
  private startTime: number;
  private lastActivity: number;
  private clickPoints: Array<{x: number, y: number, page: string, timestamp: number}> = [];
  private jsErrors: Array<{message: string, stack: string, timestamp: number}> = [];
  private conversionEvents: Array<{event: string, value?: number, timestamp: number}> = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.lastActivity = Date.now();
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initializeTracking() {
    // Initialize all tracking systems
    await this.captureDeviceSignals();
    await this.captureGeoSignals();
    this.setupBehaviorTracking();
    this.setupPerformanceTracking();
    this.setupErrorTracking();
    
    // Start the session
    this.startSession();
  }

  private async captureDeviceSignals() {
    const userAgent = navigator.userAgent;
    
    // Device type detection
    const deviceType = this.detectDeviceType(userAgent);
    
    // OS detection
    const os = this.detectOperatingSystem(userAgent);
    
    // Browser detection
    const browserInfo = this.detectBrowser(userAgent);
    
    // Screen resolution
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    
    // Update session data
    if (!this.sessionData) this.sessionData = {} as VisitorSignal;
    
    Object.assign(this.sessionData, {
      deviceType,
      operatingSystem: os,
      browser: browserInfo.name,
      browserVersion: browserInfo.version,
      screenResolution
    });
  }

  private async captureGeoSignals() {
    try {
      // Get IP and geo data from a service
      const response = await fetch('https://ipapi.co/json/');
      const geoData = await response.json();
      
      // Get timezone info
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const localTime = new Date().toLocaleString();
      
      if (!this.sessionData) this.sessionData = {} as VisitorSignal;
      
      Object.assign(this.sessionData, {
        ipAddress: geoData.ip || 'unknown',
        country: geoData.country_name || 'unknown',
        city: geoData.city || 'unknown',
        timezone,
        localTime
      });
    } catch (error) {
      console.warn('Could not capture geo signals:', error);
    }
  }

  private setupBehaviorTracking() {
    // Track page views
    this.trackPageView();
    
    // Track scroll depth
    this.setupScrollTracking();
    
    // Track clicks for heatmap
    this.setupClickTracking();
    
    // Track session activity
    this.setupActivityTracking();
    
    // Track referrer and UTM parameters
    this.captureTrafficSource();
  }

  private setupScrollTracking() {
    let maxScroll = 0;
    
    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (this.sessionData) {
          this.sessionData.scrollDepthPercent = maxScroll;
        }
      }
      
      this.updateLastActivity();
    };
    
    window.addEventListener('scroll', trackScroll, { passive: true });
  }

  private setupClickTracking() {
    document.addEventListener('click', (event) => {
      const clickPoint = {
        x: event.clientX,
        y: event.clientY,
        page: window.location.pathname,
        timestamp: Date.now()
      };
      
      this.clickPoints.push(clickPoint);
      this.updateLastActivity();
      
      // Track specific conversion events
      const target = event.target as HTMLElement;
      if (target.matches('[data-conversion]')) {
        this.trackConversion(target.dataset.conversion || 'click', 1);
      }
    });
  }

  private setupActivityTracking() {
    // Track mouse movement, keyboard input, etc.
    ['mousemove', 'keydown', 'scroll', 'click'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.updateLastActivity();
      }, { passive: true });
    });
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseSession();
      } else {
        this.resumeSession();
      }
    });
    
    // Track before unload
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  private setupPerformanceTracking() {
    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      if (this.sessionData) {
        this.sessionData.loadTimeMs = loadTime;
      }
    });
    
    // Track Core Web Vitals
    this.trackWebVitals();
  }

  private setupErrorTracking() {
    window.addEventListener('error', (event) => {
      const error = {
        message: event.message,
        stack: event.error?.stack || 'No stack trace',
        timestamp: Date.now()
      };
      
      this.jsErrors.push(error);
      
      // Send critical errors immediately
      this.sendEvent('js_error', error);
    });
    
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = {
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack || 'No stack trace',
        timestamp: Date.now()
      };
      
      this.jsErrors.push(error);
      this.sendEvent('promise_rejection', error);
    });
  }

  private captureTrafficSource() {
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    
    if (!this.sessionData) this.sessionData = {} as VisitorSignal;
    
    Object.assign(this.sessionData, {
      referrerSource: referrer || 'direct',
      utmCampaign: urlParams.get('utm_campaign') || undefined,
      utmSource: urlParams.get('utm_source') || undefined,
      utmMedium: urlParams.get('utm_medium') || undefined,
      utmContent: urlParams.get('utm_content') || undefined,
      utmTerm: urlParams.get('utm_term') || undefined
    });
  }

  private detectDeviceType(userAgent: string): 'desktop' | 'tablet' | 'mobile' {
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private detectOperatingSystem(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private detectBrowser(userAgent: string): {name: string, version: string} {
    if (userAgent.includes('Chrome')) {
      const version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
      return { name: 'Chrome', version };
    }
    if (userAgent.includes('Firefox')) {
      const version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
      return { name: 'Firefox', version };
    }
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      const version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
      return { name: 'Safari', version };
    }
    if (userAgent.includes('Edge')) {
      const version = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
      return { name: 'Edge', version };
    }
    return { name: 'Unknown', version: 'Unknown' };
  }

  private trackWebVitals() {
    // This would integrate with web-vitals library in a real implementation
    // For now, we'll track basic performance metrics
    
    if ('PerformanceObserver' in window) {
      // Track Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.sendEvent('web_vital_lcp', { value: lastEntry.startTime });
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Browser doesn't support this metric
      }
    }
  }

  private updateLastActivity() {
    this.lastActivity = Date.now();
  }

  private startSession() {
    if (!this.sessionData) return;
    
    // Check if returning visitor
    const isNewVisitor = !localStorage.getItem('visitor_fingerprint');
    const fingerprint = this.generateFingerprint();
    
    if (isNewVisitor) {
      localStorage.setItem('visitor_fingerprint', fingerprint);
    }
    
    Object.assign(this.sessionData, {
      sessionId: this.sessionId,
      fingerprint,
      isNewVisitor,
      sessionStart: this.startTime,
      lastActivity: this.lastActivity,
      firstTouchPage: window.location.pathname,
      pagesPerSession: 1,
      engagementScore: 0
    });
    
    this.sendEvent('session_start', this.sessionData);
  }

  private generateFingerprint(): string {
    // Simple fingerprinting - in production, use a more sophisticated method
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('fingerprint', 10, 10);
    const canvasFingerprint = canvas.toDataURL();
    
    const fingerprint = btoa(
      navigator.userAgent +
      navigator.language +
      screen.width + screen.height +
      new Date().getTimezoneOffset() +
      canvasFingerprint.slice(-50)
    ).slice(0, 32);
    
    return fingerprint;
  }

  public trackPageView(page?: string) {
    const currentPage = page || window.location.pathname;
    
    if (this.sessionData) {
      this.sessionData.pagesPerSession += 1;
      this.sessionData.lastTouchPage = currentPage;
      this.updateEngagementScore();
    }
    
    this.sendEvent('page_view', {
      page: currentPage,
      timestamp: Date.now(),
      sessionId: this.sessionId
    });
  }

  public trackConversion(event: string, value?: number) {
    const conversionEvent = {
      event,
      value,
      timestamp: Date.now()
    };
    
    this.conversionEvents.push(conversionEvent);
    
    if (this.sessionData) {
      this.sessionData.conversionEvents = this.conversionEvents;
      this.updateEngagementScore();
    }
    
    this.sendEvent('conversion', conversionEvent);
  }

  private updateEngagementScore() {
    if (!this.sessionData) return;
    
    const sessionDuration = (this.lastActivity - this.startTime) / 1000; // seconds
    const scrollWeight = this.sessionData.scrollDepthPercent / 100;
    const pageWeight = Math.min(this.sessionData.pagesPerSession / 5, 1);
    const conversionWeight = this.conversionEvents.length > 0 ? 1 : 0;
    const timeWeight = Math.min(sessionDuration / 300, 1); // 5 minutes = max time score
    
    this.sessionData.engagementScore = Math.round(
      (scrollWeight * 25) + 
      (pageWeight * 25) + 
      (conversionWeight * 30) + 
      (timeWeight * 20)
    );
  }

  private pauseSession() {
    this.sendEvent('session_pause', { timestamp: Date.now() });
  }

  private resumeSession() {
    this.updateLastActivity();
    this.sendEvent('session_resume', { timestamp: Date.now() });
  }

  private endSession() {
    if (!this.sessionData) return;
    
    const sessionDuration = this.lastActivity - this.startTime;
    const bounceRate = this.sessionData.pagesPerSession === 1 ? 1 : 0;
    
    Object.assign(this.sessionData, {
      sessionDuration,
      bounceRate,
      clickHeatmapPoints: this.clickPoints,
      jsErrors: this.jsErrors,
      conversionEvents: this.conversionEvents
    });
    
    this.updateEngagementScore();
    
    this.sendEvent('session_end', this.sessionData);
  }

  private sendEvent(eventType: string, data: any) {
    // Queue events for batch sending
    this.eventQueue.push({
      type: eventType,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId
    });
    
    // Send immediately for critical events, batch for others
    if (['js_error', 'conversion', 'session_end'].includes(eventType)) {
      this.flushEvents();
    } else {
      // Batch send every 30 seconds
      setTimeout(() => this.flushEvents(), 30000);
    }
  }

  private async flushEvents() {
    if (this.eventQueue.length === 0) return;
    
    const events = [...this.eventQueue];
    this.eventQueue = [];
    
    try {
      // Send to your analytics endpoint
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events })
      });
    } catch (error) {
      console.warn('Failed to send analytics events:', error);
      // Re-queue events for retry
      this.eventQueue.unshift(...events);
    }
  }

  // Public API methods
  public getCurrentSession(): VisitorSignal | null {
    return this.sessionData;
  }

  public getEngagementScore(): number {
    return this.sessionData?.engagementScore || 0;
  }

  public trackCustomEvent(eventName: string, properties: any = {}) {
    this.sendEvent('custom_event', {
      eventName,
      properties,
      timestamp: Date.now()
    });
  }
}

// Singleton instance
export const missionControl = new MissionControlAnalytics();

// Export types for use in components
export type { VisitorSignal, LiveMetrics };

/**
 * Enhanced Analytics Utility
 * Integrates Google Analytics 4 with Supabase visitor tracking
 * Tracks: forms, scroll depth, buttons, gallery views, contact conversions, blog engagement
 */

import { GA_MEASUREMENT_ID } from '../config/analytics';
import { trackVisitorSession, updateSession } from '../services/analyticsService';

// Declare gtag globally
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Track form submission
export function trackFormSubmission(formName: string, formData?: Record<string, any>) {
  try {
    // Send to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_submission', {
        form_name: formName,
        form_data: JSON.stringify(formData || {}),
        timestamp: new Date().toISOString()
      });
    }

    // Log for debugging
    console.log('📋 Form submission tracked:', formName);
  } catch (error) {
    console.error('Error tracking form submission:', error);
  }
}

// Track scroll depth
let scrollDepthTracked = {
  '25': false,
  '50': false,
  '75': false,
  '100': false
};

export function trackScrollDepth() {
  try {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    // Track at 25%, 50%, 75%, and 100%
    const thresholds: Array<'25' | '50' | '75' | '100'> = ['25', '50', '75', '100'];

    for (const threshold of thresholds) {
      const thresholdNum = parseInt(threshold);
      if (scrollPercentage >= thresholdNum && !scrollDepthTracked[threshold]) {
        scrollDepthTracked[threshold] = true;

        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'scroll_depth', {
            scroll_depth: threshold,
            page_path: window.location.pathname,
            timestamp: new Date().toISOString()
          });
        }

        console.log(`📊 Scroll depth tracked: ${threshold}%`);
      }
    }
  } catch (error) {
    console.error('Error tracking scroll depth:', error);
  }
}

// Initialize scroll depth tracking
export function initScrollDepthTracking() {
  // Reset tracking for new page
  scrollDepthTracked = {
    '25': false,
    '50': false,
    '75': false,
    '100': false
  };

  // Add scroll listener with throttling
  let scrollTimeout: NodeJS.Timeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      trackScrollDepth();
    }, 100);
  });
}

// Track button clicks
export function trackButtonClick(buttonName: string, buttonData?: Record<string, any>) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'button_click', {
        button_name: buttonName,
        button_data: JSON.stringify(buttonData || {}),
        page_path: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    }

    console.log('🔘 Button click tracked:', buttonName);
  } catch (error) {
    console.error('Error tracking button click:', error);
  }
}

// Track gallery views
export function trackGalleryView(galleryName: string, galleryData?: {
  venue?: string;
  location?: string;
  imageCount?: number;
}) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'gallery_view', {
        gallery_name: galleryName,
        venue: galleryData?.venue || 'Unknown',
        location: galleryData?.location || 'Unknown',
        image_count: galleryData?.imageCount || 0,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    }

    console.log('🖼️ Gallery view tracked:', galleryName);
  } catch (error) {
    console.error('Error tracking gallery view:', error);
  }
}

// Track contact form conversions
export function trackContactConversion(conversionData: {
  source?: string;
  formType?: string;
  phoneOrEmail?: 'phone' | 'email';
  value?: number;
}) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: GA_MEASUREMENT_ID,
        conversion_type: 'contact',
        source: conversionData.source || 'website',
        form_type: conversionData.formType || 'contact_form',
        contact_method: conversionData.phoneOrEmail || 'unknown',
        value: conversionData.value || 1,
        currency: 'USD',
        timestamp: new Date().toISOString()
      });
    }

    console.log('🎯 Contact conversion tracked:', conversionData.formType);
  } catch (error) {
    console.error('Error tracking contact conversion:', error);
  }
}

// Track blog engagement
export function trackBlogEngagement(engagementType: 'read' | 'share' | 'comment' | 'like', blogData: {
  postId?: string;
  postTitle?: string;
  postCategory?: string;
  readTime?: number;
}) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'blog_engagement', {
        engagement_type: engagementType,
        post_id: blogData.postId || 'unknown',
        post_title: blogData.postTitle || 'unknown',
        post_category: blogData.postCategory || 'unknown',
        read_time: blogData.readTime || 0,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    }

    console.log('📝 Blog engagement tracked:', engagementType, blogData.postTitle);
  } catch (error) {
    console.error('Error tracking blog engagement:', error);
  }
}

// Track time on page
let pageStartTime = Date.now();
let timeOnPageInterval: NodeJS.Timeout;

export function initTimeOnPageTracking() {
  pageStartTime = Date.now();

  // Clear any existing interval
  if (timeOnPageInterval) {
    clearInterval(timeOnPageInterval);
  }

  // Track time on page every 30 seconds
  timeOnPageInterval = setInterval(() => {
    const timeOnPage = Math.round((Date.now() - pageStartTime) / 1000);

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'time_on_page', {
        time_seconds: timeOnPage,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    }

    console.log(`⏱️ Time on page: ${timeOnPage}s`);
  }, 30000); // Every 30 seconds
}

// Track outbound links
export function trackOutboundLink(url: string, linkText?: string) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'outbound',
        event_label: url,
        link_text: linkText || 'unknown',
        timestamp: new Date().toISOString()
      });
    }

    console.log('🔗 Outbound link tracked:', url);
  } catch (error) {
    console.error('Error tracking outbound link:', error);
  }
}

// Initialize all enhanced tracking
export function initEnhancedAnalytics() {
  console.log('🚀 Initializing enhanced analytics...');

  // Initialize scroll depth tracking
  initScrollDepthTracking();

  // Initialize time on page tracking
  initTimeOnPageTracking();

  // Track initial page view
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
      send_page_view: true
    });
  }

  // Add click listeners for outbound links
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');

    if (link && link.href) {
      const isOutbound = !link.href.includes(window.location.hostname);

      if (isOutbound) {
        trackOutboundLink(link.href, link.textContent || undefined);
      }
    }
  });

  console.log('✅ Enhanced analytics initialized');
}

// Cleanup function for when component unmounts or page changes
export function cleanupEnhancedAnalytics() {
  if (timeOnPageInterval) {
    clearInterval(timeOnPageInterval);
  }

  // Reset scroll depth tracking
  scrollDepthTracked = {
    '25': false,
    '50': false,
    '75': false,
    '100': false
  };
}

// Connect Supabase visitor tracking to GA4
export async function initSupabaseGATracking() {
  try {
    // Get or create visitor session in Supabase
    const sessionData = {
      pagePath: window.location.pathname,
      referrer: document.referrer || null,
      device: {
        type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        browser: navigator.userAgent
      },
      location: {
        country: null,
        city: null
      }
    };

    // Try to track in Supabase, but don't fail if table doesn't exist
    let sessionId = null;
    try {
      sessionId = await trackVisitorSession(sessionData);
      console.log('✅ Supabase visitor tracking connected to GA4:', sessionId);
    } catch (supabaseError: any) {
      // Silently handle Supabase errors - visitors table may not exist yet
      console.debug('Supabase visitor tracking not available (table may not exist)');
      sessionId = 'ga4-only-' + Date.now();
    }

    // Send initial event to GA4 (works even without Supabase)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'session_start', {
        session_id: sessionId,
        page_path: window.location.pathname,
        referrer: document.referrer || 'direct',
        device_type: sessionData.device.type,
        timestamp: new Date().toISOString()
      });
    }

    return sessionId;
  } catch (error) {
    console.debug('GA4 tracking initialized without Supabase');
    return null;
  }
}

export default {
  trackFormSubmission,
  trackScrollDepth,
  trackButtonClick,
  trackGalleryView,
  trackContactConversion,
  trackBlogEngagement,
  initEnhancedAnalytics,
  cleanupEnhancedAnalytics,
  initSupabaseGATracking,
  trackOutboundLink
};

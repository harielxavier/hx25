/**
 * Analytics Configuration
 * 
 * This file contains configuration settings for analytics services
 * used throughout the application.
 */

// Google Analytics Measurement ID
// Format should be G-XXXXXXXXXX for GA4
export const GA_MEASUREMENT_ID = 'G-V9HYY5GS0D'; // Google Analytics ID

// Analytics feature flags
export const ANALYTICS_CONFIG = {
  // Enable/disable analytics tracking
  enabled: true,
  
  // Track page views automatically
  trackPageViews: true,
  
  // Track outbound links automatically
  trackOutboundLinks: true,
  
  // Track form submissions automatically
  trackForms: true,
  
  // Track file downloads automatically
  trackDownloads: true,
  
  // Track errors automatically
  trackErrors: true,
  
  // Track user engagement metrics (scroll depth, time on page)
  trackEngagement: true,
  
  // Debug mode (logs analytics events to console)
  debug: false
};

export default {
  GA_MEASUREMENT_ID,
  ANALYTICS_CONFIG
};

/**
 * Analytics Tracker Component
 * Initializes and tracks analytics on every page
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeAnalytics, trackPageChange } from '../services/comprehensiveAnalytics';

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Initialize analytics on mount
    initializeAnalytics();
  }, []);

  useEffect(() => {
    // Track page changes
    trackPageChange(location.pathname);
  }, [location.pathname]);

  return null; // This component doesn't render anything
}


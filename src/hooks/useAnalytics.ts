/**
 * Analytics Hook
 * Initialize analytics tracking on every page
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeAnalytics, trackPageChange } from '../services/comprehensiveAnalytics';

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Initialize analytics on first load
    const analytics = initializeAnalytics();
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    // Track page changes
    trackPageChange(location.pathname);
  }, [location.pathname]);
}


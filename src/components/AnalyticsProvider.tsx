import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, initializeAnalytics } from '../utils/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const location = useLocation();

  // Initialize analytics when the app loads
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeAnalytics();
        console.log('Analytics initialized successfully');
      } catch (error) {
        console.error('Failed to initialize analytics:', error);
      }
    };

    initialize();
  }, []);

  // Track page views when the route changes
  useEffect(() => {
    const track = async () => {
      try {
        // Track page view in both Google Analytics and Firestore
        await trackPageView(location.pathname);
        
        // Also update Google Analytics directly
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('config', window.GA_MEASUREMENT_ID, {
            page_path: location.pathname,
            page_title: document.title
          });
        }
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    };

    track();
  }, [location]);

  return <>{children}</>;
};

export default AnalyticsProvider;

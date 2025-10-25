import React, { useEffect } from 'react';

interface GoogleAnalyticsProps {
  measurementId: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ measurementId }) => {
  useEffect(() => {
    // Skip in development environment if needed
    // if (process.env.NODE_ENV === 'development') return;

    // Load Google Analytics
    const script1 = document.createElement('script');
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script1.async = true;
    document.head.appendChild(script1);

    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', measurementId, {
      page_path: window.location.pathname,
      send_page_view: true
    });

    // Make gtag available globally
    window.gtag = gtag;
    window.GA_MEASUREMENT_ID = measurementId;

    return () => {
      // Clean up
      document.head.removeChild(script1);
    };
  }, [measurementId]);

  return null; // This component doesn't render anything
};

// Add these to the window object
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    GA_MEASUREMENT_ID: string;
  }
}

export default GoogleAnalytics;

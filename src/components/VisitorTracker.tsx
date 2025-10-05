import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getVisitorLocation,
  getDeviceType,
  getDeviceInfo,
  trackVisitorSession,
  updateSession,
} from '../services/analyticsService';

export default function VisitorTracker() {
  const location = useLocation();
  const sessionIdRef = useRef<string | null>(null);
  const pageStartTimeRef = useRef<number>(Date.now());
  const previousPathRef = useRef<string>('');

  useEffect(() => {
    // Initialize session on first load
    const initSession = async () => {
      try {
        const { ip, location: geoLocation } = await getVisitorLocation();
        const deviceType = getDeviceType();
        const deviceInfo = getDeviceInfo();

        // Get UTM parameters
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source') || undefined;
        const utmMedium = urlParams.get('utm_medium') || undefined;
        const utmCampaign = urlParams.get('utm_campaign') || undefined;

        const sessionData = {
          ipAddress: ip,
          location: geoLocation,
          device: {
            type: deviceType,
            os: deviceInfo.os,
            browser: deviceInfo.browser,
          },
          pages: [],
          sessionStart: new Date(),
          totalDuration: 0,
          referrer: document.referrer || undefined,
          utmSource,
          utmMedium,
          utmCampaign,
        };

        const sessionId = await trackVisitorSession(sessionData);
        sessionIdRef.current = sessionId;

        console.log('✅ Visitor session initialized:', sessionId);
      } catch (error) {
        console.error('❌ Error initializing visitor session:', error);
      }
    };

    initSession();

    // Cleanup on unmount - record final page duration
    return () => {
      if (sessionIdRef.current && previousPathRef.current) {
        const duration = Math.floor((Date.now() - pageStartTimeRef.current) / 1000);
        updateSession(sessionIdRef.current, {
          path: previousPathRef.current,
          title: document.title,
          duration,
        });
      }
    };
  }, []);

  // Track page changes
  useEffect(() => {
    const trackPageView = async () => {
      if (!sessionIdRef.current) return;

      // Record previous page duration
      if (previousPathRef.current) {
        const duration = Math.floor((Date.now() - pageStartTimeRef.current) / 1000);
        await updateSession(sessionIdRef.current, {
          path: previousPathRef.current,
          title: document.title,
          duration,
        });
      }

      // Reset for new page
      pageStartTimeRef.current = Date.now();
      previousPathRef.current = location.pathname;

      console.log('📊 Page view tracked:', location.pathname);
    };

    trackPageView();
  }, [location.pathname]);

  return null; // This component doesn't render anything
}

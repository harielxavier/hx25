import { db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp, doc, setDoc, getDoc } from 'firebase/firestore';

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

// Track visitor session
export async function trackVisitorSession(sessionData: Partial<VisitorData>): Promise<string | null> {
  try {
    if (!db) {
      console.log('Firestore not initialized - skipping visitor tracking');
      return null;
    }
    const visitorsRef = collection(db, 'visitors');
    const docRef = await addDoc(visitorsRef, {
      ...sessionData,
      sessionStart: Timestamp.fromDate(sessionData.sessionStart || new Date()),
      sessionEnd: sessionData.sessionEnd ? Timestamp.fromDate(sessionData.sessionEnd) : null,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return null;
  }
}

// Update session with page view
export async function updateSession(sessionId: string, pageData: { path: string; title: string; duration: number }) {
  try {
    if (!db) throw new Error('Firestore not initialized');
    const sessionRef = doc(db, 'visitors', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (sessionSnap.exists()) {
      const currentData = sessionSnap.data();
      const pages = currentData.pages || [];
      
      await setDoc(
        sessionRef,
        {
          pages: [
            ...pages,
            {
              ...pageData,
              timestamp: Timestamp.now(),
            },
          ],
          sessionEnd: Timestamp.now(),
          totalDuration: (currentData.totalDuration || 0) + pageData.duration,
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.error('Error updating session:', error);
  }
}

// Get analytics summary for date range
export async function getAnalyticsSummary(startDate: Date, endDate: Date): Promise<AnalyticsSummary> {
  try {
    if (!db) throw new Error('Firestore not initialized');
    const visitorsRef = collection(db, 'visitors');
    const q = query(
      visitorsRef,
      where('sessionStart', '>=', Timestamp.fromDate(startDate)),
      where('sessionStart', '<=', Timestamp.fromDate(endDate)),
      orderBy('sessionStart', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const visitors: VisitorData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      visitors.push({
        id: doc.id,
        ...data,
        sessionStart: data.sessionStart?.toDate(),
        sessionEnd: data.sessionEnd?.toDate(),
      } as VisitorData);
    });

    // Calculate metrics
    const totalVisitors = visitors.length;
    const totalPageViews = visitors.reduce((sum, v) => sum + (v.pages?.length || 0), 0);
    const avgSessionDuration = visitors.reduce((sum, v) => sum + (v.totalDuration || 0), 0) / totalVisitors;
    const bounceRate = (visitors.filter((v) => v.pages?.length === 1).length / totalVisitors) * 100;

    // Top pages
    const pageViews: { [key: string]: number } = {};
    visitors.forEach((v) => {
      v.pages?.forEach((page) => {
        pageViews[page.path] = (pageViews[page.path] || 0) + 1;
      });
    });
    const topPages = Object.entries(pageViews)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Top locations
    const locations: { [key: string]: number } = {};
    visitors.forEach((v) => {
      const key = `${v.location.country}|${v.location.city}`;
      locations[key] = (locations[key] || 0) + 1;
    });
    const topLocations = Object.entries(locations)
      .map(([key, count]) => {
        const [country, city] = key.split('|');
        return { country, city, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Device breakdown
    const deviceBreakdown = {
      desktop: visitors.filter((v) => v.device.type === 'desktop').length,
      mobile: visitors.filter((v) => v.device.type === 'mobile').length,
      tablet: visitors.filter((v) => v.device.type === 'tablet').length,
    };

    // Traffic sources
    const sources: { [key: string]: number } = {};
    visitors.forEach((v) => {
      const source = v.utmSource || v.referrer || 'Direct';
      sources[source] = (sources[source] || 0) + 1;
    });
    const trafficSources = Object.entries(sources)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalVisitors,
      totalPageViews,
      avgSessionDuration,
      bounceRate,
      topPages,
      topLocations,
      deviceBreakdown,
      trafficSources,
    };
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
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

// Get recent visitors
export async function getRecentVisitors(limitCount: number = 50): Promise<VisitorData[]> {
  try {
    if (!db) throw new Error('Firestore not initialized');
    const visitorsRef = collection(db, 'visitors');
    const q = query(visitorsRef, orderBy('sessionStart', 'desc'), limit(limitCount));

    const querySnapshot = await getDocs(q);
    const visitors: VisitorData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      visitors.push({
        id: doc.id,
        ...data,
        sessionStart: data.sessionStart?.toDate(),
        sessionEnd: data.sessionEnd?.toDate(),
      } as VisitorData);
    });

    return visitors;
  } catch (error) {
    console.error('Error fetching recent visitors:', error);
    return [];
  }
}

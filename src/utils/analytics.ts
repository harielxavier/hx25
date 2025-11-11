// REMOVED FIREBASE: import { collection, doc, setDoc, increment, serverTimestamp, getDoc, updateDoc // REMOVED FIREBASE
// REMOVED FIREBASE: import { db } from '../firebase/config';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

// Lead generation specific metrics
interface LeadMetrics {
  source?: string;         // Where the lead came from
  campaign?: string;      // Marketing campaign if applicable
  conversionPage?: string; // Page where conversion happened
  qualityScore?: number;  // 1-10 scale
  initialInterest?: string; // What service they're interested in
  timeToConvert?: number;  // Time in seconds from first visit to conversion
}

// Check if user is authenticated to avoid permission errors
const isUserAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};

// Track event in both Google Analytics and Firestore
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    // Track in Google Analytics only - Firestore analytics temporarily disabled
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        non_interaction: event.nonInteraction
      });
    }

    // Firestore analytics disabled to prevent authentication errors
    // console.log('Event tracked (Google Analytics only):', event);

  } catch (error) {
    // Silently handle errors to prevent UI disruption
    console.debug('Analytics tracking disabled for event:', event.action);
  }
}

// Track page views
export async function trackPageView(path: string): Promise<void> {
  try {
    // Track in Google Analytics only - Firestore analytics temporarily disabled
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', (window as any).GA_MEASUREMENT_ID, {
        page_path: path
      });
    }

    // Firestore analytics disabled to prevent authentication errors
    // console.log('Page view tracked (Google Analytics only):', path);

  } catch (error) {
    // Silently handle errors to prevent UI disruption
    console.debug('Analytics tracking disabled:', path);
  }
}

// Track exceptions
export function trackException(error: Error, context: string = 'PortfolioShowcase'): void {
  try {
    trackEvent({
      category: 'Errors',
      action: `${context} Error`,
      label: error.message.substring(0, 500),
      value: 1,
      nonInteraction: true
    });

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: `${context}: ${error.message}`,
        fatal: false
      });
    }
  } catch (analyticsError) {
    console.error('Error tracking exception:', analyticsError);
    // Continue execution even if analytics fails
  }
}

// Helper function to track events in Firestore
async function trackInFirestore(event: AnalyticsEvent): Promise<void> {
  if (!isUserAuthenticated()) {
    return;
  }
  
  try {
    const eventsRef = doc(collection(db, 'analytics'), 'events');
    const eventKey = `${event.category}_${event.action}`.replace(/\s+/g, '_').toLowerCase();
    
    await setDoc(eventsRef, {
      [eventKey]: increment(1),
      lastUpdated: serverTimestamp()
    }, { merge: true });
    
    // Also track in daily stats
    const today = new Date().toISOString().split('T')[0];
    const dailyStatsRef = doc(collection(db, 'analytics'), `daily_${today}`);
    await setDoc(dailyStatsRef, {
      [`event_${eventKey}`]: increment(1),
      totalEvents: increment(1),
      lastUpdated: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error tracking in Firestore:', error);
    // Continue execution even if Firestore tracking fails
  }
}

// Track a new lead with detailed metrics
export async function trackLead(leadMetrics: LeadMetrics): Promise<void> {
  try {
    // Track the lead event in Google Analytics only
    await trackEvent({
      category: 'Leads',
      action: 'New Lead',
      label: leadMetrics.source || 'Website',
      value: leadMetrics.qualityScore || 5
    });

    // Firestore lead tracking disabled to prevent authentication errors
    console.debug('Lead tracked (Google Analytics only):', leadMetrics.source);

  } catch (error) {
    console.debug('Lead tracking disabled:', leadMetrics.source);
  }
}

// Update lead generation metrics
async function updateLeadMetrics(event?: AnalyticsEvent): Promise<void> {
  if (!isUserAuthenticated()) {
    return;
  }
  
  try {
    const leadMetricsRef = doc(collection(db, 'analytics'), 'leadMetrics');
    const leadMetricsDoc = await getDoc(leadMetricsRef);
    
    if (!leadMetricsDoc.exists()) {
      return;
    }
    
    const leadMetrics = leadMetricsDoc.data();
    const currentDate = new Date().toISOString().split('T')[0];
    const dailyStatsRef = doc(collection(db, 'analytics'), `daily_${currentDate}`);
    
    // Get page views for conversion rate calculation
    const pageViewsRef = doc(collection(db, 'analytics'), 'pageViews');
    const pageViewsDoc = await getDoc(pageViewsRef);
    const pageViews = pageViewsDoc.exists() ? pageViewsDoc.data().total || 0 : 0;
    
    // Calculate conversion rate (leads / visitors)
    const totalLeads = leadMetrics.totalLeads || 0;
    const conversionRate = pageViews > 0 ? (totalLeads / pageViews) * 100 : 0;
    
    // Update metrics
    if (event && (event.category === 'Leads' || event.category === 'Conversions')) {
      await updateDoc(leadMetricsRef, {
        totalLeads: increment(1),
        conversionRate: conversionRate,
        lastUpdated: serverTimestamp()
      });
      
      // Update daily stats
      await setDoc(dailyStatsRef, {
        totalLeads: increment(1),
        conversionRate: conversionRate,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } else {
      // Just update the calculated metrics without incrementing
      await updateDoc(leadMetricsRef, {
        conversionRate: conversionRate,
        lastUpdated: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating lead metrics:', error);
  }
}

// Calculate and update customer value metrics
export async function updateCustomerValueMetrics(bookingValue: number): Promise<void> {
  if (!isUserAuthenticated()) {
    return;
  }
  
  try {
    const customerMetricsRef = doc(collection(db, 'analytics'), 'customerMetrics');
    const leadMetricsRef = doc(collection(db, 'analytics'), 'leadMetrics');
    
    const customerMetricsDoc = await getDoc(customerMetricsRef);
    const leadMetricsDoc = await getDoc(leadMetricsRef);
    
    if (!customerMetricsDoc.exists() || !leadMetricsDoc.exists()) {
      return;
    }
    
    const customerMetrics = customerMetricsDoc.data();
    const leadMetrics = leadMetricsDoc.data();
    
    // Get total customers and total revenue
    const totalCustomers = customerMetrics.totalCustomers || 0;
    const totalRevenue = customerMetrics.totalRevenue || 0;
    const totalMarketingCost = customerMetrics.totalMarketingCost || 0;
    const totalLeads = leadMetrics.totalLeads || 0;
    
    // Calculate CLV, CAC, and ROMI
    const newTotalCustomers = totalCustomers + 1;
    const newTotalRevenue = totalRevenue + bookingValue;
    const customerLifetimeValue = newTotalCustomers > 0 ? newTotalRevenue / newTotalCustomers : 0;
    const customerAcquisitionCost = totalLeads > 0 ? totalMarketingCost / totalLeads : 0;
    const returnOnMarketingInvestment = totalMarketingCost > 0 ? ((newTotalRevenue - totalMarketingCost) / totalMarketingCost) * 100 : 0;
    
    // Update metrics
    await updateDoc(customerMetricsRef, {
      totalCustomers: increment(1),
      totalRevenue: increment(bookingValue),
      customerLifetimeValue: customerLifetimeValue,
      customerAcquisitionCost: customerAcquisitionCost,
      returnOnMarketingInvestment: returnOnMarketingInvestment,
      lastUpdated: serverTimestamp()
    });
    
  } catch (error) {
    console.error('Error updating customer value metrics:', error);
  }
}

// Initialize analytics collection if it doesn't exist
export async function initializeAnalytics(): Promise<void> {
  // Firestore analytics disabled - return early to prevent errors
  console.debug('Firestore analytics initialization skipped - analytics disabled');
  return;
}

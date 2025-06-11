import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {BetaAnalyticsDataClient} from "@google-analytics/data";
import {format, subDays} from "date-fns";

// Initialize Firebase Admin SDK (if not already done in index.ts)
// Ensure this runs only once
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// --- Configuration ---
// IMPORTANT: Replace 'YOUR_GA4_PROPERTY_ID' with your actual GA4 Property ID.
// It's highly recommended to use Firebase environment configuration for this:
// firebase functions:config:set analytics.property_id="YOUR_GA4_PROPERTY_ID"
// Then access it via functions.config().analytics.property_id
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "YOUR_GA4_PROPERTY_ID"; // Use environment variable or replace placeholder

// Initialize Google Analytics Data API client
// Authentication happens automatically via Application Default Credentials
// when deployed in the Firebase/Google Cloud environment.
const analyticsDataClient = new BetaAnalyticsDataClient();

// Define the structure for the response to match the frontend
interface AnalyticsApiResponse {
  stats: {
    totalViews: number;
    totalUsers: number;
    conversionRate: number;
    avgSessionTime: string;
    bookings: number; // Note: GA4 doesn't track 'bookings' directly unless set up as conversion
    inquiries: number; // Note: Using GA4 'conversions' metric as a proxy
  };
  pageViewsTimeSeries: { name: string; views: number }[];
  popularPages: { name: string; views: number }[];
  deviceData: { name: string; value: number }[];
  audienceData: { name: string; value: number }[];
  audienceAge: { name: string; users: number }[]; // Will be populated now
  conversionTimeSeries: { name: string; bookings: number; inquiries: number }[]; // Still placeholder
  conversionSources: { name: string; value: number }[]; // Will be populated now (using conversions metric)
}

// Helper function to format GA duration (seconds) to MM:SS string
function formatDuration(secondsStr: string | undefined): string {
  const seconds = parseFloat(secondsStr || "0");
  if (isNaN(seconds) || seconds === 0) {
    return "0:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Helper function to safely get metric value
function getMetricValue(
  row: any, // Type properly based on GA API response if needed
  metricName: string,
): number {
  const metric = row.metricValues?.find((m: any) => m.metric?.name === metricName);
  return metric ? parseInt(metric.value || "0", 10) : 0;
}

// Helper function to safely get dimension value
function getDimensionValue(
  row: any, // Type properly based on GA API response if needed
  dimensionName: string,
): string {
  const dimension = row.dimensionValues?.find((d: any) => d.dimension?.name === dimensionName);
  return dimension?.value || "Unknown";
}


export const getAnalyticsData = functions.https.onCall(async (data, context) => {
  // Optional: Add authentication check if needed
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  // }

  if (!GA4_PROPERTY_ID || GA4_PROPERTY_ID === "YOUR_GA4_PROPERTY_ID") {
    console.error("GA4 Property ID is not configured.");
    throw new functions.https.HttpsError("internal", "Analytics configuration missing.");
  }

  const propertyPath = `properties/${GA4_PROPERTY_ID}`;
  const dateRanges = [{
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"), // Last 30 days
    endDate: format(new Date(), "yyyy-MM-dd"),
  }];

  try {
    // --- 1. Fetch Summary Stats ---
    const [summaryResponse] = await analyticsDataClient.runReport({
      property: propertyPath,
      dateRanges: dateRanges,
      metrics: [
        {name: "screenPageViews"}, // Use screenPageViews for GA4
        {name: "totalUsers"},
        {name: "sessionConversionRate"}, // Use sessionConversionRate
        {name: "averageSessionDuration"},
        {name: "conversions"}, // Use 'conversions' as proxy for inquiries/bookings
      ],
    });

    const summaryRow = summaryResponse.rows?.[0];
    const totalViews = summaryRow ? getMetricValue(summaryRow, "screenPageViews") : 0;
    const totalUsers = summaryRow ? getMetricValue(summaryRow, "totalUsers") : 0;
    const conversionRate = summaryRow ? parseFloat(summaryRow.metricValues?.find((m: any) => m.metric?.name === "sessionConversionRate")?.value || "0") * 100 : 0;
    const avgSessionDurationSeconds = summaryRow ? summaryRow.metricValues?.find((m: any) => m.metric?.name === "averageSessionDuration")?.value : "0";
    const totalConversions = summaryRow ? getMetricValue(summaryRow, "conversions") : 0; // Total GA conversions

    const stats = {
      totalViews: totalViews,
      totalUsers: totalUsers,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      avgSessionTime: formatDuration(avgSessionDurationSeconds),
      bookings: 0, // Cannot get specific 'bookings' easily from GA unless custom event
      inquiries: totalConversions, // Using total conversions as proxy
    };

    // --- 2. Fetch Page Views Over Time (Daily for last 30 days) ---
    const [timeSeriesResponse] = await analyticsDataClient.runReport({
      property: propertyPath,
      dateRanges: dateRanges,
      dimensions: [{name: "date"}],
      metrics: [{name: "screenPageViews"}],
      orderBys: [{dimension: {dimensionName: "date"}, orderType: "ALPHANUMERIC"}],
    });

    const pageViewsTimeSeries = timeSeriesResponse.rows?.map((row) => ({
      name: format(new Date(getDimensionValue(row, "date")), "MMM d"), // Format date
      views: getMetricValue(row, "screenPageViews"),
    })) || [];

    // --- 3. Fetch Popular Pages ---
    const [popularPagesResponse] = await analyticsDataClient.runReport({
      property: propertyPath,
      dateRanges: dateRanges,
      dimensions: [{name: "pagePath"}], // Use pagePath
      metrics: [{name: "screenPageViews"}],
      orderBys: [{metric: {metricName: "screenPageViews"}, desc: true}],
      limit: 10,
    });

    const popularPages = popularPagesResponse.rows?.map((row) => ({
      name: getDimensionValue(row, "pagePath"),
      views: getMetricValue(row, "screenPageViews"),
    })) || [];

    // --- 4. Fetch Device Data ---
    const [deviceResponse] = await analyticsDataClient.runReport({
      property: propertyPath,
      dateRanges: dateRanges,
      dimensions: [{name: "deviceCategory"}],
      metrics: [{name: "totalUsers"}],
    });

    const deviceData = deviceResponse.rows?.map((row) => ({
      name: getDimensionValue(row, "deviceCategory"),
      value: getMetricValue(row, "totalUsers"),
    })) || [];

    // --- 5. Fetch Audience Data (New vs Returning) ---
    const [audienceResponse] = await analyticsDataClient.runReport({
      property: propertyPath,
      dateRanges: dateRanges,
      dimensions: [{name: "newVsReturning"}],
      metrics: [{name: "totalUsers"}],
    });

    const audienceData = audienceResponse.rows?.map((row) => ({
      name: getDimensionValue(row, "newVsReturning"),
      value: getMetricValue(row, "totalUsers"),
    })) || [];


    // --- 6. Fetch Audience Age Data ---
    const [ageResponse] = await analyticsDataClient.runReport({
      property: propertyPath,
      dateRanges: dateRanges,
      dimensions: [{name: "userAgeBracket"}],
      metrics: [{name: "totalUsers"}],
      orderBys: [{dimension: {dimensionName: "userAgeBracket"}, orderType: "ALPHANUMERIC"}],
    });

    const audienceAge = ageResponse.rows?.map((row) => ({
      name: getDimensionValue(row, "userAgeBracket").replace("age", ""), // Clean up label
      users: getMetricValue(row, "totalUsers"),
    })) || [];

    // --- 7. Fetch Conversion Sources ---
    // Using sessionSourceMedium and conversions metric
    const [sourceResponse] = await analyticsDataClient.runReport({
      property: propertyPath,
      dateRanges: dateRanges,
      dimensions: [{name: "sessionSourceMedium"}],
      metrics: [{name: "conversions"}],
      orderBys: [{metric: {metricName: "conversions"}, desc: true}],
      limit: 10, // Limit to top 10 sources
    });

    const conversionSources = sourceResponse.rows?.map((row) => ({
      name: getDimensionValue(row, "sessionSourceMedium"),
      value: getMetricValue(row, "conversions"),
    })) || [];


    // --- Placeholder for Conversion Time Series ---
    // Fetching this requires more specific GA API calls or might not be directly available
    const conversionTimeSeries: { name: string; bookings: number; inquiries: number }[] = []; // Placeholder


    // --- Construct the final response ---
    const responseData: AnalyticsApiResponse = {
      stats,
      pageViewsTimeSeries,
      popularPages,
      deviceData,
      audienceData,
      audienceAge, // Now fetched
      conversionTimeSeries, // Still placeholder
      conversionSources, // Now fetched
    };

    return responseData;
  } catch (error) {
    console.error("Error fetching Google Analytics data:", error);
    if (error instanceof Error) {
      throw new functions.https.HttpsError("internal", `Failed to fetch analytics: ${error.message}`);
    } else {
      throw new functions.https.HttpsError("internal", "An unknown error occurred while fetching analytics.");
    }
  }
});

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsData = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const data_1 = require("@google-analytics/data");
const date_fns_1 = require("date-fns");
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
const analyticsDataClient = new data_1.BetaAnalyticsDataClient();
// Helper function to format GA duration (seconds) to MM:SS string
function formatDuration(secondsStr) {
    const seconds = parseFloat(secondsStr || "0");
    if (isNaN(seconds) || seconds === 0) {
        return "0:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
// Helper function to safely get metric value
function getMetricValue(row, // Type properly based on GA API response if needed
metricName) {
    var _a;
    const metric = (_a = row.metricValues) === null || _a === void 0 ? void 0 : _a.find((m) => { var _a; return ((_a = m.metric) === null || _a === void 0 ? void 0 : _a.name) === metricName; });
    return metric ? parseInt(metric.value || "0", 10) : 0;
}
// Helper function to safely get dimension value
function getDimensionValue(row, // Type properly based on GA API response if needed
dimensionName) {
    var _a;
    const dimension = (_a = row.dimensionValues) === null || _a === void 0 ? void 0 : _a.find((d) => { var _a; return ((_a = d.dimension) === null || _a === void 0 ? void 0 : _a.name) === dimensionName; });
    return (dimension === null || dimension === void 0 ? void 0 : dimension.value) || "Unknown";
}
exports.getAnalyticsData = functions.https.onCall(async (data, context) => {
    // Optional: Add authentication check if needed
    // if (!context.auth) {
    //   throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
    // }
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    if (!GA4_PROPERTY_ID || GA4_PROPERTY_ID === "YOUR_GA4_PROPERTY_ID") {
        console.error("GA4 Property ID is not configured.");
        throw new functions.https.HttpsError("internal", "Analytics configuration missing.");
    }
    const propertyPath = `properties/${GA4_PROPERTY_ID}`;
    const dateRanges = [{
            startDate: (0, date_fns_1.format)((0, date_fns_1.subDays)(new Date(), 30), "yyyy-MM-dd"),
            endDate: (0, date_fns_1.format)(new Date(), "yyyy-MM-dd"),
        }];
    try {
        // --- 1. Fetch Summary Stats ---
        const [summaryResponse] = await analyticsDataClient.runReport({
            property: propertyPath,
            dateRanges: dateRanges,
            metrics: [
                { name: "screenPageViews" },
                { name: "totalUsers" },
                { name: "sessionConversionRate" },
                { name: "averageSessionDuration" },
                { name: "conversions" }, // Use 'conversions' as proxy for inquiries/bookings
            ],
        });
        const summaryRow = (_a = summaryResponse.rows) === null || _a === void 0 ? void 0 : _a[0];
        const totalViews = summaryRow ? getMetricValue(summaryRow, "screenPageViews") : 0;
        const totalUsers = summaryRow ? getMetricValue(summaryRow, "totalUsers") : 0;
        const conversionRate = summaryRow ? parseFloat(((_c = (_b = summaryRow.metricValues) === null || _b === void 0 ? void 0 : _b.find((m) => { var _a; return ((_a = m.metric) === null || _a === void 0 ? void 0 : _a.name) === "sessionConversionRate"; })) === null || _c === void 0 ? void 0 : _c.value) || "0") * 100 : 0;
        const avgSessionDurationSeconds = summaryRow ? (_e = (_d = summaryRow.metricValues) === null || _d === void 0 ? void 0 : _d.find((m) => { var _a; return ((_a = m.metric) === null || _a === void 0 ? void 0 : _a.name) === "averageSessionDuration"; })) === null || _e === void 0 ? void 0 : _e.value : "0";
        const totalConversions = summaryRow ? getMetricValue(summaryRow, "conversions") : 0; // Total GA conversions
        const stats = {
            totalViews: totalViews,
            totalUsers: totalUsers,
            conversionRate: parseFloat(conversionRate.toFixed(2)),
            avgSessionTime: formatDuration(avgSessionDurationSeconds),
            bookings: 0,
            inquiries: totalConversions, // Using total conversions as proxy
        };
        // --- 2. Fetch Page Views Over Time (Daily for last 30 days) ---
        const [timeSeriesResponse] = await analyticsDataClient.runReport({
            property: propertyPath,
            dateRanges: dateRanges,
            dimensions: [{ name: "date" }],
            metrics: [{ name: "screenPageViews" }],
            orderBys: [{ dimension: { dimensionName: "date" }, orderType: "ALPHANUMERIC" }],
        });
        const pageViewsTimeSeries = ((_f = timeSeriesResponse.rows) === null || _f === void 0 ? void 0 : _f.map((row) => ({
            name: (0, date_fns_1.format)(new Date(getDimensionValue(row, "date")), "MMM d"),
            views: getMetricValue(row, "screenPageViews"),
        }))) || [];
        // --- 3. Fetch Popular Pages ---
        const [popularPagesResponse] = await analyticsDataClient.runReport({
            property: propertyPath,
            dateRanges: dateRanges,
            dimensions: [{ name: "pagePath" }],
            metrics: [{ name: "screenPageViews" }],
            orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
            limit: 10,
        });
        const popularPages = ((_g = popularPagesResponse.rows) === null || _g === void 0 ? void 0 : _g.map((row) => ({
            name: getDimensionValue(row, "pagePath"),
            views: getMetricValue(row, "screenPageViews"),
        }))) || [];
        // --- 4. Fetch Device Data ---
        const [deviceResponse] = await analyticsDataClient.runReport({
            property: propertyPath,
            dateRanges: dateRanges,
            dimensions: [{ name: "deviceCategory" }],
            metrics: [{ name: "totalUsers" }],
        });
        const deviceData = ((_h = deviceResponse.rows) === null || _h === void 0 ? void 0 : _h.map((row) => ({
            name: getDimensionValue(row, "deviceCategory"),
            value: getMetricValue(row, "totalUsers"),
        }))) || [];
        // --- 5. Fetch Audience Data (New vs Returning) ---
        const [audienceResponse] = await analyticsDataClient.runReport({
            property: propertyPath,
            dateRanges: dateRanges,
            dimensions: [{ name: "newVsReturning" }],
            metrics: [{ name: "totalUsers" }],
        });
        const audienceData = ((_j = audienceResponse.rows) === null || _j === void 0 ? void 0 : _j.map((row) => ({
            name: getDimensionValue(row, "newVsReturning"),
            value: getMetricValue(row, "totalUsers"),
        }))) || [];
        // --- 6. Fetch Audience Age Data ---
        const [ageResponse] = await analyticsDataClient.runReport({
            property: propertyPath,
            dateRanges: dateRanges,
            dimensions: [{ name: "userAgeBracket" }],
            metrics: [{ name: "totalUsers" }],
            orderBys: [{ dimension: { dimensionName: "userAgeBracket" }, orderType: "ALPHANUMERIC" }],
        });
        const audienceAge = ((_k = ageResponse.rows) === null || _k === void 0 ? void 0 : _k.map((row) => ({
            name: getDimensionValue(row, "userAgeBracket").replace("age", ""),
            users: getMetricValue(row, "totalUsers"),
        }))) || [];
        // --- 7. Fetch Conversion Sources ---
        // Using sessionSourceMedium and conversions metric
        const [sourceResponse] = await analyticsDataClient.runReport({
            property: propertyPath,
            dateRanges: dateRanges,
            dimensions: [{ name: "sessionSourceMedium" }],
            metrics: [{ name: "conversions" }],
            orderBys: [{ metric: { metricName: "conversions" }, desc: true }],
            limit: 10, // Limit to top 10 sources
        });
        const conversionSources = ((_l = sourceResponse.rows) === null || _l === void 0 ? void 0 : _l.map((row) => ({
            name: getDimensionValue(row, "sessionSourceMedium"),
            value: getMetricValue(row, "conversions"),
        }))) || [];
        // --- Placeholder for Conversion Time Series ---
        // Fetching this requires more specific GA API calls or might not be directly available
        const conversionTimeSeries = []; // Placeholder
        // --- Construct the final response ---
        const responseData = {
            stats,
            pageViewsTimeSeries,
            popularPages,
            deviceData,
            audienceData,
            audienceAge,
            conversionTimeSeries,
            conversionSources, // Now fetched
        };
        return responseData;
    }
    catch (error) {
        console.error("Error fetching Google Analytics data:", error);
        if (error instanceof Error) {
            throw new functions.https.HttpsError("internal", `Failed to fetch analytics: ${error.message}`);
        }
        else {
            throw new functions.https.HttpsError("internal", "An unknown error occurred while fetching analytics.");
        }
    }
});
//# sourceMappingURL=analyticsApi.js.map
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
// SpanStatus import removed; setStatus calls will be removed due to persistent typing issues.
import * as functions from "firebase-functions";
import { z } from "zod"; // Import Zod

// Import other function modules
import * as emailFunctions from "./email";
import { sendLeadEmails } from "./admin-email";
import { getGrokPackageSuggestion as getGrokPackageSuggestionFromBackend } from "./grokAIBackend";
import { getAnthropicPackageSuggestion } from "./anthropicAIBackend";

const SENTRY_DSN = "https://1fb81719800e469ccfc621e5f4b02e07@o4509517571620864.ingest.us.sentry.io/4509517580664832";

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    environment: process.env.FUNCTIONS_EMULATOR === 'true' ? 'emulator' : functions.config().sentry?.environment || process.env.NODE_ENV || 'production',
  });
  console.log("Sentry initialized for Firebase Functions.");
} else {
  console.warn("Sentry DSN not found. Sentry will not be initialized for Firebase Functions.");
}

// --- Helper to wrap async functions for Sentry ---
function wrapSentryAsync<T extends (...args: any[]) => Promise<any>>(
  op: string,
  handlerName: string,
  func: T
): T {
  if (!SENTRY_DSN) return func;

  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    // For event-driven functions (like Firestore triggers), args are [data, context]
    // For HTTPS onCall, args are [data, context]
    // For HTTPS onRequest, args are [req, res]
    const contextArg = args[1] as functions.EventContext | functions.https.CallableContext | undefined;
    const reqArg = args[0] as functions.https.Request | undefined;

    return Sentry.startSpan({ name: handlerName, op }, async (span) => { // span type will be inferred
      try {
        if (contextArg && 'params' in contextArg) { // EventContext
          Sentry.setContext("firebase_event_context", { ...contextArg, params: contextArg.params });
          Sentry.setTag("trigger.event_id", contextArg.eventId);
        } else if (contextArg && 'auth' in contextArg) { // CallableContext
          Sentry.setContext("firebase_callable_context", { auth: contextArg.auth, instanceIdToken: contextArg.instanceIdToken });
          if (contextArg.auth) Sentry.setUser({ id: contextArg.auth.uid });
        } else if (reqArg && 'method' in reqArg) { // Request
           Sentry.setContext("http_request", { url: reqArg.url, method: reqArg.method, headers: reqArg.headers, query: reqArg.query, body: reqArg.body });
        }
        
        const result = await func(...args);
        // if (span) span.setStatus(SpanStatus.Ok); // Temporarily removed due to typing issues
        return result;
      } catch (e:any) {
        Sentry.captureException(e);
        // if (span) span.setStatus(SpanStatus.InternalError); // Temporarily removed
        throw e; // Re-throw the error to ensure Firebase marks the function as failed
      }
    });
  }) as T;
}

// --- Zod Schemas for Callable Functions ---
const generateContentSchema = z.object({
  type: z.string().min(1, { message: "Content type is required" }),
  context: z.object({
    clientName: z.string().optional(),
    // Add other expected context fields here if necessary
  }).passthrough(), // Allow other fields in context if not strictly defined
});

// --- Exported Functions ---

export const sendEmailWithSMTP = emailFunctions.sendEmailWithSMTP; // Not wrapping helpers directly
export const sendEmail = emailFunctions.sendEmail; // Not wrapping helpers directly
export { getAnthropicPackageSuggestion }; // Not wrapping helpers directly
export { getGrokPackageSuggestionFromBackend as getGrokPackageSuggestion }; // Not wrapping helpers directly

export const onLeadCreatedWithAdmin = functions.firestore
  .document('leads/{leadId}')
  .onCreate(
    wrapSentryAsync("function.firestore.trigger", "onLeadCreatedWithAdmin", async (snapshot, context) => {
      const leadId = context.params.leadId;
      const leadData = snapshot.data();
      Sentry.setTag("leadId", leadId);
      console.log(`onLeadCreatedWithAdmin: New lead created with ID ${leadId}`);
      const emailResult = await sendLeadEmails(leadId, leadData);
      console.log(`onLeadCreatedWithAdmin: Emails sent for lead ${leadId}:`, emailResult);
      return emailResult;
    })
  );

export const analyticsEndpoint = functions.https.onRequest(
  wrapSentryAsync("function.http", "analyticsEndpoint", async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(200).send();
      return;
    }
    // In a real scenario, fetch actual analytics data here
    const mockAnalyticsData = {
      stats: { totalViews: 1250, totalUsers: 890, conversionRate: 3.2, avgSessionTime: "2:45", bookings: 12, inquiries: 45 },
      // Add other mock data structures as needed
    };
    res.status(200).json(mockAnalyticsData);
  })
);

export const generateContentWithGrok = functions.https.onCall(
  wrapSentryAsync("function.callable", "generateContentWithGrok", async (data, context) => {
    // Validate input data
    const validationResult = generateContentSchema.safeParse(data);
    if (!validationResult.success) {
      console.error("Invalid input for generateContentWithGrok:", validationResult.error.flatten());
      // It's good practice to throw an HttpsError for invalid arguments in callable functions
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid data provided.",
        validationResult.error.flatten().fieldErrors
      );
    }

    const { type, context: contentContext } = validationResult.data; // Use validated data
    Sentry.setContext("generation_request", { type, clientName: contentContext?.clientName });

    const fallbackContent = {
      'sneak-peek-caption': `✨ Another magical moment captured! ${contentContext.clientName ? `Congratulations ${contentContext.clientName}!` : ''} #NJWeddingPhotographer #HarielXavierPhotography #LoveStory`,
      'email-follow-up': `Hi ${contentContext.clientName || 'there'}! Thank you for your interest in Hariel Xavier Photography. We're excited to discuss capturing your special day. Let's schedule a time to chat about your vision!`,
      'social-post': 'Love is in the air! ✨ Another beautiful couple choosing us to capture their forever moments. Book your consultation today! #WeddingPhotography #NewJersey',
      'upsell-email': `Hi ${contentContext.clientName || 'there'}! We have some exciting add-ons that could make your wedding photography even more special. Let's discuss how we can enhance your package!`
    };
    const generatedText = fallbackContent[type as keyof typeof fallbackContent] || 'Thank you for choosing Hariel Xavier Photography!';
    const responseContent = {
      content: generatedText,
      tone: 'professional' as const,
      hashtags: type === 'sneak-peek-caption' ? ['#NJWeddingPhotographer', '#HarielXavierPhotography'] : undefined
    };
    return { success: true, content: responseContent };
  })
);

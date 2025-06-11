// Import all function modules
import * as emailFunctions from "./email";
import * as functions from "firebase-functions";
import { sendLeadEmails } from "./admin-email";
import { getGrokPackageSuggestion as getGrokPackageSuggestionFromBackend } from "./grokAIBackend"; // Added import
// import * as analyticsApi from "./analyticsApi"; // Temporarily disabled due to build errors

// Export the original functions
export const sendEmailWithSMTP = emailFunctions.sendEmailWithSMTP;
export const sendEmail = emailFunctions.sendEmail;

// Export the analytics function - temporarily disabled
// export const getAnalyticsData = analyticsApi.getAnalyticsData;

// Create a new Firestore trigger that uses our admin-email module
export const onLeadCreatedWithAdmin = functions.firestore
  .document('leads/{leadId}')
  .onCreate(async (snapshot, context) => {
    const leadId = context.params.leadId;
    const leadData = snapshot.data();
    
    console.log(`onLeadCreatedWithAdmin: New lead created with ID ${leadId}`);
    
    try {
      // Send emails using the admin-email module
      const emailResult = await sendLeadEmails(leadId, leadData);
      
      console.log(`onLeadCreatedWithAdmin: Emails sent for lead ${leadId}:`, emailResult);
      
      return emailResult;
    } catch (error) {
      console.error(`onLeadCreatedWithAdmin: Error sending emails for lead ${leadId}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

// Analytics endpoint for frontend
export const analyticsEndpoint = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).send();
    return;
  }

  try {
    // Return mock analytics data for now to prevent 404 errors
    const mockAnalyticsData = {
      stats: {
        totalViews: 1250,
        totalUsers: 890,
        conversionRate: 3.2,
        avgSessionTime: "2:45",
        bookings: 12,
        inquiries: 45
      },
      pageViewsTimeSeries: [
        { name: "Jan 1", views: 120 },
        { name: "Jan 2", views: 135 },
        { name: "Jan 3", views: 98 },
        { name: "Jan 4", views: 156 },
        { name: "Jan 5", views: 142 }
      ],
      popularPages: [
        { name: "/", views: 450 },
        { name: "/pricing", views: 320 },
        { name: "/portfolio", views: 280 },
        { name: "/contact", views: 200 }
      ],
      deviceData: [
        { name: "Desktop", value: 60 },
        { name: "Mobile", value: 35 },
        { name: "Tablet", value: 5 }
      ],
      audienceData: [
        { name: "New Visitors", value: 70 },
        { name: "Returning Visitors", value: 30 }
      ],
      audienceAge: [
        { name: "18-24", users: 45 },
        { name: "25-34", users: 320 },
        { name: "35-44", users: 280 },
        { name: "45-54", users: 150 }
      ],
      conversionTimeSeries: [
        { name: "Week 1", bookings: 3, inquiries: 12 },
        { name: "Week 2", bookings: 2, inquiries: 8 },
        { name: "Week 3", bookings: 4, inquiries: 15 },
        { name: "Week 4", bookings: 3, inquiries: 10 }
      ],
      conversionSources: [
        { name: "Google Search", value: 45 },
        { name: "Instagram", value: 25 },
        { name: "Facebook", value: 15 },
        { name: "Direct", value: 15 }
      ]
    };

    res.status(200).json(mockAnalyticsData);
  } catch (error) {
    console.error('Analytics endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Export our new Grok AI function
export const getGrokPackageSuggestion = getGrokPackageSuggestionFromBackend;

/*
// Grok AI package recommendation endpoint (simplified version) - COMMENTED OUT to avoid conflict
export const getPackageRecommendationWithGrok = functions.https.onCall(async (data, context) => {
  try {
    const { quizData } = data;
    
    // Simple rule-based recommendation as fallback
    let recommendedPackage = 'timeless';
    
    if (quizData.guestCount > 150 || quizData.budgetRange === 'above-8k') {
      recommendedPackage = 'masterpiece';
    } else if (quizData.guestCount > 100 || quizData.budgetRange === '5k-8k') {
      recommendedPackage = 'heritage';
    } else if (quizData.budgetRange === 'under-3k') {
      recommendedPackage = 'essential';
    }

    const recommendation = {
      recommendedPackage,
      confidence: 85,
      reasoning: `Based on your ${quizData.guestCount} guests and ${quizData.budgetRange} budget, this package offers the best value for your ${quizData.weddingStyle} wedding.`,
      suggestedAddOns: [
        {
          addOnId: 'drone',
          name: 'Drone Coverage',
          price: 245,
          reasoning: 'Aerial shots would be perfect for your venue type.',
          priority: 'medium'
        }
      ],
      personalizedMessage: `We're excited to capture your special day! The ${recommendedPackage} package is perfect for your vision.`
    };

    return {
      success: true,
      recommendation
    };
  } catch (error) {
    console.error('Error getting package recommendation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});
*/

// Content generation endpoint (simplified version)
export const generateContentWithGrok = functions.https.onCall(async (data, context) => {
  try {
    const { type, context: contentContext } = data;
    
    const fallbackContent = {
      'sneak-peek-caption': `✨ Another magical moment captured! ${contentContext.clientName ? `Congratulations ${contentContext.clientName}!` : ''} #NJWeddingPhotographer #HarielXavierPhotography #LoveStory`,
      'email-follow-up': `Hi ${contentContext.clientName || 'there'}! Thank you for your interest in Hariel Xavier Photography. We're excited to discuss capturing your special day. Let's schedule a time to chat about your vision!`,
      'social-post': 'Love is in the air! ✨ Another beautiful couple choosing us to capture their forever moments. Book your consultation today! #WeddingPhotography #NewJersey',
      'upsell-email': `Hi ${contentContext.clientName || 'there'}! We have some exciting add-ons that could make your wedding photography even more special. Let's discuss how we can enhance your package!`
    };

    const content = {
      content: fallbackContent[type as keyof typeof fallbackContent] || 'Thank you for choosing Hariel Xavier Photography!',
      tone: 'professional' as const,
      hashtags: type === 'sneak-peek-caption' ? ['#NJWeddingPhotographer', '#HarielXavierPhotography'] : undefined
    };

    return {
      success: true,
      content
    };
  } catch (error) {
    console.error('Error generating content:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});

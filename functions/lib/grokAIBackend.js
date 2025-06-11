"use strict";
/**
 * Grok AI Backend Service for Firebase Functions
 *
 * This is the backend version of the Grok AI service that runs in Firebase Functions
 * and handles AI-powered package recommendations and content generation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.grokAI = void 0;
class GrokAIBackendService {
    constructor() {
        this.baseUrl = 'https://api.x.ai/v1';
        // Use environment variable or fallback to hardcoded key
        this.apiKey = process.env.GROK_API_KEY || 'xai-KeUNf3srwQp9bTQU90gZwysz7mO6dEnf5naCwiDKJB3kSVu2zBZE73vAHmhjZ3QDQQ5TqTWghJe5LpSl';
    }
    /**
     * Get AI-powered package recommendation based on quiz responses
     */
    async getPackageRecommendation(quizData) {
        const prompt = this.buildRecommendationPrompt(quizData);
        try {
            const response = await this.callGrokAPI(prompt, {
                temperature: 0.7,
                maxTokens: 1000
            });
            return this.parseRecommendationResponse(response);
        }
        catch (error) {
            console.error('Error getting package recommendation:', error);
            return this.getFallbackRecommendation(quizData);
        }
    }
    /**
     * Generate personalized content using Grok AI
     */
    async generateContent(request) {
        const prompt = this.buildContentPrompt(request);
        try {
            const response = await this.callGrokAPI(prompt, {
                temperature: 0.8,
                maxTokens: 500
            });
            return this.parseContentResponse(response, request.type);
        }
        catch (error) {
            console.error('Error generating content:', error);
            return this.getFallbackContent(request.type);
        }
    }
    /**
     * Core Grok API call method
     */
    async callGrokAPI(prompt, options) {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'grok-beta',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert wedding photography consultant for Hariel Xavier Photography, a luxury photographer in New Jersey. You understand the emotional and artistic aspects of wedding photography and can provide personalized recommendations.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: options.temperature,
                max_tokens: options.maxTokens
            })
        });
        if (!response.ok) {
            throw new Error(`Grok API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.choices[0].message.content;
    }
    /**
     * Build recommendation prompt for Grok
     */
    buildRecommendationPrompt(quizData) {
        return `
As an expert wedding photography consultant for Hariel Xavier Photography, analyze this couple's quiz responses and recommend the perfect package.

AVAILABLE PACKAGES:
1. The Essential ($2,395)
   - 6 hours coverage, 400 edited images
   - Online gallery, 3-month hosting
   - 5 sneak peeks within 48 hours
   - Best for: Intimate weddings, budget-conscious couples

2. The Timeless ($2,995) [MOST POPULAR]
   - 8 hours coverage, 600 edited images
   - Engagement session included
   - 1-year gallery hosting
   - 10 sneak peeks within 24 hours
   - Best for: Traditional weddings, couples wanting engagement photos

3. The Heritage ($3,895)
   - 9 hours with 2 photographers
   - 800 edited images, lifetime hosting
   - Engagement session, luxury print box
   - 15 sneak peeks within 24 hours
   - Best for: Larger weddings, couples wanting comprehensive coverage

4. The Masterpiece ($5,395) [MOST POPULAR PREMIUM]
   - 10 hours with 2 photographers
   - 1000 edited images, luxury album included
   - Parent albums, rehearsal dinner coverage
   - Priority editing, next-day preview blog
   - Best for: Luxury weddings, couples wanting the full experience

CLIENT PROFILE:
- Guest Count: ${quizData.guestCount}
- Venue Type: ${quizData.venueType}
- Budget Range: ${quizData.budgetRange}
- Social Media Focus: ${quizData.socialFocus}
- Wedding Style: ${quizData.weddingStyle}
- Photography Priority: ${quizData.photographyPriority}
- Special Needs: ${quizData.specialNeeds.join(', ')}
- Timeline Flexibility: ${quizData.timelineFlexibility}

Provide a JSON response with:
{
  "recommendedPackage": "package-name",
  "confidence": 0-100,
  "reasoning": "detailed explanation why this package fits",
  "suggestedAddOns": [
    {
      "addOnId": "addon-id",
      "name": "Add-on Name",
      "price": 000,
      "reasoning": "why this add-on makes sense",
      "priority": "high/medium/low"
    }
  ],
  "personalizedMessage": "warm, personal message explaining the recommendation"
}

Focus on emotional connection and value, not just features. Be persuasive but authentic.
`;
    }
    /**
     * Build content generation prompt
     */
    buildContentPrompt(request) {
        const { type, context } = request;
        const basePrompt = `
You are creating ${type} content for Hariel Xavier Photography, a luxury wedding photographer in New Jersey.

BRAND VOICE: Elegant, warm, professional, emotionally connected
STYLE: Sophisticated but approachable, focuses on memories and emotions
TARGET AUDIENCE: Affluent couples in NJ/NY area, values quality and experience

CONTEXT:
${Object.entries(context).map(([key, value]) => `- ${key}: ${value}`).join('\n')}
`;
        switch (type) {
            case 'sneak-peek-caption':
                return `${basePrompt}

Create an Instagram caption for sneak peek photos. Include:
- Emotional hook about the moment captured
- Mention of the couple (if names provided)
- Relevant hashtags for NJ wedding photography
- Call to action for booking consultations

Keep it under 150 words, engaging and shareable.`;
            case 'email-follow-up':
                return `${basePrompt}

Create a personalized follow-up email. Include:
- Warm greeting referencing their consultation/inquiry
- Recap of their wedding vision
- Gentle reminder about booking
- Next steps
- Professional but friendly tone

Keep it under 200 words.`;
            case 'social-post':
                return `${basePrompt}

Create a social media post showcasing recent work. Include:
- Engaging caption about the wedding/couple
- Behind-the-scenes insight
- Relevant hashtags
- Call to action

Keep it engaging and authentic.`;
            case 'upsell-email':
                return `${basePrompt}

Create an upsell email for existing clients. Include:
- Personal greeting
- Explanation of additional service value
- Limited-time offer if applicable
- Easy next steps

Keep it helpful, not pushy.`;
            default:
                return basePrompt;
        }
    }
    /**
     * Parse recommendation response from Grok
     */
    parseRecommendationResponse(response) {
        try {
            // Clean up response and parse JSON
            const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleanResponse);
        }
        catch (error) {
            console.error('Error parsing recommendation response:', error);
            return this.getFallbackRecommendation({});
        }
    }
    /**
     * Parse content response from Grok
     */
    parseContentResponse(response, type) {
        try {
            // If response is JSON, parse it; otherwise treat as plain text
            if (response.trim().startsWith('{')) {
                return JSON.parse(response);
            }
            return {
                content: response.trim(),
                tone: 'professional',
                hashtags: type === 'sneak-peek-caption' ? ['#NJWeddingPhotographer', '#HarielXavierPhotography'] : undefined
            };
        }
        catch (error) {
            console.error('Error parsing content response:', error);
            return this.getFallbackContent(type);
        }
    }
    /**
     * Fallback recommendation if AI fails
     */
    getFallbackRecommendation(quizData) {
        // Simple rule-based fallback
        let recommendedPackage = 'timeless';
        if (quizData.guestCount > 150 || quizData.budgetRange === 'above-8k') {
            recommendedPackage = 'masterpiece';
        }
        else if (quizData.guestCount > 100 || quizData.budgetRange === '5k-8k') {
            recommendedPackage = 'heritage';
        }
        else if (quizData.budgetRange === 'under-3k') {
            recommendedPackage = 'essential';
        }
        return {
            recommendedPackage,
            confidence: 75,
            reasoning: 'Based on your wedding size and preferences, this package offers the best value for your needs.',
            suggestedAddOns: [],
            personalizedMessage: 'We recommend this package based on your wedding details. Let\'s discuss how we can make your day perfect!'
        };
    }
    /**
     * Fallback content if AI fails
     */
    getFallbackContent(type) {
        const fallbackContent = {
            'sneak-peek-caption': 'Another beautiful moment captured! ✨ #NJWeddingPhotographer #HarielXavierPhotography',
            'email-follow-up': 'Thank you for your interest in Hariel Xavier Photography. We\'d love to discuss your wedding photography needs.',
            'social-post': 'Capturing love stories across New Jersey. Book your consultation today!',
            'upsell-email': 'We have some exciting add-ons that could enhance your wedding photography experience.'
        };
        return {
            content: fallbackContent[type] || 'Thank you for choosing Hariel Xavier Photography!',
            tone: 'professional'
        };
    }
}
exports.grokAI = new GrokAIBackendService();
exports.default = GrokAIBackendService;
//# sourceMappingURL=grokAIBackend.js.map
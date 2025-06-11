interface EmailThread {
  id: string;
  clientId: string;
  jobId: string;
  emails: Email[];
  overallSentiment: SentimentScore;
  lastAnalyzed: Date;
}

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
  sentiment: SentimentScore;
  emotionalMarkers: EmotionalMarker[];
}

interface SentimentScore {
  overall: number; // -1 to 1 (negative to positive)
  confidence: number; // 0 to 1
  emotions: {
    joy: number;
    anger: number;
    fear: number;
    sadness: number;
    anxiety: number;
    excitement: number;
    satisfaction: number;
    frustration: number;
  };
  urgency: 'low' | 'medium' | 'high';
  stress_level: 'calm' | 'concerned' | 'stressed' | 'overwhelmed';
}

interface EmotionalMarker {
  phrase: string;
  emotion: string;
  intensity: number; // 0 to 1
  context: string;
}

interface ReminderTone {
  style: 'professional' | 'warm' | 'empathic' | 'urgent' | 'celebratory';
  greeting: string;
  body_tone: string;
  closing: string;
  urgency_level: 'low' | 'medium' | 'high';
  include_reassurance: boolean;
  include_flexibility: boolean;
}

interface CommunicationContext {
  client_name: string;
  job_type: string;
  days_until_event: number;
  payment_status: 'current' | 'overdue' | 'partial';
  deliverable_status: 'on_track' | 'delayed' | 'overdue';
  previous_interactions: number;
  client_responsiveness: 'fast' | 'normal' | 'slow';
}

class SentimentAnalysisService {
  private openaiApiKey: string;
  private sentimentCache: Map<string, SentimentScore> = new Map();
  
  constructor() {
    this.openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
  }

  /**
   * Analyze sentiment of an email thread
   */
  async analyzeEmailThread(emails: Email[]): Promise<SentimentScore> {
    try {
      // Get recent emails (last 3-5 for context)
      const recentEmails = emails.slice(-5);
      const emailText = recentEmails.map(email => 
        `From: ${email.from}\nSubject: ${email.subject}\nBody: ${email.body}`
      ).join('\n\n---\n\n');

      // Check cache first
      const cacheKey = this.generateCacheKey(emailText);
      if (this.sentimentCache.has(cacheKey)) {
        return this.sentimentCache.get(cacheKey)!;
      }

      // Analyze with OpenAI
      const sentiment = await this.analyzeWithOpenAI(emailText);
      
      // Cache the result
      this.sentimentCache.set(cacheKey, sentiment);
      
      return sentiment;
      
    } catch (error) {
      console.error('Error analyzing email sentiment:', error);
      
      // Return neutral sentiment as fallback
      return {
        overall: 0,
        confidence: 0.5,
        emotions: {
          joy: 0.1,
          anger: 0.1,
          fear: 0.1,
          sadness: 0.1,
          anxiety: 0.1,
          excitement: 0.1,
          satisfaction: 0.1,
          frustration: 0.1
        },
        urgency: 'medium',
        stress_level: 'calm'
      };
    }
  }

  /**
   * Analyze sentiment using OpenAI GPT
   */
  private async analyzeWithOpenAI(emailText: string): Promise<SentimentScore> {
    const prompt = `
Analyze the sentiment and emotional tone of this email thread between a photographer and client. 
Focus on the CLIENT'S emotional state and stress level.

Email Thread:
${emailText}

Return a JSON response with this exact structure:
{
  "overall": <number between -1 and 1>,
  "confidence": <number between 0 and 1>,
  "emotions": {
    "joy": <0 to 1>,
    "anger": <0 to 1>,
    "fear": <0 to 1>,
    "sadness": <0 to 1>,
    "anxiety": <0 to 1>,
    "excitement": <0 to 1>,
    "satisfaction": <0 to 1>,
    "frustration": <0 to 1>
  },
  "urgency": "<low|medium|high>",
  "stress_level": "<calm|concerned|stressed|overwhelmed>"
}

Consider:
- Wedding stress and timeline pressure
- Payment concerns or delays
- Communication responsiveness
- Excitement vs anxiety about the event
- Satisfaction with service so far
- Any expressed frustrations or concerns
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in emotional intelligence and client communication analysis. Return only valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Invalid JSON response from OpenAI');
    }
  }

  /**
   * Generate appropriate reminder tone based on sentiment
   */
  generateReminderTone(
    sentiment: SentimentScore,
    context: CommunicationContext
  ): ReminderTone {
    const { overall, emotions, stress_level, urgency } = sentiment;
    const { days_until_event, payment_status, deliverable_status } = context;

    // Determine base style
    let style: ReminderTone['style'] = 'professional';
    
    if (stress_level === 'overwhelmed' || emotions.anxiety > 0.7) {
      style = 'empathic';
    } else if (stress_level === 'stressed' || emotions.frustration > 0.6) {
      style = 'warm';
    } else if (emotions.excitement > 0.7 || emotions.joy > 0.6) {
      style = 'celebratory';
    } else if (urgency === 'high' || payment_status === 'overdue') {
      style = 'urgent';
    } else if (overall > 0.3) {
      style = 'warm';
    }

    // Generate tone components
    const greeting = this.generateGreeting(style, context);
    const bodyTone = this.generateBodyTone(style, sentiment, context);
    const closing = this.generateClosing(style, context);

    // Determine if reassurance is needed
    const includeReassurance = 
      stress_level === 'stressed' || 
      stress_level === 'overwhelmed' ||
      emotions.anxiety > 0.5 ||
      emotions.fear > 0.4;

    // Determine if flexibility should be offered
    const includeFlexibility = 
      emotions.frustration > 0.5 ||
      stress_level === 'overwhelmed' ||
      deliverable_status === 'delayed';

    return {
      style,
      greeting,
      body_tone: bodyTone,
      closing,
      urgency_level: urgency,
      include_reassurance: includeReassurance,
      include_flexibility: includeFlexibility
    };
  }

  /**
   * Generate personalized greeting
   */
  private generateGreeting(style: ReminderTone['style'], context: CommunicationContext): string {
    const { client_name, days_until_event } = context;
    
    const greetings = {
      professional: `Hi ${client_name},`,
      warm: `Hello ${client_name}!`,
      empathic: `Hi ${client_name}, I hope you're doing well.`,
      urgent: `Hi ${client_name},`,
      celebratory: `Hello ${client_name}! I hope you're getting excited!`
    };

    let greeting = greetings[style];

    // Add event proximity context for celebratory style
    if (style === 'celebratory' && days_until_event <= 30) {
      greeting += ` With your big day just ${days_until_event} days away,`;
    }

    return greeting;
  }

  /**
   * Generate body tone guidance
   */
  private generateBodyTone(
    style: ReminderTone['style'], 
    sentiment: SentimentScore, 
    context: CommunicationContext
  ): string {
    const toneGuidance = {
      professional: 'Use clear, direct language. Be respectful and efficient.',
      warm: 'Use friendly, approachable language. Show personal interest in their event.',
      empathic: 'Acknowledge their stress. Use reassuring language. Offer support and understanding.',
      urgent: 'Be direct but not harsh. Emphasize importance without creating panic.',
      celebratory: 'Share in their excitement. Use positive, upbeat language.'
    };

    let guidance = toneGuidance[style];

    // Add specific guidance based on sentiment
    if (sentiment.emotions.anxiety > 0.6) {
      guidance += ' Provide reassurance about timeline and process.';
    }
    
    if (sentiment.emotions.frustration > 0.5) {
      guidance += ' Acknowledge any concerns and offer solutions.';
    }

    if (context.deliverable_status === 'delayed') {
      guidance += ' Be transparent about delays and provide clear next steps.';
    }

    return guidance;
  }

  /**
   * Generate appropriate closing
   */
  private generateClosing(style: ReminderTone['style'], context: CommunicationContext): string {
    const closings = {
      professional: 'Best regards,',
      warm: 'Looking forward to hearing from you!',
      empathic: 'Please don\'t hesitate to reach out if you have any questions or concerns.',
      urgent: 'Please let me know as soon as possible.',
      celebratory: 'Can\'t wait to capture your special day!'
    };

    return closings[style];
  }

  /**
   * Generate complete reminder email with sentiment-based tone
   */
  async generateReminderEmail(
    emailThread: EmailThread,
    context: CommunicationContext,
    reminderType: 'payment' | 'deliverable' | 'meeting' | 'general'
  ): Promise<{
    subject: string;
    body: string;
    tone: ReminderTone;
    sentiment_analysis: SentimentScore;
  }> {
    // Analyze current sentiment
    const sentiment = await this.analyzeEmailThread(emailThread.emails);
    
    // Generate appropriate tone
    const tone = this.generateReminderTone(sentiment, context);
    
    // Generate email content
    const subject = this.generateSubject(reminderType, tone, context);
    const body = this.generateEmailBody(reminderType, tone, context);

    return {
      subject,
      body,
      tone,
      sentiment_analysis: sentiment
    };
  }

  /**
   * Generate email subject based on tone and type
   */
  private generateSubject(
    type: 'payment' | 'deliverable' | 'meeting' | 'general',
    tone: ReminderTone,
    context: CommunicationContext
  ): string {
    const { client_name, job_type } = context;

    const subjects = {
      payment: {
        professional: `Payment Reminder - ${job_type}`,
        warm: `Quick payment reminder for your ${job_type}`,
        empathic: `Gentle reminder about your ${job_type} payment`,
        urgent: `Important: Payment Required - ${job_type}`,
        celebratory: `Almost ready for your ${job_type}! Quick payment reminder`
      },
      deliverable: {
        professional: `${job_type} Delivery Update`,
        warm: `Your ${job_type} photos are almost ready!`,
        empathic: `Update on your ${job_type} delivery`,
        urgent: `Action Required: ${job_type} Delivery`,
        celebratory: `Exciting update on your ${job_type} photos!`
      },
      meeting: {
        professional: `Meeting Confirmation - ${job_type}`,
        warm: `Looking forward to our ${job_type} meeting!`,
        empathic: `Checking in about our upcoming meeting`,
        urgent: `Important: Meeting Confirmation Required`,
        celebratory: `Excited to plan your ${job_type} together!`
      },
      general: {
        professional: `${job_type} Update`,
        warm: `Quick update on your ${job_type}`,
        empathic: `Checking in on your ${job_type}`,
        urgent: `Important ${job_type} Update`,
        celebratory: `Great news about your ${job_type}!`
      }
    };

    return subjects[type][tone.style];
  }

  /**
   * Generate email body with sentiment-appropriate tone
   */
  private generateEmailBody(
    type: 'payment' | 'deliverable' | 'meeting' | 'general',
    tone: ReminderTone,
    context: CommunicationContext
  ): string {
    let body = tone.greeting + '\n\n';

    // Add reassurance if needed
    if (tone.include_reassurance) {
      body += 'I know planning your wedding can feel overwhelming, and I want you to know that everything is on track and you\'re in great hands. ';
    }

    // Add main content based on type
    body += this.getMainContent(type, tone, context);

    // Add flexibility if needed
    if (tone.include_flexibility) {
      body += '\n\nI understand that things can get hectic during wedding planning. If you need to adjust anything or have concerns, please don\'t hesitate to reach out. I\'m here to make this as smooth as possible for you.';
    }

    // Add closing
    body += '\n\n' + tone.closing;

    return body;
  }

  /**
   * Get main content for email body
   */
  private getMainContent(
    type: 'payment' | 'deliverable' | 'meeting' | 'general',
    tone: ReminderTone,
    context: CommunicationContext
  ): string {

    switch (type) {
      case 'payment':
        if (tone.style === 'empathic') {
          return `I wanted to gently remind you about the remaining balance for your photography package. I know there's a lot to keep track of right now, so I thought a friendly nudge might be helpful.`;
        } else if (tone.style === 'urgent') {
          return `I need to follow up on the outstanding payment for your photography package. To ensure everything stays on schedule, I'll need to receive payment by [date].`;
        } else {
          return `This is a friendly reminder about the remaining balance for your photography package. Payment can be made through [payment method].`;
        }

      case 'deliverable':
        if (tone.style === 'celebratory') {
          return `I have some exciting news! Your photos are ready for delivery. I can't wait for you to see how beautifully everything turned out.`;
        } else if (tone.style === 'empathic') {
          return `I wanted to update you on the progress of your photo editing. I know you're eager to see the results, and I appreciate your patience as I put the finishing touches on your gallery.`;
        } else {
          return `Your photo gallery is ready for review. You can access it through the client portal using the link below.`;
        }

      case 'meeting':
        if (tone.style === 'celebratory') {
          return `I'm so excited to meet with you and go over all the details for your big day! Our meeting is scheduled for [date/time].`;
        } else if (tone.style === 'empathic') {
          return `I wanted to confirm our upcoming meeting on [date/time]. I know you have a lot on your plate, so please let me know if you need to reschedule.`;
        } else {
          return `This is to confirm our meeting scheduled for [date/time]. Please let me know if this still works for your schedule.`;
        }

      default:
        return `I wanted to reach out with a quick update on your photography package.`;
    }
  }

  /**
   * Generate cache key for sentiment analysis
   */
  private generateCacheKey(text: string): string {
    // Simple hash function for caching
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  /**
   * Get sentiment-based communication recommendations
   */
  getSentimentRecommendations(sentiment: SentimentScore): string[] {
    const recommendations: string[] = [];

    if (sentiment.stress_level === 'overwhelmed') {
      recommendations.push('Consider offering a phone call to address concerns directly');
      recommendations.push('Provide extra reassurance about timeline and process');
      recommendations.push('Offer flexibility with deadlines where possible');
    }

    if (sentiment.emotions.anxiety > 0.6) {
      recommendations.push('Include detailed next steps to reduce uncertainty');
      recommendations.push('Provide frequent updates to maintain confidence');
    }

    if (sentiment.emotions.frustration > 0.5) {
      recommendations.push('Acknowledge any previous issues or delays');
      recommendations.push('Offer solutions or alternatives');
      recommendations.push('Consider a personal touch like a handwritten note');
    }

    if (sentiment.emotions.excitement > 0.7) {
      recommendations.push('Match their enthusiasm in your communication');
      recommendations.push('Share behind-the-scenes details or previews');
    }

    if (sentiment.urgency === 'high') {
      recommendations.push('Respond quickly to maintain momentum');
      recommendations.push('Provide clear action items and deadlines');
    }

    return recommendations;
  }
}

export default SentimentAnalysisService;
export type { 
  SentimentScore, 
  ReminderTone, 
  EmailThread, 
  Email, 
  CommunicationContext,
  EmotionalMarker
};

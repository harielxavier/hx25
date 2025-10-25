import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client with API key from environment
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

export interface ClaudeResponse {
  content: string;
  tokens?: {
    input: number;
    output: number;
  };
}

/**
 * Generate SEO-optimized content for photography website
 */
export async function generateSEOContent(params: {
  topic: string;
  keywords: string[];
  type: 'blog' | 'page' | 'gallery';
  location?: string;
}): Promise<ClaudeResponse> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Generate SEO-optimized content for a luxury wedding photography website.

Topic: ${params.topic}
Keywords to include: ${params.keywords.join(', ')}
Content Type: ${params.type}
${params.location ? `Location: ${params.location}` : ''}

Requirements:
- Compelling H1 title with main keyword
- Meta description (155 characters max)
- Well-structured content with H2 and H3 headers
- Natural keyword placement
- Call-to-action
- Professional, luxury brand tone

Format the response as JSON with these fields:
- title
- metaDescription
- content (HTML formatted)
- keywords (array)`
        }
      ],
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '';

    return {
      content,
      tokens: {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens
      }
    };
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error('Failed to generate SEO content');
  }
}

/**
 * Generate professional client email drafts
 */
export async function generateClientEmail(params: {
  type: 'inquiry_response' | 'booking_confirmation' | 'follow_up';
  clientName: string;
  details: Record<string, any>;
}): Promise<ClaudeResponse> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `Draft a professional email for a luxury wedding photography business.

Email Type: ${params.type.replace('_', ' ')}
Client Name: ${params.clientName}
Details: ${JSON.stringify(params.details, null, 2)}

Requirements:
- Professional yet warm and personal tone
- Luxury service level communication
- Clear call-to-action
- Contact information in signature

Format with:
- Subject line
- Email body
- Professional signature`
        }
      ],
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '';

    return {
      content,
      tokens: {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens
      }
    };
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error('Failed to generate email');
  }
}

/**
 * Analyze business metrics and provide insights
 */
export async function analyzeBusinessMetrics(data: {
  bookings: Array<{date: string; revenue: number; type: string}>;
  inquiries: Array<{date: string; source: string; converted: boolean}>;
  period: string;
}): Promise<ClaudeResponse> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `Analyze photography business data and provide actionable insights.

Period: ${data.period}
Total Bookings: ${data.bookings.length}
Total Revenue: $${data.bookings.reduce((sum, b) => sum + b.revenue, 0).toLocaleString()}
Total Inquiries: ${data.inquiries.length}
Conversion Rate: ${((data.inquiries.filter(i => i.converted).length / data.inquiries.length) * 100).toFixed(1)}%

Recent Bookings Sample:
${JSON.stringify(data.bookings.slice(0, 5), null, 2)}

Provide:
1. Revenue trends analysis
2. Booking patterns (seasonal, type preferences)
3. Lead source effectiveness
4. Actionable recommendations for growth
5. Suggested pricing adjustments

Format as structured business report.`
        }
      ],
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '';

    return {
      content,
      tokens: {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens
      }
    };
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error('Failed to analyze metrics');
  }
}

/**
 * Generate image descriptions for SEO and accessibility
 */
export async function generateImageDescription(imageUrl: string): Promise<ClaudeResponse> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this wedding/portrait photo and provide:

1. SEO-optimized alt text (125 chars max)
2. Detailed description for accessibility
3. Keywords for search (5-7 relevant tags)
4. Instagram caption suggestion
5. Mood/style classification (romantic, classic, modern, etc.)

Format as JSON.`
            },
            {
              type: 'image',
              source: {
                type: 'url',
                url: imageUrl,
                media_type: 'image/jpeg'
              }
            }
          ]
        }
      ],
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '';

    return {
      content,
      tokens: {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens
      }
    };
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error('Failed to analyze image');
  }
}

/**
 * Calculate API usage costs
 */
export function calculateCost(tokens: { input: number; output: number }) {
  // Claude 3.5 Sonnet pricing
  const inputCostPer1M = 3.00;  // $3 per million input tokens
  const outputCostPer1M = 15.00; // $15 per million output tokens

  const inputCost = (tokens.input / 1_000_000) * inputCostPer1M;
  const outputCost = (tokens.output / 1_000_000) * outputCostPer1M;

  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
    formattedTotal: `$${(inputCost + outputCost).toFixed(4)}`
  };
}
import { getEnv } from '../utils/envManager';

interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  recommendations: SEORecommendation[];
  keywords: KeywordData[];
  performance: PerformanceMetrics;
}

interface SEOIssue {
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  fix: string;
}

interface SEORecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'content' | 'technical' | 'performance' | 'local';
}

interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  position?: number;
  trend: 'up' | 'down' | 'stable';
  opportunities: string[];
}

interface PerformanceMetrics {
  pageSpeed: number;
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
  mobileUsability: number;
  indexability: number;
}

class SEOService {
  private domain: string;
  private apiKey: string;

  constructor() {
    this.domain = getEnv('VITE_DOMAIN', 'https://harielxavier.com');
    this.apiKey = getEnv('VITE_SEO_API_KEY', '');
  }

  /**
   * Photography-specific keyword research for wedding photographers
   */
  async getPhotographyKeywords(): Promise<KeywordData[]> {
    const baseKeywords = [
      'wedding photographer sparta nj',
      'new jersey wedding photography',
      'engagement photographer near me',
      'bridal portraits sparta',
      'wedding venues new jersey',
      'picatinny club wedding',
      'outdoor wedding photography',
      'romantic wedding photos',
      'candid wedding moments',
      'wedding day timeline',
      'bridal preparation photos',
      'ceremony photography',
      'reception photography',
      'wedding photo packages',
      'affordable wedding photographer',
      'luxury wedding photography',
      'destination wedding photographer',
      'elopement photography',
      'couples photography',
      'anniversary photos'
    ];

    // In a real implementation, this would call actual SEO APIs
    return baseKeywords.map((keyword, index) => ({
      keyword,
      volume: Math.floor(Math.random() * 5000) + 100,
      difficulty: Math.floor(Math.random() * 100),
      position: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 1 : undefined,
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
      opportunities: this.generateKeywordOpportunities(keyword)
    }));
  }

  /**
   * Generate local SEO recommendations for photography business
   */
  async getLocalSEORecommendations(): Promise<SEORecommendation[]> {
    return [
      {
        title: 'Optimize Google My Business Profile',
        description: 'Complete your Google My Business profile with high-quality photos, accurate business hours, and regular posts about recent weddings.',
        priority: 'high',
        category: 'local'
      },
      {
        title: 'Create Location-Specific Landing Pages',
        description: 'Build dedicated pages for each area you serve (Sparta, Morris County, Sussex County) with local keywords and venue information.',
        priority: 'high',
        category: 'content'
      },
      {
        title: 'Collect and Display Client Reviews',
        description: 'Actively request reviews from satisfied clients and display them prominently on your website with schema markup.',
        priority: 'high',
        category: 'local'
      },
      {
        title: 'Build Local Citations',
        description: 'Ensure your business is listed consistently across local directories like The Knot, WeddingWire, and local chamber of commerce.',
        priority: 'medium',
        category: 'local'
      },
      {
        title: 'Create Venue-Specific Content',
        description: 'Write blog posts about popular wedding venues in your area, including photography tips and location highlights.',
        priority: 'medium',
        category: 'content'
      }
    ];
  }

  /**
   * Analyze current SEO performance
   */
  async analyzeSEOPerformance(url: string = this.domain): Promise<SEOAnalysis> {
    // In a real implementation, this would use actual SEO analysis tools
    const mockAnalysis: SEOAnalysis = {
      score: 78,
      issues: await this.identifySEOIssues(),
      recommendations: await this.getLocalSEORecommendations(),
      keywords: await this.getPhotographyKeywords(),
      performance: {
        pageSpeed: 85,
        coreWebVitals: {
          lcp: 2.1,
          fid: 45,
          cls: 0.08
        },
        mobileUsability: 92,
        indexability: 95
      }
    };

    return mockAnalysis;
  }

  /**
   * Identify common SEO issues for photography websites
   */
  async identifySEOIssues(): Promise<SEOIssue[]> {
    return [
      {
        type: 'warning',
        title: 'Image Alt Text Missing',
        description: 'Some gallery images are missing descriptive alt text, which impacts accessibility and SEO.',
        impact: 'medium',
        fix: 'Add descriptive alt text to all images, including couple names and photo descriptions.'
      },
      {
        type: 'info',
        title: 'Schema Markup Opportunities',
        description: 'Add structured data for local business, reviews, and photography services.',
        impact: 'medium',
        fix: 'Implement LocalBusiness, Review, and Service schema markup throughout the site.'
      },
      {
        type: 'warning',
        title: 'Page Load Speed',
        description: 'Some gallery pages load slowly due to large image files.',
        impact: 'high',
        fix: 'Implement lazy loading and optimize images with WebP format and responsive sizing.'
      },
      {
        type: 'info',
        title: 'Internal Linking',
        description: 'Improve internal linking structure between gallery pages and service pages.',
        impact: 'low',
        fix: 'Add contextual links between related galleries and service pages.'
      }
    ];
  }

  /**
   * Generate keyword opportunities
   */
  private generateKeywordOpportunities(keyword: string): string[] {
    const opportunities = [
      'Create dedicated landing page',
      'Add to blog content strategy',
      'Include in image alt text',
      'Use in meta descriptions',
      'Add to FAQ section',
      'Include in testimonials'
    ];

    return opportunities.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  /**
   * Generate SEO-optimized content suggestions
   */
  async getContentSuggestions(): Promise<string[]> {
    return [
      'Ultimate Guide to Wedding Photography in Sparta, NJ',
      'Top 10 Wedding Venues in Morris County for Photography',
      'How to Prepare for Your Engagement Photo Session',
      'Wedding Day Timeline: A Photographer\'s Perspective',
      'Seasonal Wedding Photography: Making the Most of New Jersey\'s Beauty',
      'Bridal Portrait Tips: Looking Your Best on Camera',
      'Choosing the Perfect Wedding Photography Package',
      'Behind the Scenes: A Day in the Life of a Wedding Photographer',
      'Wedding Photography Trends for 2025',
      'How Weather Affects Your Outdoor Wedding Photos'
    ];
  }

  /**
   * Track keyword rankings
   */
  async trackKeywordRankings(keywords: string[]): Promise<{ [key: string]: number }> {
    // Mock implementation - in reality, this would use SEO APIs
    const rankings: { [key: string]: number } = {};
    
    keywords.forEach(keyword => {
      rankings[keyword] = Math.floor(Math.random() * 100) + 1;
    });

    return rankings;
  }

  /**
   * Generate meta descriptions for different page types
   */
  generateMetaDescription(pageType: string, customData?: any): string {
    const descriptions = {
      home: 'Professional wedding photographer in Sparta, NJ. Capturing timeless love stories with a modern approach. Book your consultation today!',
      gallery: `Beautiful ${customData?.coupleName || 'wedding'} photography by Hariel Xavier. View stunning wedding photos from ${customData?.venue || 'New Jersey venues'}.`,
      pricing: 'Wedding photography packages in Sparta, NJ starting at competitive rates. Customizable options for every budget and style.',
      contact: 'Contact Hariel Xavier Photography for your wedding photography needs in Sparta, NJ and surrounding areas. Free consultation available.',
      blog: 'Wedding photography tips, venue guides, and inspiration from professional photographer Hariel Xavier in Sparta, New Jersey.',
      about: 'Meet Hariel Xavier, professional wedding photographer serving Sparta, NJ and surrounding areas. Passionate about capturing your special moments.'
    };

    return descriptions[pageType as keyof typeof descriptions] || descriptions.home;
  }

  /**
   * Generate structured data for different content types
   */
  generateStructuredData(type: string, data: any) {
    const schemas = {
      LocalBusiness: {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${this.domain}/#business`,
        name: 'Hariel Xavier Photography',
        image: `${this.domain}/images/logo.jpg`,
        description: 'Professional wedding photography services in Sparta, NJ and surrounding areas',
        url: this.domain,
        telephone: '+1-862-391-4179',
        email: 'info@harielxavier.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Sparta',
          addressLocality: 'Sparta',
          addressRegion: 'NJ',
          postalCode: '07871',
          addressCountry: 'US'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 41.0348,
          longitude: -74.6396
        },
        openingHours: 'Mo-Su 09:00-21:00',
        priceRange: '$$',
        serviceArea: {
          '@type': 'GeoCircle',
          geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: 41.0348,
            longitude: -74.6396
          },
          geoRadius: '50000'
        }
      },
      
      Service: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: data.serviceName || 'Wedding Photography',
        description: data.description || 'Professional wedding photography services',
        provider: {
          '@type': 'LocalBusiness',
          name: 'Hariel Xavier Photography'
        },
        areaServed: 'Sparta, NJ',
        serviceType: 'Photography'
      },

      ImageGallery: {
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        name: data.galleryName || 'Wedding Photo Gallery',
        description: data.description || 'Beautiful wedding photography',
        associatedMedia: data.images?.map((img: any) => ({
          '@type': 'ImageObject',
          contentUrl: img.url,
          caption: img.caption || 'Wedding photography by Hariel Xavier'
        })) || []
      }
    };

    return schemas[type as keyof typeof schemas];
  }
}

export const seoService = new SEOService();
export type { SEOAnalysis, SEOIssue, SEORecommendation, KeywordData, PerformanceMetrics };

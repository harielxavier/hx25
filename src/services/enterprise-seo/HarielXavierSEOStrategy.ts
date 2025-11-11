/**
 * Hariel Xavier Photography - Customized SEO Strategy
 * 
 * Target: Dominate Anthony Ziccardi and capture high-end wedding clients
 * Focus: Bergen County wealthy areas (Upper Saddle River, Saddle River, etc.)
 * Goal: 10+ new clients per month, premium pricing positioning
 */

import { SEOConfiguration } from './EnterpriseSEOPlatform';

export const harielXavierSEOConfig: SEOConfiguration = {
  domain: 'https://harielxavier.com',
  
  // Strategic keyword targeting to outrank Anthony Ziccardi
  targetKeywords: [
    // Primary wedding keywords
    'wedding photographer sparta nj',
    'wedding photographer near me',
    'new jersey wedding photographer',
    'morris county wedding photographer',
    'sussex county wedding photographer',
    
    // High-value Bergen County keywords
    'wedding photographer bergen county',
    'upper saddle river wedding photographer',
    'saddle river wedding photographer',
    'alpine nj wedding photographer',
    'franklin lakes wedding photographer',
    'ridgewood wedding photographer',
    'mahwah wedding photographer',
    'ramsey wedding photographer',
    
    // Luxury/premium positioning keywords
    'luxury wedding photographer nj',
    'high end wedding photographer',
    'elegant wedding photography',
    'fine art wedding photographer',
    'luxury bridal portraits',
    
    // Venue-specific keywords (premium venues)
    'perona farms wedding photographer',
    'the manor wedding photographer',
    'crystal plaza wedding photographer',
    'the grove wedding photographer',
    'nanina\'s in the park photographer',
    'the palace at somerset park photographer',
    'the bernards inn wedding photographer',
    'ashford estate wedding photographer',
    
    // Service-specific keywords
    'engagement photographer nj',
    'bridal portrait photographer',
    'family photographer sparta nj',
    'corporate event photographer nj',
    'maternity photographer nj',
    
    // Seasonal and trending keywords
    'fall wedding photographer nj',
    'spring wedding photographer',
    'outdoor wedding photographer',
    'rustic wedding photographer nj',
    'modern wedding photographer',
    
    // Long-tail competitive keywords
    'best wedding photographer morris county',
    'top rated wedding photographer nj',
    'award winning wedding photographer',
    'professional wedding photography sparta'
  ],
  
  // Direct competitors to monitor and outrank
  competitors: [
    'anthonyziccardi.com', // Primary target
    'njweddingphotographer.com',
    'bergencountyweddings.com',
    'morristownweddingphotographer.com',
    'njfineartweddings.com'
  ],
  
  localBusiness: {
    name: 'Hariel Xavier Photography',
    address: {
      street: 'Sparta',
      city: 'Sparta',
      state: 'NJ',
      zip: '07871',
      country: 'US'
    },
    coordinates: {
      latitude: 41.0348,
      longitude: -74.6396
    },
    phone: '+1-862-355-3502',
    email: 'info@harielxavier.com',
    businessType: 'Professional Photography Services',
    serviceAreas: [
      'Sparta, NJ',
      'Morris County, NJ',
      'Sussex County, NJ',
      'Bergen County, NJ',
      'Upper Saddle River, NJ',
      'Saddle River, NJ',
      'Alpine, NJ',
      'Franklin Lakes, NJ',
      'Ridgewood, NJ',
      'Mahwah, NJ',
      'Ramsey, NJ',
      'Wayne, NJ',
      'Montclair, NJ',
      'Short Hills, NJ'
    ],
    openingHours: [
      { dayOfWeek: 'Monday', opens: '09:00', closes: '18:00' },
      { dayOfWeek: 'Tuesday', opens: '09:00', closes: '18:00' },
      { dayOfWeek: 'Wednesday', opens: '09:00', closes: '18:00' },
      { dayOfWeek: 'Thursday', opens: '09:00', closes: '18:00' },
      { dayOfWeek: 'Friday', opens: '09:00', closes: '18:00' },
      { dayOfWeek: 'Saturday', opens: '08:00', closes: '22:00' },
      { dayOfWeek: 'Sunday', opens: '08:00', closes: '22:00' }
    ]
  },
  
  technicalSEO: {
    enableAutomaticSitemapGeneration: true,
    enableSchemaMarkupAutomation: true,
    enableCoreWebVitalsMonitoring: true,
    enableImageOptimization: true,
    enableInternalLinkingOptimization: true,
    enablePageSpeedOptimization: true,
    enableSecurityAuditing: true
  },
  
  contentStrategy: {
    primaryTopics: [
      'Luxury Wedding Photography',
      'Bergen County Weddings',
      'Premium Wedding Venues',
      'Bridal Portrait Sessions',
      'Engagement Photography',
      'Family Photography',
      'Corporate Events'
    ],
    contentPillars: [
      'Wedding Photography Expertise',
      'Local Venue Knowledge',
      'Luxury Service Experience',
      'Photography Education',
      'Client Success Stories'
    ],
    targetAudience: [
      'Affluent couples in Bergen County',
      'High-end wedding planners',
      'Luxury venue coordinators',
      'Corporate executives',
      'Established families'
    ],
    contentTypes: [
      'Wedding gallery showcases',
      'Venue photography guides',
      'Wedding planning tips',
      'Behind-the-scenes content',
      'Client testimonials',
      'Photography tutorials'
    ],
    publishingFrequency: 'weekly',
    contentGoals: [
      'Establish authority in luxury wedding photography',
      'Showcase work at premium venues',
      'Build trust with high-end clientele',
      'Educate potential clients',
      'Improve search rankings'
    ]
  },
  
  monitoring: {
    rankTrackingFrequency: 'daily',
    alertThresholds: {
      rankingDrop: 3, // Alert if any keyword drops more than 3 positions
      trafficDrop: 15, // Alert if traffic drops more than 15%
      coreWebVitalsThreshold: 2.5 // Alert if LCP exceeds 2.5 seconds
    },
    reportingSchedule: 'weekly',
    enableRealTimeAlerts: true
  }
};

// Premium venue targeting strategy
export const premiumVenueStrategy = {
  targetVenues: [
    {
      name: 'Perona Farms',
      location: 'Andover, NJ',
      keywords: ['perona farms wedding photographer', 'perona farms photography'],
      contentStrategy: 'Create comprehensive venue guide with photo examples'
    },
    {
      name: 'The Manor',
      location: 'West Orange, NJ',
      keywords: ['the manor wedding photographer', 'west orange wedding photography'],
      contentStrategy: 'Showcase elegant ballroom photography'
    },
    {
      name: 'Crystal Plaza',
      location: 'Livingston, NJ',
      keywords: ['crystal plaza wedding photographer', 'livingston wedding photography'],
      contentStrategy: 'Highlight luxury reception photography'
    },
    {
      name: 'Ashford Estate',
      location: 'Allentown, NJ',
      keywords: ['ashford estate wedding photographer', 'allentown wedding photography'],
      contentStrategy: 'Feature outdoor ceremony and reception photos'
    },
    {
      name: 'The Bernards Inn',
      location: 'Bernardsville, NJ',
      keywords: ['bernards inn wedding photographer', 'bernardsville wedding photography'],
      contentStrategy: 'Emphasize intimate luxury wedding photography'
    }
  ]
};

// Competitive analysis strategy against Anthony Ziccardi
export const competitiveStrategy = {
  primaryCompetitor: {
    name: 'Anthony Ziccardi',
    domain: 'anthonyziccardi.com',
    weaknesses: [
      'Limited venue coverage',
      'Outdated website design',
      'Poor mobile optimization',
      'Weak local SEO presence'
    ],
    opportunities: [
      'Target his top keywords with better content',
      'Outrank on venue-specific searches',
      'Capture his overflow clients',
      'Build stronger local citations'
    ]
  },
  
  differentiationStrategy: [
    'Superior technical photography skills',
    'Better client experience and service',
    'More comprehensive venue knowledge',
    'Stronger online presence and reviews',
    'Professional website and galleries',
    'Better pricing transparency'
  ]
};

// Content calendar for SEO domination
export const contentCalendar = {
  monthly: [
    {
      week: 1,
      topic: 'Featured Wedding Gallery',
      keywords: ['luxury wedding photographer', 'bergen county weddings'],
      venues: ['Highlight premium venue work']
    },
    {
      week: 2,
      topic: 'Venue Spotlight',
      keywords: ['venue name + wedding photographer'],
      venues: ['Rotate through target venues']
    },
    {
      week: 3,
      topic: 'Photography Tips',
      keywords: ['wedding photography tips', 'bridal portrait tips'],
      venues: ['Educational content for SEO']
    },
    {
      week: 4,
      topic: 'Client Success Story',
      keywords: ['wedding photographer testimonial', 'nj wedding review'],
      venues: ['Social proof and local SEO']
    }
  ],
  
  seasonal: [
    {
      season: 'Spring',
      focus: 'Outdoor wedding photography, garden venues',
      keywords: ['spring wedding photographer nj', 'outdoor wedding photography']
    },
    {
      season: 'Summer',
      focus: 'Peak wedding season, multiple venues',
      keywords: ['summer wedding photographer', 'nj wedding photographer']
    },
    {
      season: 'Fall',
      focus: 'Autumn colors, rustic venues',
      keywords: ['fall wedding photographer nj', 'autumn wedding photography']
    },
    {
      season: 'Winter',
      focus: 'Indoor venues, holiday engagements',
      keywords: ['winter wedding photographer', 'holiday engagement photos']
    }
  ]
};

// Local SEO domination strategy
export const localSEOStrategy = {
  googleMyBusiness: {
    optimizations: [
      'Complete all profile sections',
      'Add high-quality photos weekly',
      'Post updates about recent weddings',
      'Respond to all reviews within 24 hours',
      'Use local keywords in posts',
      'Add venue locations as served areas'
    ]
  },
  
  citations: {
    primaryDirectories: [
      'The Knot',
      'WeddingWire',
      'Yelp',
      'Google My Business',
      'Facebook Business',
      'Better Business Bureau'
    ],
    localDirectories: [
      'NJ.com Business Directory',
      'Morris County Chamber of Commerce',
      'Sussex County Chamber of Commerce',
      'Bergen County Business Directory'
    ]
  },
  
  reviewStrategy: {
    target: '50+ reviews with 4.8+ average rating',
    tactics: [
      'Follow up with every client for reviews',
      'Make review process easy with direct links',
      'Incentivize reviews with small discounts',
      'Respond professionally to all reviews',
      'Feature reviews on website'
    ]
  }
};

export default harielXavierSEOConfig;

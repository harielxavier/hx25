// Updated AI Service to use Anthropic Claude with comprehensive package knowledge

// Define the structure of the packages to be sent to the backend
interface PricingPackageFeature {
  text: string;
  icon?: React.ElementType | string;
}

interface PricingPackage {
  id: string;
  name: string;
  price: string;
  monthlyPrice?: string;
  features: (string | PricingPackageFeature)[];
  popular?: boolean;
  tier?: 'elopement' | 'single-shooter' | 'duo-coverage' | 'luxury';
  usp?: string;
  perfectFor?: string[];
  themeColor?: string;
  textColor?: string;
  coverage?: string;
  highlights?: string;
}

// Quiz response interface
export interface QuizResponse {
  guestCount: number;
  venueType: string;
  budgetRange: string;
  socialFocus: string;
  specialNeeds: string[];
  weddingStyle: string;
  photographyPriority: string;
  timelineFlexibility: string;
}

// Package recommendation interface
export interface PackageRecommendation {
  recommendedPackage: string;
  confidence: number;
  reasoning: string;
  suggestedAddOns: Array<{
    name: string;
    price: number;
    reasoning: string;
  }>;
  personalizedMessage: string;
}

// Define the expected response from the Firebase function
interface AnthropicSuggestionResponse {
  data: {
    suggestion?: string;
    recommendedPackage?: string;
    confidence?: number;
    reasoning?: string;
    suggestedAddOns?: Array<{
      name: string;
      price: number;
      reasoning: string;
    }>;
    personalizedMessage?: string;
  };
  error?: string;
}

class AnthropicAIService {
  // Firebase project details
  private projectId = "harielxavierphotography-18d17";
  private region = "us-central1";
  private functionName = "getAnthropicPackageSuggestion";
  private functionUrl = `https://${this.region}-${this.projectId}.cloudfunctions.net/${this.functionName}`;

  // Complete package database with all details
  private readonly packageDatabase = {
    // ELOPEMENT PACKAGES
    'elopement-intimate': {
      id: 'elopement-intimate',
      name: 'The Intimate',
      price: '1,595',
      monthlyPrice: '133',
      tier: 'elopement',
      coverage: '3 hours of heartfelt coverage',
      highlights: '200+ professionally edited images, 10 sneak peeks within 24 hours',
      perfectFor: ['City hall vows', 'Cozy backyard ceremonies', 'Charming micro-venues'],
      features: [
        '3 hours of heartfelt coverage',
        '200+ professionally edited, high-resolution images',
        'Online gallery for sharing & downloads (6 months)',
        '10 breathtaking sneak peeks within 24 hours',
        'Travel within 25 miles of Sparta, NJ included',
        'Personal consultation to dream up your day',
        'Timeline planning assistance for a seamless experience'
      ]
    },
    'elopement-adventure': {
      id: 'elopement-adventure',
      name: 'The Adventure',
      price: '2,195',
      monthlyPrice: '183',
      tier: 'elopement',
      popular: true,
      coverage: '4 hours of adventurous coverage',
      highlights: '300+ professionally edited images, 15 sneak peeks within 12 hours',
      perfectFor: ['Breathtaking beach elopements', 'Majestic mountain vows', 'Unique destination spots'],
      features: [
        '4 hours of adventurous coverage',
        '300+ professionally edited, high-resolution images',
        'Online gallery for sharing & downloads (1 year)',
        '15 stunning sneak peeks within 12 hours',
        'Travel within 50 miles of Sparta, NJ included',
        'Location scouting assistance for epic backdrops',
        'Guidance on permits & local vendor connections',
        'Emergency weather backup planning'
      ]
    },
    'elopement-escape': {
      id: 'elopement-escape',
      name: 'The Escape',
      price: '2,895',
      monthlyPrice: '241',
      tier: 'elopement',
      coverage: '6 hours of immersive coverage (ceremony + celebration)',
      highlights: '400+ professionally edited images, 20 sneak peeks within 6 hours',
      perfectFor: ['Romantic weekend getaways', 'Multi-location elopement stories'],
      features: [
        '6 hours of immersive coverage (ceremony + celebration)',
        '400+ professionally edited, high-resolution images',
        'Lifetime gallery hosting - your memories, forever',
        '20 captivating sneak peeks within just 6 hours!',
        'Travel within 100 miles of Sparta, NJ included',
        'Complimentary mini engagement session (1 hour, local)',
        'Day-of coordination support for a stress-free flow',
        'Curated vendor recommendations'
      ]
    },

    // SINGLE SHOOTER WEDDING PACKAGES
    'wedding-sparta-sparkler': {
      id: 'wedding-sparta-sparkler',
      name: 'The Sparta Sparkler',
      price: '2,795',
      monthlyPrice: '233',
      tier: 'single-shooter',
      coverage: '8 hours of continuous coverage by Hariel Xavier',
      highlights: '500+ meticulously edited images, engagement session included',
      perfectFor: ['Intimate weddings', 'Budget-conscious couples', 'Single-location ceremonies'],
      features: [
        '8 hours of continuous coverage by Hariel Xavier',
        '500+ meticulously edited, high-resolution images',
        'Online gallery for easy sharing, viewing, and print ordering (1 year access)',
        '10 exciting sneak peek images delivered within 48 hours',
        'Complimentary engagement session at a local Sparta, NJ location',
        'In-depth pre-wedding consultation and timeline planning',
        'Full printing and personal use rights'
      ]
    },
    'wedding-xavier-classic': {
      id: 'wedding-xavier-classic',
      name: 'The Xavier Classic',
      price: '3,295',
      monthlyPrice: '275',
      tier: 'single-shooter',
      coverage: '9 hours of comprehensive coverage by Hariel Xavier',
      highlights: '600+ artistically edited images, $150 print credit included',
      perfectFor: ['Traditional weddings', 'Classic ceremonies', 'Couples wanting extended coverage'],
      features: [
        '9 hours of comprehensive coverage by Hariel Xavier',
        '600+ artistically edited, high-resolution images',
        'Online gallery with advanced features (1 year access)',
        '15 captivating sneak peek images delivered within 24-48 hours',
        '$150 credit towards fine art prints or products',
        'Choice of location for your engagement session (within Sussex County)',
        'Personalized timeline crafting and vendor coordination assistance'
      ]
    },

    // DUO COVERAGE WEDDING PACKAGES
    'duo-sussex-storyteller': {
      id: 'duo-sussex-storyteller',
      name: 'Sussex Storyteller Duo',
      price: '3,995',
      monthlyPrice: '333',
      tier: 'duo-coverage',
      popular: true,
      coverage: '9 hours of dynamic coverage with Hariel Xavier & a skilled second photographer',
      highlights: '700+ stunningly edited images, simultaneous bride & groom coverage',
      perfectFor: ['Medium to large weddings', 'Multiple locations', 'Couples wanting comprehensive coverage'],
      features: [
        '9 hours of dynamic coverage with Hariel Xavier & a skilled second photographer',
        '700+ stunningly edited, high-resolution images, capturing multiple perspectives',
        'Simultaneous coverage of bride & groom preparations',
        'Expanded online gallery with guest access options (2 years access)',
        '20 breathtaking sneak peek images delivered within 24 hours',
        '$200 credit towards luxurious albums or wall art',
        'Full engagement session at your choice of Sussex County location',
        'Priority post-production timeline'
      ]
    },
    'duo-skylands-signature': {
      id: 'duo-skylands-signature',
      name: 'Skylands Signature Duo',
      price: '5,495',
      monthlyPrice: '458',
      tier: 'duo-coverage',
      coverage: '10 hours of immersive coverage with Hariel Xavier, a second photographer, & a dedicated assistant',
      highlights: '900+ masterfully edited images, next-day mini-movie sneak peek',
      perfectFor: ['Large weddings', 'Luxury venues', 'Couples wanting premium experience'],
      features: [
        '10 hours of immersive coverage with Hariel Xavier, a second photographer, & a dedicated assistant',
        '900+ masterfully edited, high-resolution images, offering unparalleled depth',
        'Next-day \'mini-movie\' sneak peek (30-60s social media teaser)',
        'Premium engagement session (extended time, multiple locations/outfits)',
        'Custom-designed 10x10 Fine Art Wedding Album (20 pages/40 sides)',
        '$400 credit towards albums, prints, or wall art collections',
        'Lifetime secure online gallery hosting for your peace of mind'
      ]
    },

    // LUXURY PACKAGE
    'duo-xavier-xperience': {
      id: 'duo-xavier-xperience',
      name: 'The Xavier Xperience',
      price: '7,995+',
      tier: 'luxury',
      coverage: 'Full Weekend Coverage: Up to 12 hours on wedding day + 3 hours rehearsal dinner',
      highlights: '1200+ magazine-quality images, same-day slideshow, cinematic highlight film',
      perfectFor: ['Luxury weddings', 'Multi-day celebrations', 'Couples wanting the ultimate experience'],
      features: [
        'Full Weekend Coverage: Up to 12 hours on wedding day + 3 hours rehearsal dinner',
        'Elite Team: Hariel Xavier, expert second photographer, and dedicated lighting assistant',
        '1200+ meticulously edited, magazine-quality images',
        'Same-Day Slideshow: A curated selection of images showcased at your reception',
        'Next-Day \'First Look\' Gallery: ~50-75 images to relive the magic immediately',
        'Cinematic Highlight Film (5-7 minutes) by our dedicated film team',
        'Luxury Heirloom Collection: Bespoke 12x12 Album, 2 Parent Albums, Fine Art Print Box',
        'Exclusive Engagement Xperience: Styled session with hair & makeup consultation',
        'Personalized planning & concierge service throughout your journey',
        '$750 credit towards statement wall art or album upgrades'
      ]
    }
  };

  constructor() {}

  /**
   * Gets a package recommendation based on quiz responses
   */
  async getPackageRecommendation(quizData: QuizResponse): Promise<PackageRecommendation> {
    console.log("Getting package recommendation with quiz data:", quizData);

    try {
      const response = await fetch(this.functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            type: 'packageRecommendation',
            quizData: quizData
          }
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Firebase Function HTTP error:", response.status, errorBody);
        throw new Error(`Sarah AI service returned an error: ${response.status}`);
      }

      const result = await response.json() as AnthropicSuggestionResponse;
      console.log("Received package recommendation:", result);

      if (result.error) {
        throw new Error(`Sarah AI Error: ${result.error}`);
      }
      
      if (result.data) {
        return {
          recommendedPackage: result.data.recommendedPackage || 'duo-sussex-storyteller',
          confidence: result.data.confidence || 85,
          reasoning: result.data.reasoning || 'Based on your preferences, this package offers excellent value.',
          suggestedAddOns: result.data.suggestedAddOns || [],
          personalizedMessage: result.data.personalizedMessage || 'I\'d love to discuss how we can make your wedding photography perfect!'
        };
      } else {
        throw new Error("Unexpected response structure from Sarah AI");
      }

    } catch (error: any) {
      console.error("Error calling Sarah AI:", error);
      // Provide intelligent fallback based on quiz data
      return this.getFallbackRecommendation(quizData);
    }
  }

  /**
   * Gets a general AI suggestion with comprehensive package knowledge
   */
  async getAISuggestion(
    userInput: string,
    packages: PricingPackage[]
  ): Promise<string> {
    console.log("Getting AI suggestion with user input:", userInput);

    // Enhance packages with our comprehensive database
    const enhancedPackages = packages.map(pkg => {
      const dbPackage = this.packageDatabase[pkg.id as keyof typeof this.packageDatabase];
      return dbPackage ? { ...pkg, ...dbPackage } : pkg;
    });

    try {
      const response = await fetch(this.functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            userInput,
            packages: enhancedPackages
          }
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Firebase Function HTTP error:", response.status, errorBody);
        throw new Error(`Sarah AI service returned an error: ${response.status}`);
      }

      const result = await response.json() as AnthropicSuggestionResponse;
      console.log("Received AI suggestion:", result);

      if (result.error) {
        throw new Error(`Sarah AI Error: ${result.error}`);
      }
      
      if (result.data && result.data.suggestion) {
        return result.data.suggestion;
      } else {
        throw new Error("Sarah AI returned an unexpected response. Please try again.");
      }

    } catch (error: any) {
      console.error("Error calling Sarah AI:", error);
      throw new Error(`Sarah AI is currently unavailable. ${error.message || 'Please try again later.'}`);
    }
  }

  /**
   * Provides intelligent fallback recommendations based on quiz data
   */
  private getFallbackRecommendation(quizData: QuizResponse): PackageRecommendation {
    let recommendedPackage = 'duo-sussex-storyteller'; // Default to most popular
    let reasoning = '';

    // Intelligent recommendation logic
    if (quizData.guestCount <= 50) {
      if (quizData.budgetRange === 'under-3k') {
        recommendedPackage = 'elopement-adventure';
        reasoning = 'Perfect for your intimate celebration with adventurous coverage and beautiful locations.';
      } else {
        recommendedPackage = 'elopement-escape';
        reasoning = 'The Escape package offers extended coverage perfect for your intimate wedding with extra celebration time.';
      }
    } else if (quizData.guestCount <= 100) {
      if (quizData.budgetRange === 'under-3k') {
        recommendedPackage = 'wedding-sparta-sparkler';
        reasoning = 'Essential coverage that captures all your important moments within your budget.';
      } else if (quizData.budgetRange === '3k-5k') {
        recommendedPackage = 'duo-sussex-storyteller';
        reasoning = 'Our most popular package with two photographers ensuring every angle is captured.';
      } else {
        recommendedPackage = 'duo-skylands-signature';
        reasoning = 'Premium coverage with extended time and luxury album included.';
      }
    } else {
      if (quizData.budgetRange === 'above-8k') {
        recommendedPackage = 'duo-xavier-xperience';
        reasoning = 'The ultimate luxury experience with full weekend coverage and cinematic film.';
      } else {
        recommendedPackage = 'duo-skylands-signature';
        reasoning = 'Perfect for larger weddings with comprehensive coverage and premium features.';
      }
    }

    return {
      recommendedPackage,
      confidence: 85,
      reasoning,
      suggestedAddOns: [],
      personalizedMessage: 'I\'d love to discuss how we can customize this package perfectly for your special day!'
    };
  }
}

// Create service instance and export
export const grokAI = new AnthropicAIService();
export const grokAIService = grokAI; // Maintain backward compatibility
export type { PricingPackage as GrokServicePricingPackage };

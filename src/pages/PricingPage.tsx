import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { 
  Check, 
  Sparkles, 
  Gem, 
  Crown, 
  Zap, 
  Film, 
  Gift, 
  CalendarDays, 
  Users, 
  Video, 
  Package2,
  Camera,
  Clock,
  Image,
  Eye,
  Heart,
  Star,
  Award,
  Plus,
  ArrowRight
} from 'lucide-react';
import Navigation from '../components/landing/Navigation';
import SEO from '../components/layout/SEO';

interface Package {
  id: string;
  name: string;
  price: string;
  coverage: string;
  images: string;
  features: string[];
  popular?: boolean;
  tier?: 'single' | 'duo' | 'event';
  themeColor?: string;
  textColor?: string;
  icon?: React.ElementType;
}

interface ALaCarteItem {
  title: string;
  price: string;
  description?: string;
  category: string;
}

interface BonusOffer {
  title: string;
  value: string;
  description: string;
  icon?: React.ElementType;
}

const PricingPage: React.FC = () => {
  const [selectedPhotographerType, setSelectedPhotographerType] = useState<'single' | 'duo'>('single');
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: packagesRef, inView: packagesInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: eventsRef, inView: eventsInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: alacarteRef, inView: alacarteInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Single Photographer Packages
  const singlePackages: Package[] = [
    {
      id: 'petite-spark',
      name: 'Petite Spark',
      price: '2,295',
      coverage: '6 hours',
      images: '400+',
      tier: 'single',
      icon: Sparkles,
      features: [
        '6 hours coverage by Hariel Xavier',
        '400+ fully edited, high-res images',
        'Complimentary Sparta engagement mini-session',
        '5 sneak peeks delivered within 24 hours',
        '1-year online gallery',
        'Full print and personal use rights',
        'Pre-wedding consultation and timeline planning'
      ]
    },
    {
      id: 'sparta-sparkler',
      name: 'Sparta Sparkler',
      price: '2,795',
      coverage: '8 hours',
      images: '500+',
      tier: 'single',
      popular: true,
      icon: Gem,
      features: [
        '8 hours coverage by Hariel Xavier',
        '500+ meticulously edited, high-res images',
        'Complimentary Sparta engagement session',
        '10 sneak peeks within 48 hours',
        '1-year online gallery',
        'Timeline crafting consult',
        'Full print and personal rights'
      ]
    },
    {
      id: 'xavier-classic',
      name: 'Xavier Classic',
      price: '3,295',
      coverage: '9 hours',
      images: '600+',
      tier: 'single',
      icon: Crown,
      features: [
        '9 hours coverage by Hariel Xavier',
        '600+ artistically edited, high-res images',
        'Engagement session at your choice of location in Sussex County',
        '15 sneak peeks delivered within 24-48 hours',
        '$150 credit towards fine art prints or products',
        'Personalized timeline planning and vendor coordination assistance',
        'Advanced online gallery (1 year)'
      ]
    }
  ];

  // Duo Photographer Packages
  const duoPackages: Package[] = [
    {
      id: 'sussex-duo-essence',
      name: 'Sussex Duo Essence',
      price: '3,295',
      coverage: '7 hours',
      images: '500+',
      tier: 'duo',
      icon: Users,
      features: [
        '7 hours coverage with Hariel Xavier + second shooter',
        'Coverage includes bride & groom prep, ceremony, and reception',
        '500+ edited, high-res images capturing multiple perspectives',
        'Engagement mini-session included',
        '10 sneak peeks delivered within 24 hours',
        '1.5-year expanded online gallery'
      ]
    },
    {
      id: 'storyteller-duo',
      name: 'Storyteller Duo',
      price: '3,995',
      coverage: '9 hours',
      images: '700+',
      tier: 'duo',
      popular: true,
      icon: Video,
      features: [
        '9 hours coverage with two photographers',
        'Simultaneous bride & groom prep coverage',
        '700+ edited images from multiple angles',
        '20 sneak peeks delivered within 24 hours',
        'Full engagement session in Sussex County',
        '$200 credit toward albums or wall art',
        '2-year online gallery with guest access',
        'Priority editing and timeline assistance'
      ]
    },
    {
      id: 'skylands-signature-duo',
      name: 'Skylands Signature Duo',
      price: '5,495',
      coverage: '10 hours',
      images: '900+',
      tier: 'duo',
      icon: Award,
      themeColor: 'bg-gradient-to-br from-amber-100 to-amber-50',
      textColor: 'text-amber-900',
      features: [
        '10 hours coverage with Hariel Xavier, second photographer, and assistant',
        '900+ masterfully edited images',
        'Next-day mini-movie sneak peek (30-60s social media teaser)',
        'Premium engagement session with multiple locations/outfits',
        'Custom 10x10 fine art album (20 pages)',
        '$400 credit for albums/prints/wall art',
        'Lifetime secure online gallery hosting',
        'Capturai Same-Day Slideshow included',
        'Hariel Xavier Photography product included free'
      ]
    }
  ];

  // Event Photography Packages
  const eventPackages: Package[] = [
    {
      id: 'essential-event',
      name: 'Essential Event',
      price: '995',
      coverage: '3 hours',
      images: '150+',
      tier: 'event',
      icon: Camera,
      features: [
        '3 hours coverage by Hariel Xavier',
        '150+ professionally edited images',
        'Online gallery with 3-month access',
        'Event highlights slideshow included',
        'Full print/personal use rights'
      ]
    },
    {
      id: 'premier-event',
      name: 'Premier Event',
      price: '1,795',
      coverage: '5 hours',
      images: '300+',
      tier: 'event',
      popular: true,
      icon: Star,
      features: [
        '5 hours coverage by Hariel Xavier',
        '300+ edited images',
        'Online gallery with 6-month access',
        'Customized event slideshow',
        'Priority editing'
      ]
    },
    {
      id: 'deluxe-event-duo',
      name: 'Deluxe Event Duo',
      price: '3,495',
      coverage: '6 hours',
      images: '450+',
      tier: 'event',
      icon: Crown,
      features: [
        '6 hours coverage with two photographers',
        '450+ edited images from multiple angles',
        'Online gallery with 1-year access',
        'Event highlights mini-movie (3-5 minutes)',
        'Full print and personal use rights'
      ]
    }
  ];

  // À La Carte Options
  const alaCarteItems: ALaCarteItem[] = [
    // Additional Coverage
    { title: 'Additional Hour (Lead Photographer)', price: '300', category: 'Coverage' },
    { title: 'Additional Hour (Second Photographer)', price: '175', category: 'Coverage' },
    { title: 'Rehearsal Dinner Coverage (3 hours)', price: '650', category: 'Coverage' },
    
    // Special Sessions
    { title: 'Bridal Boudoir Session (tasteful & empowering)', price: '500', category: 'Sessions' },
    { title: 'Day-After / "Trash the Dress" Creative Session', price: '600', category: 'Sessions' },
    
    // Albums & Products
    { title: '10×10 Fine Art Wedding Album (20 pages)', price: '695', category: 'Albums' },
    { title: '12×12 Luxury Heirloom Album (30 pages)', price: '1,095', category: 'Albums' },
    { title: 'Parent Album (8×8 replica)', price: '355', category: 'Albums' },
    { title: 'Album Page Expansions (per spread)', price: '60', category: 'Albums' },
    
    // Stationery
    { title: 'Thank You Cards (set of 100)', price: '150', category: 'Stationery' },
    { title: 'Save-the-Date Postcards (set of 100)', price: '150', category: 'Stationery' },
    
    // Wall Art
    { title: 'Custom Wall Art (canvas, metal, acrylic)', price: '250', description: 'Starting at', category: 'Wall Art' },
    
    // Special Services
    { title: 'Next-Day Sneak Peek Gallery (full gallery in 48h)', price: '295', category: 'Services' },
    { title: 'Rush Full Gallery Editing (14 days)', price: '300', category: 'Services' },
    { title: 'Slideshow for Reception (30+ images)', price: '450', category: 'Services' },
    { title: 'Drone Photo/Video Footage', price: '350', description: 'location/weather permitting', category: 'Services' },
    { title: 'Cinematic Highlight Film (5–7 minutes)', price: '2,000', category: 'Services' },
    { title: 'USB Keepsake Box with select prints', price: '195', category: 'Services' },
    { title: 'Extra Online Gallery Year', price: '75', category: 'Services' }
  ];

  // Bonus Offers
  const bonusOffers: BonusOffer[] = [
    {
      title: 'Early Bird Booking Credit',
      value: '$275 off',
      description: 'when booked 12+ months out',
      icon: CalendarDays
    },
    {
      title: 'Parent Album Discount',
      value: '25% off',
      description: 'with primary album purchase',
      icon: Heart
    },
    {
      title: 'Referral Credit',
      value: '$250 for you and your friend',
      description: 'when they book',
      icon: Gift
    }
  ];

  const PackageCard: React.FC<{ pkg: Package }> = ({ pkg }) => {
    const IconComponent = pkg.icon || Camera;
    
    return (
      <div className={`bg-gradient-to-br from-white to-champagneRose/5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-champagneRose/20 ${
        pkg.popular ? 'ring-4 ring-champagneRose/30 scale-105' : ''
      }`}>
        {pkg.popular && (
          <div className="bg-gradient-to-r from-accent to-rose-dark text-white text-center py-2 text-sm font-semibold">
            Most Popular
          </div>
        )}
        
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-rose-dark rounded-xl flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-primary">{pkg.name}</h3>
              <p className="text-gray-600 text-sm">{pkg.coverage} • {pkg.images} images</p>
            </div>
          </div>
          
          <div className="mb-6">
            <span className="text-4xl font-light text-primary">${pkg.price}</span>
          </div>
          
          <ul className="space-y-3 mb-8">
            {pkg.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-champagneRose rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <Check className="w-3 h-3 text-accent" />
                </div>
                <span className="text-gray-700 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          
          <a
            href="https://calendly.com/harielxavierphotography/hariel-xavier-photography-meeting"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-4 px-6 rounded-xl font-semibold text-center transition-all duration-300 ${
              pkg.popular 
                ? 'bg-gradient-to-r from-accent to-rose-dark text-white hover:from-rose-dark hover:to-accent shadow-lg' 
                : 'bg-primary text-white hover:bg-gray-800'
            }`}
          >
            Book Your Consultation
          </a>
        </div>
      </div>
    );
  };

  const ALaCarteCard: React.FC<ALaCarteItem> = ({ title, price, description, category }) => (
    <div className="bg-gradient-to-br from-white to-champagneRose/5 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-champagneRose/10">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-primary">{title}</h4>
        <span className="text-lg font-light text-gray-700">${price}</span>
      </div>
      {description && (
        <p className="text-sm text-gray-500 mb-2">{description}</p>
      )}
      <span className="inline-block px-3 py-1 bg-champagneRose text-accent text-xs font-medium rounded-full">
        {category}
      </span>
    </div>
  );

  const BonusCard: React.FC<BonusOffer> = ({ title, value, description, icon: IconComponent }) => (
    <div className="bg-gradient-to-br from-rose-light to-champagneRose rounded-xl p-6 border border-champagneRose">
      <div className="flex items-center gap-4">
        {IconComponent && (
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-white" />
          </div>
        )}
        <div>
          <h4 className="font-semibold text-primary">{title}</h4>
          <p className="text-accent font-bold">{value}</p>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );

  const groupedAlaCarte = alaCarteItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ALaCarteItem[]>);

  return (
    <>
      <SEO
        title="Wedding Photography Packages & Pricing | Hariel Xavier Photography"
        description="Discover our comprehensive wedding photography packages in Sparta, NJ. Single photographer, duo coverage, and event photography options with transparent pricing."
        keywords="wedding photography pricing, Sparta NJ photographer, wedding packages, duo photographer, event photography, wedding photographer rates"
        ogImage="https://harielxavierphotography.com/MoStuff/LandingPage/HeroPage.jpg"
        type="website"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-primary via-gray-800 to-black text-white pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className={`transform transition-all duration-1000 ${heroInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="font-serif text-5xl md:text-7xl mb-6">Photography Packages</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transparent, comprehensive pricing designed for every celebration in Sparta, NJ and beyond
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendly.com/harielxavierphotography/hariel-xavier-photography-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent hover:bg-rose-dark text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Book Free Consultation
              </a>
              <a
                href="#packages"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl font-semibold transition-all duration-300"
              >
                View Packages
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Photographer Type Toggle */}
      <section id="packages" ref={packagesRef} className="py-16 bg-gradient-to-br from-white to-champagneRose/10">
        <div className="container mx-auto px-4">
          <div className={`transform transition-all duration-1000 ${packagesInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">Wedding Photography Packages</h2>
              <p className="text-xl text-gray-600 mb-8">Choose the perfect coverage for your special day</p>
              
              {/* Toggle */}
              <div className="flex justify-center mb-12">
                <div className="bg-white rounded-xl p-2 shadow-lg">
                  <button
                    onClick={() => setSelectedPhotographerType('single')}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      selectedPhotographerType === 'single'
                        ? 'bg-accent text-white shadow-md'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    Single Photographer
                  </button>
                  <button
                    onClick={() => setSelectedPhotographerType('duo')}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      selectedPhotographerType === 'duo'
                        ? 'bg-accent text-white shadow-md'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    Duo Photographer
                  </button>
                </div>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(selectedPhotographerType === 'single' ? singlePackages : duoPackages).map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Event Photography */}
      <section ref={eventsRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className={`transform transition-all duration-1000 ${eventsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">Event Photography</h2>
              <p className="text-xl text-gray-600 mb-8">Perfect for birthdays, charity events, corporate gatherings, and special celebrations</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {eventPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* À La Carte Options */}
      <section ref={alacarteRef} className="py-16 bg-gradient-to-br from-white to-champagneRose/10">
        <div className="container mx-auto px-4">
          <div className={`transform transition-all duration-1000 ${alacarteInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">À La Carte Options</h2>
              <p className="text-xl text-gray-600 mb-8">Customize your experience with these popular add-ons</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(groupedAlaCarte).map(([category, items]) => (
                <div key={category} className="space-y-4">
                  <h3 className="font-serif text-2xl text-gray-900 mb-6 text-center">{category}</h3>
                  {items.map((item, index) => (
                    <ALaCarteCard key={index} {...item} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bonus Offers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">Exclusive Bonuses</h2>
            <p className="text-xl text-gray-600 mb-8">Special incentives for our valued clients</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {bonusOffers.map((bonus, index) => (
              <BonusCard key={index} {...bonus} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-gray-800 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Ready to Capture Your Story?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss your vision and create a custom package that perfectly fits your needs and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendly.com/harielxavierphotography/hariel-xavier-photography-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent hover:bg-rose-dark text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Book Free Consultation
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="mailto:contact@harielxavierphotography.com"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              Email Us Directly
              <Plus className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default PricingPage;
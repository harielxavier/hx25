/**
 * AI-Enhanced Pricing Page for Hariel Xavier Photography
 * 
 * Elegant design matching the original pricing page aesthetic
 * with subtle AI enhancements and dynamic SEO integration
 */

import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Check, Sparkles, ArrowRight, Brain, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/landing/Navigation';
import DynamicSEO from '../components/DynamicSEO';
import ReversibleVideo from '../components/shared/ReversibleVideo';
import AIPackageQuiz from '../components/pricing/AIPackageQuiz';
import SarahAvatar from '../components/icons/SarahAvatar';

// Package data with enhanced AI-friendly descriptions
const packages = {
  essential: {
    name: 'The Essential',
    price: '2,495',
    originalPrice: null,
    features: [
      '6 hours coverage',
      '400 edited images',
      'Online gallery with digital download',
      '3-month gallery hosting',
      '5 sneak peeks within 48 hours',
      'Delivery in 6 weeks'
    ],
    bestFor: 'Intimate weddings, budget-conscious couples',
    aiDescription: 'Perfect for couples who want professional photography without the extras'
  },
  timeless: {
    name: 'The Signature',
    price: '3,195',
    originalPrice: null,
    features: [
      '8 hours coverage',
      '600 edited images',
      'Online gallery with digital download',
      '1-year gallery hosting',
      '10 sneak peeks within 24 hours',
      'Engagement session',
      'Story in 60 Seconds reel',
      'Delivery in 4 weeks'
    ],
    bestFor: 'Traditional weddings, couples wanting engagement photos',
    aiDescription: 'Our most popular package with engagement session included',
    popular: true
  },
  heritage: {
    name: 'The Heritage',
    price: '3,895',
    originalPrice: null,
    features: [
      '9 hours with 2 photographers',
      '800 edited images',
      'Online gallery with digital download',
      'Lifetime gallery hosting',
      '15 sneak peeks within 24 hours',
      'Engagement session',
      'Luxury print box with 30 prints + USB',
      'Delivery in 3 weeks'
    ],
    bestFor: 'Larger weddings, couples wanting comprehensive coverage',
    aiDescription: 'Dual photographer coverage for complete wedding documentation'
  },
  masterpiece: {
    name: 'The Masterpiece',
    price: '5,395',
    originalPrice: null,
    features: [
      '10 hours with 2 photographers',
      '1000 edited images',
      'Engagement session',
      'Luxury album',
      'Parent albums',
      'Large print box with 50 prints',
      'Premium USB box',
      'Rehearsal dinner coverage (2 hours)',
      'Next day preview blog post',
      'Lifetime gallery hosting',
      'Priority editing'
    ],
    bestFor: 'Luxury weddings, couples wanting the full experience',
    aiDescription: 'Complete luxury experience with all premium features',
    popular: true
  }
};

// Enhanced pricing card component matching original design
const PricingCard = ({ 
  pkg, 
  packageKey,
  isRecommended = false,
  className = '' 
}: { 
  pkg: any; 
  packageKey: string;
  isRecommended?: boolean;
  className?: string; 
}) => {
  return (
    <div className={`bg-white p-10 border ${
      isRecommended 
        ? 'border-black shadow-xl ring-2 ring-gray-200' 
        : pkg.popular 
          ? 'border-black shadow-xl' 
          : 'border-gray-200 shadow-md'
    } relative transition-all duration-300 hover:shadow-2xl hover:translate-y-[-5px] ${className}`}>
      
      {/* AI Recommendation Badge */}
      {isRecommended && (
        <div className="absolute top-0 right-0 bg-black text-white py-1.5 px-6 text-sm tracking-wider flex items-center space-x-2">
          <Brain className="w-3 h-3" />
          <span>AI Recommended</span>
        </div>
      )}

      {/* Popular Badge */}
      {pkg.popular && !isRecommended && (
        <div className="absolute top-0 right-0 bg-black text-white py-1.5 px-6 text-sm tracking-wider">
          Most Popular
        </div>
      )}

      <h3 className="font-serif text-2xl mb-4">{pkg.name}</h3>
      <div className="flex items-baseline mb-8">
        <span className="text-5xl font-light">${pkg.price}</span>
      </div>
      
      <div className="space-y-5 mb-10">
        {pkg.features.map((feature: string, index: number) => (
          <div key={index} className="flex items-start gap-3 group">
            <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
      
      <a
        href="https://harielxavierphotography.studioninja.co/inquire"
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full py-4 ${
          isRecommended || pkg.popular 
            ? 'bg-black text-white' 
            : 'bg-white text-black border border-black'
        } hover:bg-black hover:text-white transition-all duration-300 tracking-wider text-sm uppercase inline-block text-center`}
      >
        {isRecommended ? 'Book Recommended Package' : 'Book a Consultation'}
      </a>
    </div>
  );
};

// À La Carte Item component
const ALaCarteItem = ({ 
  title, 
  price, 
  description = '' 
}: { 
  title: string; 
  price: string; 
  description?: string; 
}) => {
  return (
    <div className="py-4 border-b border-gray-50 group transition-all duration-300 hover:bg-gray-50/50">
      <div className="flex justify-between items-baseline">
        <div>
          <h4 className="font-medium text-gray-800 group-hover:text-black transition-colors">{title}</h4>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        <div className="text-xl font-light">${price}</div>
      </div>
    </div>
  );
};

// Pricing section component with animations
const PricingSection = ({ 
  title, 
  subtitle = '', 
  children 
}: { 
  title: string; 
  subtitle?: string; 
  children: React.ReactNode; 
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="font-serif text-3xl md:text-4xl mb-4">{title}</h2>
          {subtitle && (
            <>
              <div className="w-16 h-px bg-black mx-auto mb-4"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
            </>
          )}
        </div>
        <div className={`transform transition-all duration-1000 delay-100 ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default function AIPricingPage() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [recommendedPackage, setRecommendedPackage] = useState<string | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const handleQuizComplete = (packageId: string) => {
    setRecommendedPackage(packageId);
    setShowQuiz(false);
    // Scroll to packages section
    document.getElementById('packages-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <DynamicSEO 
        page="pricing"
        baseTitle="Wedding Photography Pricing | Hariel Xavier Photography"
        baseDescription="View our comprehensive wedding photography packages and investment options. AI-powered recommendations to find your perfect package."
        baseKeywords={["wedding photography pricing", "photography packages", "wedding photographer", "Bergen County photographer"]}
        enableAutoRefresh={true}
        refreshInterval={15}
      />
      <Navigation />
      
      <main id="main-content" className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-center justify-center mb-20">
          <div className="absolute inset-0">
            <ReversibleVideo 
              src="/MoStuff/meettheteam/1moving.mp4"
              className="w-full h-full object-cover"
              playbackRate={0.5}
              autoPlay
              playsInline
              muted
              data-component-name="AIPricingPage"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60" />
          </div>
          <div className="relative text-center text-white px-4 max-w-4xl mx-auto transform transition-all duration-1000 animate-fade-in-up">
            <p className="text-sm uppercase tracking-[0.3em] mb-6 text-gray-200">Investment</p>
            <h1 className="font-serif text-5xl md:text-6xl mb-6 leading-tight">The Art of Capturing <span className="italic">Timeless</span> Moments</h1>
            <div className="w-24 h-px bg-white mx-auto mb-6"></div>
            <p className="text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Curated collections designed for couples who value artistry and emotional storytelling
            </p>
          </div>
        </section>

        {/* Sarah AI Helper Section - Right Under Hero */}
        {!recommendedPackage && (
          <section className="py-16 bg-gradient-to-br from-rose-50 via-white to-amber-50 border-b border-rose-100">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="mb-8">
                  <h2 className="font-serif text-2xl md:text-3xl mb-4 text-gray-800">Need Help Designing Your Package?</h2>
                  <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                    Every wedding is unique, and we know choosing the right photography package can feel overwhelming. 
                    That's why we created something special to help you.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-rose-50 to-amber-50 p-8 rounded-2xl border-2 border-rose-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-center mb-6">
                    <SarahAvatar size="xl" animated={true} className="mr-4" />
                    <div className="text-left">
                      <h3 className="font-serif text-2xl text-rose-800 mb-1">Meet Sarah</h3>
                      <p className="text-rose-600 text-sm font-medium">Your AI Wedding Expert</p>
                    </div>
                  </div>
                  
                  <h3 className="font-serif text-xl mb-4 text-gray-800">Ask Sarah, Our AI Expert</h3>
                  <p className="text-gray-700 mb-6 max-w-md mx-auto leading-relaxed">
                    Hi! I'm Sarah, your personal AI wedding consultant. Answer a few quick questions about your special day, 
                    and I'll recommend the perfect package tailored just for you. It takes less than 2 minutes!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="bg-gradient-to-r from-rose-400 to-amber-400 text-white px-8 py-3 rounded-full hover:from-rose-500 hover:to-amber-500 transition-all duration-300 tracking-wider text-sm font-medium inline-flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Heart className="w-4 h-4" />
                      <span>Ask Sarah for My Perfect Package</span>
                      <Sparkles className="w-4 h-4" />
                    </button>
                    
                    <span className="text-rose-400 text-sm font-medium">or</span>
                    
                    <button
                      onClick={() => document.getElementById('packages-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-rose-600 hover:text-rose-800 transition-colors duration-300 text-sm font-medium tracking-wider underline decoration-rose-300 hover:decoration-rose-500"
                    >
                      Browse All Packages Below
                    </button>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="mt-6 flex justify-center space-x-2 opacity-60">
                    <div className="w-2 h-2 bg-rose-300 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-amber-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-2 h-2 bg-rose-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* AI Quiz Modal */}
        <AnimatePresence>
          {showQuiz && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowQuiz(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif">Find Your Perfect Package</h2>
                    <button
                      onClick={() => setShowQuiz(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <AIPackageQuiz onComplete={handleQuizComplete} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Single Photographer Collections */}
        <PricingSection 
          title={recommendedPackage ? "Your Personalized Recommendation" : "Single Photographer Collections"}
          subtitle={recommendedPackage ? "Based on your preferences, here's our AI recommendation along with other available options." : "Perfect for intimate weddings and elopements"}
        >
          <div ref={ref} className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto" id="packages-section">
            <PricingCard 
              pkg={packages.essential}
              packageKey="essential"
              isRecommended={recommendedPackage === 'essential'}
              className={`transform transition-all duration-700 ${
                inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            />
            <PricingCard 
              pkg={packages.timeless}
              packageKey="timeless"
              isRecommended={recommendedPackage === 'timeless'}
              className={`transform transition-all duration-700 delay-100 ${
                inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            />
          </div>
        </PricingSection>

        {/* Dual Photographer Collections */}
        <PricingSection 
          title="Dual Photographer Collections" 
          subtitle="Comprehensive coverage for your special day"
        >
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <PricingCard 
              pkg={packages.heritage}
              packageKey="heritage"
              isRecommended={recommendedPackage === 'heritage'}
            />
            <PricingCard 
              pkg={packages.masterpiece}
              packageKey="masterpiece"
              isRecommended={recommendedPackage === 'masterpiece'}
            />
          </div>
        </PricingSection>

        {/* Cinematography Add-On */}
        <PricingSection 
          title="Cinematography Add-On" 
          subtitle="Complement your photography with beautiful motion pictures"
        >
          <div className="max-w-3xl mx-auto bg-white p-10 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 mb-8">
              <div>
                <h3 className="font-serif text-2xl mb-4">Wedding Film Package</h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Cinematic storytelling that captures the emotions and atmosphere of your special day
                </p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-light">$2,200</span>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              {[
                "8 hours coverage",
                "8-minute highlight film",
                "Ceremony + speeches",
                "Drone footage",
                "Delivered with photos"
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-gray-600">
                  <span className="font-medium text-black">Premium packages available</span> for photo + video
                </p>
                <button className="px-8 py-3 bg-black text-white hover:bg-gray-900 transition-colors tracking-wider text-sm uppercase">
                  Add to Package
                </button>
              </div>
            </div>
          </div>
        </PricingSection>

        {/* Bundle Savings */}
        <PricingSection 
          title="Bundle Savings" 
          subtitle="Save more when you book multiple services"
        >
          <div className="max-w-3xl mx-auto bg-white p-10 border border-gray-200 shadow-md">
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">72-Hour Upgrade Special</h4>
                  <p className="text-gray-600">Book The Signature within 3 days and get Heritage's luxury print box FREE ($395 value)</p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">Photo + Video Bundle</h4>
                  <p className="text-gray-600">Lock photo + video together and save $400 (instant social proof)</p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">Multi-Album Discount</h4>
                  <p className="text-gray-600">Save 20% when ordering 3+ albums (perfect for parent gifts)</p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">Early Booking Discount</h4>
                  <p className="text-gray-600">$250 off when booking 12+ months in advance</p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">Referral Reward</h4>
                  <p className="text-gray-600">$200 off for both you and your friend when they book</p>
                </div>
              </li>
            </ul>
          </div>
        </PricingSection>


        {/* Wedding Availability Checker Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-serif text-3xl md:text-4xl mb-4">Ready to Book Your Date?</h2>
                <div className="w-16 h-px bg-black mx-auto mb-4"></div>
                <p className="text-gray-600 max-w-2xl mx-auto mb-10">
                  Begin your journey with Hariel Xavier Photography by scheduling a consultation today
                </p>
                <a 
                  href="https://calendly.com/harielxavierphotography/hariel-xavier-photography-meeting" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white px-12 py-4 hover:bg-gray-800 transition-all duration-300 tracking-wider uppercase text-sm hover:shadow-lg hover:translate-y-[-2px] inline-block"
                >
                  Book a Consultation
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-black text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <ReversibleVideo 
              src="/MoStuff/meettheteam/1moving.mp4"
              className="w-full h-full object-cover"
              playbackRate={0.5}
              autoPlay
              playsInline
              muted
              data-component-name="PricingCTA"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">Ready to Create <span className="italic">Timeless</span> Memories?</h2>
            <div className="w-24 h-px bg-white mx-auto mb-8 opacity-70"></div>
            <p className="text-white/80 max-w-2xl mx-auto mb-10 text-lg">
              Prime dates for 2025-2026 are booking quickly. Secure your date and start planning your dream wedding photography.
            </p>
            <div className="flex justify-center">
              <a 
                href="https://calendly.com/harielxavierphotography/hariel-xavier-photography-meeting" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black px-12 py-4 hover:bg-gray-100 transition-all duration-300 tracking-wider uppercase text-sm hover:shadow-lg hover:translate-y-[-2px] inline-block"
              >
                Book a Consultation
              </a>
            </div>
          </div>
        </section>

        {/* À La Carte Menu */}
        <PricingSection 
          title="À La Carte Menu" 
          subtitle="Customize your package with these affordable add-ons"
        >
          <div className="max-w-4xl mx-auto bg-white p-8 border border-gray-200">
            <div className="mb-8">
              <h3 className="font-serif text-xl mb-4 pb-2 border-b border-gray-200">Additional Coverage</h3>
              <div className="space-y-0">
                <ALaCarteItem title="Extra Hour Photography" price="250" />
                <ALaCarteItem title="Extra Hour with Second Shooter" price="350" />
                <ALaCarteItem title="Rehearsal Dinner Coverage (2 hours)" price="395" />
                <ALaCarteItem title="Engagement Session (if not in package)" price="295" />
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="font-serif text-xl mb-4 pb-2 border-b border-gray-200">Albums & Prints</h3>
              <div className="space-y-0">
                <ALaCarteItem title="Premium Wedding Album (10x10)" price="595" />
                <ALaCarteItem title="Parent Album Copy (8x8)" price="295" />
                <ALaCarteItem title="Album Upgrade (per 5 spreads)" price="95" />
                <ALaCarteItem title="Fine Art Print Box (25 prints)" price="245" />
                <ALaCarteItem title="Individual 8x10 Fine Art Prints" price="25" />
                <ALaCarteItem title="Canvas Wall Art (24x36)" price="295" />
                <ALaCarteItem title="Metal Prints (20x30)" price="245" />
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="font-serif text-xl mb-4 pb-2 border-b border-gray-200">Digital Items</h3>
              <div className="space-y-0">
                <ALaCarteItem title="Additional USB Copy" price="75" />
                <ALaCarteItem title="Extended Gallery Hosting (per year)" price="95" />
                <ALaCarteItem title="Rush Editing (2-week delivery)" price="295" />
              </div>
            </div>
            
            <div>
              <h3 className="font-serif text-xl mb-4 pb-2 border-b border-gray-200">Special Add-ons</h3>
              <div className="space-y-0">
                <ALaCarteItem title="Next Day Sneak Peeks (25 images)" price="195" />
                <ALaCarteItem title="Drone Coverage (if not booking video)" price="245" />
                <ALaCarteItem title="Custom Slideshow" price="175" />
              </div>
            </div>
          </div>
        </PricingSection>
      </main>
    </>
  );
}

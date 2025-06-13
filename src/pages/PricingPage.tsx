import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useInView } from 'react-intersection-observer';
import { Check, Sparkles, Gem, Crown, Zap, Film, Gift, CalendarDays, MessageSquareHeart, Users, Video, Package2, Bot } from 'lucide-react'; // Added Bot icon
import { grokAI, GrokServicePricingPackage } from '../services/ai/GrokAIService';
import SarahAIWidget from '../components/pricing/SarahAIWidget'; // Import the new widget
import Navigation from '../components/landing/Navigation';
import SEO from '../components/layout/SEO';
import ReversibleVideo from '../components/shared/ReversibleVideo';
import CalendarAvailability from '../components/wedding/CalendarAvailability';

interface FeatureDetail {
  text: string;
  icon?: React.ElementType;
}

interface Package {
  id: string;
  name: string;
  price: string;
  monthlyPrice?: string;
  coverage?: string; 
  highlights?: string; 
  idealFor?: string; 
  signatureTouches?: string; 
  whyTwoShooters?: string; 
  features: (string | FeatureDetail)[]; // This will be used by PricingCard
  popular?: boolean;
  tier?: 'elopement' | 'single-shooter' | 'duo-coverage' | 'premium' | 'luxury'; 
  usp?: string;
  perfectFor?: string[]; 
  themeColor?: string;
  textColor?: string;
  notes?: string; 
}

interface ALaCarteCategory {
  title: string;
  items: ALaCarteItemDetail[];
}

interface ALaCarteItemDetail {
  title: string;
  price: string;
  description?: string;
}

interface BonusOffer {
  title: string;
  value: string;
  icon?: React.ElementType;
  notes?: string; 
}

// Reusable PricingCard component (enhanced for new structure)
const PricingCard: React.FC<{ pkg: Package; className?: string }> = ({ pkg, className = '' }) => {
  const navigate = useNavigate();
  const cardBaseStyle = "bg-white p-8 md:p-12 border relative transition-all duration-300 hover:shadow-2xl hover:translate-y-[-2px] rounded-lg flex flex-col"; // Increased md padding
  const popularStyle = "border-champagneRose shadow-xl ring-2 ring-champagneRose";
  const defaultStyle = "border-gray-200 shadow-md";
  
  let currentThemeColor = 'bg-gray-800';
  let currentTextColor = 'text-gray-300';

  if (pkg.themeColor) {
    currentThemeColor = pkg.themeColor;
    currentTextColor = pkg.textColor || 'text-white';
  } else if (pkg.popular) {
    currentThemeColor = 'bg-champagneRose'; 
    currentTextColor = 'text-black';      
  } else if (pkg.tier === 'luxury') {
    currentThemeColor = 'bg-black';
    currentTextColor = 'text-champagneRose';
  }


  return (
    <div className={`${cardBaseStyle} ${pkg.popular ? popularStyle : defaultStyle} ${className}`}>
      {pkg.popular && (
        <div className={`absolute top-0 right-0 ${currentThemeColor} ${currentTextColor} py-1.5 px-6 text-sm tracking-wider font-semibold transform translate-x-2 -translate-y-2 rounded-tr-lg rounded-bl-lg`}>
          Most Popular
        </div>
      )}
      <h3 className={`font-serif text-3xl mb-3 ${pkg.tier === 'luxury' ? 'text-champagneRose' : 'text-black'}`}>{pkg.name}</h3>
      <div className="flex items-baseline mb-1">
        <span className={`text-5xl font-light ${pkg.tier === 'luxury' ? 'text-champagneRose' : 'text-black'}`}>${pkg.price}</span>
      </div>
      {pkg.monthlyPrice && <p className="text-md text-gray-600 mb-6">or ${pkg.monthlyPrice}/mo\*</p>}
      
      {pkg.usp && <p className="text-sm text-gray-700 italic mb-6">{pkg.usp}</p>}

      <div className="space-y-4 mb-8 flex-grow">
        {pkg.features.map((feature, index) => {
          const featureText = typeof feature === 'string' ? feature : feature.text;
          const IconComponent = typeof feature === 'string' ? Check : (feature.icon || Check);
          return (
            <div key={index} className="flex items-start gap-3 group">
              <div className={`w-5 h-5 rounded-full ${currentThemeColor} flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                <IconComponent className={`w-3 h-3 ${currentTextColor}`} />
              </div>
              <span className="text-gray-700 text-sm">{featureText}</span>
            </div>
          );
        })}
      </div>
      
      {pkg.perfectFor && pkg.perfectFor.length > 0 && (
        <div className="mb-6 mt-auto">
          <p className="text-xs text-gray-500 font-medium mb-2">PERFECT FOR:</p>
          <div className="flex flex-wrap gap-2">
            {pkg.perfectFor.map((item, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
      <a
        href="https://calendly.com/harielxavierphotography/hariel-xavier-photography-meeting"
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full mt-auto py-3.5 ${
          pkg.popular || pkg.tier === 'luxury' ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black border border-black hover:bg-black hover:text-white'
        } transition-all duration-300 tracking-wider text-sm font-semibold uppercase inline-block text-center rounded-md`}
      >
        Book Your Consultation
      </a>
    </div>
  );
};

const ALaCarteItemDisplay: React.FC<ALaCarteItemDetail> = ({ title, price, description }) => (
  <div className="py-4 border-b border-gray-200 group transition-all duration-300 hover:bg-gray-50/50 px-2">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-semibold text-gray-800 group-hover:text-black transition-colors">{title}</h4>
        {description && <p className="text-sm text-gray-500 mt-1 max-w-md">{description}</p>}
      </div>
      <div className="text-lg font-light text-gray-700 whitespace-nowrap pl-4">${price}</div>
    </div>
  </div>
);

const PricingSectionWrapper: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; bgClass?: string; titleClass?: string; subtitleClass?: string; textAlignment?: 'text-center' | 'text-left'; contentMaxWidth?: string; id?: string; }> = 
  ({ title, subtitle, children, bgClass = "bg-white", titleClass = "text-black", subtitleClass = "text-gray-600", textAlignment = "text-center", contentMaxWidth = "max-w-7xl", id }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <section ref={ref} className={`py-20 md:py-28 ${bgClass}`} id={id}> {/* Increased vertical padding */}
      <div className={`container mx-auto px-4 ${contentMaxWidth}`}>
        <div className={`${textAlignment} mb-14 md:mb-20 transform transition-all duration-1000 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}> {/* Increased bottom margin */}
          <h2 className={`font-serif text-4xl md:text-5xl mb-4 ${titleClass}`}>{title}</h2>
          {subtitle && (
            <>
              <div className={`w-20 h-px ${titleClass === 'text-white' ? 'bg-white' : 'bg-black'} ${textAlignment === 'text-center' ? 'mx-auto' : ''} mb-4 opacity-70`}></div>
              <p className={`max-w-2xl ${textAlignment === 'text-center' ? 'mx-auto' : ''} text-lg ${subtitleClass}`}>{subtitle}</p>
            </>
          )}
        </div>
        <div className={`transform transition-all duration-1000 delay-100 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default function PricingPage() {
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);

  const elopementPackages: Package[] = [
    { id: 'elopement-intimate', name: "The Intimate", price: "1,595", monthlyPrice: "133", tier: 'elopement',
      features: [
        { text: "3 hours of heartfelt coverage", icon: CalendarDays }, 
        { text: "200+ professionally edited, high-resolution images", icon: Sparkles },
        { text: "Online gallery for sharing & downloads (6 months)", icon: Gift }, 
        { text: "10 breathtaking sneak peeks within 24 hours", icon: Zap },
        { text: "Travel within 25 miles of Sparta, NJ included", icon: Check }, 
        "Personal consultation to dream up your day",
        "Timeline planning assistance for a seamless experience"
      ],
      perfectFor: ["City hall vows", "Cozy backyard ceremonies", "Charming micro-venues"], 
      usp: "Perfectly capturing the pure essence of your intimate celebration."
    },
    { id: 'elopement-adventure', name: "The Adventure", price: "2,195", monthlyPrice: "183", tier: 'elopement', popular: true, themeColor: 'bg-champagneRose', textColor: 'text-black',
      features: [
        { text: "4 hours of adventurous coverage", icon: CalendarDays }, 
        { text: "300+ professionally edited, high-resolution images", icon: Sparkles },
        { text: "Online gallery for sharing & downloads (1 year)", icon: Gift }, 
        { text: "15 stunning sneak peeks within 12 hours", icon: Zap },
        { text: "Travel within 50 miles of Sparta, NJ included", icon: Check },
        "Location scouting assistance for epic backdrops",
        "Guidance on permits & local vendor connections",
        "Emergency weather backup planning"
      ],
      perfectFor: ["Breathtaking beach elopements", "Majestic mountain vows", "Unique destination spots"], 
      usp: "Our most loved choice for spirited couples ready to say 'I do' in style."
    },
    { id: 'elopement-escape', name: "The Escape", price: "2,895", monthlyPrice: "241", tier: 'elopement',
      features: [
        { text: "6 hours of immersive coverage (ceremony + celebration)", icon: CalendarDays }, 
        { text: "400+ professionally edited, high-resolution images", icon: Sparkles },
        { text: "Lifetime gallery hosting - your memories, forever", icon: Gem }, 
        { text: "20 captivating sneak peeks within just 6 hours!", icon: Zap },
        { text: "Travel within 100 miles of Sparta, NJ included", icon: Check },
        "Complimentary mini engagement session (1 hour, local)",
        "Day-of coordination support for a stress-free flow",
        "Curated vendor recommendations"
      ],
      perfectFor: ["Romantic weekend getaways", "Multi-location elopement stories"], 
      usp: "The ultimate elopement journey, capturing every cherished detail from start to finish."
    }
  ];

  const singleShooterWeddingPackages: Package[] = [
    { id: 'wedding-sparta-sparkler', name: "The Sparta Sparkler", price: "2,795", monthlyPrice: "233", tier: 'single-shooter',
      features: [
        {text: "8 hours of continuous coverage by Hariel Xavier", icon: CalendarDays},
        {text: "500+ meticulously edited, high-resolution images", icon: Sparkles},
        {text: "Online gallery for easy sharing, viewing, and print ordering (1 year access)", icon: Gift},
        {text: "10 exciting sneak peek images delivered within 48 hours", icon: Zap},
        {text: "Complimentary engagement session at a local Sparta, NJ location", icon: Users},
        "In-depth pre-wedding consultation and timeline planning",
        "Full printing and personal use rights"
      ],
      usp: "Essential, beautiful coverage capturing the heart of your Sparta wedding."
    },
    { id: 'wedding-xavier-classic', name: "The Xavier Classic", price: "3,295", monthlyPrice: "275", tier: 'single-shooter',
      features: [
        {text: "9 hours of comprehensive coverage by Hariel Xavier", icon: CalendarDays},
        {text: "600+ artistically edited, high-resolution images", icon: Sparkles},
        {text: "Online gallery with advanced features (1 year access)", icon: Gift},
        {text: "15 captivating sneak peek images delivered within 24-48 hours", icon: Zap},
        {text: "$150 credit towards fine art prints or products", icon: Package2},
        "Choice of location for your engagement session (within Sussex County)",
        "Personalized timeline crafting and vendor coordination assistance"
      ],
      usp: "A classic, enhanced experience for a truly memorable wedding day."
    }
  ];

  const duoCoverageWeddingPackages: Package[] = [
    { id: 'duo-sussex-storyteller', name: "Sussex Storyteller Duo", price: "3,995", monthlyPrice: "333", tier: 'duo-coverage', popular: true, themeColor: 'bg-champagneRose', textColor: 'text-black', notes: "*Most Popular",
      features: [
        {text: "9 hours of dynamic coverage with Hariel Xavier & a skilled second photographer", icon: Users},
        {text: "700+ stunningly edited, high-resolution images, capturing multiple perspectives", icon: Sparkles},
        {text: "Simultaneous coverage of bride & groom preparations", icon: Check},
        {text: "Expanded online gallery with guest access options (2 years access)", icon: Gift},
        {text: "20 breathtaking sneak peek images delivered within 24 hours", icon: Zap},
        {text: "$200 credit towards luxurious albums or wall art", icon: Package2},
        "Full engagement session at your choice of Sussex County location",
        "Priority post-production timeline"
      ],
      usp: "Our most popular choice! Two photographers ensure every angle and emotion is beautifully preserved."
    },
    { id: 'duo-skylands-signature', name: "Skylands Signature Duo", price: "5,495", monthlyPrice: "458", tier: 'duo-coverage',
      features: [
        {text: "10 hours of immersive coverage with Hariel Xavier, a second photographer, & a dedicated assistant", icon: Users},
        {text: "900+ masterfully edited, high-resolution images, offering unparalleled depth", icon: Sparkles},
        {text: "Next-day 'mini-movie' sneak peek (30-60s social media teaser)", icon: Film},
        {text: "Premium engagement session (extended time, multiple locations/outfits)", icon: Gem},
        {text: "Custom-designed 10x10 Fine Art Wedding Album (20 pages/40 sides)", icon: Gift},
        {text: "$400 credit towards albums, prints, or wall art collections", icon: Package2},
        "Lifetime secure online gallery hosting for your peace of mind"
      ],
      usp: "A signature experience from engagement to heirloom album, capturing every detail with an expert team."
    },
    { id: 'duo-xavier-xperience', name: "The Xavier Xperience", price: "7,995+", tier: 'luxury', themeColor: 'bg-black', textColor: 'text-champagneRose',
      features: [
        {text: "Full Weekend Coverage: Up to 12 hours on wedding day + 3 hours rehearsal dinner", icon: Crown},
        {text: "Elite Team: Hariel Xavier, expert second photographer, and dedicated lighting assistant", icon: Users},
        {text: "1200+ meticulously edited, magazine-quality images", icon: Sparkles},
        {text: "Same-Day Slideshow: A curated selection of images showcased at your reception", icon: Film},
        {text: "Next-Day 'First Look' Gallery: ~50-75 images to relive the magic immediately", icon: Zap},
        {text: "Cinematic Highlight Film (5-7 minutes) by our dedicated film team", icon: Video},
        {text: "Luxury Heirloom Collection: Bespoke 12x12 Album, 2 Parent Albums, Fine Art Print Box", icon: Gift},
        {text: "Exclusive Engagement Xperience: Styled session with hair & makeup consultation", icon: Gem},
        {text: "Personalized planning & concierge service throughout your journey", icon: Check},
        {text: "$750 credit towards statement wall art or album upgrades", icon: Package2}
      ],
      usp: "The ultimate, all-inclusive photography and cinematography experience for the discerning couple."
    }
  ];
  
  const cinematographyAddOns: ALaCarteItemDetail[] = [
    { title: "Wedding Film Package", price: "2,200", description: "8h dedicated filmmaker, 5–7 min highlight film, full ceremony & main speeches edit, drone footage (venue/weather permitting)." },
    { title: "Same-Day Reception Slideshow", price: "500", description: "A heartwarming slideshow of 30+ images from your day, curated & projected during dinner." },
    { title: "Drone Photo/Video Footage", price: "400", description: "Breathtaking aerial artistry of your venue and surroundings (subject to location & weather)." }
  ];

  const aLaCarteAtelier: ALaCarteItemDetail[] = [
    { title: "Additional Hour of Photography (Lead Photographer)", price: "350" },
    { title: "Additional Hour of Photography (Second Photographer)", price: "200" },
    { title: "Rehearsal Dinner Coverage (3 hours)", price: "750" },
    { title: "Bridal Boudoir Session (tasteful & empowering)", price: "600" },
    { title: "Day-After / 'Trash the Dress' Creative Session", price: "700" },
    { title: "10×10 Fine-Art Wedding Album (20 pages)", price: "795" },
    { title: "12×12 Luxury Heirloom Album (30 pages)", price: "1,295" },
    { title: "Parent Album (8×8 replica)", price: "395" },
    { title: "Custom Wall Art (Canvas, Metal, Acrylic)", price: "Starting at $295" },
    { title: "Rush Editing (full gallery in 2 weeks)", price: "500" }
  ];

  const limitedTimeBonuses: BonusOffer[] = [
    { title: "Early-Bird Credit", value: "$250 OFF", icon: CalendarDays, notes:"Book 12+ months out" },
    { title: "Album Trio Special", value: "20% OFF Parent Albums", icon: Gift, notes:"With primary album order" },
    { title: "Share the Love Referral", value: "$200 Credit Each", icon: Sparkles, notes:"When your friend books" }
  ];

  const allPackagesForAI = [
    ...elopementPackages, 
    ...singleShooterWeddingPackages, 
    ...duoCoverageWeddingPackages
  ].map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    tier: p.tier,
    coverage: p.coverage,
    highlights: p.highlights || p.signatureTouches || p.whyTwoShooters, // Consolidate for AI
    features: [] // Keep features minimal for AI prompt if needed, or expand later
  }));

  return (
    <>
      <SEO 
        title="Wedding Photography Pricing NJ | Elopements & Weddings | Hariel Xavier"
        description="Discover Hariel Xavier Photography's competitive elopement and wedding packages in Sparta & Sussex County, NJ. Single & duo photographer options, cinematic films, and luxury albums. Starting $133/mo."
      />
      <Navigation />
      
      <main id="main-content" className="pt-20 md:pt-24 bg-gray-50">
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white bg-black">
          <div className="absolute inset-0">
            <ReversibleVideo 
              src="/MoStuff/meettheteam/1moving.mp4"
              className="w-full h-full object-cover opacity-50"
              playbackRate={0.5} autoPlay playsInline muted data-component-name="PricingPageHero"
            />
          </div>
          <div className="relative z-10 p-4">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 leading-tight">
              Your Story, <span className="italic text-champagneRose">Masterfully Told</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            “Your wedding photographs aren’t just files on a hard-drive; they are the first heirlooms of a brand-new family.” – Hariel Xavier
            </p>
            <div className="w-24 h-px bg-champagneRose mx-auto mb-8"></div>
          </div>
        </section>

        <PricingSectionWrapper 
          title="Feeling Overwhelmed? Meet Sarah, Your AI Wedding Ally!" 
          subtitle="Planning your dream wedding is exciting, but choosing the right photography package can feel like a puzzle. That's where Sarah comes in!" 
          bgClass="bg-white"
          textAlignment="text-center"
        >
          <SarahAIWidget allPackages={allPackagesForAI as GrokServicePricingPackage[]} />
        </PricingSectionWrapper>
        
        <div id="collections-title"></div> {/* Anchor for manual exploration */}

        <PricingSectionWrapper
          title="Elopement Collections"
          subtitle="Intimate, adventurous, unforgettable. Weekday & Off-Peak Friendly. *12-month, interest-free auto-pay."
          bgClass="bg-black" titleClass="text-white" subtitleClass="text-gray-300"
        >
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl">
              {elopementPackages.map(pkg => <PricingCard key={pkg.id} pkg={pkg} />)}
            </div>
          </div>
        </PricingSectionWrapper>

        <PricingSectionWrapper
          title="Wedding Collections: Single Photographer"
          subtitle="Focused, artistic coverage by Hariel Xavier, perfect for capturing the essence of your day with elegance and intimacy. These options already undercut competing single-shooter packages that begin at $3,495."
        >
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {singleShooterWeddingPackages.map(pkg => <PricingCard key={pkg.id} pkg={pkg} />)}
            </div>
          </div>
        </PricingSectionWrapper>

        <PricingSectionWrapper
          title="Wedding Collections: Duo Coverage"
          subtitle="Two storytellers, one seamless narrative. Ensure every angle, every emotion, every fleeting moment is captured with our lead and second photographer teams. Compared with the nearest local peers—whose two-photographer 8-hour 'Gold' runs $4,895—our Duo line saves you ≈ $900 while adding an extra hour and richer deliverables."
          bgClass="bg-gray-100"
        >
          <div className="space-y-8">
            {/* Regular duo packages in centered grid */}
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {duoCoverageWeddingPackages.filter(pkg => pkg.tier !== 'luxury').map(pkg => (
                  <PricingCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            </div>
            
            {/* Luxury package centered and highlighted */}
            {duoCoverageWeddingPackages.filter(pkg => pkg.tier === 'luxury').map(pkg => (
              <div key={pkg.id} className="flex justify-center mt-12">
                <div className="max-w-2xl w-full">
                  <div className="text-center mb-6">
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-400 to-rose-400 text-white text-sm font-semibold rounded-full mb-4">
                      ✨ LUXURY EXPERIENCE ✨
                    </span>
                  </div>
                  <PricingCard pkg={pkg} className="transform hover:scale-105 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </PricingSectionWrapper>

        <PricingSectionWrapper 
          title="Cinematic Storytelling: Add a Wedding Film" 
          subtitle="Elevate your memories with a breathtaking wedding film. Bundle any Duo collection with the Film Package & save $300!"
          bgClass="bg-black" titleClass="text-white" subtitleClass="text-gray-300"
        >
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {cinematographyAddOns.map(item => (
              <div key={item.title} className="bg-gray-800 p-6 rounded-lg text-center flex flex-col items-center">
                <Video className="w-12 h-12 text-champagneRose mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-3xl font-light text-champagneRose mb-3">${item.price}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </PricingSectionWrapper>

        <PricingSectionWrapper title="The À La Carte Atelier" subtitle="Customize your collection with these popular additions and fine-art products.">
          <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 border border-gray-200 shadow-lg rounded-lg">
            {aLaCarteAtelier.map(item => <ALaCarteItemDisplay key={item.title} {...item} />)}
          </div>
        </PricingSectionWrapper>
        
        <PricingSectionWrapper 
            title="Limited-Time Bonuses" 
            subtitle="Book by July 31st to unlock these extras and make your investment even sweeter!"
            bgClass="bg-gray-100"
        >
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {limitedTimeBonuses.map(offer => (
              <div key={offer.title} className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-xl transition-shadow flex flex-col items-center">
                {offer.icon && <offer.icon className="w-12 h-12 text-champagneRose mb-4" />}
                <h4 className="text-xl font-semibold text-black mb-2">{offer.title}</h4>
                <p className="text-gray-700 mb-1 font-medium">{offer.value}</p>
                {offer.notes && <p className="text-xs text-gray-500">({offer.notes})</p>}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-10 text-lg italic">“Because memories fade—but regret lasts a lifetime.”</p>
        </PricingSectionWrapper>

        <PricingSectionWrapper title="Contact Me" subtitle="Ready to capture your story? Fill out the form below to get in touch!">
          <div className="max-w-2xl mx-auto">
            <iframe height="699" style={{minWidth: '100%', maxWidth: '600px', border: 0, margin: '0 auto'}} id="sn-form-09sk9"
              src="https://app.studioninja.co/contactform/parser/0a800fc8-7fbb-1621-817f-cbe6e7e26016/0a800fc8-7fbb-1621-817f-d37610217750"
              allowFullScreen>
            </iframe>
            <script type="text/javascript" data-iframe-id="sn-form-09sk9"
              src="https://app.studioninja.co/client-assets/form-render/assets/scripts/iframeResizer.js"></script>
          </div>
        </PricingSectionWrapper>
        <div className="text-center py-10 bg-gray-50 text-xs text-gray-500">
          \*Payment plans up to 18 months available. All prices subject to NJ sales tax where applicable. Travel fees may apply for locations outside included mileage.
        </div>
      </main>
    </>
  );
}

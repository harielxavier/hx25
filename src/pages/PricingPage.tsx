import { useState, useEffect } from 'react';
import { Check, Camera, Users, Star, Gift, Calendar, Image, Award, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

export default function PricingPage() {
  const [packageType, setPackageType] = useState<'single' | 'duo'>('single');

  const singlePackages = [
    {
      name: "Petite Spark",
      hours: 6,
      price: 2295,
      images: "400+",
      popular: false,
      features: [
        "6 hours coverage by Hariel Xavier",
        "400+ fully edited, high-res images",
        "Complimentary Sparta engagement mini-session",
        "5 sneak peeks delivered within 24 hours",
        "1-year online gallery",
        "Full print and personal use rights",
        "Pre-wedding consultation and timeline planning"
      ]
    },
    {
      name: "Sparta Sparkler",
      hours: 8,
      price: 2795,
      images: "500+",
      popular: true,
      features: [
        "8 hours coverage by Hariel Xavier",
        "500+ meticulously edited, high-res images",
        "Complimentary Sparta engagement session",
        "10 sneak peeks within 48 hours",
        "1-year online gallery",
        "Timeline crafting consult",
        "Full print and personal rights"
      ]
    },
    {
      name: "Xavier Classic",
      hours: 9,
      price: 3295,
      images: "600+",
      popular: false,
      features: [
        "9 hours coverage by Hariel Xavier",
        "600+ artistically edited, high-res images",
        "Engagement session at your choice of location in Sussex County",
        "15 sneak peeks delivered within 24-48 hours",
        "$150 credit towards fine art prints or products",
        "Personalized timeline planning and vendor coordination assistance",
        "Advanced online gallery (1 year)"
      ]
    }
  ];

  const duoPackages = [
    {
      name: "Sussex Duo Essence",
      hours: 7,
      price: 3295,
      images: "500+",
      popular: false,
      features: [
        "7 hours coverage with Hariel Xavier + second shooter",
        "Coverage includes bride & groom prep, ceremony, and reception",
        "500+ edited, high-res images capturing multiple perspectives",
        "Engagement mini-session included",
        "10 sneak peeks delivered within 24 hours",
        "1.5-year expanded online gallery"
      ]
    },
    {
      name: "Storyteller Duo",
      hours: 9,
      price: 3995,
      images: "700+",
      popular: true,
      features: [
        "9 hours coverage with two photographers",
        "Simultaneous bride & groom prep coverage",
        "700+ edited images from multiple angles",
        "20 sneak peeks delivered within 24 hours",
        "Full engagement session in Sussex County",
        "$200 credit toward albums or wall art",
        "2-year online gallery with guest access",
        "Priority editing and timeline assistance"
      ]
    },
    {
      name: "Skylands Signature Duo",
      hours: 10,
      price: 5495,
      images: "900+",
      popular: false,
      badge: "BEST VALUE",
      features: [
        "10 hours coverage with Hariel Xavier, second photographer, and assistant",
        "900+ masterfully edited images",
        "Next-day mini-movie sneak peek (30-60s social media teaser)",
        "Premium engagement session with multiple locations/outfits",
        "Custom 10x10 fine art album (20 pages)",
        "$400 credit for albums/prints/wall art",
        "Lifetime secure online gallery hosting",
        "Capturai Same-Day Slideshow included free",
        "Hariel Xavier Photography product included free"
      ]
    }
  ];

  const eventPackages = [
    {
      name: "Essential Event",
      hours: 3,
      price: 995,
      images: "150+",
      features: [
        "3 hours coverage by Hariel Xavier",
        "150+ professionally edited images",
        "Online gallery with 3-month access",
        "Event highlights slideshow included",
        "Full print/personal use rights"
      ]
    },
    {
      name: "Premier Event",
      hours: 5,
      price: 1795,
      images: "300+",
      popular: true,
      features: [
        "5 hours coverage by Hariel Xavier",
        "300+ edited images",
        "Online gallery with 6-month access",
        "Customized event slideshow",
        "Priority editing"
      ]
    },
    {
      name: "Deluxe Event Duo",
      hours: 6,
      price: 3495,
      images: "450+",
      features: [
        "6 hours coverage with two photographers",
        "450+ edited images from multiple angles",
        "Online gallery with 1-year access",
        "Event highlights mini-movie (3-5 minutes)",
        "Full print and personal use rights"
      ]
    }
  ];

  const alacarte = [
    { name: "Additional Hour (Lead Photographer)", price: 300 },
    { name: "Additional Hour (Second Photographer)", price: 175 },
    { name: "Bridal Boudoir Session", price: 500 },
    { name: "Day-After / 'Trash the Dress' Creative Session", price: 600 },
    { name: "Rehearsal Dinner Coverage (3 hours)", price: 650 },
    { name: "10×10 Fine Art Wedding Album (20 pages)", price: 695 },
    { name: "12×12 Luxury Heirloom Album (30 pages)", price: 1095 },
    { name: "Parent Album (8×8 replica)", price: 355 },
    { name: "Album Page Expansions (per spread)", price: 60 },
    { name: "Thank You Cards (set of 100)", price: 150 },
    { name: "Save-the-Date Postcards (set of 100)", price: 150 },
    { name: "Custom Wall Art (canvas, metal, acrylic)", price: 250, note: "Starting at" },
    { name: "Next-Day Sneak Peek Gallery (full gallery in 48h)", price: 295 },
    { name: "Rush Full Gallery Editing (14 days)", price: 300 },
    { name: "Slideshow for Reception (30+ images)", price: 450 },
    { name: "Drone Photo/Video Footage", price: 350, note: "location/weather permitting" },
    { name: "Cinematic Highlight Film (5–7 minutes)", price: 2000, note: "add-on" },
    { name: "USB Keepsake Box with select prints", price: 195 },
    { name: "Extra Online Gallery Year", price: 75 }
  ];

  const bonuses = [
    {
      title: "Early Bird Bonus",
      description: "$275 credit when booked 12+ months in advance",
      icon: Calendar
    },
    {
      title: "Parent Album",
      description: "25% savings with primary album purchase",
      icon: Gift
    },
    {
      title: "Referral Program",
      description: "$250 credit for you and referred couples",
      icon: Star
    },
    {
      title: "Premium Inclusions",
      description: "Complimentary upgrades on signature packages",
      icon: Sparkles
    }
  ];

  const currentPackages = packageType === 'single' ? singlePackages : duoPackages;

  return (
    <>
      <SEO 
        title="Wedding Photography Pricing | Sparta, NJ | Hariel Xavier Photography"
        description="Transparent wedding photography pricing for Sparta, Sussex County, and NJ. Single photographer packages from $2,295. Duo photographer packages from $3,295. Event photography available."
        keywords="wedding photography pricing, Sparta NJ photographer prices, Sussex County wedding costs, affordable wedding photographer NJ"
      />
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative h-[70vh] overflow-hidden"
        >
          {/* Hero Background Image with Minimal Overlay */}
          <div className="absolute inset-0">
            <motion.img
              src="/images/pricehero.jpg"
              alt="Hariel Xavier Photography"
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
            />
            {/* Subtle gradient for text readability only */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10"></div>
          </div>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-champagneRose rounded-full opacity-10 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-96 h-96 bg-rose rounded-full opacity-10 blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, -30, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          
          {/* Lower Third Glass Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/15 backdrop-blur-md border-t border-white/30"
            >
              <div className="container mx-auto px-6 md:px-12 py-6 md:py-8 text-center">
                <h1 className="text-2xl md:text-4xl font-serif mb-2 text-white drop-shadow-xl" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.6)' }}>
                  Investment in Your Love Story
                </h1>
                
                <div className="w-16 h-0.5 bg-gradient-to-r from-champagneRose to-rose mb-3 rounded-full mx-auto"></div>
                
                <p
                  className="text-sm md:text-lg text-white font-light drop-shadow-lg"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
                >
                  Elegant, transparent pricing for timeless photography in Sparta, Sussex County & beyond
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Package Type Toggle */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="inline-flex rounded-2xl bg-gradient-to-r from-rose-light via-white to-cream shadow-2xl p-2 border border-champagneRose/30">
                <button
                  onClick={() => setPackageType('single')}
                  className={`px-10 py-4 rounded-xl font-serif text-lg transition-all duration-500 flex items-center space-x-3 ${
                    packageType === 'single'
                      ? 'bg-gradient-to-r from-gray-900 to-black text-white shadow-xl scale-105'
                      : 'text-gray-600 hover:text-black hover:bg-white/50'
                  }`}
                >
                  <Camera size={22} className={packageType === 'single' ? 'text-champagneRose' : ''} />
                  <span>Single Photographer</span>
                </button>
                <button
                  onClick={() => setPackageType('duo')}
                  className={`px-10 py-4 rounded-xl font-serif text-lg transition-all duration-500 flex items-center space-x-3 ${
                    packageType === 'duo'
                      ? 'bg-gradient-to-r from-gray-900 to-black text-white shadow-xl scale-105'
                      : 'text-gray-600 hover:text-black hover:bg-white/50'
                  }`}
                >
                  <Users size={22} className={packageType === 'duo' ? 'text-champagneRose' : ''} />
                  <span>Duo Photographer</span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Wedding Packages */}
        <section className="py-20 bg-gradient-to-b from-white via-rose-light/30 to-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-champagneRose to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-champagneRose to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">
                {packageType === 'single' ? 'Single Photographer' : 'Duo Photographer'} Packages
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
                {packageType === 'single' 
                  ? 'Intimate, artful coverage by Hariel Xavier—capturing every cherished moment with elegance and care'
                  : 'Comprehensive dual-angle storytelling, ensuring no precious moment goes unnoticed from any perspective'
                }
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={packageType}
                initial={{ opacity: 0, x: packageType === 'single' ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: packageType === 'single' ? 50 : -50 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto"
              >
                {currentPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.name}
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ 
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                    className={`relative bg-white rounded-3xl overflow-hidden shadow-2xl group ${
                      pkg.popular ? 'ring-2 ring-champagneRose' : ''
                    }`}
                  >
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-champagneRose/10 via-transparent to-rose/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Popular Badge */}
                    {pkg.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-gray-900 to-black text-white px-6 py-2 text-sm font-serif tracking-wide">
                        Most Loved
                      </div>
                    )}
                    
                    {/* Best Value Badge */}
                    {pkg.badge && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-champagneRose to-rose text-white px-6 py-2 text-sm font-serif tracking-wide">
                        Signature Collection
                      </div>
                    )}

                    <div className="p-10 relative z-10">
                      {/* Package Name with Sparkle */}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-3xl font-serif text-gray-900">{pkg.name}</h3>
                        <Sparkles className="h-6 w-6 text-champagneRose" />
                      </div>
                      <p className="text-gray-500 mb-8 font-light tracking-wide">{pkg.hours} Hours of Artful Coverage</p>

                      {/* Price */}
                      <div className="mb-8">
                        <span className="text-6xl font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                          ${pkg.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Image Count Highlight */}
                      <div className="bg-gradient-to-r from-rose-light to-cream rounded-2xl p-5 mb-8 text-center border border-champagneRose/20">
                        <div className="flex items-center justify-center space-x-2">
                          <Image className="h-5 w-5 text-rose" />
                          <span className="font-bold text-lg text-gray-900">{pkg.images}</span>
                          <span className="text-gray-600">Edited Images</span>
                        </div>
                      </div>

                      {/* Features List */}
                      <ul className="space-y-4 mb-10">
                        {pkg.features.map((feature, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="flex items-start"
                          >
                            <Check className="h-5 w-5 text-champagneRose mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 font-light leading-relaxed">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Link
                        to="/book-now"
                        className={`block w-full text-center py-4 rounded-xl font-serif text-lg transition-all duration-300 ${
                          pkg.popular
                            ? 'bg-gradient-to-r from-gray-900 to-black text-white hover:shadow-2xl hover:scale-105'
                            : 'bg-gradient-to-r from-champagneRose to-rose text-white hover:shadow-xl hover:scale-105'
                        }`}
                      >
                        Reserve {pkg.name}
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Event Photography */}
        <section className="py-20 bg-gradient-to-br from-cream via-white to-rose-light/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">
                Event Photography
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
                Celebrations, corporate gatherings, and special moments deserve the same artful attention
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {eventPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.name}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={`bg-white rounded-2xl overflow-hidden shadow-xl border-2 transition-all ${
                    pkg.popular ? 'border-champagneRose' : 'border-gray-100'
                  }`}
                >
                  {pkg.popular && (
                    <div className="bg-gradient-to-r from-champagneRose to-rose text-white text-center py-2 text-sm font-serif tracking-wide">
                      Client Favorite
                    </div>
                  )}
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-serif mb-2 text-gray-900">{pkg.name}</h3>
                    <p className="text-gray-500 mb-6 font-light">{pkg.hours} Hours</p>
                    
                    <div className="mb-6">
                      <span className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                        ${pkg.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-gradient-to-r from-rose-light to-cream rounded-xl p-4 mb-6 text-center border border-champagneRose/20">
                      <span className="font-bold text-lg">{pkg.images} Images</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <Check className="h-4 w-4 text-champagneRose mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 font-light">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/contact"
                      className="block w-full text-center py-3 bg-gradient-to-r from-champagneRose to-rose text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 font-serif"
                    >
                      Inquire About Event
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* À La Carte Options */}
        <section className="py-20 bg-gradient-to-br from-white via-cream/30 to-white relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">
                À La Carte Enhancements
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                Personalize your collection with exquisite additions
              </p>
            </motion.div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-5">
                {alacarte.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    className="bg-white border-2 border-gray-100 rounded-2xl p-6 flex items-center justify-between hover:shadow-xl hover:border-champagneRose/40 transition-all group"
                  >
                    <div className="flex-1">
                      <h4 className="font-serif text-lg text-gray-900 group-hover:text-black transition-colors">{item.name}</h4>
                      {item.note && (
                        <p className="text-xs text-gray-500 italic mt-1">{item.note}</p>
                      )}
                    </div>
                    <div className="text-right ml-6">
                      <span className="text-2xl font-bold bg-gradient-to-r from-champagneRose to-rose bg-clip-text text-transparent">
                        {item.note === 'Starting at' ? 'From ' : ''}${item.price.toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Exclusive Bonuses */}
        <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
          {/* Animated Gradient Orbs */}
          <motion.div
            className="absolute top-10 right-10 w-96 h-96 bg-champagneRose rounded-full opacity-10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                Exceptional Value & Bonuses
              </h2>
              <p className="text-gray-300 text-xl max-w-2xl mx-auto font-light">
                Thoughtful inclusions designed to enhance your experience
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {bonuses.map((bonus, index) => {
                const Icon = bonus.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    whileHover={{ 
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                    className="bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 hover:border-champagneRose/50 transition-all group"
                  >
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-champagneRose to-rose rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h4 className="font-serif text-lg mb-3">{bonus.title}</h4>
                    <p className="text-gray-300 text-sm font-light leading-relaxed">{bonus.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gradient-to-b from-white via-rose-light/20 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-serif mb-16 text-center text-gray-900"
              >
                Included in Every Collection
              </motion.h2>
              
              <div className="grid md:grid-cols-2 gap-10">
                {[
                  {
                    icon: Award,
                    title: "14+ Years of Artistry",
                    description: "Refined expertise serving couples throughout Sparta, Sussex County, and beyond with timeless elegance"
                  },
                  {
                    icon: Image,
                    title: "Museum-Quality Images",
                    description: "Every photograph thoughtfully edited and delivered in archival print-ready resolution"
                  },
                  {
                    icon: Sparkles,
                    title: "Swift Previews",
                    description: "Curated sneak peeks within 24-48 hours, complete gallery delivered with care in 4-6 weeks"
                  },
                  {
                    icon: Check,
                    title: "Complete Usage Rights",
                    description: "Print, share, and treasure your images forever with full creative freedom and ownership"
                  }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="flex items-start space-x-5 group"
                    >
                      <motion.div
                        className="w-14 h-14 bg-gradient-to-br from-champagneRose to-rose rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </motion.div>
                      <div>
                        <h4 className="font-serif text-xl mb-2 text-gray-900">{item.title}</h4>
                        <p className="text-gray-600 font-light leading-relaxed">{item.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gradient-to-br from-cream via-white to-rose-light/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-serif mb-12 text-center text-gray-900"
              >
                Frequently Asked Questions
              </motion.h2>
              
              <div className="space-y-5">
                {[
                  {
                    q: "Do you require a deposit?",
                    a: "A 30% retainer secures your date, with the remaining balance due two weeks before your celebration."
                  },
                  {
                    q: "What's the difference between single and duo photographer coverage?",
                    a: "Single photographer coverage focuses on the main narrative and key moments. Duo coverage provides dual perspectives—capturing both partners simultaneously during preparation, multiple ceremony angles, and comprehensive reception documentation."
                  },
                  {
                    q: "How far in advance should we book?",
                    a: "We recommend reaching out 12-18 months in advance. Couples who reserve early receive a $275 credit as our appreciation."
                  },
                  {
                    q: "Do you travel outside of Sparta and Sussex County?",
                    a: "Absolutely. We serve all of New Jersey, New York, and welcome destination weddings. Travel beyond 50 miles from Sparta may include a modest travel fee."
                  },
                  {
                    q: "What if we need more hours than a package includes?",
                    a: "Additional time can be added at $300/hour for lead photography or $175/hour for a second photographer."
                  },
                  {
                    q: "Can we customize our package?",
                    a: "Certainly. All collections are designed to be personalized with our à la carte offerings to perfectly suit your vision."
                  }
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-champagneRose/30 transition-all"
                  >
                    <h4 className="font-serif text-xl mb-3 text-gray-900">{faq.q}</h4>
                    <p className="text-gray-600 font-light leading-relaxed">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-rose-light via-white to-cream relative overflow-hidden">
          {/* Animated Background */}
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-champagneRose rounded-full opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 100, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            {/* Studio Ninja Contact Form */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 pt-12 border-t border-champagneRose/30"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif mb-4">Let's Start Your Journey</h2>
                <p className="max-w-2xl mx-auto text-gray-600 font-light">
                  Ready to capture your love story? Fill out the form below to get in touch!
                </p>
              </div>
              <div className="max-w-2xl mx-auto">
                <iframe 
                  height="699" 
                  style={{minWidth: '100%', maxWidth: '600px', border: 0, margin: '0 auto'}} 
                  id="sn-form-pricing"
                  src="https://app.studioninja.co/contactform/parser/0a800fc8-7fbb-1621-817f-cbe6e7e26016/0a800fc8-7fbb-1621-817f-d37610217750"
                  allowFullScreen
                  title="Contact Form"
                >
                </iframe>
                <script 
                  type="text/javascript" 
                  data-iframe-id="sn-form-pricing"
                  src="https://app.studioninja.co/client-assets/form-render/assets/scripts/iframeResizer.js"
                ></script>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Camera, Clock, Heart, Sparkles, ChevronRight, ArrowUp, Award, Eye, Sun, Users, Gem, Phone, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { biancaJeffreyImages } from '../data/biancaJeffreyImages';
import PhotoswipeResponsiveGallery from '../components/gallery/PhotoswipeResponsiveGallery';
import { useInView } from 'react-intersection-observer';

// Gallery data
const galleryData = {
  id: 'park-chateau-estate-wedding',
  title: 'Park Chateau Estate',
  subtitle: 'Master Photography at New Jersey\'s Premier Venue',
  description: 'Exclusive insights from 50+ weddings photographed',
  venue: 'Park Chateau Estate',
  location: 'East Brunswick, New Jersey',
  weddingsPhotographed: '50+',
  averageGuestCount: '200-350',
  preferredVendor: true,
  coverImage: 'https://res.cloudinary.com/dos0qac90/image/upload/v1761593133/hariel-xavier-photography/MoStuff/Featured_Wedding/Bianca_and_Jeffreys_Wedding/THE_FIRST_LOOK/Bianca_and_Jeff_s_Wedding-475.jpg'
};

// Featured images for hero carousel
const featuredImages = [
  'https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_1600/v1761593133/hariel-xavier-photography/MoStuff/Featured_Wedding/Bianca_and_Jeffreys_Wedding/THE_FIRST_LOOK/Bianca_and_Jeff_s_Wedding-475.jpg',
  'https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_1600/v1761593133/hariel-xavier-photography/MoStuff/Featured_Wedding/Bianca_and_Jeffreys_Wedding/The_Ceremony/Bianca_and_Jeff_s_Wedding-826.jpg',
  'https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_1600/v1761593133/hariel-xavier-photography/MoStuff/Featured_Wedding/Bianca_and_Jeffreys_Wedding/The_Reception/Bianca_and_Jeff_s_Wedding-1337.jpg'
];

// Venue expertise timeline
const venueExpertise = [
  {
    time: 'Chapel',
    event: 'Perfect Natural Light Window',
    description: '3:00-4:30 PM provides ethereal backlighting through stained glass',
    icon: Sun
  },
  {
    time: 'Gardens',
    event: 'Golden Hour Magic Spot',
    description: 'Southwest gazebo area captures stunning sunset portraits at 6:30 PM',
    icon: Camera
  },
  {
    time: 'Grand Ballroom',
    event: 'Chandelier Reflection Technique',
    description: 'Center dance floor creates dramatic crystal reflections for first dance',
    icon: Sparkles
  },
  {
    time: 'Bridal Suite',
    event: 'Morning Light Advantage',
    description: 'East-facing windows provide soft, flattering light until 11 AM',
    icon: Sun
  },
  {
    time: 'Estate Grounds',
    event: 'Hidden Garden Path',
    description: 'Secret pathway behind fountain - perfect for intimate couple portraits',
    icon: Heart
  },
  {
    time: 'Cocktail Terrace',
    event: 'Architectural Frame Shot',
    description: 'French doors create elegant framing for group photos at sunset',
    icon: Users
  }
];

// Venue insider knowledge
const insiderTips = [
  {
    title: 'Best Photo Locations',
    items: [
      'Grand Staircase - Dramatic entrances',
      'Rose Garden - Peak bloom May-September',
      'Reflection Pool - Mirror-like shots',
      'Chapel Altar - Natural window light'
    ]
  },
  {
    title: 'Optimal Timing',
    items: [
      'Ceremony: 3-4 PM for best chapel lighting',
      'Portraits: 5:30-6:30 PM golden hour',
      'Reception entrance: After sunset for dramatic lighting',
      'Sparkler exit: 10:30 PM for night photography'
    ]
  },
  {
    title: 'Weather Contingencies',
    items: [
      'Indoor ceremony backup in Grand Ballroom',
      'Covered colonnade for rainy portraits',
      'Climate-controlled conservatory year-round',
      'Heated/cooled bridal suite for comfort'
    ]
  }
];

function BiancaJeffreyGalleryPage() {
  const [loading, setLoading] = useState(true);
  const [currentFeaturedImage, setCurrentFeaturedImage] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [expertiseRef, expertiseInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [venueRef, venueInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // All images without filtering
  const galleryImages = biancaJeffreyImages.filter(img => !img.featured);

  // Auto-rotate featured images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeaturedImage((prev) => (prev + 1) % featuredImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Park Chateau Estate Wedding Photography Expert | 50+ Weddings | Hariel Xavier</title>
        <meta name="description" content="Preferred photographer at Park Chateau Estate with 50+ weddings captured. Expert knowledge of every photo location, optimal lighting times, and venue secrets. East Brunswick, NJ." />
        <meta name="keywords" content="Park Chateau Estate photographer, preferred vendor, East Brunswick wedding venue expert, NJ luxury wedding photographer, Park Chateau wedding specialist" />
        <link rel="canonical" href="https://harielxavier.com/bianca-jeffrey" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Park Chateau Estate Wedding Photography Expert | 50+ Weddings" />
        <meta property="og:description" content="Preferred photographer at Park Chateau Estate. Expert knowledge from 50+ weddings at this premier New Jersey venue." />
        <meta property="og:image" content={galleryData.coverImage} />

        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "Park Chateau Estate Wedding Photography Portfolio",
            "description": "Expert wedding photography at Park Chateau Estate by preferred vendor Hariel Xavier Photography",
            "image": galleryData.coverImage,
            "author": {
              "@type": "Person",
              "name": "Hariel Xavier",
              "url": "https://harielxavier.com",
              "award": "Park Chateau Estate Preferred Photographer"
            },
            "contentLocation": {
              "@type": "Place",
              "name": "Park Chateau Estate",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "East Brunswick",
                "addressRegion": "NJ",
                "addressCountry": "US"
              }
            }
          })}
        </script>
      </Helmet>

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {featuredImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentFeaturedImage ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Park Chateau Estate wedding photography ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>

        <div className="relative h-full flex items-center justify-center">
          <div className={`text-center text-white px-4 transform transition-all duration-1000 ${
            heroInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {/* Back Button */}
            <Link
              to="/portfolio"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span>Back to Portfolio</span>
            </Link>

            {/* Preferred Vendor Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6 border border-white/30">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold">Park Chateau Estate Preferred Photographer</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl mb-4 tracking-wide">
              Park Chateau Estate
            </h1>
            <p className="text-2xl md:text-3xl mb-6 font-light">
              {galleryData.weddingsPhotographed} Weddings Captured • Every Secret Spot Known
            </p>
            <div className="flex items-center justify-center gap-6 text-lg">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>East Brunswick, New Jersey</span>
              </div>
              <div className="hidden md:flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                <span>Venue Specialist Since 2018</span>
              </div>
            </div>

            {/* Image indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {featuredImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeaturedImage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentFeaturedImage
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-[1px] h-12 bg-white/50 mx-auto mb-2" />
          <p className="text-white/80 text-xs uppercase tracking-widest">Explore</p>
        </div>
      </section>

      {/* Venue Expertise Section */}
      <section ref={expertiseRef} className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className={`max-w-5xl mx-auto transform transition-all duration-1000 ${
            expertiseInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif mb-4">
                Why I'm Your Park Chateau Expert
              </h2>
              <p className="text-lg text-gray-600">
                After photographing 50+ weddings here, I know every magical corner, perfect angle, and golden moment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Award className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Preferred Vendor Status</h3>
                <p className="text-gray-600">
                  Officially recognized by Park Chateau for exceptional service and stunning results
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Camera className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="font-semibold text-xl mb-2">50+ Weddings Here</h3>
                <p className="text-gray-600">
                  Unmatched experience with every season, weather condition, and ceremony style
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Gem className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Hidden Gems Master</h3>
                <p className="text-gray-600">
                  I know secret spots for portraits that even some staff members don't know about
                </p>
              </div>
            </div>

            {/* Insider Knowledge Timeline */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <h3 className="text-2xl font-serif text-center mb-8">
                My Park Chateau Photography Playbook
              </h3>
              <div className="space-y-6">
                {venueExpertise.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-start transform transition-all duration-700 ${
                        expertiseInView ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="flex-shrink-0 w-32 md:w-40">
                        <p className="font-semibold text-gray-900">{item.time}</p>
                      </div>
                      <div className="flex-grow pl-6 md:pl-8 border-l-2 border-gray-200">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Icon className="w-5 h-5 text-gray-700" />
                          </div>
                          <div>
                            <h4 className="font-medium text-lg mb-1">{item.event}</h4>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              A Recent Park Chateau Celebration
            </h2>
            <p className="text-lg text-gray-600">
              Every corner captured with expertise • Every moment perfectly timed
            </p>
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <PhotoswipeResponsiveGallery
              images={galleryImages}
              layout="justified"
              gapSize={8}
              targetRowHeight={400}
            />
          )}
        </div>
      </section>

      {/* Venue Master Knowledge */}
      <section ref={venueRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className={`max-w-6xl mx-auto transform transition-all duration-1000 ${
            venueInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-6">
              Park Chateau Insider Knowledge
            </h2>

            {/* Direct Contact CTA */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-6 mb-12 text-center">
              <p className="text-lg font-semibold mb-3">Ready to see Park Chateau in person?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="tel:732-238-4200"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call (732) 238-4200
                </a>
                <a
                  href="mailto:events@parkchateau.com?subject=Tour Request - Referred by Hariel Xavier Photography"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Schedule a Tour
                </a>
              </div>
              <p className="text-sm text-gray-300 mt-3">Mention Hariel Xavier Photography when you call</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {insiderTips.map((section, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <h3 className="font-semibold text-xl mb-4 text-gray-900">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start text-gray-600">
                        <span className="text-gray-400 mr-2 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Venue Details Grid */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-serif mb-6">
                    The Park Chateau Advantage
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Park Chateau Estate isn't just a venue—it's a photographer's paradise.
                    With French-inspired architecture, manicured gardens, and endless elegant details,
                    every wedding here is an opportunity for extraordinary photography.
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 mr-3 mt-1 text-gray-400" />
                      <div>
                        <p className="font-semibold">Ideal Timeline</p>
                        <p className="text-gray-600 text-sm">
                          3 PM ceremony for perfect chapel light, 6 PM golden hour portraits
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="w-5 h-5 mr-3 mt-1 text-gray-400" />
                      <div>
                        <p className="font-semibold">Capacity Sweet Spot</p>
                        <p className="text-gray-600 text-sm">
                          200-300 guests fills the ballroom perfectly without feeling empty
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 mr-3 mt-1 text-gray-400" />
                      <div>
                        <p className="font-semibold">Book Park Chateau Today</p>
                        <p className="text-gray-600 text-sm">
                          <a href="tel:732-238-4200" className="text-gray-900 font-medium hover:text-gray-700">(732) 238-4200</a><br />
                          <a href="mailto:events@parkchateau.com" className="text-gray-900 hover:text-gray-700">events@parkchateau.com</a><br />
                          678 Cranbury Road, East Brunswick, NJ
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="tel:732-238-4200"
                      className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      Call Park Chateau Now
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                    <a
                      href="mailto:events@parkchateau.com?subject=Wedding Photography Inquiry - Referred by Hariel Xavier"
                      className="inline-flex items-center justify-center px-4 py-2 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-colors"
                    >
                      Email Park Chateau
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_800/v1761593133/hariel-xavier-photography/MoStuff/Featured_Wedding/Bianca_and_Jeffreys_Wedding/The_Ceremony/Bianca_and_Jeff_s_Wedding-826.jpg"
                    alt="Park Chateau Estate Chapel - Expert photography location"
                    className="w-full h-auto"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <p className="text-white font-medium">The Chapel</p>
                    <p className="text-white/80 text-sm">
                      Best light: 3-4 PM through stained glass windows
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Award className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
            <h2 className="text-3xl md:text-4xl font-serif mb-6">
              Ready to Book Park Chateau Estate?
            </h2>
            <p className="text-xl mb-4 text-gray-300 leading-relaxed">
              Contact Park Chateau directly and mention Hariel Xavier Photography as your preferred photographer.
              With 50+ weddings captured here, I work seamlessly with their exceptional team.
            </p>

            {/* Park Chateau Contact Info Box */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-4">Contact Park Chateau Estate Directly:</h3>
              <div className="space-y-2 text-gray-200">
                <p>📍 678 Cranbury Road, East Brunswick, NJ 08816</p>
                <p>📞 (732) 238-4200</p>
                <p>✉️ events@parkchateau.com</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:732-238-4200"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                📞 Call Park Chateau Now
              </a>
              <a
                href="mailto:events@parkchateau.com?subject=Wedding Inquiry - Interested in Hariel Xavier Photography&body=Hello Park Chateau,%0A%0AI'm interested in hosting my wedding at your venue and would like to work with Hariel Xavier Photography as my preferred photographer.%0A%0APlease send me information about available dates and packages.%0A%0AThank you!"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-all"
              >
                ✉️ Email Park Chateau
              </a>
            </div>
            <div className="mt-8 space-y-2">
              <p className="text-yellow-400 font-semibold">
                ⭐ Mention "Hariel Xavier Photography" when contacting Park Chateau
              </p>
              <p className="text-gray-400 text-sm">
                Preferred Vendor • 50+ Weddings • Expert Knowledge of Every Location
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-all transform hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default BiancaJeffreyGalleryPage;
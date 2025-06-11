import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { History, MapPin, Home, Clock, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import SEO from '../components/SEO';
import WeddingAvailabilityChecker from '../components/wedding/WeddingAvailabilityChecker';

// Define types for packages
interface Package {
  name: string;
  price: string;
  originalPrice?: string;
  features: string[];
  popular?: boolean;
}

// Simple PricingCard component
const PricingCard = ({ 
  pkg, 
  selected, 
  onClick 
}: { 
  pkg: Package; 
  selected: boolean; 
  onClick: () => void 
}) => {
  return (
    <div 
      className={`border rounded-lg p-6 transition-all duration-300 cursor-pointer ${
        selected 
          ? 'border-black bg-black text-white shadow-lg scale-105' 
          : 'border-gray-200 hover:border-gray-400 hover:shadow'
      }`}
      onClick={onClick}
    >
      {pkg.popular && (
        <div className="bg-yellow-400 text-black text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-full inline-block mb-2">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-medium mb-2">{pkg.name}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{pkg.price}</span>
        {pkg.originalPrice && (
          <span className={`ml-2 line-through ${selected ? 'text-gray-300' : 'text-gray-400'}`}>
            {pkg.originalPrice}
          </span>
        )}
      </div>
      <div className="space-y-3 mt-6">
        {pkg.features.map((feature: string, index: number) => (
          <div key={index} className="flex items-start gap-3 group">
            <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className={selected ? 'text-gray-100' : 'text-gray-700'}>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple BookingModal component
const BookingModal = ({ 
  package: pkg, 
  onClose 
}: { 
  package: Package; 
  onClose: () => void; 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
        <div className="flex justify-between items-center p-8 border-b border-gray-100">
          <h2 className="font-serif text-2xl">Book Your <span className="italic">{pkg.name}</span> Package</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black transition-colors">
            <span className="text-2xl">×</span>
          </button>
        </div>
        
        <div className="p-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Email Address</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none"
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Wedding Date</label>
              <input 
                type="date" 
                className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Venue</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none"
                placeholder="Picatinny Club"
                defaultValue="Picatinny Club"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Message</label>
              <textarea 
                className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none h-32"
                placeholder="Tell us about your wedding plans..."
              ></textarea>
            </div>
            
            <div className="pt-4 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-3 border border-gray-200 hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Book Now
              </button>
            </div>
          </form>
        </div>
      </div>
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
    <div className="py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{title}</h4>
        <span className="font-light">${price}</span>
      </div>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  );
};

export default function PicatinnyClubPage() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isHistorySectionVisible, setIsHistorySectionVisible] = useState(false);
  const [randomGalleryImages, setRandomGalleryImages] = useState<string[]>([]);

  // We don't need this ref and inView, so removing them

  const { ref: historyRef, inView: historyInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (historyInView) {
      setIsHistorySectionVisible(true);
    }
  }, [historyInView]);

  // Generate random gallery images on component mount using actual files
  useEffect(() => {
    // List of actual image files in public/MoStuff/club/ (based on previous list_files result)
    // Note: Manually listing these based on the tool output. A dynamic server-side approach would be more robust.
    const allClubImages = [
      'ca1.jpg', 'ca2.jpg', 'ca3.jpg', 'ca4.jpg', 'ca5.jpg', 'ca6.jpg', 'ca7.jpg', 'ca8.jpg', 'ca9.jpg', 
      'ca10.jpg', 'ca11.jpg', 'ca12.jpg', 'ca13.jpg', 'ca14.jpg', 'ca15.jpg', 'ca16.jpg', 'ca18.jpg', 'ca20.jpg', 
      'pic 19.jpg', 'pic 30.jpg', // Handle names with spaces if needed, ensure URL encoding works
      'pic1.jpg', 'pic2.jpg', 'pic3.jpg', 'pic4.jpg', 'pic5.jpg', 'pic6.jpg', 'pic7.jpg', 'pic8.jpg', 'pic9.jpg', 
      'pic10.jpg', 'pic11.jpg', 'pic12.jpg', 'pic13.jpg', 'pic14.jpg', 'pic16.jpg', 'pic17.jpg', 'pic20.jpg', 
      'pic21.jpg', 'pic22.jpg', 'pic23.jpg', 'pic24.jpg', 'pic26.jpg', 'pic27.jpg', 'pic28.jpg', 'pic30.jpg', 
      'pic31.jpg', 'pic32.jpg', 'pic33.jpg', 'pic34.jpg', 'pic35.jpg', 'pic40.jpg', 'pic42.jpg', 
      'sa1.jpg', 'sa2.jpg', 'sa3.jpg', 'sa4.jpg', 'sa6.jpg', 'sa7.jpg', 'sa8.jpg', 'sa9.jpg', 
      'sa10.jpg', 'sa11.jpg', 'sa12.jpg', 'sa13.jpg', 'sa14.jpg'
    ];

    // Filter out the hero image and any non-jpg files just in case
    const validImages = allClubImages.filter(img => 
        img.toLowerCase().endsWith('.jpg') && 
        img !== 'pic5.jpg' // Exclude the hero image
    );

    // Shuffle the array using Fisher-Yates algorithm
    const shuffledImages = [...validImages];
    for (let i = shuffledImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
    }

    // Select up to 60 images (or fewer if not enough images available)
    const numberOfImagesToShow = Math.min(shuffledImages.length, 60);
    setRandomGalleryImages(shuffledImages.slice(0, numberOfImagesToShow));
    
  }, []); // Empty dependency array ensures this runs only once on mount

  // Special Picatinny Club packages with discounted prices
  const singlePhotographerCollections: Package[] = [
    {
      name: "The Essential",
      price: "2,195",
      originalPrice: "2,395",
      features: [
        "6 hours coverage",
        "400 edited images",
        "Online gallery with digital download",
        "3-month gallery hosting",
        "5 sneak peeks within 48 hours",
        "Delivery in 6 weeks",
        "Special Picatinny Club discount"
      ]
    },
    {
      name: "The Timeless",
      price: "2,795",
      originalPrice: "2,995",
      features: [
        "8 hours coverage",
        "600 edited images",
        "Online gallery with digital download",
        "1-year gallery hosting",
        "10 sneak peeks within 24 hours",
        "Engagement session",
        "Delivery in 4 weeks",
        "Special Picatinny Club discount"
      ],
      popular: true
    }
  ];

  const dualPhotographerCollections: Package[] = [
    {
      name: "The Heritage",
      price: "3,695",
      originalPrice: "3,895",
      features: [
        "9 hours with 2 photographers",
        "800 edited images",
        "Online gallery with digital download",
        "Lifetime gallery hosting",
        "15 sneak peeks within 24 hours",
        "Engagement session",
        "Luxury print box with 30 prints + USB",
        "Delivery in 3 weeks",
        "Special Picatinny Club discount"
      ]
    },
    {
      name: "The Masterpiece",
      price: "5,095",
      originalPrice: "5,395",
      features: [
        "10 hours with 2 photographers",
        "1000 edited images",
        "Engagement session",
        "Luxury album",
        "Parent albums",
        "Large print box with 50 prints",
        "Premium USB box",
        "Rehearsal dinner coverage (2 hours)",
        "Next day preview blog post",
        "Lifetime gallery hosting",
        "Priority editing",
        "Special Picatinny Club discount"
      ],
      popular: true
    }
  ];

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  return (
    <>
      <SEO 
        title="Picatinny Club Wedding Photography | Special Pricing"
        description="Exclusive wedding photography packages for Picatinny Club couples at the historic Picatinny Arsenal. Special pricing as a preferred vendor."
      />
      <Navigation />
      
      <main id="main-content" className="pt-24">
        {/* Hero Section */}
        <section className="relative bg-black text-white py-20">
          <div className="absolute inset-0 opacity-40">
            <img 
              src="/MoStuff/club/pic5.jpg" 
              alt="Picatinny Club Wedding" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block bg-black bg-opacity-50 px-6 py-2 mb-6">
                <span className="text-sm uppercase tracking-widest">Preferred Vendor</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">Picatinny Club Wedding Photography</h1>
              <p className="text-xl mb-10 text-white/80">
                Exclusive packages and special pricing for couples celebrating at this historic venue nestled in the rolling hills of northern New Jersey
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-black px-8 py-3 hover:bg-gray-100 transition-colors"
                >
                  View Special Pricing
                </button>
                <Link 
                  to="/#contact-form" 
                  className="border border-white text-white px-8 py-3 hover:bg-white hover:text-black transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Venue History Section */}
        <section ref={historyRef} className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black text-white mb-4">
                <History className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl mb-4">A Venue Rich in History</h2>
              <p className="text-gray-600">
                Discover the storied past of this unique military venue established in 1880
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={`transition-all duration-1000 ${isHistorySectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <img 
                  src="/MoStuff/club/pic5.jpg" 
                  alt="Wedding Ceremony at Picatinny Club" 
                  className="w-full h-auto rounded-lg shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 italic text-center">A beautiful wedding ceremony at The Club at Picatinny</p>
              </div>
              
              <div className={`space-y-6 transition-all duration-1000 delay-300 ${isHistorySectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div>
                  <h3 className="text-xl font-medium mb-2">From Powder Depot to Premier Venue</h3>
                  <p className="text-gray-700">
                    The Club at Picatinny is located on the grounds of the historic Picatinny Arsenal, which was established on September 6, 1880, originally as the Dover Powder Depot. The name was changed to Picatinny Arsenal in 1907, and it has served as a center for military research, development, and innovation ever since.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">A Hidden Gem in Northern New Jersey</h3>
                  <p className="text-gray-700">
                    Nestled among 6,400 acres of rolling hills and serene lakes in Morris County, The Club at Picatinny offers a stunning natural backdrop for weddings. The venue combines military heritage with elegant modern amenities, creating a unique setting for your special day.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">Exclusive Access</h3>
                  <p className="text-gray-700">
                    While located on a military installation, The Club at Picatinny is open to the public for weddings and special events. As your photographers, we have established a trusted relationship with the venue staff, ensuring seamless access and coordination for your wedding day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Venue Highlights */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl mb-4">Why We Love Picatinny Club</h2>
              <p className="text-gray-600">
                As a preferred vendor, we've photographed countless beautiful weddings at this stunning venue
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                <img 
                  src="/MoStuff/club/pic8.jpg" 
                  alt="Picatinny Club Grounds" 
                  className="w-full h-64 object-cover mb-4 rounded"
                />
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mr-3">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-xl">Stunning Grounds</h3>
                </div>
                <p className="text-gray-600">
                  Set against the backdrop of the Picatinny Lake and surrounded by lush forests, the venue offers expansive, well-maintained grounds with beautiful landscaping that provide endless photo opportunities in every season.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                <img 
                  src="/MoStuff/club/pic11.jpg" 
                  alt="Picatinny Club Ballroom" 
                  className="w-full h-64 object-cover mb-4 rounded"
                />
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mr-3">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-xl">Elegant Ballroom</h3>
                </div>
                <p className="text-gray-600">
                  The spacious ballroom features high ceilings with exposed wooden beams, large windows with lake views, and a classic design that can be transformed to match any wedding style or theme.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                <img 
                  src="/MoStuff/club/pic10.jpg" 
                  alt="Picatinny Club Lighting" 
                  className="w-full h-64 object-cover mb-4 rounded"
                />
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mr-3">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-xl">Ambient Lighting</h3>
                </div>
                <p className="text-gray-600">
                  The venue features stunning chandeliers, wall sconces, and the ability to add custom lighting elements like uplighting, fairy lights, and candles to create the perfect ambiance for your celebration.
                </p>
              </div>
            </div>

            <div className="mt-12 bg-gray-50 p-8 rounded-lg shadow-md">
              <h3 className="font-serif text-2xl text-center mb-4">Venue Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">Spacious outdoor terrace with lake views</span>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">Picturesque gazebo for ceremonies</span>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">Elegant ballroom with panoramic windows</span>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">Experienced event coordinators</span>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">Full-service catering with customizable menus</span>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">Private bridal suite and groom's room</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Special Pricing Section */}
        <section id="pricing" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-block bg-black px-4 py-1 mb-4">
                <span className="text-white text-sm uppercase tracking-widest">Exclusive Offer</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl mb-4">Special Picatinny Club Pricing</h2>
              <p className="text-gray-600">
                As a preferred vendor, we're pleased to offer exclusive pricing for Picatinny Club couples
              </p>
            </div>
            
            <div className="mb-16">
              <h3 className="font-serif text-2xl text-center mb-8">Single Photographer Collections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {singlePhotographerCollections.map((pkg, index) => (
                  <PricingCard 
                    key={index}
                    pkg={pkg}
                    selected={selectedPackage === pkg}
                    onClick={() => handlePackageSelect(pkg)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-serif text-2xl text-center mb-8">Dual Photographer Collections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {dualPhotographerCollections.map((pkg, index) => (
                  <PricingCard 
                    key={index}
                    pkg={pkg}
                    selected={selectedPackage === pkg}
                    onClick={() => handlePackageSelect(pkg)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Picatinny Club Weddings */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl mb-4">Featured Picatinny Club Weddings</h2>
              <p className="text-gray-600">
                Browse our portfolio of beautiful weddings photographed at this historic venue
              </p>
            </div>
            
            {/* Updated grid to handle potentially more images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> 
              {randomGalleryImages.map((imageName, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                  <img 
                    src={`/MoStuff/club/${imageName}`} // Ensure URL encoding handles spaces if present
                    alt={`Picatinny Club Wedding ${index + 1}`} 
                    className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy" // Add lazy loading for potentially many images
                  />
                  {/* Optional overlay - kept simple for now */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                     {/* You can add text here if needed, like image name or generic text */}
                     {/* <p className="text-white text-xs">{imageName}</p> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Removing the Testimonials Section as requested */}

        {/* Availability Checker Section Removed as requested */}

        {/* Booking Modal */}
        {selectedPackage && (
          <BookingModal
            package={selectedPackage} 
            onClose={() => setSelectedPackage(null)} 
          />
        )}
      </main>
      
      <Footer />
    </>
  );
}

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import { ArrowRight, Check, MapPin, Calendar, Clock } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import SEOHead from '../components/common/SEOHead';
import FeaturedGalleries from '../components/landing/FeaturedGalleries';
import CuratorSocialFeed from '../components/social/CuratorSocialFeed';
import PhotographyStyleSlider from '../components/portfolio/PhotographyStyleSlider';
import BlurText from '../components/BlurText';
// Removed FOMO element
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
// Import lens flare styles
import '../styles/lens-flare.css';
import '../styles/animated-dots.css';
import { getAllPosts } from '../services/supabaseBlogService';

const HeroPageUrl = 'https://res.cloudinary.com/dos0qac90/image/upload/v1761593258/hariel-xavier-photography/MoStuff/LandingPage/HeroPage.jpg';
const PortraitUrl = 'https://res.cloudinary.com/dos0qac90/image/upload/v1761593385/hariel-xavier-photography/MoStuff/portrait.jpg';

export function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const location = useLocation(); // Get location object
  const [latestBlogPosts, setLatestBlogPosts] = useState<any[]>([]);

  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [processRef, processInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const increment = end / (duration / 16); // 60fps

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [end, duration]);

    return count;
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;
      const docHeight = document.body.scrollHeight;
      const totalScrollable = docHeight - winHeight;
      const progress = Math.min(scrollY / totalScrollable, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location.hash === '#contact-form') {
      const element = document.getElementById('contact-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const posts = await getAllPosts();
        // Get the 3 most recent published posts
        const recentPosts = posts
          .sort((a, b) => {
            const aTime = a.published_at ? new Date(a.published_at).getTime() : 0;
            const bTime = b.published_at ? new Date(b.published_at).getTime() : 0;
            return bTime - aTime;
          })
          .slice(0, 3);
        setLatestBlogPosts(recentPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchLatestBlogs();
  }, []);

  return (
    <>
      <SEOHead 
        title="Hariel Xavier Photography | Wedding Photographer in Sparta, NJ"
        description="Professional wedding photography services in Sparta, NJ and surrounding areas. Capturing timeless moments with a modern approach for your dream wedding day."
        keywords={["wedding photographer Sparta NJ", "NJ wedding photography", "professional wedding photographer New Jersey", "luxury wedding photos NJ", "Hariel Xavier Photography", "wedding photography services"]}
        imageUrl="https://harielxavier.com/MoStuff/LandingPage/HeroPage.jpg"
        type="photography"
        location={{
          city: "Sparta",
          state: "NJ",
          country: "US"
        }}
        rating={{
          value: 5.0,
          count: 100
        }}
      />
      {/* JSON-LD Structured Data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Photographer',
        'name': 'Hariel Xavier Photography',
        'image': 'https://harielxavier.com/MoStuff/LandingPage/HeroPage.jpg',
        'description': 'Professional wedding photography services in Sparta, NJ and surrounding areas. Capturing timeless moments with a modern approach for your dream wedding day.',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '',
          'addressLocality': 'Sparta',
          'addressRegion': 'NJ',
          'postalCode': '',
          'addressCountry': 'US'
        },
        'telephone': '+1-862-391-4179',
        'url': 'https://harielxavier.com',
        'priceRange': '$$$',
        'sameAs': [
          'https://instagram.com/harielxavierphotography',
          'https://facebook.com/harielxavierphotography'
        ],
        'openingHoursSpecification': [{
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
          ],
          'opens': '09:00',
          'closes': '20:00'
        }],
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '5',
          'reviewCount': '100'
        }
      }) }} />
      
      {/* Review Schema for Testimonials */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Review',
        'itemReviewed': {
          '@type': 'LocalBusiness',
          'name': 'Hariel Xavier Photography',
          'image': 'https://harielxavier.com/MoStuff/LandingPage/HeroPage.jpg',
          'telephone': '+1-862-391-4179',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Sparta',
            'addressRegion': 'NJ',
            'addressCountry': 'US'
          }
        },
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': '5',
          'bestRating': '5'
        },
        'author': {
          '@type': 'Person',
          'name': 'Roberto Tatis'
        },
        'reviewBody': 'We couldn\'t have picked a better wedding photographer than Mauricio from Hariel Xavier Photography. From the moment he showed up, his fun personality and energy made our day even more special. He kept us relaxed and made everything so easy. The photos turned out amazing!'
      }) }} />
      
      {/* VideoObject Schema for Wedding Video */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        'name': 'Morgan & Michael\'s Wedding - Farmstead Golf & Country Club',
        'description': 'Cinematic wedding film capturing the love story of Morgan and Michael at Farmstead Golf & Country Club in Lafayette, NJ. Professional wedding videography by Hariel Xavier Photography.',
        'thumbnailUrl': 'https://harielxavier.com/MoStuff/images/morganvideocover.jpg',
        'uploadDate': '2024-06-15',
        'duration': 'PT5M30S',
        'contentUrl': 'https://storage.googleapis.com/harielxavier-videos/Morgan%20%26%20Michael%27s%20Wedding.mp4',
        'embedUrl': 'https://harielxavier.com',
        'publisher': {
          '@type': 'Organization',
          'name': 'Hariel Xavier Photography',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://harielxavier.com/black.png'
          }
        },
        'locationCreated': {
          '@type': 'Place',
          'name': 'Farmstead Golf & Country Club',
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': '88 Lawrence Rd',
            'addressLocality': 'Lafayette',
            'addressRegion': 'NJ',
            'addressCountry': 'US'
          }
        }
      }) }} />
      
      {/* BreadcrumbList Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [{
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://harielxavier.com'
        }]
      }) }} />

      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-[60]">
        <div 
          className="h-full bg-black transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Navigation />
      
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ height: '100vh', paddingTop: '170px' }}>
        {/* Video Background REMOVED - Using static image HeroPageUrl as primary background */}
        {/* 
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster={HeroPageUrl}
        >
          <source src="/images/bts.mov" type="video/mp4" />
        </video>
        */}
        
        {/* Static background image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HeroPageUrl})` }} // HeroPageUrl is 'https://res.cloudinary.com/dos0qac90/image/upload/v1761593258/hariel-xavier-photography/MoStuff/LandingPage/HeroPage.jpg'
        />
        
        <div className="absolute inset-0 bg-black bg-opacity-20" data-component-name="LandingPage" aria-hidden="true" />
        
        {/* Lens Flare Effect */}
        <div className="lens-flare-container">
          <div className="lens-flare"></div>
          <div className="lens-flare lens-flare-2"></div>
          <div className="lens-flare lens-flare-3"></div>
          <div className="lens-artifact lens-artifact-1"></div>
          <div className="lens-artifact lens-artifact-2"></div>
          <div className="lens-artifact lens-artifact-3"></div>
        </div>
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-[10%] w-32 h-32 rounded-full bg-[#ffd7ba] opacity-20 blur-xl" 
               style={{ animation: 'pulse-slow 6s infinite ease-in-out' }}></div>
          
          <div className="absolute top-[20%] right-[15%] w-40 h-40 rounded-full bg-[#ffb8a3] opacity-25 blur-xl"
               style={{ animation: 'float 12s infinite ease-in-out' }}></div>
          
          <div className="absolute top-[40%] left-[5%] w-24 h-24 rounded-full bg-[#e6c9c9] opacity-30 blur-xl"
               style={{ animation: 'float-delayed 14s infinite ease-in-out' }}></div>
          
          <div className="absolute top-[50%] right-[8%] w-36 h-36 rounded-full bg-[#d4b2b0] opacity-20 blur-xl"
               style={{ animation: 'pulse-slow-delayed 8s infinite ease-in-out' }}></div>
          
          <div className="absolute bottom-[20%] left-[45%] w-44 h-44 rounded-full bg-[#ffd7ba] opacity-15 blur-xl"
               style={{ animation: 'float-reverse 16s infinite ease-in-out' }}></div>
        </div>
        
        <div className={`relative text-center text-white px-4 transform transition-all duration-1000 ${
          heroInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <p className="text-sm font-display uppercase tracking-[0.4em] mb-8 text-white/90">Award-Winning Photography</p>
          <div className="mb-8">
            <div className="inline-block bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
              <div className="flex items-center gap-2 text-black">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="font-semibold">5.0</span>
                <span className="text-gray-700">• Trusted by 300+ Couples</span>
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-medium leading-[1.1] mb-6">
            <BlurText
              text="Luxury Wedding Photography"
              delay={500}
              animateBy="words"
              direction="top"
              className="font-display font-medium"
            />
            <br />
            <span className="font-serif text-white/95 font-normal text-4xl md:text-5xl lg:text-6xl">for New Jersey Couples</span>
          </h1>
          <p className="text-xl text-white/95 mb-4 max-w-2xl mx-auto font-light leading-relaxed">
            Artfully capturing authentic moments and timeless elegance for discerning couples across New Jersey's most prestigious venues.
          </p>
          <p className="text-lg text-white/85 mb-12 max-w-2xl mx-auto font-display font-light">
            <span className="font-medium">Sparta, NJ</span> • 14 Years Experience • 300+ Weddings • Featured in Top Publications
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/showcase"
              className="w-full sm:w-auto bg-white text-black px-8 py-4 hover:bg-black hover:text-white border-2 border-white transition-all duration-300 font-display font-medium tracking-wide"
            >
              View Portfolio
            </Link>
            <Link
              to="/pricing"
              className="w-full sm:w-auto border-2 border-white/80 text-white px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 font-display font-medium tracking-wide backdrop-blur-sm"
            >
              Investment & Packages
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white">
          <div className="animate-bounce">
            <div className="w-[1px] h-16 bg-white/70 mx-auto mb-4" />
            <p className="font-display uppercase tracking-[0.3em] text-xs text-white/80">Scroll Down</p>
          </div>
        </div>
      </section>

      <section 
        className="py-20 bg-black text-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center">
              <p className="text-6xl font-serif mb-4">{useCountUp(14)}</p>
              <p className="text-sm uppercase tracking-[0.2em]">Years Shooting</p>
            </div>
            <div className="text-center">
              <p className="text-6xl font-serif mb-4">{useCountUp(300)}+</p>
              <p className="text-sm uppercase tracking-[0.2em]">Weddings Captured</p>
            </div>
            <div className="text-center">
              <p className="text-6xl font-serif mb-4">{useCountUp(5)}.0</p>
              <p className="text-sm uppercase tracking-[0.2em]">Star Rating</p>
            </div>
          </div>
        </div>
      </section>

      <FeaturedGalleries />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src={PortraitUrl}
                alt="Mauricio Fernandez, award-winning wedding photographer in Sparta, NJ specializing in luxury wedding photography"
                className="w-full aspect-[3/4] object-cover"
                data-component-name="LandingPage"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="font-serif text-4xl mb-6" data-component-name="LandingPage">Hi, I'm <span className="text-rose-dark">Mauricio</span></h2>
              <p className="text-2xl font-serif mb-6 font-normal text-gray-700">Why I Still Cry at Weddings (And Why That's a Good Thing)</p>
              <p className="text-lg mb-6">I've shot 300+ weddings over the past 14 years. My dirty little secret? I still get emotional during the first dance. Every. Single. Time.</p>
              <p className="text-lg mb-6">There's something about watching two people who chose each other, surrounded by everyone they love, that gets me. I just do my job from behind the camera so you don't see the tears.</p>
              <p className="text-lg mb-6">I accidentally discovered my calling at a friend's wedding back in 2010. That one day changed everything. Since then, I've photographed hundreds of weddings across New Jersey, New York, and Pennsylvania. What I love most? The quiet moments between the big ones—the groom's nervous laugh, the bride's mom crying during the first look, the way couples look at each other when they think no one's watching.</p>
              <p className="text-lg mb-8"><span className="font-semibold">My Promise:</span> I'll capture the big moments everyone expects AND the small moments no one sees coming. Those moments? They're why I do this.</p>
              <Link 
                to="/about"
                className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition-all duration-300"
              >
                Read My Full Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f6f7]">
        {/* Portfolio showcase removed as requested */}
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-10">
            <span className="text-sm uppercase tracking-wider text-gray-500 mb-2">Exclusive Partnership</span>
            <h2 className="font-serif text-4xl md:text-5xl text-center mb-4">Preferred Venue Partner</h2>
            <div className="w-24 h-1 bg-black rounded-full mb-6"></div>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
              Officially recognized as the premier photography partner at this prestigious venue
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-500">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 bg-black text-white flex flex-col relative group">
                <div className="relative overflow-hidden h-full">
                  <img 
                    src="https://res.cloudinary.com/dos0qac90/image/upload/v1761593382/hariel-xavier-photography/MoStuff/club/pic8.jpg" 
                    alt="Elegant outdoor wedding ceremony at Picatinny Club, Sparta NJ - Preferred wedding photographer Hariel Xavier" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="inline-block bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                      <p className="text-white text-xs font-medium uppercase tracking-wider">Official Partner</p>
                    </div>
                    <h3 className="text-2xl font-serif mb-2 text-white">The Club at Picatinny</h3>
                    <p className="text-white/90 text-sm mb-4">A historic venue with breathtaking views</p>
                    <div className="flex items-center text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-2 text-white/70" />
                      <span className="text-white/90">Picatinny Arsenal, New Jersey</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-3/5 p-8 md:p-10">
                <div className="flex flex-col h-full justify-center">
                  <div className="mb-6">
                    <h4 className="font-medium text-xl mb-4 flex items-center">
                      <span className="inline-block w-8 h-8 bg-black text-white rounded-full flex items-center justify-center mr-3">
                        <Check className="w-4 h-4" />
                      </span>
                      Exclusive Venue Knowledge
                    </h4>
                    <p className="text-gray-600 ml-11">
                      As the preferred photographer at Picatinny Club, I bring unparalleled familiarity with the venue's hidden gems and perfect lighting spots for truly exceptional wedding photography.
                    </p>
                  </div>
                  
                  <ul className="space-y-5 mb-8">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-50 border border-green-200 mr-3 mt-0.5">
                        <Check className="w-4 h-4 text-green-600" />
                      </span>
                      <div>
                        <span className="font-medium">Venue Expertise</span>
                        <p className="text-gray-600 text-sm mt-1">Intimate knowledge of the venue's best photo locations and seasonal lighting conditions</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-50 border border-green-200 mr-3 mt-0.5">
                        <Check className="w-4 h-4 text-green-600" />
                      </span>
                      <div>
                        <span className="font-medium">Seamless Coordination</span>
                        <p className="text-gray-600 text-sm mt-1">Established relationships with venue staff for flawless wedding day execution</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-50 border border-green-200 mr-3 mt-0.5">
                        <Check className="w-4 h-4 text-green-600" />
                      </span>
                      <div>
                        <span className="font-medium">Exclusive Access</span>
                        <p className="text-gray-600 text-sm mt-1">Special permission to use restricted areas for stunning and unique photo opportunities</p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="mt-auto flex flex-col sm:flex-row gap-4">
                    <Link 
                      to="/picatinny-club" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-black text-white hover:bg-gray-800 transition-all duration-300 group"
                    >
                      Explore Venue Gallery
                      <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a 
                      href="#contact-form" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 group"
                    >
                      Check Availability
                      <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white" data-component-name="PortfolioPage">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h2 className="font-serif text-4xl text-center mb-4">Recent Wedding Film</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#e6c9c9] via-[#d4b2b0] to-[#e6c9c9] rounded-full mb-6"></div>
            <p className="text-center text-gray-300 max-w-3xl mx-auto">
              Experience the magic of our cinematic wedding videography that captures the essence of your special day
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="relative">
                <div className="relative aspect-video rounded-lg overflow-hidden group bg-black">
                  <video 
                    src="https://storage.googleapis.com/harielxavier-videos/Morgan%20%26%20Michael%27s%20Wedding.mp4"
                    poster="https://res.cloudinary.com/dos0qac90/image/upload/v1761593388/hariel-xavier-photography/MoStuff/images/morganvideocover.jpg"
                    className="w-full h-full object-cover"
                    controls
                    preload="auto"
                    playsInline
                    data-component-name="LandingPage"
                  ></video>
                  
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-black flex">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="flex-1 border border-gray-800"></div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-serif text-3xl mb-4">Morgan & Michael's Wedding</h3>
                <div className="flex items-center text-gray-300 mb-6">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Farmstead Golf & Country Club, 88 Lawrence Rd, Lafayette, NJ</span>
                </div>
                <p className="text-gray-200 mb-8">
                  A beautiful celebration of love and commitment. This cinematic wedding film captures the essence of Morgan and Michael's special day, 
                  from the emotional ceremony to the joyful reception. Every moment tells a story of love and the beginning of their journey together.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Cinematic</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Emotional</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Outdoor Ceremony</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Summer Wedding</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div>
              <h2 className="font-serif text-4xl mb-6">Wedding <span className="text-rose-dark">Photography</span></h2>
              <p className="text-lg mb-4">Capturing Your Love Story with Elegance</p>
              <p className="text-lg mb-8">
                Your wedding day is one of the most important moments of your life. My comprehensive wedding 
                photography services ensure that every precious moment is captured with artistry and authenticity.
                From the intimate first look to the joyful celebration, I'll be there to document your unique love story.
              </p>
              <div className="space-y-4 mb-8 text-left max-w-2xl mx-auto">
                <div className="flex items-start">
                  <Check className="text-black mr-3 mt-1 flex-shrink-0" size={18} />
                  <p>Interactive before/after editing showcase</p>
                </div>
                <div className="flex items-start">
                  <Check className="text-black mr-3 mt-1 flex-shrink-0" size={18} />
                  <p>Comprehensive client experience timeline</p>
                </div>
                <div className="flex items-start">
                  <Check className="text-black mr-3 mt-1 flex-shrink-0" size={18} />
                  <p>Instant wedding date availability checker</p>
                </div>
                <div className="flex items-start">
                  <Check className="text-black mr-3 mt-1 flex-shrink-0" size={18} />
                  <p>Wedding style quiz to discover your perfect photography style</p>
                </div>
              </div>
              {/* Removed link to /wedding as per user request */}
            </div>
          </div>
        </div>
      </section>

      {/* Original Testimonials Section - Keep as additional social proof */}
      <section 
        className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden"
        data-component-name="LandingPage"
      >
        {/* Decorative subtle orbs - matching pricing page */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-champagneRose rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-champagneRose rounded-full opacity-5 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <div className="inline-block mb-4">
              <span className="text-champagneRose uppercase tracking-[0.3em] text-sm font-semibold">Client Reviews</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white">
              Love Notes
            </h2>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto font-light">
              Words from the heart of couples who trusted us to capture their special day
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div 
              className="bg-white p-10 shadow-2xl rounded-2xl text-center relative overflow-hidden transition-all duration-500 border border-champagneRose/20"
              style={{
                opacity: currentTestimonial === 0 ? 1 : 0,
                position: 'relative',
                zIndex: currentTestimonial === 0 ? 1 : 0,
                transition: 'all 0.5s ease-in-out',
                transform: currentTestimonial === 0 ? 'translateY(0) scale(1.02)' : 'translateY(10px) scale(1)',
                boxShadow: currentTestimonial === 0 ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : ''
              }}
              data-component-name="LandingPage"
            >
              <div className="absolute top-6 left-6 text-8xl font-serif text-champagneRose opacity-20">"</div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-champagneRose/10 to-transparent rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-champagneRose/10 to-transparent rounded-bl-2xl"></div>
              
              <div className="flex justify-center mb-6 gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-6 h-6 text-champagneRose" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-xl italic mb-8 relative z-10 max-w-2xl mx-auto text-gray-700 leading-relaxed">
                "We couldn't have picked a better wedding photographer than Mauricio from Hariel Xavier Photography. From the moment he showed up, his fun personality and energy made our day even more special. He kept us relaxed and made everything so easy. The photos turned out amazing!"
              </blockquote>
              <div className="h-px bg-gradient-to-r from-transparent via-champagneRose/30 to-transparent mb-6"></div>
              <div className="pt-4 mt-auto">
                <p className="font-semibold text-xl text-gray-900">Roberto Tatis</p>
                <p className="text-gray-500 text-sm mt-1">Wedding Client • Sparta, NJ</p>
              </div>
            </div>
            
            <div 
              className="bg-white p-10 shadow-2xl rounded-2xl text-center absolute top-0 left-0 right-0 transition-all duration-500 border border-champagneRose/20"
              style={{
                opacity: currentTestimonial === 1 ? 1 : 0,
                zIndex: currentTestimonial === 1 ? 1 : 0,
                transition: 'all 0.5s ease-in-out',
                transform: currentTestimonial === 1 ? 'translateY(0) scale(1.02)' : 'translateY(10px) scale(1)',
                boxShadow: currentTestimonial === 1 ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : ''
              }}
            >
              <div className="absolute top-6 left-6 text-8xl font-serif text-champagneRose opacity-20">"</div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-champagneRose/10 to-transparent rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-champagneRose/10 to-transparent rounded-bl-2xl"></div>
              
              <div className="flex justify-center mb-6 gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-6 h-6 text-champagneRose" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-xl italic mb-8 relative z-10 max-w-2xl mx-auto text-gray-700 leading-relaxed">
                "Mauricio and the rest of the team at Hariel Xavier Photography are now like family to my wife and I! We carefully chose Mauricio and his team and from day one at our engagement photos we KNEW the right choice was made."
              </blockquote>
              <div className="h-px bg-gradient-to-r from-transparent via-champagneRose/30 to-transparent mb-6"></div>
              <div className="pt-4 mt-auto">
                <p className="font-semibold text-xl text-gray-900">Jose Rojas</p>
                <p className="text-gray-500 text-sm mt-1">Wedding Client • Morris County, NJ</p>
              </div>
            </div>
            
            <div 
              className="bg-white p-10 shadow-2xl rounded-2xl text-center absolute top-0 left-0 right-0 transition-all duration-500 border border-champagneRose/20"
              style={{
                opacity: currentTestimonial === 2 ? 1 : 0,
                zIndex: currentTestimonial === 2 ? 1 : 0,
                transition: 'all 0.5s ease-in-out',
                transform: currentTestimonial === 2 ? 'translateY(0) scale(1.02)' : 'translateY(10px) scale(1)',
                boxShadow: currentTestimonial === 2 ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : ''
              }}
            >
              <div className="absolute top-6 left-6 text-8xl font-serif text-champagneRose opacity-20">"</div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-champagneRose/10 to-transparent rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-champagneRose/10 to-transparent rounded-bl-2xl"></div>
              
              <div className="flex justify-center mb-6 gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-6 h-6 text-champagneRose" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-xl italic mb-8 relative z-10 max-w-2xl mx-auto text-gray-700 leading-relaxed">
                "Just writing this review brings tears to my eyes and joy to my heart. We're so glad we chose Hariel Xavier Photography for our engagement session and for our wedding day photos. From the moment we met with you it felt like we knew you our entire lives."
              </blockquote>
              <div className="h-px bg-gradient-to-r from-transparent via-champagneRose/30 to-transparent mb-6"></div>
              <div className="pt-4 mt-auto">
                <p className="font-semibold text-xl text-gray-900">Jazmine Ortiz</p>
                <p className="text-gray-500 text-sm mt-1">Wedding Client • Sussex County, NJ</p>
              </div>
            </div>
            
            <div 
              className="bg-white p-10 shadow-2xl rounded-2xl text-center absolute top-0 left-0 right-0 transition-all duration-500 border border-champagneRose/20"
              style={{
                opacity: currentTestimonial === 3 ? 1 : 0,
                zIndex: currentTestimonial === 3 ? 1 : 0,
                transition: 'all 0.5s ease-in-out',
                transform: currentTestimonial === 3 ? 'translateY(0) scale(1.02)' : 'translateY(10px) scale(1)',
                boxShadow: currentTestimonial === 3 ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : ''
              }}
            >
              <div className="absolute top-6 left-6 text-8xl font-serif text-champagneRose opacity-20">"</div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-champagneRose/10 to-transparent rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-champagneRose/10 to-transparent rounded-bl-2xl"></div>
              
              <div className="flex justify-center mb-6 gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-6 h-6 text-champagneRose" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-xl italic mb-8 relative z-10 max-w-2xl mx-auto text-gray-700 leading-relaxed">
                "Our wedding photos are absolutely stunning! Mauricio has such an eye for capturing those special moments. He made us feel comfortable in front of the camera and was so professional throughout the entire process. We'll cherish these photos forever."
              </blockquote>
              <div className="h-px bg-gradient-to-r from-transparent via-champagneRose/30 to-transparent mb-6"></div>
              <div className="pt-4 mt-auto">
                <p className="font-semibold text-xl text-gray-900">Marcia Martinez</p>
                <p className="text-gray-500 text-sm mt-1">Wedding Client • Bergen County, NJ</p>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
                    currentTestimonial === index ? 'bg-champagneRose scale-125' : 'bg-white/40'
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={processRef} className="py-20 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-black/5 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-black/5 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 transform transition-all duration-1000 ease-out"
               style={{ 
                 opacity: processInView ? 1 : 0, 
                 transform: processInView ? 'translateY(0)' : 'translateY(30px)'
               }}>
            <p className="text-sm uppercase tracking-[0.3em] mb-4 text-black/70 relative inline-block">
              <span className="absolute -left-8 top-1/2 w-6 h-[1px] bg-black/30"></span>
              The Journey
              <span className="absolute -right-8 top-1/2 w-6 h-[1px] bg-black/30"></span>
            </p>
            <h2 className="text-5xl mb-6 font-serif">
              Your love story deserves to be told 
              <span className="block mt-2 text-black/80">with artistry and grace</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 md:gap-12">
            {[
              {
                title: "The First Connection",
                description: "Share your dreams and vision over a heartfelt conversation, where your story begins to unfold.",
                icon: "✨"
              },
              {
                title: "Crafting Your Journey",
                description: "Together, we'll design an artful approach to capturing every precious moment of your celebration.",
                icon: "🎨"
              },
              {
                title: "Your Celebration",
                description: "Immerse yourself in the joy while we artfully document each meaningful moment of your love story.",
                icon: "📸"
              },
              {
                title: "Timeless Art",
                description: "Your legacy of love, transformed into an exquisite collection of artful memories to cherish forever.",
                icon: "♾️"
              }
            ].map((step, index) => (
              <div 
                key={index}
                className={`text-center relative group cursor-default`}
                style={{ 
                  opacity: processInView ? 1 : 0,
                  transform: processInView ? 'translateY(0)' : 'translateY(40px)',
                  transition: `all 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${index * 150}ms`
                }}
              >
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-[calc(100%_-_16px)] w-full h-[1px] bg-black/10 z-0">
                    <div 
                      className="h-full bg-black/30 origin-left" 
                      style={{ 
                        width: processInView ? '100%' : '0%',
                        transition: `width 1.5s ease-out ${(index * 150) + 500}ms`
                      }}
                    />
                  </div>
                )}
                
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div 
                    className="absolute inset-0 rounded-full bg-black/5 transform group-hover:scale-110 transition-all duration-500"
                    style={{ 
                      opacity: processInView ? 1 : 0,
                      transform: `scale(${processInView ? (1) : 0.6})`,
                      transition: `all 0.7s ease-out ${(index * 150) + 300}ms`
                    }}
                  />
                  <p className="text-6xl font-light text-black/20 relative z-10 group-hover:text-black/40 transition-colors duration-500">
                    0{index + 1}
                  </p>
                  <div className="absolute -top-2 -right-2 text-2xl opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-500">
                    {step.icon}
                  </div>
                </div>
                
                <h3 className="text-xl mb-3 font-medium group-hover:text-black transition-colors duration-300">{step.title}</h3>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 max-w-xs mx-auto">
                  {step.description}
                </p>
                
                <div 
                  className="w-10 h-0.5 bg-black/30 mx-auto mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <PhotographyStyleSlider />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4">Follow Our Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with our latest work and behind-the-scenes moments on Instagram
            </p>
          </div>
          <CuratorSocialFeed feedId="f9d2afdf-f60e-4050-97d7-5b52c7ffaeb3" className="w-full" />
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Latest from Our Blog</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover wedding photography tips, venue highlights, and behind-the-scenes stories from our recent work.
            </p>
          </div>

          {latestBlogPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {latestBlogPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative overflow-hidden">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholders/default.jpg';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Recently'}</span>
                      <Clock className="w-4 h-4 ml-4 mr-2" />
                      <span>{post.read_time || '5 min read'}</span>
                    </div>

                    <h3 className="text-xl font-serif mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-accent hover:text-rose-dark font-medium transition-colors"
                    >
                      Read More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center bg-gradient-to-r from-accent to-rose-dark text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:from-rose-dark hover:to-accent transform hover:-translate-y-1"
            >
              View All Blog Posts
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section id="contact-form" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-8">Contact Me</h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-12">
            Ready to capture your story? Fill out the form below to get in touch!
          </p>
          <div className="max-w-2xl mx-auto">
            <iframe height="699" style={{minWidth: '100%', maxWidth: '600px', border: 0, margin: '0 auto'}} id="sn-form-09sk9"
              src="https://app.studioninja.co/contactform/parser/0a800fc8-7fbb-1621-817f-cbe6e7e26016/0a800fc8-7fbb-1621-817f-d37610217750"
              allowFullScreen>
            </iframe>
            <script type="text/javascript" data-iframe-id="sn-form-09sk9"
              src="https://app.studioninja.co/client-assets/form-render/assets/scripts/iframeResizer.js"></script>
          </div>
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="py-16 bg-gray-50" id="faq">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">How far in advance should we book our wedding photographer?</h3>
              <p className="text-gray-700">It's best to book as soon as you have your date and venue set—typically 9-18 months in advance for popular dates.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Do you travel for weddings outside Sparta, NJ?</h3>
              <p className="text-gray-700">Absolutely! I serve all of New Jersey and am happy to discuss destination weddings or events in neighboring states.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How soon will we receive our photos?</h3>
              <p className="text-gray-700">You can expect your full wedding gallery within 6-8 weeks. Sneak peeks are delivered within a few days of your event.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Can we request specific shots or a shot list?</h3>
              <p className="text-gray-700">Yes! I encourage couples to share must-have shots or special moments they want captured. We'll discuss these during your consultation.</p>
            </div>
          </div>
        </div>
        {/* FAQPage Schema for SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'How far in advance should we book our wedding photographer?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': "It's best to book as soon as you have your date and venue set—typically 9-18 months in advance for popular dates."
              }
            },
            {
              '@type': 'Question',
              'name': 'Do you travel for weddings outside Sparta, NJ?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Absolutely! I serve all of New Jersey and am happy to discuss destination weddings or events in neighboring states.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How soon will we receive our photos?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'You can expect your full wedding gallery within 6-8 weeks. Sneak peeks are delivered within a few days of your event.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Can we request specific shots or a shot list?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': "Yes! I encourage couples to share must-have shots or special moments they want captured. We'll discuss these during your consultation."
              }
            }
          ]
        })}} />
        {/* Example Event Schema (uncomment and customize if you have a public event) */}
        {/*
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Event',
          'name': 'Wedding Photography at Sparta Grand',
          'startDate': '2025-09-15T16:00',
          'endDate': '2025-09-15T23:00',
          'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
          'eventStatus': 'https://schema.org/EventScheduled',
          'location': {
            '@type': 'Place',
            'name': 'Sparta Grand',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': '123 Main St',
              'addressLocality': 'Sparta',
              'addressRegion': 'NJ',
              'postalCode': '07871',
              'addressCountry': 'US'
            }
          },
          'image': [
            'https://harielxavier.com/MoStuff/LandingPage/HeroPage.jpg'
          ],
          'description': 'Join us for a special wedding photography event at Sparta Grand! Featuring live shoots, Q&A, and exclusive offers.',
          'organizer': {
            '@type': 'Organization',
            'name': 'Hariel Xavier Photography',
            'url': 'https://harielxavier.com'
          }
        })}} />
        */}
      </section>

      <Footer />

      {showConfetti && (
        <Confetti 
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={5000}
          gravity={0.2}
          colors={['#ff0000', '#00ff00', '#0000ff']} // Customize colors
        />
      )}
    </>
  );
}

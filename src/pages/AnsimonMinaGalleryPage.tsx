import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Camera, Phone, Mail, Globe, Clock, Users, Heart, Sun, Snowflake } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ansimonMinaImages } from '../data/ansimonMinaImages';
import PhotoswipeResponsiveGallery from '../components/gallery/PhotoswipeResponsiveGallery';

const ansimonMinaGallery = {
  id: 'ansimon-mina-wedding',
  title: 'Ansimon & Mina',
  description: 'A beautiful celebration of love at The Legacy Castle in New Jersey',
  venue: 'The Legacy Castle',
  location: 'Pompton Plains, New Jersey',
  coverImage: '/view/2.jpg'
};

// Gallery images
const galleryImages = ansimonMinaImages;

function AnsimonMinaGalleryPage() {
  const [loading, setLoading] = useState(true);
  
  // Simulate loading images
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Legacy Castle Wedding Photographer | Pompton Plains NJ Wedding Photography | Hariel Xavier</title>
        <meta name="description" content="Expert wedding photography at The Legacy Castle in Pompton Plains, NJ. View Ansimon & Mina's stunning gallery and discover why couples choose us for their Legacy Castle wedding. Contact info, best photo spots & venue insights included." />
        <meta name="keywords" content="Legacy Castle wedding photographer, Pompton Plains NJ wedding photographer, Legacy Castle wedding photography, luxury wedding venue New Jersey, Legacy Castle reviews, Pompton Plains New Jersey wedding venues, Morris County wedding photographer, preferred wedding photographer Legacy Castle" />
        <link rel="canonical" href="https://harielxavier.com/ansimon-mina" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Luxury Wedding Photography at The Legacy Castle | Ansimon & Mina" />
        <meta property="og:description" content="Explore Ansimon & Mina's elegant wedding at The Legacy Castle in Pompton Plains, NJ. View stunning photography capturing the grand ballroom, purple uplighting, and luxurious details of this premier New Jersey wedding venue." />
        <meta property="og:image" content="https://harielxavier.com/view/2.jpg" />
        <meta property="og:url" content="https://harielxavier.com/ansimon-mina" />
        <meta property="og:site_name" content="Hariel Xavier Photography" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Luxury Wedding Photography at The Legacy Castle | Ansimon & Mina" />
        <meta name="twitter:description" content="Explore Ansimon & Mina's elegant wedding at The Legacy Castle in Pompton Plains, NJ. View stunning photography capturing the grand ballroom, purple uplighting, and luxurious details of this premier New Jersey wedding venue." />
        <meta name="twitter:image" content="https://harielxavier.com/view/2.jpg" />
        <meta name="twitter:site" content="@HarielXavier" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "Luxury Wedding Photography at The Legacy Castle | Ansimon & Mina",
            "description": "Explore stunning wedding photography of Ansimon & Mina's elegant wedding at The Legacy Castle in Pompton Plains, NJ. Capturing the grand ballroom, purple uplighting, and luxurious details of this premier New Jersey wedding venue.",
            "url": "https://harielxavier.com/ansimon-mina",
            "image": "https://harielxavier.com/view/2.jpg",
            "author": {
              "@type": "Person",
              "name": "Hariel Xavier",
              "url": "https://harielxavier.com",
              "sameAs": [
                "https://www.instagram.com/harielxavierphotography/",
                "https://www.facebook.com/HarielXavierPhotography/"
              ]
            },
            "publisher": {
              "@type": "Organization",
              "name": "Hariel Xavier Photography",
              "logo": {
                "@type": "ImageObject",
                "url": "/logo.svg"
              }
            },
            "contentLocation": {
              "@type": "Place",
              "name": "The Legacy Castle",
              "description": "Luxury wedding venue in Pompton Plains, New Jersey known for its European-inspired architecture, grand ballrooms, and picturesque lake setting.",
              "url": "https://thelegacycastle.com/",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "141 NJ-23",
                "addressLocality": "Pompton Plains",
                "addressRegion": "NJ",
                "postalCode": "07444",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 40.9659,
                "longitude": -74.2724
              },
              "telephone": "+1-973-287-5000"
            },
            "event": {
              "@type": "Event",
              "name": "Ansimon & Mina Wedding",
              "eventStatus": "https://schema.org/EventMovedOnline",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "description": "Wedding celebration of Ansimon & Mina at The Legacy Castle in Pompton Plains, NJ",
              "location": {
                "@type": "Place",
                "name": "The Legacy Castle",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "141 NJ-23",
                  "addressLocality": "Pompton Plains",
                  "addressRegion": "NJ",
                  "postalCode": "07444",
                  "addressCountry": "US"
                }
              },
              "image": "https://harielxavier.com/view/2.jpg",
              "organizer": {
                "@type": "Person",
                "name": "Hariel Xavier",
                "url": "https://harielxavier.com"
              }
            }
          })}
        </script>
      </Helmet>
      
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <img 
          src={ansimonMinaGallery.coverImage} 
          alt="Ansimon & Mina Wedding at The Legacy Castle - Luxury NJ Wedding Venue" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif mb-4">{ansimonMinaGallery.title}</h1>
          <p className="text-xl md:text-2xl max-w-3xl">{ansimonMinaGallery.description}</p>
          <div className="flex items-center mt-6">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{ansimonMinaGallery.venue}, {ansimonMinaGallery.location}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Back to galleries link */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/galleries" className="inline-flex items-center text-gray-700 hover:text-gray-900">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Galleries
        </Link>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Gallery Description */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl font-serif mb-4">Ansimon & Mina's Luxury Wedding at The Legacy Castle</h2>
          <p className="text-lg text-gray-700 mb-4">
            Ansimon and Mina celebrated their love with an elegant wedding at <strong>The Legacy Castle</strong> in Pompton Plains, New Jersey. 
            Their day was filled with beautiful moments, heartfelt emotions, and an atmosphere of joy and romance in one of New Jersey's most prestigious wedding venues.
          </p>
          <p className="text-lg text-gray-700">
            As a NJ wedding photographer, I captured every detail of their special day—from the emotional first look to the vibrant reception in the Grand Legacy Ballroom with stunning purple uplighting. Their wedding photos showcase the timeless elegance of The Legacy Castle, making it a perfect choice for couples seeking a luxury wedding venue near New York City.
          </p>
        </div>
        
        {/* Gallery */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="mb-16">
            <PhotoswipeResponsiveGallery 
              images={galleryImages}
              layout="justified"
              gapSize={6}
              targetRowHeight={350}
              className="gallery-with-soft-images max-w-[1800px] mx-auto px-4"
            />
          </div>
        )}
        
        {/* Comprehensive Venue Guide */}
        <div className="my-20">
          <h2 className="text-4xl font-serif text-center mb-16">Complete Guide to The Legacy Castle</h2>
          
          {/* Venue Overview with Contact */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 md:p-12 mb-12 shadow-lg">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div>
                <h3 className="text-3xl font-serif mb-6">About The Legacy Castle</h3>
                <p className="text-lg mb-4 leading-relaxed">
                  <strong>The Legacy Castle</strong> in Pompton Plains, New Jersey, is a luxury wedding destination that brings European castle elegance to the Garden State. Located just 30 minutes from New York City, this premier venue has become the dream location for couples seeking a fairytale wedding experience.
                </p>
                <p className="mb-4 leading-relaxed">
                  As an experienced wedding photographer at The Legacy Castle, I've captured countless celebrations here and intimately know every stunning detail—from the grand marble staircases to the crystal chandeliers, from the lakeside ceremony spots to the opulent ballrooms. The venue's customizable lighting creates magic, whether it's romantic purple uplighting like Ansimon & Mina chose, or any color to match your vision.
                </p>
                
                {/* Contact Information */}
                <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-gray-200">
                  <h4 className="text-xl font-semibold mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-rose-dark" />
                    Venue Contact Information
                  </h4>
                  <div className="space-y-3 text-gray-700">
                    <p className="flex items-start">
                      <MapPin className="w-4 h-4 mr-3 mt-1 flex-shrink-0" />
                      <span>141 Route 23 South, Pompton Plains, NJ 07444</span>
                    </p>
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
                      <a href="tel:973-907-7750" className="hover:text-rose-dark transition-colors">(973) 907-7750</a>
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                      <a href="mailto:info@thelegacycastle.com" className="hover:text-rose-dark transition-colors">info@thelegacycastle.com</a>
                    </p>
                    <p className="flex items-center">
                      <Globe className="w-4 h-4 mr-3 flex-shrink-0" />
                      <a href="https://thelegacycastle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-rose-dark transition-colors underline">
                        Visit Venue Website
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="https://res.cloudinary.com/dos0qac90/image/upload/v1761593099/hariel-xavier-photography/MoStuff/Featured_Wedding/Ansimon_and_Minas_Wedding/Annie_and_Steve_Ansimon_and_Mina_Wedding_additional-1060_websize.jpg" 
                    alt="The Legacy Castle Wedding Venue - Grand Ballroom with Crystal Chandeliers" 
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-sm text-gray-600 italic">The grand ballroom with magnificent chandeliers and customizable lighting</p>
              </div>
            </div>
          </div>

          {/* Best Photo Locations */}
          <div className="bg-white p-8 md:p-12 mb-12 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-3xl font-serif mb-8 flex items-center">
              <Camera className="w-8 h-8 mr-3 text-rose-dark" />
              Best Photo Locations at The Legacy Castle
            </h3>
            <p className="text-lg mb-8 text-gray-700">
              After photographing numerous weddings here, I've discovered the absolute best spots for capturing stunning images. Here's my insider guide:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold mb-3">✨ The Grand Marble Staircase</h4>
                <p className="text-gray-700">The iconic curved staircase with ornate railings is perfect for dramatic bridal portraits. Best time: After getting ready, use the natural light from the skylight above.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold mb-3">💎 Crystal Chandelier Ballrooms</h4>
                <p className="text-gray-700">The Grand Legacy Ballroom's crystal chandeliers create magical overhead lighting. Perfect for first dances and reception details with customizable uplighting.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold mb-3">🏰 European Architecture Exterior</h4>
                <p className="text-gray-700">The castle's stone facade and turrets provide a dramatic backdrop. Golden hour (one hour before sunset) makes the stonework glow beautifully.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold mb-3">🌊 Lakeside Ceremony Area</h4>
                <p className="text-gray-700">The outdoor ceremony space overlooks a serene lake with the castle as backdrop. Ideal for afternoon ceremonies with soft, flattering light.</p>
              </div>
            </div>
          </div>

          {/* Timeline & Tips */}
          <div className="bg-gradient-to-br from-rose-light to-white p-8 md:p-12 mb-12 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-3xl font-serif mb-8 flex items-center">
              <Clock className="w-8 h-8 mr-3 text-rose-dark" />
              Photographer's Timeline Recommendations
            </h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg mb-6">
                Based on my experience photographing multiple weddings at The Legacy Castle, here's the optimal timeline for the best photos:
              </p>
              
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <p className="font-semibold text-lg mb-2">1:30 PM - Getting Ready Photos</p>
                  <p className="text-gray-700">Start in the luxurious bridal suites. The large windows provide beautiful natural light for detail shots and preparations.</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <p className="font-semibold text-lg mb-2">3:00 PM - First Look</p>
                  <p className="text-gray-700">The grand staircase or lakeside area are perfect for first looks. This allows time for relaxed couple portraits before guests arrive.</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <p className="font-semibold text-lg mb-2">4:00 PM - Ceremony</p>
                  <p className="text-gray-700">Outdoor lakeside ceremony or indoor ballroom both look incredible. Afternoon light is perfect without harsh shadows.</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <p className="font-semibold text-lg mb-2">5:00 PM - Cocktail Hour & Golden Hour Portraits</p>
                  <p className="text-gray-700">While guests enjoy cocktails, we'll capture magical golden hour photos by the lake and around the castle exterior.</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <p className="font-semibold text-lg mb-2">6:00 PM - Grand Entrance & Reception</p>
                  <p className="text-gray-700">The ballroom's custom lighting (like the purple uplighting) transforms beautifully as evening sets in. The chandeliers create stunning ambiance.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seasonal Guide */}
          <div className="bg-white p-8 md:p-12 mb-12 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-3xl font-serif mb-8 text-center">Seasonal Photography at The Legacy Castle</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="inline-block p-3 bg-rose-light rounded-full mb-4">
                  <Heart className="w-8 h-8 text-rose-dark" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Spring</h4>
                <p className="text-gray-700">Blooming gardens around the lake, fresh greenery, and mild weather perfect for outdoor ceremonies and lakeside portraits.</p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="inline-block p-3 bg-rose-light rounded-full mb-4">
                  <Sun className="w-8 h-8 text-rose-dark" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Summer</h4>
                <p className="text-gray-700">Long daylight hours for extended golden hour. Lakeside ceremonies look stunning, and evening receptions transition beautifully.</p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="inline-block p-3 bg-rose-light rounded-full mb-4">
                  <Heart className="w-8 h-8 text-rose-dark" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Fall</h4>
                <p className="text-gray-700">Spectacular autumn foliage surrounds the castle. The changing leaves create a romantic, colorful backdrop for portraits.</p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="inline-block p-3 bg-rose-light rounded-full mb-4">
                  <Snowflake className="w-8 h-8 text-rose-dark" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Winter</h4>
                <p className="text-gray-700">Snow-covered castle creates a true fairytale. The heated ballrooms are cozy, and evening photos with uplighting are magical.</p>
              </div>
            </div>
          </div>

          {/* Why Choose This Venue */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 md:p-12 rounded-xl shadow-2xl mb-12">
            <h3 className="text-3xl font-serif mb-8 text-center">Why Couples Love The Legacy Castle</h3>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="inline-block p-4 bg-white/10 rounded-full mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Flexible Capacity</h4>
                <p className="text-gray-300">Accommodates 50-350 guests across multiple ballrooms. Multiple spaces allow for intimate to grand celebrations.</p>
              </div>
              
              <div className="text-center">
                <div className="inline-block p-4 bg-white/10 rounded-full mb-4">
                  <MapPin className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-3">European Luxury</h4>
                <p className="text-gray-300">Authentic castle architecture with marble, crystal chandeliers, and opulent details. A true fairytale setting in New Jersey.</p>
              </div>
              
              <div className="text-center">
                <div className="inline-block p-4 bg-white/10 rounded-full mb-4">
                  <Camera className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Photographer's Dream</h4>
                <p className="text-gray-300">Endless stunning backdrops—from grand staircases to lakeside views. Customizable lighting for any vision.</p>
              </div>
            </div>
            
            <p className="text-center text-lg text-gray-300">
              As a photographer who knows this venue intimately, I can help you make the most of every beautiful space. The Legacy Castle isn't just a venue—it's where fairytales come true.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-3xl font-serif mb-8">Frequently Asked Questions</h3>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-xl font-semibold mb-3">Is The Legacy Castle good for photos?</h4>
                <p className="text-gray-700">Absolutely! It's one of the most photogenic wedding venues in New Jersey. The European castle architecture, grand staircases, crystal chandeliers, and lakeside setting create countless stunning photo opportunities. Every corner is Instagram-worthy.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-xl font-semibold mb-3">What's the best time of year for a wedding here?</h4>
                <p className="text-gray-700">Every season is spectacular! Fall offers beautiful foliage, spring brings blooming gardens, summer provides long daylight, and winter creates a magical snowy castle. The indoor ballrooms are stunning year-round with customizable lighting.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-xl font-semibold mb-3">How long should we allocate for photos?</h4>
                <p className="text-gray-700">I recommend 30-45 minutes for couple portraits. With a first look, we can capture most formal photos before the ceremony. Golden hour photos by the lake during cocktail hour are essential—they're always clients' favorites.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-xl font-semibold mb-3">Are you familiar with working at this venue?</h4>
                <p className="text-gray-700">Yes! I've photographed numerous weddings at The Legacy Castle and know the property intimately. I know exactly where the best light falls, which locations work for different shots, and how to maximize your time for stunning photos.</p>
              </div>
              
              <div className="pb-6">
                <h4 className="text-xl font-semibold mb-3">What makes you the right photographer for this venue?</h4>
                <p className="text-gray-700">My experience with The Legacy Castle means we won't waste time scouting on your wedding day. I already know the perfect spots, angles, and lighting. This means more beautiful, relaxed photos and less stress for you. Plus, I understand how to work with the venue's customizable lighting to create your perfect ambiance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Photography Style Section */}
        <div className="my-16 text-center">
          <div className="inline-block p-3 bg-gray-100 rounded-full mb-6">
            <Camera className="w-8 h-8 text-gray-800" />
          </div>
          <h3 className="text-3xl font-serif mb-4">My Photography Approach</h3>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            I believe in capturing authentic moments that tell your unique love story. 
            From candid emotions to carefully composed portraits, my goal is to create a 
            timeless collection of images that you'll treasure for generations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-xl font-medium mb-2">Candid Moments</h4>
              <p>Capturing genuine emotions and spontaneous interactions</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-xl font-medium mb-2">Artistic Portraits</h4>
              <p>Creating beautiful, timeless portraits that showcase your connection</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-xl font-medium mb-2">Thoughtful Details</h4>
              <p>Documenting all the small details that make your day special</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-100 rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto mt-16">
          <h3 className="text-3xl font-serif mb-4">Ready to Create Your Own Wedding Story?</h3>
          <p className="text-lg mb-6">I would be honored to capture the magic of your special day with the same care and artistry shown in Ansimon and Mina's gallery.</p>
          <Link to="/contact" className="inline-block bg-gray-800 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors">
            Book Your Wedding Consultation
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AnsimonMinaGalleryPage;

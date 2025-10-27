import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Camera, Phone, Mail, Globe, Clock, Users, Heart, Sun, Snowflake } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { jackieChrisImages } from '../data/jackieChrisImages';
import PhotoswipeResponsiveGallery from '../components/gallery/PhotoswipeResponsiveGallery';

// Gallery data for Jackie & Chris Wedding
const jackieChrisGallery = {
  id: 'jackie-chris-wedding',
  title: 'Jackie & Chris',
  description: 'A breathtaking celebration of love at The Inn at Millrace Pond in Hope, NJ',
  venue: 'The Inn at Millrace Pond',
  location: 'Hope, New Jersey',
  coverImage: 'https://res.cloudinary.com/dos0qac90/image/upload/v1761593156/hariel-xavier-photography/MoStuff/Featured_Wedding/Jackie_and_Chriss_Wedding_/jmt__44_of_61_.jpg'
};

// Gallery images
const galleryImages = jackieChrisImages.filter(img => 
  // Exclude the featured thumbnail from the main gallery
  img.id !== 'jackie-chris-featured'
);

function JackieChrisGalleryPage() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading images
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Inn at Millrace Pond Wedding Photographer | Hope NJ Wedding Photography | Hariel Xavier</title>
        <meta name="description" content="Expert wedding photography at The Inn at Millrace Pond in Hope, NJ. View Jackie & Chris's stunning gallery and discover why couples choose us for their Millrace Pond wedding. Contact info, best photo spots & venue insights included." />
        <meta name="keywords" content="Inn at Millrace Pond wedding photographer, Hope NJ wedding photographer, Millrace Pond wedding photography, rustic wedding venue New Jersey, historic wedding venue Hope NJ, Inn at Millrace Pond reviews, Hope New Jersey wedding venues, Warren County wedding photographer, preferred wedding photographer Millrace Pond" />
        <link rel="canonical" href="https://harielxavier.com/jackie-chris" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="The Inn at Millrace Pond Wedding Photography | Jackie & Chris" />
        <meta property="og:description" content="View this beautiful wedding at The Inn at Millrace Pond in Hope, NJ. Professional wedding photography showcasing the rustic charm and historic beauty of this scenic New Jersey venue." />
        <meta property="og:image" content="https://harielxavier.com/MoStuff/Featured Wedding/Jackie & Chriss Wedding /jmt (44 of 61).jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Inn at Millrace Pond Wedding Photography | Jackie & Chris" />
        <meta name="twitter:description" content="View this beautiful wedding at The Inn at Millrace Pond in Hope, NJ. Professional wedding photography showcasing the rustic charm and historic beauty of this scenic New Jersey venue." />
        <meta name="twitter:image" content="https://harielxavier.com/MoStuff/Featured Wedding/Jackie & Chriss Wedding /jmt (44 of 61).jpg" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "The Inn at Millrace Pond Wedding Photography | Jackie & Chris",
            "description": "Professional wedding photography at The Inn at Millrace Pond in Hope, New Jersey. Featuring the beautiful wedding of Jackie and Chris.",
            "image": "https://harielxavier.com/MoStuff/Featured Wedding/Jackie & Chriss Wedding /jmt (44 of 61).jpg",
            "author": {
              "@type": "Person",
              "name": "Hariel Xavier",
              "url": "https://harielxavier.com"
            },
            "contentLocation": {
              "@type": "Place",
              "name": "The Inn at Millrace Pond",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Hope",
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
      <div className="relative h-screen">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img 
            src="https://res.cloudinary.com/dos0qac90/image/upload/v1761593156/hariel-xavier-photography/MoStuff/Featured_Wedding/Jackie_and_Chriss_Wedding_/jmt__44_of_61_.jpg"
            alt="Jackie & Chris Wedding at The Inn at Millrace Pond" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif mb-4">{jackieChrisGallery.title}</h1>
          <p className="text-xl md:text-2xl max-w-3xl">{jackieChrisGallery.description}</p>
          <div className="flex items-center mt-6">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{jackieChrisGallery.venue}, {jackieChrisGallery.location}</span>
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
          <p className="text-lg text-gray-700">
            Jackie and Chris celebrated their love with an intimate wedding at the charming <strong>Inn at Millrace Pond</strong> in Hope, New Jersey. 
            Their day was filled with heartfelt moments, beautiful details, and an atmosphere of pure joy at this historic and picturesque venue.
          </p>
        </div>
        
        {/* Gallery */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="mb-16">
            <PhotoswipeResponsiveGallery 
              images={galleryImages} 
              featuredFirst={true}
              gapSize={6}
              layout="justified"
              targetRowHeight={350}
              className="gallery-with-soft-images max-w-[1800px] mx-auto px-4"
            />
          </div>
        )}
        
        {/* Comprehensive Venue Guide */}
        <div className="my-20">
          <h2 className="text-4xl font-serif text-center mb-16">Complete Guide to The Inn at Millrace Pond</h2>
          
          {/* Venue Overview with Contact */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 md:p-12 mb-12 shadow-lg">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div>
                <h3 className="text-3xl font-serif mb-6">About The Inn at Millrace Pond</h3>
                <p className="text-lg mb-4 leading-relaxed">
                  <strong>The Inn at Millrace Pond</strong> in Hope, New Jersey, is a premier wedding destination that seamlessly blends 18th-century colonial charm with modern elegance. This historic venue, nestled in Warren County's picturesque countryside, has been hosting unforgettable weddings for decades.
                </p>
                <p className="mb-4 leading-relaxed">
                  As an experienced wedding photographer at The Inn at Millrace Pond, I've captured countless celebrations here and know every corner, every perfect light angle, and every magical moment this venue has to offer. The combination of rustic stone buildings, tranquil pond views, and lush gardens creates an unparalleled backdrop for wedding photography.
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
                      <span>313 Hope Johnsonburg Road, Hope, NJ 07844</span>
                    </p>
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
                      <a href="tel:908-459-4884" className="hover:text-rose-dark transition-colors">(908) 459-4884</a>
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                      <a href="mailto:info@innatmillracepond.com" className="hover:text-rose-dark transition-colors">info@innatmillracepond.com</a>
                    </p>
                    <p className="flex items-center">
                      <Globe className="w-4 h-4 mr-3 flex-shrink-0" />
                      <a href="https://innatmillracepond.com/" target="_blank" rel="noopener noreferrer" className="hover:text-rose-dark transition-colors underline">
                        Visit Venue Website
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="https://res.cloudinary.com/dos0qac90/image/upload/v1761593160/hariel-xavier-photography/MoStuff/Featured_Wedding/Jackie_and_Chriss_Wedding_/jmt__51_of_61_.jpg" 
                    alt="The Inn at Millrace Pond Wedding Venue - Historic Stone Building" 
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-sm text-gray-600 italic">The historic stone buildings provide a stunning backdrop for portraits</p>
              </div>
            </div>
          </div>

          {/* Best Photo Locations */}
          <div className="bg-white p-8 md:p-12 mb-12 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-3xl font-serif mb-8 flex items-center">
              <Camera className="w-8 h-8 mr-3 text-rose-dark" />
              Best Photo Locations at The Inn at Millrace Pond
            </h3>
            <p className="text-lg mb-8 text-gray-700">
              After photographing numerous weddings here, I've discovered the absolute best spots for capturing stunning images at every time of day. Here's my insider guide:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold mb-3">🌟 The Colonial Stone Buildings</h4>
                <p className="text-gray-700">The restored 1700s stone structures provide incredible texture and character. Best time: Golden hour (one hour before sunset) when the warm light hits the stone perfectly.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold mb-3">💧 The Millrace Pond</h4>
                <p className="text-gray-700">The serene pond with its waterwheel creates magical reflections. Perfect for couple portraits during cocktail hour or sunset shots after the ceremony.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold mb-3">🌳 The Garden Ceremony Site</h4>
                <p className="text-gray-700">Surrounded by mature trees and lush landscaping, this outdoor ceremony space offers dappled light and natural beauty. Ideal for spring and fall weddings.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold mb-3">🏛️ The Historic Inn Interior</h4>
                <p className="text-gray-700">Original wood beams, stone fireplaces, and colonial architecture create stunning getting-ready photos. The soft window light is perfect for detail shots.</p>
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
                Based on my experience photographing multiple weddings at The Inn at Millrace Pond, here's the optimal timeline for the best photos:
              </p>
              
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <p className="font-semibold text-lg mb-2">2:00 PM - Getting Ready Photos</p>
                  <p className="text-gray-700">Start in the inn's historic rooms. The afternoon light through the original windows is perfect for detail shots and candid moments.</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <p className="font-semibold text-lg mb-2">3:30 PM - First Look (Optional)</p>
                  <p className="text-gray-700">Consider doing a first look by the pond or near the stone buildings. This allows for relaxed couple portraits before guests arrive.</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <p className="font-semibold text-lg mb-2">4:30 PM - Ceremony</p>
                  <p className="text-gray-700">This timing captures beautiful natural light without harsh shadows. The garden ceremony site looks incredible in late afternoon.</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <p className="font-semibold text-lg mb-2">5:30 PM - Cocktail Hour</p>
                  <p className="text-gray-700">While guests enjoy cocktails, we'll capture stunning couple portraits at golden hour - the absolute best light of the day.</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <p className="font-semibold text-lg mb-2">6:30 PM - Reception</p>
                  <p className="text-gray-700">The reception space transforms beautifully as evening sets in. String lights and candles create a romantic atmosphere.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seasonal Guide */}
          <div className="bg-white p-8 md:p-12 mb-12 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-3xl font-serif mb-8 text-center">Seasonal Photography at The Inn at Millrace Pond</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="inline-block p-3 bg-rose-light rounded-full mb-4">
                  <Heart className="w-8 h-8 text-rose-dark" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Spring</h4>
                <p className="text-gray-700">Blooming gardens, fresh greenery, and vibrant flowers. Cherry blossoms and tulips frame the historic buildings beautifully.</p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="inline-block p-3 bg-rose-light rounded-full mb-4">
                  <Sun className="w-8 h-8 text-rose-dark" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Summer</h4>
                <p className="text-gray-700">Lush landscapes, long daylight hours, and pond reflections. Perfect for outdoor ceremonies and golden hour portraits.</p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="inline-block p-3 bg-rose-light rounded-full mb-4">
                  <Heart className="w-8 h-8 text-rose-dark" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Fall</h4>
                <p className="text-gray-700">Spectacular foliage, warm autumn colors, and stunning sunset light. My personal favorite season for Millrace Pond weddings!</p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="inline-block p-3 bg-rose-light rounded-full mb-4">
                  <Snowflake className="w-8 h-8 text-rose-dark" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Winter</h4>
                <p className="text-gray-700">Cozy indoor spaces with fireplace glow. Snow-covered landscapes create a romantic, intimate atmosphere.</p>
              </div>
            </div>
          </div>

          {/* Why Choose This Venue */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 md:p-12 rounded-xl shadow-2xl mb-12">
            <h3 className="text-3xl font-serif mb-8 text-center">Why Couples Love The Inn at Millrace Pond</h3>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="inline-block p-4 bg-white/10 rounded-full mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Intimate Capacity</h4>
                <p className="text-gray-300">Perfect for 50-150 guests, creating a warm, personal atmosphere where you can actually spend time with everyone.</p>
              </div>
              
              <div className="text-center">
                <div className="inline-block p-4 bg-white/10 rounded-full mb-4">
                  <MapPin className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Historic Charm</h4>
                <p className="text-gray-300">Authentic 1700s colonial buildings with original stonework, creating a timeless setting that never goes out of style.</p>
              </div>
              
              <div className="text-center">
                <div className="inline-block p-4 bg-white/10 rounded-full mb-4">
                  <Camera className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Photo Paradise</h4>
                <p className="text-gray-300">Multiple ceremony and portrait locations on one property - no need to travel between sites for your photos.</p>
              </div>
            </div>
            
            <p className="text-center text-lg text-gray-300">
              As a photographer who knows this venue intimately, I can help you make the most of every beautiful space and perfect moment. 
              The Inn at Millrace Pond isn't just a venue - it's a photographer's dream come true.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-3xl font-serif mb-8">Frequently Asked Questions</h3>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-xl font-semibold mb-3">Is The Inn at Millrace Pond good for photos?</h4>
                <p className="text-gray-700">Absolutely! It's one of the best wedding venues in New Jersey for photography. The combination of historic architecture, natural landscapes, and the beautiful pond creates endless photo opportunities. Every season offers something unique.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-xl font-semibold mb-3">What's the best time of year for a wedding here?</h4>
                <p className="text-gray-700">While every season is beautiful, fall (September-October) is particularly spectacular with the changing foliage. Spring (April-May) offers blooming gardens. I've captured stunning weddings here in every season!</p>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-xl font-semibold mb-3">How long should we allocate for photos?</h4>
                <p className="text-gray-700">I recommend at least 30-45 minutes for couple portraits. If you're doing a first look, we can capture most formal photos before the ceremony. Golden hour portraits (during cocktail hour) are a must - they're always clients' favorite images.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-xl font-semibold mb-3">Are you familiar with working at this venue?</h4>
                <p className="text-gray-700">Yes! I've photographed multiple weddings at The Inn at Millrace Pond and know the property intimately. I know exactly where the best light falls at every hour, which spots work best for different types of shots, and how to maximize your time for stunning photos.</p>
              </div>
              
              <div className="pb-6">
                <h4 className="text-xl font-semibold mb-3">What makes you the right photographer for this venue?</h4>
                <p className="text-gray-700">My experience with The Inn at Millrace Pond means we won't waste precious time scouting locations on your wedding day. I already know the perfect spots, the best angles, and how to work with the venue's unique lighting. This means more beautiful, relaxed photos and less stress for you.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-8 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg border border-gray-100">
              <div className="inline-block p-3 bg-gray-200 rounded-full mb-4">
                <Camera className="w-6 h-6 text-gray-700" />
              </div>
              <h4 className="text-xl font-medium mb-3">Candid Moments</h4>
              <p className="text-gray-600">Capturing genuine emotions and spontaneous interactions that tell your unique story</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg border border-gray-100">
              <div className="inline-block p-3 bg-gray-200 rounded-full mb-4">
                <Camera className="w-6 h-6 text-gray-700" />
              </div>
              <h4 className="text-xl font-medium mb-3">Artistic Portraits</h4>
              <p className="text-gray-600">Creating beautiful, timeless portraits that showcase your connection and personalities</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg border border-gray-100">
              <div className="inline-block p-3 bg-gray-200 rounded-full mb-4">
                <Camera className="w-6 h-6 text-gray-700" />
              </div>
              <h4 className="text-xl font-medium mb-3">Thoughtful Details</h4>
              <p className="text-gray-600">Documenting all the small details and meaningful moments that make your day special</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-100 rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto mt-16">
          <h3 className="text-3xl font-serif mb-4">Ready to Create Your Own Wedding Story?</h3>
          <p className="text-lg mb-6">I would be honored to capture the magic of your special day with the same care and artistry shown in Jackie and Chris's gallery.</p>
          <Link to="/#contact-form" className="inline-block bg-gray-800 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors">
            Book Your Wedding Consultation
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default JackieChrisGalleryPage;

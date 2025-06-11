import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Camera } from 'lucide-react';
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
  coverImage: '/MoStuff/Featured Wedding/Jackie & Chriss Wedding /jmt (44 of 61).jpg'
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
        <title>The Inn at Millrace Pond Wedding Photography | Jackie & Chris | Hariel Xavier Photography</title>
        <meta name="description" content="View this beautiful wedding at The Inn at Millrace Pond in Hope, NJ. Professional wedding photography showcasing the rustic charm and historic beauty of this scenic New Jersey venue." />
        <meta name="keywords" content="The Inn at Millrace Pond, Hope NJ wedding venue, rustic wedding venue New Jersey, historic wedding venue, Hariel Xavier Photography, Jackie and Chris wedding" />
        <link rel="canonical" href="https://harielxavierphotography.com/jackie-chris" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="The Inn at Millrace Pond Wedding Photography | Jackie & Chris" />
        <meta property="og:description" content="View this beautiful wedding at The Inn at Millrace Pond in Hope, NJ. Professional wedding photography showcasing the rustic charm and historic beauty of this scenic New Jersey venue." />
        <meta property="og:image" content="https://harielxavierphotography.com/MoStuff/Featured Wedding/Jackie & Chriss Wedding /jmt (44 of 61).jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Inn at Millrace Pond Wedding Photography | Jackie & Chris" />
        <meta name="twitter:description" content="View this beautiful wedding at The Inn at Millrace Pond in Hope, NJ. Professional wedding photography showcasing the rustic charm and historic beauty of this scenic New Jersey venue." />
        <meta name="twitter:image" content="https://harielxavierphotography.com/MoStuff/Featured Wedding/Jackie & Chriss Wedding /jmt (44 of 61).jpg" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "The Inn at Millrace Pond Wedding Photography | Jackie & Chris",
            "description": "Professional wedding photography at The Inn at Millrace Pond in Hope, New Jersey. Featuring the beautiful wedding of Jackie and Chris.",
            "image": "https://harielxavierphotography.com/MoStuff/Featured Wedding/Jackie & Chriss Wedding /jmt (44 of 61).jpg",
            "author": {
              "@type": "Person",
              "name": "Hariel Xavier",
              "url": "https://harielxavierphotography.com"
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
            src="/MoStuff/Featured Wedding/Jackie & Chriss Wedding /jmt (44 of 61).jpg"
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
        
        {/* Venue Highlight */}
        <div className="bg-gray-50 rounded-xl p-8 md:p-12 my-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-serif mb-4">The Inn at Millrace Pond</h3>
              <p className="mb-4"><strong>The Inn at Millrace Pond</strong> in Hope, NJ provided the perfect backdrop for Jackie and Chris's special day. This historic venue, dating back to the 1700s, offers rustic charm and natural beauty that created a magical atmosphere for their celebration.</p>
              <p>From the restored stone buildings to the beautiful outdoor spaces overlooking the pond, every corner of this venue offered stunning photo opportunities to capture their love story. The Inn at Millrace Pond is known for its historic character, beautiful gardens, and intimate setting that creates timeless wedding photographs.</p>
              <p className="mt-4">
                <a href="https://innatmillracepond.com/" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline font-medium">
                  Visit The Inn at Millrace Pond Website →
                </a>
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/MoStuff/Featured Wedding/Jackie & Chriss Wedding /jmt (51 of 61).jpg" 
                alt="The Inn at Millrace Pond in Hope, NJ - Historic Wedding Venue" 
                className="w-full h-auto"
              />
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

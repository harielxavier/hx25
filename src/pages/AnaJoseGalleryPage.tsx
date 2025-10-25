import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Camera } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { anaJoseImages } from '../data/anaJoseImages';
import PhotoswipeResponsiveGallery from '../components/gallery/PhotoswipeResponsiveGallery';

const anaJoseGallery = {
  id: 'ana-jose-wedding',
  title: 'Anna & Jose',
  description: 'A beautiful celebration of love at The Meadow Wood in Randolph, NJ',
  venue: 'The Meadow Wood',
  location: 'Randolph, New Jersey',
  coverImage: '/MoStuff/Featured Wedding/Anna & Jose\'s Wedding/aj-189.jpg'
};

// Gallery images
const galleryImages = anaJoseImages.filter(img => 
  // Exclude the featured thumbnail from the main gallery
  img.id !== 'ana-jose-featured'
);

function AnaJoseGalleryPage() {
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
        <title>The Meadow Wood Wedding Photography | Anna & Jose | Hariel Xavier Photography</title>
        <meta name="description" content="View this breathtaking wedding at The Meadow Wood in Randolph, NJ. Professional wedding photography showcasing the elegant venue and beautiful grounds of this premier New Jersey wedding destination." />
        <meta name="keywords" content="The Meadow Wood, Randolph NJ wedding venue, luxury wedding venue New Jersey, elegant wedding venue, Hariel Xavier Photography, Anna and Jose wedding" />
        <link rel="canonical" href="https://harielxavier.com/ana-jose" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="The Meadow Wood Wedding Photography | Anna & Jose" />
        <meta property="og:description" content="View this breathtaking wedding at The Meadow Wood in Randolph, NJ. Professional wedding photography showcasing the elegant venue and beautiful grounds of this premier New Jersey wedding destination." />
        <meta property="og:image" content="https://harielxavier.com/MoStuff/Featured Wedding/Anna & Jose's Wedding/aj-189.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Meadow Wood Wedding Photography | Anna & Jose" />
        <meta name="twitter:description" content="View this breathtaking wedding at The Meadow Wood in Randolph, NJ. Professional wedding photography showcasing the elegant venue and beautiful grounds of this premier New Jersey wedding destination." />
        <meta name="twitter:image" content="https://harielxavier.com/MoStuff/Featured Wedding/Anna & Jose's Wedding/aj-189.jpg" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "The Meadow Wood Wedding Photography | Anna & Jose",
            "description": "Professional wedding photography at The Meadow Wood in Randolph, New Jersey. Featuring the beautiful wedding of Anna and Jose.",
            "image": "https://harielxavier.com/MoStuff/Featured Wedding/Anna & Jose's Wedding/aj-189.jpg",
            "author": {
              "@type": "Person",
              "name": "Hariel Xavier",
              "url": "https://harielxavier.com"
            },
            "contentLocation": {
              "@type": "Place",
              "name": "The Meadow Wood",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "10 Meadow Wood",
                "addressLocality": "Randolph",
                "addressRegion": "NJ",
                "postalCode": "07869",
                "addressCountry": "US"
              }
            }
          })}
        </script>
      </Helmet>
      
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 z-10"></div>
        <img 
          src={anaJoseGallery.coverImage}
          alt={`${anaJoseGallery.title} Wedding at ${anaJoseGallery.venue}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
          <h1 className="text-4xl md:text-6xl font-serif mb-4 text-center">
            Anna & Jose's Wedding
          </h1>
          <div className="flex items-center text-lg md:text-xl mb-2">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{anaJoseGallery.venue}, {anaJoseGallery.location}</span>
          </div>
        </div>
      </div>
      
      {/* Back to Galleries Link */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/wedding" className="inline-flex items-center text-gray-600 hover:text-black transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back to Wedding Galleries</span>
        </Link>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Gallery */}
            <div className="mb-16">
              <PhotoswipeResponsiveGallery 
                images={galleryImages}
                // Using data attributes for title instead of direct prop
                data-gallery-title={`${anaJoseGallery.title} Wedding at ${anaJoseGallery.venue}`}
              />
            </div>
            
            {/* Venue Description */}
            <div className="my-16">
              <h2 className="text-3xl font-serif mb-6 text-center">The Meadow Wood</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <p className="text-lg mb-4">
                    The Meadow Wood in Randolph, New Jersey is one of the region's premier wedding venues, offering a perfect blend of elegance, sophistication, and natural beauty. Set on meticulously landscaped grounds, this luxurious venue provides a stunning backdrop for weddings throughout the year.
                  </p>
                  <p className="text-lg mb-4">
                    What makes The Meadow Wood truly special is its versatile spaces that can accommodate both intimate gatherings and grand celebrations. The venue features a magnificent ballroom with crystal chandeliers, elegant drapery, and a spacious dance floor—perfect for Anna & Jose's reception that balanced classic elegance with modern touches.
                  </p>
                  <p className="text-lg mb-4">
                    The venue's outdoor ceremony space, where Anna & Jose exchanged their vows, offers a picturesque setting with lush gardens and manicured lawns. The cocktail hour space transitions beautifully between the ceremony and reception, allowing guests to enjoy the beautiful surroundings while celebrating the newly married couple.
                  </p>
                  <p className="text-lg">
                    The Meadow Wood's dedicated staff provides exceptional service, ensuring that every detail is perfectly executed. From the custom menu to the impeccable timing of events, Anna & Jose's wedding day unfolded seamlessly at this remarkable venue.
                  </p>
                  <p className="mt-4">
                    <a href="https://themeadowwood.com/" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline font-medium">
                      Visit The Meadow Wood Website →
                    </a>
                  </p>
                </div>
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="/MoStuff/Featured Wedding/Anna & Jose's Wedding/aj-238.jpg" 
                    alt="The Meadow Wood in Randolph, NJ - Elegant Wedding Venue" 
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
              <p className="text-lg mb-6">I would be honored to capture the magic of your special day with the same care and artistry shown in Anna and Jose's gallery.</p>
              <Link to="/#contact-form" className="inline-block bg-gray-800 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors">
                Book Your Wedding Consultation
              </Link>
            </div>
          </>
        )}
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AnaJoseGalleryPage;

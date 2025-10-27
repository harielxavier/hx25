import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Camera } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { biancaJeffreyImages } from '../data/biancaJeffreyImages';
import PhotoswipeResponsiveGallery from '../components/gallery/PhotoswipeResponsiveGallery';

// Gallery data for Bianca & Jeffrey Wedding
const biancaJeffreyGallery = {
  id: 'bianca-jeffrey-wedding',
  title: 'Bianca & Jeffrey',
  description: 'A beautiful celebration of love at Park Chateau Estate in New Jersey',
  venue: 'Park Chateau Estate',
  location: 'East Brunswick, New Jersey',
  coverImage: '/MoStuff/Featured Wedding/Bianca & Jeffrey\'s Wedding/The Ceremony/Bianca & Jeff_s Wedding-826.jpg'
};

// Gallery images
const galleryImages = biancaJeffreyImages.filter(img => 
  // Exclude the featured thumbnail from the main gallery
  img.id !== 'bianca-jeffrey-featured'
);

function BiancaJeffreyGalleryPage() {
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
        <title>Park Chateau Estate Wedding Photography | Bianca & Jeffrey | Hariel Xavier Photography</title>
        <meta name="description" content="View this elegant wedding at Park Chateau Estate in East Brunswick, NJ. Professional wedding photography showcasing the luxury and grandeur of this premier New Jersey venue." />
        <meta name="keywords" content="Park Chateau Estate, East Brunswick wedding venue, NJ luxury wedding venue, French-inspired wedding venue, Hariel Xavier Photography, Bianca and Jeffrey wedding" />
        <link rel="canonical" href="https://harielxavier.com/bianca-jeffrey" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Park Chateau Estate Wedding Photography | Bianca & Jeffrey" />
        <meta property="og:description" content="View this elegant wedding at Park Chateau Estate in East Brunswick, NJ. Professional wedding photography showcasing the luxury and grandeur of this premier New Jersey venue." />
        <meta property="og:image" content="https://harielxavier.com/MoStuff/Featured Wedding/Bianca & Jeffrey's Wedding/The Ceremony/Bianca & Jeff_s Wedding-826.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Park Chateau Estate Wedding Photography | Bianca & Jeffrey" />
        <meta name="twitter:description" content="View this elegant wedding at Park Chateau Estate in East Brunswick, NJ. Professional wedding photography showcasing the luxury and grandeur of this premier New Jersey venue." />
        <meta name="twitter:image" content="https://harielxavier.com/MoStuff/Featured Wedding/Bianca & Jeffrey's Wedding/The Ceremony/Bianca & Jeff_s Wedding-826.jpg" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "Park Chateau Estate Wedding Photography | Bianca & Jeffrey",
            "description": "Professional wedding photography at Park Chateau Estate in East Brunswick, New Jersey. Featuring the elegant wedding of Bianca and Jeffrey.",
            "image": "https://harielxavier.com/MoStuff/Featured Wedding/Bianca & Jeffrey's Wedding/The Ceremony/Bianca & Jeff_s Wedding-826.jpg",
            "author": {
              "@type": "Person",
              "name": "Hariel Xavier",
              "url": "https://harielxavier.com"
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
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Back to Galleries</span>
          </Link>
        </div>
        
        {/* Gallery Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{biancaJeffreyGallery.title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{biancaJeffreyGallery.description}</p>
          <div className="flex items-center justify-center mt-4 text-gray-500">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{biancaJeffreyGallery.venue}, {biancaJeffreyGallery.location}</span>
          </div>
        </div>
        
        {/* Gallery */}
        <div className="mb-16">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <PhotoswipeResponsiveGallery 
              images={galleryImages}
              layout="justified"
              gapSize={6}
              targetRowHeight={350}
            />
          )}
        </div>
        
        {/* Venue Information */}
        <div className="my-16">
          <h2 className="text-3xl font-serif text-center mb-8">About the Venue</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-medium mb-4">Park Chateau Estate</h3>
              <p className="text-gray-600 mb-4">
                Park Chateau Estate is a luxury wedding venue in East Brunswick, New Jersey, offering a blend of French-inspired architecture and elegant gardens. This magnificent estate provides a romantic and sophisticated backdrop for weddings, with its grand ballroom, manicured grounds, and exquisite details.
              </p>
              <p className="text-gray-600 mb-4">
                The venue features stunning indoor and outdoor spaces, including a beautiful chapel, expansive gardens, and a luxurious bridal suite. The estate's timeless design and attention to detail create a truly magical setting for couples to celebrate their special day.
              </p>
              <p className="mt-4">
                <a href="https://parkchateau.com/" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline font-medium">
                  Visit Park Chateau Estate Website →
                </a>
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://res.cloudinary.com/dos0qac90/image/upload/v1761593133/hariel-xavier-photography/MoStuff/Featured_Wedding/Bianca_and_Jeffreys_Wedding/The_Ceremony/Bianca_and_Jeff_s_Wedding-826.jpg" 
                alt="Park Chateau Estate in East Brunswick, NJ - Luxury Wedding Venue" 
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

        {/* Testimonial */}
        <div className="bg-gray-100 rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto my-16">
          <div className="inline-block p-3 bg-white rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl italic mb-6">"Hariel captured our wedding day perfectly. Every time we look at our photos, we're transported back to those magical moments. The attention to detail and ability to capture genuine emotion is truly remarkable."</p>
            <div className="font-medium">
              <p className="text-gray-900">Bianca & Jeffrey</p>
              <p className="text-gray-500">East Brunswick, New Jersey</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-100 rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto mt-16">
          <h3 className="text-3xl font-serif mb-4">Ready to Create Your Own Wedding Story?</h3>
          <p className="text-lg mb-6">I would be honored to capture the magic of your special day with the same care and artistry shown in Bianca and Jeffrey's gallery.</p>
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

export default BiancaJeffreyGalleryPage;

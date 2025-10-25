import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Camera } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { amandaAlexImages } from '../data/amandaAlexImages';
import PhotoswipeResponsiveGallery from '../components/gallery/PhotoswipeResponsiveGallery';

const amandaAlexGallery = {
  id: 'amanda-alex-wedding',
  title: 'Amanda & Alex',
  description: 'A stunning wedding celebration at The Mansion on Main Street in Voorhees Township, NJ',
  venue: 'The Mansion on Main Street',
  location: 'Voorhees Township, New Jersey',
  coverImage: '/MoStuff/amanda/thumb.jpg'
};

// Gallery images
const galleryImages = amandaAlexImages.filter(img => 
  // Exclude the featured thumbnail from the main gallery
  img.id !== 'amanda-alex-featured'
);

function AmandaAlexGalleryPage() {
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
        <title>The Mansion on Main Street Wedding Photography | Amanda & Alex | Hariel Xavier Photography</title>
        <meta name="description" content="Explore the breathtaking wedding of Amanda & Alex at The Mansion on Main Street in Voorhees Township, NJ. Professional wedding photography capturing the elegance of this premier New Jersey wedding venue by Hariel Xavier Photography." />
        <meta name="keywords" content="The Mansion on Main Street, Voorhees Township NJ wedding venue, luxury wedding venue New Jersey, elegant wedding venue, Hariel Xavier Photography, Amanda and Alex wedding" />
        <link rel="canonical" href="https://harielxavier.com/amanda-alex" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="The Mansion on Main Street Wedding Photography | Amanda & Alex" />
        <meta property="og:description" content="Explore the breathtaking wedding of Amanda & Alex at The Mansion on Main Street in Voorhees Township, NJ. Professional wedding photography capturing the elegance of this premier New Jersey wedding venue by Hariel Xavier Photography." />
        <meta property="og:image" content="https://harielxavier.com/mostuff/amanda/Amanda & Alexander's Wedding-07196_websize.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Mansion on Main Street Wedding Photography | Amanda & Alex" />
        <meta name="twitter:description" content="Explore the breathtaking wedding of Amanda & Alex at The Mansion on Main Street in Voorhees Township, NJ. Professional wedding photography capturing the elegance of this premier New Jersey wedding venue by Hariel Xavier Photography." />
        <meta name="twitter:image" content="https://harielxavier.com/mostuff/amanda/Amanda & Alexander's Wedding-07196_websize.jpg" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "The Mansion on Main Street Wedding Photography | Amanda & Alex",
            "description": "Professional wedding photography at The Mansion on Main Street in Voorhees Township, New Jersey. Featuring the beautiful wedding of Amanda and Alex.",
            "image": "https://harielxavier.com/mostuff/amanda/Amanda & Alexander's Wedding-07196_websize.jpg",
            "author": {
              "@type": "Person",
              "name": "Hariel Xavier",
              "url": "https://harielxavier.com"
            },
            "contentLocation": {
              "@type": "Place",
              "name": "The Mansion on Main Street",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "3000 Main St",
                "addressLocality": "Voorhees Township",
                "addressRegion": "NJ",
                "postalCode": "08043",
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
          src={amandaAlexGallery.coverImage}
          alt={`${amandaAlexGallery.title} Wedding at ${amandaAlexGallery.venue}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
          <h1 className="text-4xl md:text-6xl font-serif mb-4 text-center">
            Amanda & Alex's Wedding
          </h1>
          <div className="flex items-center text-lg md:text-xl mb-2">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{amandaAlexGallery.venue}, {amandaAlexGallery.location}</span>
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
                data-gallery-title={`${amandaAlexGallery.title} Wedding at ${amandaAlexGallery.venue}`}
              />
            </div>
            
            {/* Venue Description */}
            <div className="my-16">
              <h2 className="text-3xl font-serif mb-6 text-center">The Mansion on Main Street</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <p className="text-lg mb-4">
                    The Mansion on Main Street in Voorhees Township, New Jersey, is a premier wedding venue that combines timeless elegance with modern sophistication. Nestled in the heart of South Jersey, this exquisite venue offers a picturesque setting for unforgettable wedding celebrations.
                  </p>
                  <p className="text-lg mb-4">
                    What sets The Mansion on Main Street apart is its stunning architecture and versatile event spaces. The grand ballroom, adorned with crystal chandeliers and elegant decor, provided the perfect backdrop for Amanda & Alex's reception, blending classic charm with contemporary style.
                  </p>
                  <p className="text-lg mb-4">
                    The venue's beautifully landscaped grounds and outdoor ceremony space, where Amanda & Alex exchanged their vows, create a romantic atmosphere surrounded by natural beauty. The seamless transition to the cocktail hour and reception spaces allowed guests to fully enjoy the celebration in this magnificent setting.
                  </p>
                  <p className="text-lg">
                    With exceptional service and attention to detail, The Mansion on Main Street ensures that every aspect of the wedding day is flawlessly executed. From personalized menus to impeccable timing, Amanda & Alex's wedding was a testament to the venue's commitment to creating magical experiences.
                  </p>
                  <p className="mt-4">
                    <a href="https://www.mansiononmainstreet.com/" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline font-medium">
                      Visit The Mansion on Main Street Website →
                    </a>
                  </p>
                </div>
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="/MoStuff/amanda/venue.jpg" 
                    alt="The Mansion on Main Street in Voorhees Township, NJ - Elegant Wedding Venue" 
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
              <p className="text-lg mb-6">I would be honored to capture the magic of your special day with the same care and artistry shown in Amanda and Alex's gallery.</p>
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

export default AmandaAlexGalleryPage;

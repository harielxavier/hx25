import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Camera } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { judyMikeImages } from '../data/judyMikeImages';
import PhotoswipeResponsiveGallery from '../components/gallery/PhotoswipeResponsiveGallery';

// Gallery data for Judy & Mike's Wedding
const judyMikeGallery = {
  id: 'judy-mike-wedding',
  title: 'Judy & Mike',
  description: 'A luxurious celebration of love at Nanina\'s In the Park in Belleville, NJ',
  venue: 'Nanina\'s In the Park',
  location: 'Belleville, New Jersey',
  coverImage: '/MoStuff/Featured Wedding/Judy & Mike\'s Wedding/jm5.jpg'
};

// Gallery images
const galleryImages = judyMikeImages.filter(img => 
  // Exclude the featured thumbnail from the main gallery
  img.id !== 'judy-mike-featured'
);

function JudyMikeGalleryPage() {
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
        <title>Nanina's In the Park Wedding Photography | Judy & Mike | Hariel Xavier Photography</title>
        <meta name="description" content="View this breathtaking wedding at Nanina's In the Park in Belleville, NJ. Professional wedding photography showcasing the elegant venue and beautiful grounds of this premier New Jersey wedding destination." />
        <meta name="keywords" content="Nanina's In the Park, Belleville NJ wedding venue, luxury wedding venue New Jersey, elegant wedding venue, Hariel Xavier Photography, Judy and Mike wedding" />
        <link rel="canonical" href="https://harielxavier.com/judy-mike" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Nanina's In the Park Wedding Photography | Judy & Mike" />
        <meta property="og:description" content="View this breathtaking wedding at Nanina's In the Park in Belleville, NJ. Professional wedding photography showcasing the elegant venue and beautiful grounds of this premier New Jersey wedding destination." />
        <meta property="og:image" content="https://harielxavier.com/MoStuff/Featured Wedding/Judy & Mike's Wedding/jm5.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nanina's In the Park Wedding Photography | Judy & Mike" />
        <meta name="twitter:description" content="View this breathtaking wedding at Nanina's In the Park in Belleville, NJ. Professional wedding photography showcasing the elegant venue and beautiful grounds of this premier New Jersey wedding destination." />
        <meta name="twitter:image" content="https://harielxavier.com/MoStuff/Featured Wedding/Judy & Mike's Wedding/jm5.jpg" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "Nanina's In the Park Wedding Photography | Judy & Mike",
            "description": "Professional wedding photography at Nanina's In the Park in Belleville, New Jersey. Featuring the beautiful wedding of Judy and Mike.",
            "image": "https://harielxavier.com/MoStuff/Featured Wedding/Judy & Mike's Wedding/jm5.jpg",
            "author": {
              "@type": "Person",
              "name": "Hariel Xavier",
              "url": "https://harielxavier.com"
            },
            "contentLocation": {
              "@type": "Place",
              "name": "Nanina's In the Park",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "540 Mill Street",
                "addressLocality": "Belleville",
                "addressRegion": "NJ",
                "postalCode": "07109",
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
          src={judyMikeGallery.coverImage}
          alt={`${judyMikeGallery.title} Wedding at ${judyMikeGallery.venue}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
          <h1 className="text-4xl md:text-6xl font-serif mb-4 text-center">
            Judy & Mike's Wedding
          </h1>
          <div className="flex items-center text-lg md:text-xl mb-2">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{judyMikeGallery.venue}, {judyMikeGallery.location}</span>
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
                data-gallery-title={`${judyMikeGallery.title} Wedding at ${judyMikeGallery.venue}`}
              />
            </div>
            
            {/* Venue Description */}
            <div className="my-16">
              <h2 className="text-3xl font-serif mb-6 text-center">Nanina's In the Park</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <p className="text-lg mb-4">
                    Nanina's In the Park in Belleville, New Jersey is one of the most prestigious wedding venues in the region, offering an unparalleled blend of Italian-inspired elegance, luxurious amenities, and impeccable service. Set within the beautiful Branch Brook Park, this magnificent venue provided the perfect backdrop for Judy and Mike's spectacular wedding celebration.
                  </p>
                  <p className="text-lg mb-4">
                    What makes Nanina's truly exceptional is its stunning architecture and meticulously landscaped grounds. The venue features a grand ballroom with crystal chandeliers, marble columns, and a spacious dance floor—perfect for Judy & Mike's reception that balanced timeless elegance with modern sophistication.
                  </p>
                  <p className="text-lg mb-4">
                    The venue's outdoor ceremony space, where Judy & Mike took many of their portraits, offers a picturesque setting with beautiful gardens, a charming stone bridge, and a romantic gazebo adorned with cascading flowers. The cocktail hour space transitions beautifully between the ceremony and reception, allowing guests to enjoy the beautiful surroundings while celebrating the newly married couple.
                  </p>
                  <p className="text-lg">
                    Nanina's In the Park's dedicated staff provides exceptional service, ensuring that every detail is perfectly executed. From the custom menu featuring authentic Italian cuisine to the impeccable timing of events, Judy & Mike's wedding day unfolded seamlessly at this remarkable venue.
                  </p>
                  <p className="mt-4">
                    <a href="https://www.naninasinthepark.com/" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline font-medium">
                      Visit Nanina's In the Park Website →
                    </a>
                  </p>
                </div>
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="https://res.cloudinary.com/dos0qac90/image/upload/v1761593168/hariel-xavier-photography/MoStuff/Featured_Wedding/Judy_and_Mikes_Wedding/jm20.jpg" 
                    alt="Nanina's In the Park in Belleville, NJ - Luxury Wedding Venue" 
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
                For Judy and Mike's wedding at Nanina's In the Park, I focused on capturing the grandeur and luxury 
                of this magnificent venue while documenting the authentic emotions of their special day. The venue's 
                opulent architecture and elegant details provided a stunning backdrop for timeless, sophisticated imagery.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-8 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg border border-gray-100">
                  <div className="inline-block p-3 bg-gray-200 rounded-full mb-4">
                    <Camera className="w-6 h-6 text-gray-700" />
                  </div>
                  <h4 className="text-xl font-medium mb-3">Luxurious Details</h4>
                  <p className="text-gray-600">Showcasing the venue's opulent features including crystal chandeliers, grand staircases, and elegant ballrooms</p>
                </div>
                <div className="bg-gray-50 p-8 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg border border-gray-100">
                  <div className="inline-block p-3 bg-gray-200 rounded-full mb-4">
                    <Camera className="w-6 h-6 text-gray-700" />
                  </div>
                  <h4 className="text-xl font-medium mb-3">Dramatic Portraits</h4>
                  <p className="text-gray-600">Creating stunning portraits that utilize the venue's spectacular lighting and architectural elements</p>
                </div>
                <div className="bg-gray-50 p-8 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg border border-gray-100">
                  <div className="inline-block p-3 bg-gray-200 rounded-full mb-4">
                    <Camera className="w-6 h-6 text-gray-700" />
                  </div>
                  <h4 className="text-xl font-medium mb-3">Candid Emotions</h4>
                  <p className="text-gray-600">Documenting genuine moments of joy, celebration, and connection throughout this magnificent event</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gray-100 rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto mt-16">
              <h3 className="text-3xl font-serif mb-4">Ready to Create Your Own Wedding Story?</h3>
              <p className="text-lg mb-6">I would be honored to capture the magic of your special day with the same care and artistry shown in Judy and Mike's gallery.</p>
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

export default JudyMikeGalleryPage;

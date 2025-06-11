import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Camera } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
// Import the named export - this should resolve any caching issues
import { crystaDavidImages } from '../data/crystaDavidImages';
import PhotoswipeResponsiveGallery from '../components/gallery/PhotoswipeResponsiveGallery';

// Gallery data for Crysta & David Wedding
const crystaDavidGallery = {
  id: 'crysta-david-wedding',
  title: 'Crysta & David',
  description: 'A fairytale wedding at the historic Skylands Manor in Ringwood, New Jersey',
  venue: 'Skylands Manor',
  location: 'Ringwood, New Jersey',
  coverImage: '/MoStuff/Portfolio/crystadavid/cd14.jpg'
};

// Gallery images - filter out the featured thumbnail
const galleryImages = crystaDavidImages.filter(img => 
  img.id !== 'crysta-david-featured'
);

function CrystaDavidGalleryPage() {
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
        <title>Luxury Castle Wedding Photography at Skylands Manor | Crysta & David | Hariel Xavier Photography</title>
        <meta name="description" content="Explore Crysta & David's enchanting fairytale wedding at Skylands Manor in Ringwood, NJ. View stunning photography capturing the Tudor-style castle, botanical gardens, and romantic details of this historic New Jersey wedding venue." />
        <meta name="keywords" content="Skylands Manor, Ringwood wedding venue, NJ wedding photographer, castle wedding venue New Jersey, Hariel Xavier Photography, Crysta and David wedding, luxury castle wedding NJ, Skylands Manor wedding photos, historic wedding venue NJ, Ringwood NJ wedding photography, NJ botanical garden wedding" />
        <link rel="canonical" href="https://harielxavierphotography.com/crysta-david" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Luxury Castle Wedding Photography at Skylands Manor | Crysta & David" />
        <meta property="og:description" content="Explore Crysta & David's enchanting fairytale wedding at Skylands Manor in Ringwood, NJ. View stunning photography capturing the Tudor-style castle, botanical gardens, and romantic details of this historic New Jersey wedding venue." />
        <meta property="og:image" content="https://harielxavierphotography.com/MoStuff/Portfolio/crystadavid/cd14.jpg" />
        <meta property="og:url" content="https://harielxavierphotography.com/crysta-david" />
        <meta property="og:site_name" content="Hariel Xavier Photography" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Luxury Castle Wedding Photography at Skylands Manor | Crysta & David" />
        <meta name="twitter:description" content="Explore Crysta & David's enchanting fairytale wedding at Skylands Manor in Ringwood, NJ. View stunning photography capturing the Tudor-style castle, botanical gardens, and romantic details of this historic New Jersey wedding venue." />
        <meta name="twitter:image" content="https://harielxavierphotography.com/MoStuff/Portfolio/crystadavid/cd14.jpg" />
        <meta name="twitter:site" content="@HarielXavier" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "Luxury Castle Wedding Photography at Skylands Manor | Crysta & David",
            "description": "Explore stunning wedding photography of Crysta & David's fairytale wedding at Skylands Manor in Ringwood, NJ. Capturing the Tudor-style castle, botanical gardens, and romantic details of this historic New Jersey wedding venue.",
            "url": "https://harielxavierphotography.com/crysta-david",
            "image": "https://harielxavierphotography.com/MoStuff/Portfolio/crystadavid/cd14.jpg",
            "author": {
              "@type": "Person",
              "name": "Hariel Xavier",
              "url": "https://harielxavierphotography.com",
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
              "name": "Skylands Manor",
              "description": "Historic Tudor Revival mansion and wedding venue in Ringwood, New Jersey, surrounded by 100 acres of formal botanical gardens within 1,000 acres of natural woodlands.",
              "url": "https://skylandsmanor.com/",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "5 Morris Rd",
                "addressLocality": "Ringwood",
                "addressRegion": "NJ",
                "postalCode": "07456",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 41.1297,
                "longitude": -74.2385
              },
              "telephone": "+1-973-962-9370"
            },
            "event": {
              "@type": "Event",
              "name": "Crysta & David Wedding",
              "eventStatus": "https://schema.org/EventMovedOnline",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "description": "Wedding celebration of Crysta & David at Skylands Manor in Ringwood, NJ",
              "location": {
                "@type": "Place",
                "name": "Skylands Manor",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "5 Morris Rd",
                  "addressLocality": "Ringwood",
                  "addressRegion": "NJ",
                  "postalCode": "07456",
                  "addressCountry": "US"
                }
              },
              "image": "https://harielxavierphotography.com/MoStuff/Portfolio/crystadavid/cd14.jpg",
              "organizer": {
                "@type": "Person",
                "name": "Hariel Xavier",
                "url": "https://harielxavierphotography.com"
              }
            }
          })}
        </script>
      </Helmet>
      
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <img 
          src={crystaDavidGallery.coverImage} 
          alt="Crysta & David Wedding at Skylands Manor - Historic Castle Wedding Venue in NJ" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif mb-4">{crystaDavidGallery.title}</h1>
          <p className="text-xl md:text-2xl max-w-3xl">{crystaDavidGallery.description}</p>
          <div className="flex items-center mt-6">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{crystaDavidGallery.venue}, {crystaDavidGallery.location}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-8">
          <Link to="/wedding" className="inline-flex items-center text-gray-600 hover:text-black transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Back to Wedding Galleries</span>
          </Link>
        </div>
        
        {/* Gallery Description */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl font-serif mb-4">Crysta & David's Fairytale Wedding at Skylands Manor</h2>
          <p className="text-lg text-gray-700 mb-4">
            Crysta and David celebrated their love with a magical wedding at <strong>Skylands Manor</strong> in Ringwood, New Jersey. 
            Their day was filled with enchanting moments, heartfelt emotions, and an atmosphere of timeless romance in one of New Jersey's most historic and prestigious wedding venues.
          </p>
          <p className="text-lg text-gray-700">
            As a luxury NJ wedding photographer, I captured every detail of their special day—from the romantic first look in the botanical gardens to the elegant reception in the castle's grand hall. Their wedding photos showcase the breathtaking beauty of Skylands Manor, making it an ideal choice for couples seeking a castle wedding venue near New York City.
          </p>
        </div>
        
        {/* Venue Highlight */}
        <div className="bg-gray-50 rounded-xl p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-serif mb-4">Skylands Manor - Historic Castle Wedding Venue in NJ</h2>
              <p className="mb-4"><strong>Skylands Manor</strong> in Ringwood, New Jersey provided the perfect fairytale backdrop for Crysta and David's wedding day. This Tudor Revival mansion, built in the 1920s, is surrounded by 100 acres of formal botanical gardens within 1,000 acres of natural woodlands, offering a truly magical setting for luxury weddings.</p>
              <p className="mb-4">The castle-like architecture features 54 rooms of late Gothic to early Renaissance styles, with intricate stonework, grand halls, and beautiful stained-glass windows. The surrounding New Jersey Botanical Garden offers stunning natural settings for ceremonies and portraits, including tree-lined orchards, rolling lawns, and stone terraces that create unforgettable wedding photography opportunities.</p>
              <p className="mb-4">Located at 5 Morris Rd, Ringwood, NJ 07456, Skylands Manor is part of the Ringwood State Park and is just an hour from New York City, making it a convenient yet breathtaking destination for couples seeking a historic castle wedding experience in New Jersey. The venue offers multiple event spaces including the Grand Ballroom, Magnolia Room, and outdoor garden areas for ceremonies of unparalleled elegance.</p>
              <p className="mt-4">
                <a href="https://skylandsmanor.com/" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline font-medium">
                  Visit Skylands Manor Website →
                </a>
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/MoStuff/Portfolio/crystadavid/cd49.jpg" 
                alt="Skylands Manor in Ringwood, NJ - Historic Castle Wedding Venue with Botanical Gardens" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
        
        {/* Loading state */}
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

        {/* Photography Style Section */}
        <div className="my-16 text-center">
          <div className="inline-block p-3 bg-gray-100 rounded-full mb-6">
            <Camera className="w-8 h-8 text-gray-800" />
          </div>
          <h3 className="text-3xl font-serif mb-4">My Photography Approach</h3>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            For Crysta and David's wedding at Skylands Manor, I focused on capturing the enchanting atmosphere 
            of this historic venue while documenting the authentic emotions of their special day. The castle's 
            architecture and surrounding gardens provided a stunning backdrop for timeless, romantic imagery.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-xl font-medium mb-2">Architectural Beauty</h4>
              <p>Showcasing the historic Tudor-style architecture and botanical garden surroundings</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-xl font-medium mb-2">Natural Light</h4>
              <p>Utilizing the beautiful natural light filtering through the garden landscapes</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-xl font-medium mb-2">Intimate Moments</h4>
              <p>Capturing the couple's connection against the backdrop of this fairytale setting</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-100 rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto mt-16">
          <h3 className="text-3xl font-serif mb-4">Ready to Create Your Own Wedding Story?</h3>
          <p className="text-lg mb-6">I would be honored to capture the magic of your special day with the same care and artistry shown in Crysta and David's gallery.</p>
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

export default CrystaDavidGalleryPage;

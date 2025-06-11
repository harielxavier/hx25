import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Camera } from 'lucide-react';
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
        <title>Luxury Wedding Photography at The Legacy Castle | Ansimon & Mina | Hariel Xavier Photography</title>
        <meta name="description" content="Explore Ansimon & Mina's elegant wedding at The Legacy Castle in Pompton Plains, NJ. View stunning photography capturing the grand ballroom, purple uplighting, and luxurious details of this premier New Jersey wedding venue." />
        <meta name="keywords" content="The Legacy Castle, Pompton Plains wedding venue, NJ wedding photographer, luxury wedding venue New Jersey, Hariel Xavier Photography, Ansimon and Mina wedding, Legacy Castle ballroom, purple wedding lighting, NJ luxury wedding, Pompton Plains wedding photography, Legacy Castle wedding photos" />
        <link rel="canonical" href="https://harielxavierphotography.com/ansimon-mina" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Luxury Wedding Photography at The Legacy Castle | Ansimon & Mina" />
        <meta property="og:description" content="Explore Ansimon & Mina's elegant wedding at The Legacy Castle in Pompton Plains, NJ. View stunning photography capturing the grand ballroom, purple uplighting, and luxurious details of this premier New Jersey wedding venue." />
        <meta property="og:image" content="https://harielxavierphotography.com/view/2.jpg" />
        <meta property="og:url" content="https://harielxavierphotography.com/ansimon-mina" />
        <meta property="og:site_name" content="Hariel Xavier Photography" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Luxury Wedding Photography at The Legacy Castle | Ansimon & Mina" />
        <meta name="twitter:description" content="Explore Ansimon & Mina's elegant wedding at The Legacy Castle in Pompton Plains, NJ. View stunning photography capturing the grand ballroom, purple uplighting, and luxurious details of this premier New Jersey wedding venue." />
        <meta name="twitter:image" content="https://harielxavierphotography.com/view/2.jpg" />
        <meta name="twitter:site" content="@HarielXavier" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "Luxury Wedding Photography at The Legacy Castle | Ansimon & Mina",
            "description": "Explore stunning wedding photography of Ansimon & Mina's elegant wedding at The Legacy Castle in Pompton Plains, NJ. Capturing the grand ballroom, purple uplighting, and luxurious details of this premier New Jersey wedding venue.",
            "url": "https://harielxavierphotography.com/ansimon-mina",
            "image": "https://harielxavierphotography.com/view/2.jpg",
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
              "image": "https://harielxavierphotography.com/view/2.jpg",
              "organizer": {
                "@type": "Person",
                "name": "Hariel Xavier",
                "url": "https://harielxavierphotography.com"
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
        
        {/* Venue Highlight */}
        <div className="bg-gray-50 rounded-xl p-8 md:p-12 my-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-serif mb-4">The Legacy Castle - Premier NJ Wedding Venue</h2>
              <p className="mb-4"><strong>The Legacy Castle</strong> in Pompton Plains, New Jersey provided the perfect backdrop for Ansimon and Mina's special day. With its elegant European-inspired architecture and luxurious surroundings, it created a magical atmosphere for their celebration, making it one of the most sought-after wedding venues in NJ.</p>
              <p className="mb-4">From the grand ballrooms with stunning chandeliers to the beautiful outdoor spaces with a picturesque lake setting, every corner of this venue offered incredible photo opportunities to capture their love story. The Legacy Castle is renowned for its opulent design, featuring marble floors, intricate moldings, and customizable lighting options like the purple uplighting that made Ansimon & Mina's wedding reception truly spectacular.</p>
              <p className="mb-4">Located at 141 NJ-23, Pompton Plains, NJ 07444, The Legacy Castle offers multiple event spaces including the Grand Legacy Ballroom, Mayfair Gardens, and Oxford Hall, making it ideal for luxury weddings of any size. Its proximity to New York City (just 30 minutes away) makes it a convenient yet breathtaking destination for couples seeking a fairytale wedding experience in New Jersey.</p>
              <p className="mt-4">
                <a href="https://thelegacycastle.com/" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline font-medium">
                  Visit The Legacy Castle Website →
                </a>
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/MoStuff/Featured Wedding/Ansimon & Mina's Wedding/legacy.jpg" 
                alt="The Legacy Castle in Pompton Plains, NJ - Luxury Wedding Venue with Grand Ballroom" 
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

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Camera } from 'lucide-react';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { karniZilvinasImages } from '../data/karniZilvinasImages';
import PhotoswipeResponsiveGallery from '../components/gallery/PhotoswipeResponsiveGallery';
import SEO from '../components/SEO';

// Gallery data for Karni & Zilvinas Wedding
const karniZilvinasGallery = {
  id: 'karni-zilvinas-wedding',
  title: 'Karni & Zilvinas',
  description: 'A luxurious wedding celebration at The Venetian in Garfield, New Jersey',
  venue: 'The Venetian',
  location: 'Garfield, New Jersey',
  coverImage: 'https://res.cloudinary.com/dos0qac90/image/upload/v1761593170/hariel-xavier-photography/MoStuff/Featured_Wedding/Karni_and_Zilnivas/kz_and_Zilvinas_Wedding__1_.jpg'
};

// Gallery images - filter out the featured thumbnail
const galleryImages = karniZilvinasImages.filter(img => 
  img.id !== 'karni-zilvinas-featured'
);

function KarniZilvinasGalleryPage() {
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
      <SEO 
        title="The Venetian Wedding Photography | Karni & Zilvinas | Hariel Xavier Photography"
        description="View this luxurious wedding at The Venetian in Garfield, NJ. Professional wedding photography showcasing the elegant ballrooms and beautiful grounds of this premier New Jersey wedding venue."
        keywords="The Venetian, Garfield wedding venue, NJ wedding photographer, luxury wedding venue New Jersey, Hariel Xavier Photography, Karni and Zilvinas wedding"
        ogImage="https://res.cloudinary.com/dos0qac90/image/upload/v1761593170/hariel-xavier-photography/MoStuff/Featured_Wedding/Karni_and_Zilnivas/kz_and_Zilvinas_Wedding__1_.jpg"
        type="website"
      />
      
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-8">
          <Link to="/wedding" className="inline-flex items-center text-gray-600 hover:text-black transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Back to Wedding Galleries</span>
          </Link>
        </div>
        
        {/* Gallery Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{karniZilvinasGallery.title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">{karniZilvinasGallery.description}</p>
          <div className="flex items-center justify-center text-gray-500">
            <span className="mr-6">{karniZilvinasGallery.venue}</span>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{karniZilvinasGallery.location}</span>
            </div>
          </div>
        </div>
        
        {/* Venue Highlight */}
        <div className="bg-gray-50 rounded-xl p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-serif mb-4">The Venetian</h3>
              <p className="mb-4"><strong>The Venetian</strong> in Garfield, New Jersey is one of the region's most prestigious wedding venues, offering an unparalleled blend of luxury, elegance, and impeccable service. This magnificent venue provided the perfect setting for Karni and Zilvinas's spectacular wedding celebration.</p>
              <p>The venue is renowned for its opulent ballrooms featuring crystal chandeliers, marble columns, and grand staircases that create a truly regal atmosphere. The Venetian's exquisite architecture draws inspiration from Italian Renaissance design, with meticulous attention to detail evident in every aspect of the space.</p>
              <p>For Karni and Zilvinas's wedding, The Venetian's expert staff transformed their already stunning spaces into a personalized fairytale setting. The venue's beautiful outdoor areas, including manicured gardens and a picturesque gazebo, provided perfect backdrops for romantic portraits and intimate moments throughout the day.</p>
              <p className="mt-4">
                <a href="https://venetiannj.com/" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline font-medium">
                  Visit The Venetian Website →
                </a>
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://res.cloudinary.com/dos0qac90/image/upload/v1761593173/hariel-xavier-photography/MoStuff/Featured_Wedding/Karni_and_Zilnivas/kz_and_Zilvinas_Wedding__22_.jpg" 
                alt="The Venetian in Garfield, NJ - Luxury Wedding Venue" 
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
            For Karni and Zilvinas's wedding at The Venetian, I focused on capturing the grandeur and luxury 
            of this magnificent venue while documenting the authentic emotions of their special day. The venue's 
            opulent architecture and elegant details provided a stunning backdrop for timeless, sophisticated imagery.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-xl font-medium mb-2">Luxurious Details</h4>
              <p>Showcasing the venue's opulent features including crystal chandeliers, grand staircases, and elegant ballrooms</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-xl font-medium mb-2">Dramatic Lighting</h4>
              <p>Utilizing the venue's spectacular lighting to create dramatic, romantic portraits</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-xl font-medium mb-2">Candid Emotions</h4>
              <p>Capturing genuine moments of joy, celebration, and connection throughout this magnificent event</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-100 rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto mt-16">
          <h3 className="text-3xl font-serif mb-4">Ready to Create Your Own Wedding Story?</h3>
          <p className="text-lg mb-6">I would be honored to capture the magic of your special day with the same care and artistry shown in Karni and Zilvinas's gallery.</p>
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

export default KarniZilvinasGalleryPage;

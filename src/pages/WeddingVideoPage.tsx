import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Calendar, MapPin, Users } from 'lucide-react';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import SEO from '../components/layout/SEO';
import VideoPlayer from '../components/VideoPlayer';

const WeddingVideoPage: React.FC = () => {
  // Updated video path with multiple fallback options
  const videoSources = [
    '/MoStuff/Morgan & Michael\'s Wedding.mp4',
    '/videos/Morgan & Michael\'s Wedding.mp4',
    '/assets/videos/Morgan & Michael\'s Wedding.mp4',
    'https://storage.googleapis.com/harielxavier-videos/Morgan%20%26%20Michael%27s%20Wedding.mp4'
  ];
  
  const [currentVideoSource, setCurrentVideoSource] = useState(videoSources[0]);
  const [videoError, setVideoError] = useState(false);
  
  // Use the actual existing morganvideocover.jpg from images folder
  const posterImage = 'https://res.cloudinary.com/dos0qac90/image/upload/v1761593388/hariel-xavier-photography/MoStuff/images/morganvideocover.jpg';

  // Fallback poster in case the main one doesn't exist
  const fallbackPoster = 'https://images.unsplash.com/photo-1583939411023-14606be1c8b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80';

  // Handle video error by trying the next source
  const handleVideoError = () => {
    const currentIndex = videoSources.indexOf(currentVideoSource);
    if (currentIndex < videoSources.length - 1) {
      setCurrentVideoSource(videoSources[currentIndex + 1]);
    } else {
      setVideoError(true);
    }
  };

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="Morgan & Michael's Wedding | Hariel Xavier Photography"
        description="Watch the beautiful wedding video of Morgan and Michael, captured by Hariel Xavier Photography. A stunning celebration of love and commitment."
      />
      <Navigation />
      
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[60vh] bg-black overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-110"
          style={{ 
            backgroundImage: `url(${fallbackPoster})`,
            transformOrigin: 'center bottom',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-white p-4 z-10">
          <h1 className="text-5xl md:text-6xl font-serif mb-4 text-center">Morgan & Michael's Wedding</h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl font-light">
            A beautiful celebration of love and commitment
          </p>
          <div className="mt-8 flex items-center space-x-2">
            <Heart className="text-rose-400 animate-pulse" size={20} />
            <span className="text-rose-200">June 15, 2024</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link to="/portfolio" className="inline-flex items-center text-gray-600 hover:text-black transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Portfolio
          </Link>
        </div>
        
        <div className="max-w-5xl mx-auto">
          {/* Video Player with Enhanced Styling */}
          <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-12">
            {videoError ? (
              <div className="aspect-video bg-gray-900 flex items-center justify-center text-white p-8 text-center">
                <div>
                  <p className="text-xl mb-4">Sorry, the video is currently unavailable.</p>
                  <p className="text-gray-400">Please check back later or contact us for assistance.</p>
                </div>
              </div>
            ) : (
              <VideoPlayer 
                src={currentVideoSource} 
                title="Morgan & Michael's Wedding" 
                poster={posterImage}
                className="aspect-video"
                autoPlay={false}
                onError={handleVideoError}
              />
            )}
            
            <div className="p-8">
              <h2 className="text-3xl font-serif mb-4">Morgan & Michael's Wedding</h2>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                Witness the beautiful celebration of Morgan and Michael's wedding day. This cinematic video captures 
                the essence of their special day, from the emotional ceremony to the joyful reception. Every moment tells a story
                of love, commitment, and the beginning of their journey together.
              </p>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-medium mb-6">Event Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start">
                    <Calendar className="text-gray-500 mr-3 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">June 15, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="text-gray-500 mr-3 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">Farmstead Golf & Country Club</p>
                      <p className="text-sm text-gray-500">88 Lawrence Rd, Lafayette, NJ</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="text-gray-500 mr-3 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Guests</p>
                      <p className="font-medium">150 Friends & Family</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonial Section */}
          <div className="bg-gray-50 p-8 rounded-lg mb-16">
            <div className="max-w-3xl mx-auto text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-xl italic text-gray-700 mb-6">
                "Hariel Xavier Photography captured our wedding day perfectly. The video brings tears to our eyes every time we watch it. 
                They have an incredible talent for capturing genuine moments and emotions."
              </p>
              <div>
                <p className="font-medium">Morgan & Michael</p>
                <p className="text-sm text-gray-500">Newlyweds</p>
              </div>
            </div>
          </div>
          
          {/* More from this Wedding */}
          <div className="mt-12">
            <h3 className="text-2xl font-serif mb-8">More from this Wedding</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link to="/gallery/morgan-michael-wedding" className="block group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={fallbackPoster} 
                    alt="Wedding Gallery" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h4 className="mt-4 font-medium">Photo Gallery</h4>
                <p className="text-sm text-gray-500">View all photos</p>
              </Link>
              
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={fallbackPoster} 
                  alt="Couple Portrait" 
                  className="w-full h-full object-cover"
                />
                <h4 className="mt-4 font-medium">Couple Portraits</h4>
                <p className="text-sm text-gray-500">Intimate moments</p>
              </div>
              
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={fallbackPoster} 
                  alt="Reception" 
                  className="w-full h-full object-cover"
                />
                <h4 className="mt-4 font-medium">Reception</h4>
                <p className="text-sm text-gray-500">Celebration highlights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-black text-white py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">Ready to capture your special day?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Let us tell your unique love story through beautiful cinematic videography and photography.
          </p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-4 bg-white text-black hover:bg-gray-100 transition-colors"
          >
            Book Your Wedding
          </Link>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default WeddingVideoPage;

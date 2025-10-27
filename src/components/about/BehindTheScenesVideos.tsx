import React, { useState, useEffect, useRef } from 'react';

interface VideoSource {
  src: string;
  title: string;
}

interface BehindTheScenesVideosProps {
  className?: string;
}

const BehindTheScenesVideos: React.FC<BehindTheScenesVideosProps> = ({ className = '' }) => {
  const videos: VideoSource[] = [
    { src: '/images/bts.MOV', title: 'Behind the Scenes 1' },
    { src: '/MoStuff/meettheteam/bts2.MOV', title: 'Behind the Scenes 2' },
    { src: '/MoStuff/meettheteam/bts3.MOV', title: 'Behind the Scenes 3' },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Set up video refs array
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videos.length);
  }, [videos.length]);

  // Handle auto-play when video becomes active
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeIndex) {
          // Force video to load and play
          setIsLoading(true);
          setHasError(false);
          
          // Set a timeout to prevent immediate play attempts that might fail
          setTimeout(() => {
            if (video) {
              video.load();
              // Only try to play if the document has been interacted with
              if (document.hasFocus()) {
                const playPromise = video.play();
                
                if (playPromise !== undefined) {
                  playPromise
                    .then(() => {
                      setIsLoading(false);
                    })
                    .catch(() => {
                      console.log('Auto-play prevented. User needs to interact first.');
                      setIsLoading(false);
                    });
                } else {
                  setIsLoading(false);
                }
              } else {
                // Don't try to autoplay if document doesn't have focus
                setIsLoading(false);
              }
            }
          }, 300);
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [activeIndex]);

  const handleVideoClick = () => {
    const video = videoRefs.current[activeIndex];
    if (video) {
      if (video.paused) {
        video.play().catch(() => {
          console.error('Error playing video:');
          setHasError(true);
        });
      } else {
        video.pause();
      }
    }
  };

  const handleVideoError = (index: number) => {
    console.error(`Error loading video at index ${index}`);
    setHasError(true);
    setIsLoading(false);
  };

  const handleVideoLoaded = () => {
    setIsLoading(false);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[activeIndex];
    if (video) {
      video.muted = !video.muted;
      setIsMuted(!isMuted);
    }
  };

  const nextVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const prevVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  return (
    <div className={`relative ${className}`} data-component-name="AboutPage">
      <div className="relative aspect-video overflow-hidden rounded-lg shadow-2xl bg-black">
        {videos.map((video, index) => (
          <div 
            key={video.src}
            className={`absolute inset-0 transition-opacity duration-500 ${index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            onClick={handleVideoClick}
          >
            <video
              ref={el => videoRefs.current[index] = el}
              src={video.src}
              className="w-full h-full object-cover"
              muted={isMuted}
              loop
              playsInline
              data-component-name="AboutPage"
              onError={() => handleVideoError(index)}
              onLoadedData={handleVideoLoaded}
              poster="https://res.cloudinary.com/dos0qac90/image/upload/v1761593258/hariel-xavier-photography/MoStuff/LandingPage/HeroPage.jpg" // Add a poster image to show before video loads
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
            
            {/* Loading indicator */}
            {isLoading && index === activeIndex && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
            
            {/* Error message */}
            {hasError && index === activeIndex && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
                <div className="text-white text-center p-4">
                  <p className="text-xl mb-2">Video could not be loaded</p>
                  <button 
                    className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      const video = videoRefs.current[activeIndex];
                      if (video) {
                        setHasError(false);
                        setIsLoading(true);
                        video.load();
                        video.play().catch(() => {
                          setHasError(true);
                          setIsLoading(false);
                        });
                      }
                    }}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
              <div className="text-white text-lg font-medium">{video.title}</div>
              <div className="flex space-x-3">
                <button 
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Play button overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none"
          onClick={handleVideoClick}
        >
          <button 
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors pointer-events-auto"
            onClick={handleVideoClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Navigation buttons */}
        <button 
          onClick={prevVideo}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={nextVideo}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Video indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BehindTheScenesVideos;

import React, { useEffect, useRef } from 'react';

interface HeroImage {
  src: string;
  alt: string;
}

const PremiumHeroSection: React.FC = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);
  
  // Sample hero images - replace with actual premium images
  const heroImages: HeroImage[] = [
    {
      src: "https://source.unsplash.com/random/1920x1080/?wedding,editorial",
      alt: "Editorial wedding portrait at sunset"
    },
    {
      src: "https://source.unsplash.com/random/1920x1080/?wedding,luxury",
      alt: "Luxury wedding venue in Italy"
    },
    {
      src: "https://source.unsplash.com/random/1920x1080/?wedding,couple",
      alt: "Elegant couple portrait in natural light"
    }
  ];
  
  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollPosition = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrollPosition * 0.4}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <section className="relative h-[85vh] overflow-hidden">
      {/* Hero image with parallax effect */}
      <div 
        ref={parallaxRef}
        className="absolute inset-0 w-full h-full"
      >
        <div className="relative w-full h-full">
          {/* Main hero image */}
          <img 
            src={heroImages[0].src}
            alt={heroImages[0].alt}
            className="w-full h-full object-cover"
            loading="eager"
            {...{ fetchpriority: "high" } as any}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50"></div>
        </div>
      </div>
      
      {/* Typography overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="font-display text-5xl md:text-7xl font-light text-white mb-6 tracking-wide">
          Hariel Xavier
        </h1>
        <p className="font-body text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8 tracking-wide">
          Timeless moments captured with an editorial approach
        </p>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <svg className="w-8 h-8 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};

export default PremiumHeroSection;

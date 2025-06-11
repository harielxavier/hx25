import React, { useEffect, useRef } from 'react';

const ArtisticApproachSection: React.FC = () => {
  const animationRef = useRef<HTMLDivElement>(null);
  
  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-reveal');
          }
        });
      },
      { threshold: 0.2 }
    );
    
    if (animationRef.current) {
      observer.observe(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        observer.unobserve(animationRef.current);
      }
    };
  }, []);
  
  return (
    <section className="artistic-approach-section py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center max-w-6xl mx-auto">
          {/* Cinematic BTS imagery */}
          <div className="relative h-[600px] overflow-hidden">
            <img 
              src="https://source.unsplash.com/random/800x1200/?photographer,wedding" 
              alt="Behind the scenes of a wedding photoshoot" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          
          {/* Photography philosophy and approach */}
          <div ref={animationRef} className="opacity-0 transition-opacity duration-1000">
            <h2 className="font-display text-3xl md:text-4xl mb-6">The Artistic Approach</h2>
            
            <div className="space-y-6 font-body text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                My approach to wedding photography is deeply rooted in editorial storytelling and fine art principles. I believe that your wedding images should not only document the day but should evoke the emotions, atmosphere, and unique narrative of your celebration.
              </p>
              
              <p className="leading-relaxed">
                Working with a limited number of couples each year allows me to provide an unparalleled level of attention and artistic focus. Each wedding is approached as a unique creative collaboration, resulting in imagery that is both timeless and distinctly yours.
              </p>
              
              <p className="leading-relaxed">
                My process begins months before your wedding day, as we develop a relationship that allows me to understand your vision and the emotional nuances that make your story unique. This foundation of trust and understanding is what enables me to capture moments with both authenticity and artistic intention.
              </p>
              
              <p className="leading-relaxed">
                The result is a curated collection of images that transcends traditional wedding photography—a narrative art piece that will become an heirloom, preserving not just how your celebration looked, but how it felt.
              </p>
            </div>
            
            <div className="mt-8">
              <div className="inline-block border-t border-gray-300 dark:border-gray-700 pt-4">
                <p className="font-display text-lg italic">
                  "Photography is the art of capturing emotions and transforming them into timeless visual poetry."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtisticApproachSection;

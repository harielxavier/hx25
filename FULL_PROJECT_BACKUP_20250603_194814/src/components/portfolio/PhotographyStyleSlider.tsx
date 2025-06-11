import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface StyleType {
  title: string;
  subtitle: string;
  description: string;
  approach: string[];
  idealFor: string[];
  subtleRecommendation: string;
  style: 'documentary' | 'guided' | 'editorial';
}

const PhotographyStyleSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Define the style based on slider position
  const getStyle = (): 'documentary' | 'guided' | 'editorial' => {
    if (sliderPosition < 33) return 'documentary';
    if (sliderPosition < 67) return 'guided';
    return 'editorial';
  };

  const currentStyle = getStyle();

  // Specific slider images
  const sliderImages = {
    documentary: '/MoStuff/style-slider/LeftSlider.jpg',
    guided: '/MoStuff/style-slider/MiddleSlider.jpg',
    editorial: '/MoStuff/style-slider/RightSlider.jpg'
  };

  // Photography styles with detailed descriptions
  const photographyStyles: StyleType[] = [
    {
      title: "Documentary Storytelling",
      subtitle: "Authentic, unposed moments",
      description: "I'll blend into the background, capturing genuine interactions and emotions as they naturally unfold. This approach preserves the authentic atmosphere of your day with minimal interruption.",
      approach: [
        "Fly-on-the-wall observation",
        "Natural light and authentic moments",
        "Minimal posing or direction",
        "Focus on emotional connections",
        "Candid guest interactions"
      ],
      idealFor: [
        "Camera-shy couples who want to forget I'm there",
        "Those who value authentic moments over posed portraits",
        "Couples who want their day captured as it truly happened",
        "When the genuine emotion matters most"
      ],
      subtleRecommendation: "This approach works beautifully with 8 hours of coverage, allowing me to document your complete story without needing extensive portrait time.",
      style: 'documentary'
    },
    {
      title: "Guided Authenticity",
      subtitle: "Natural with gentle direction",
      description: "The perfect balance between documentary and editorial. I'll provide just enough guidance to help you look your best while maintaining the natural connection between you. You'll never feel awkwardly posed.",
      approach: [
        "Light direction that feels natural",
        "Genuine moments with subtle refinement",
        "Flattering angles and compositions",
        "Blend of candid and thoughtfully arranged",
        "Comfortable guidance throughout"
      ],
      idealFor: [
        "Couples who want to look natural but appreciate guidance",
        "Those wanting beautiful portraits without feeling stiff",
        "When you want the best of both documentary and editorial",
        "First-time photography clients who want direction"
      ],
      subtleRecommendation: "Most of my couples choose this balanced approach with 9 hours of coverage, which includes time for a relaxed first look and naturally guided portraits.",
      style: 'guided'
    },
    {
      title: "Editorial Excellence",
      subtitle: "Magazine-worthy moments",
      description: "For couples who want their wedding to look like it belongs in a high-end publication. I'll create dramatic, artistic compositions with more intentional direction while still capturing the authentic emotion.",
      approach: [
        "Creative direction and artistic vision",
        "Dramatic lighting and compositions",
        "Fashion-inspired posing techniques",
        "Attention to every visual detail",
        "Statement-making portrait sessions"
      ],
      idealFor: [
        "Style-conscious couples who love fashion photography",
        "Those comfortable in front of the camera",
        "When you want your photos to make a statement",
        "Couples with a bold, artistic vision"
      ],
      subtleRecommendation: "This premium approach is enhanced with 10 hours of coverage, giving us ample time for creative portrait sessions and artistic detail shots throughout your day.",
      style: 'editorial'
    }
  ];

  // Get current style details
  const currentStyleDetails = photographyStyles.find(s => s.style === currentStyle);

  // Handle mouse/touch events for slider
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    
    // Calculate position as percentage
    let newPosition = (mouseX / containerWidth) * 100;
    
    // Clamp position between 0 and 100
    newPosition = Math.max(0, Math.min(100, newPosition));
    
    setSliderPosition(newPosition);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const touchX = e.touches[0].clientX - containerRect.left;
    
    // Calculate position as percentage
    let newPosition = (touchX / containerWidth) * 100;
    
    // Clamp position between 0 and 100
    newPosition = Math.max(0, Math.min(100, newPosition));
    
    setSliderPosition(newPosition);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove as any);
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove as any);
      window.removeEventListener('touchend', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove as any);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <section ref={ref} className="py-24 bg-gradient-to-r from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl mb-6 relative inline-block">
            <span className="relative z-10">Your Story, Your Style</span>
            <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-800 to-transparent"></span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Every relationship is unique, and your photography should be too. 
            Move the slider to discover which approach resonates with your personality and vision.
            I'll adapt my style to capture your love story in a way that feels authentically you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <div className={`text-left transition-opacity duration-300 ${currentStyle === 'documentary' ? 'opacity-100' : 'opacity-40'}`}>
                <h3 className="font-serif text-2xl mb-2">Documentary</h3>
                <p className="text-gray-600 max-w-xs">
                  Authentic & Unposed
                </p>
              </div>
              <div className={`text-center transition-opacity duration-300 ${currentStyle === 'guided' ? 'opacity-100' : 'opacity-40'}`}>
                <h3 className="font-serif text-2xl mb-2">Guided</h3>
                <p className="text-gray-600 max-w-xs">
                  Balanced Approach
                </p>
              </div>
              <div className={`text-right transition-opacity duration-300 ${currentStyle === 'editorial' ? 'opacity-100' : 'opacity-40'}`}>
                <h3 className="font-serif text-2xl mb-2">Editorial</h3>
                <p className="text-gray-600 max-w-xs">
                  Creative Direction
                </p>
              </div>
            </div>

            {/* Slider Control */}
            <div 
              ref={containerRef}
              className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-gray-400 to-gray-800 rounded-full"
                style={{ width: `${sliderPosition}%` }}
              ></div>
              <div 
                className="absolute top-0 h-6 w-6 bg-white border-2 border-gray-800 rounded-full shadow-lg -mt-2 -ml-3 cursor-grab active:cursor-grabbing"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
              ></div>
            </div>

            {/* Style Description */}
            <div className="space-y-6">
              <div className={`transition-all duration-500 ${currentStyle === currentStyleDetails?.style ? 'block' : 'hidden'}`}>
                <h4 className="font-serif text-xl mb-3">{currentStyleDetails?.title}</h4>
                <p className="text-gray-600 mb-4">
                  {currentStyleDetails?.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h5 className="font-medium text-sm uppercase tracking-wider mb-2 text-gray-800">My Approach:</h5>
                    <ul className="text-sm space-y-1">
                      {currentStyleDetails?.approach.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-black">•</span>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm uppercase tracking-wider mb-2 text-gray-800">Ideal For:</h5>
                    <ul className="text-sm space-y-1">
                      {currentStyleDetails?.idealFor.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-black">•</span>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 border-l-2 border-gray-300 italic text-gray-600 text-sm">
                  {currentStyleDetails?.subtleRecommendation}
                </div>
              </div>
            </div>

            {/* Subtle Call to Action */}
            <div className="pt-4 flex justify-end">
              <Link 
                to="/contact" 
                className="text-gray-800 hover:text-black transition-colors text-sm font-medium flex items-center group"
              >
                <span>Discuss your vision</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Image Display */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl"
          >
            {/* Documentary Image */}
            <div 
              className={`absolute inset-0 transition-opacity duration-700 ${
                currentStyle === 'documentary' ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img 
                src={sliderImages.documentary} 
                alt="Documentary style photography" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <h3 className="font-serif text-xl">Documentary Storytelling</h3>
                <p className="text-sm text-white/80">Authentic moments, naturally captured</p>
              </div>
            </div>

            {/* Guided Image */}
            <div 
              className={`absolute inset-0 transition-opacity duration-700 ${
                currentStyle === 'guided' ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img 
                src={sliderImages.guided} 
                alt="Guided style photography" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <h3 className="font-serif text-xl">Guided Authenticity</h3>
                <p className="text-sm text-white/80">The perfect balance of natural and refined</p>
              </div>
            </div>

            {/* Editorial Image */}
            <div 
              className={`absolute inset-0 transition-opacity duration-700 ${
                currentStyle === 'editorial' ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img 
                src={sliderImages.editorial} 
                alt="Editorial style photography" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <h3 className="font-serif text-xl">Editorial Excellence</h3>
                <p className="text-sm text-white/80">Magazine-worthy artistic direction</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subtle Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Every couple deserves photography that reflects their unique relationship.
            Let's discuss how we can tailor my approach to tell your love story in a way that feels authentically you.
          </p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-3 border-2 border-gray-800 text-gray-800 rounded-lg font-medium tracking-wide transform transition-all duration-300 hover:bg-gray-800 hover:text-white"
          >
            Start the Conversation
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PhotographyStyleSlider;

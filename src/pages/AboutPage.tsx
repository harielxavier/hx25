import { useInView } from 'react-intersection-observer';
import Navigation from '../components/landing/Navigation';
import SEO from '../components/SEO';
import { useEffect, useState } from 'react';
import CuratorSocialFeed from '../components/social/CuratorSocialFeed';
import BehindTheScenesVideos from '../components/about/BehindTheScenesVideos';
import ReversibleVideo from '../components/shared/ReversibleVideo';

export default function AboutPage() {
  // Multiple intersection observers for different sections
  const { ref: bioRef, inView: bioInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const { ref: philosophyRef, inView: philosophyInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const { ref: teamRef, inView: teamInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const { ref: funFactsRef, inView: funFactsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Staggered animation for team members
  const [visibleTeamMembers, setVisibleTeamMembers] = useState<number[]>([]);
  
  useEffect(() => {
    if (teamInView) {
      const timer = setTimeout(() => {
        setVisibleTeamMembers([0]);
        
        const timer2 = setTimeout(() => {
          setVisibleTeamMembers([0, 1]);
          
          const timer3 = setTimeout(() => {
            setVisibleTeamMembers([0, 1, 2]);
          }, 200);
          
          return () => clearTimeout(timer3);
        }, 200);
        
        return () => clearTimeout(timer2);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [teamInView]);
  
  // Staggered animation for philosophy pillars
  const [visiblePhilosophyPillars, setVisiblePhilosophyPillars] = useState<number[]>([]);
  
  useEffect(() => {
    if (philosophyInView) {
      const timer = setTimeout(() => {
        setVisiblePhilosophyPillars([0]);
        
        const timer2 = setTimeout(() => {
          setVisiblePhilosophyPillars([0, 1]);
          
          const timer3 = setTimeout(() => {
            setVisiblePhilosophyPillars([0, 1, 2]);
          }, 200);
          
          return () => clearTimeout(timer3);
        }, 200);
        
        return () => clearTimeout(timer2);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [philosophyInView]);

  return (
    <>
      <SEO 
        title="About Hariel Xavier | NYC & NJ Wedding Photographer"
        description="Meet Hariel Xavier, professional wedding photographer with 14+ years experience capturing love stories in New York, New Jersey, and beyond. Discover my philosophy and approach to wedding photography."
      />
      <Navigation />
      
      <main id="main-content" className="pt-24 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative h-[60vh] overflow-hidden">
          <h1 className="sr-only">About Hariel Xavier - Wedding Photographer</h1>
          <div className="absolute inset-0">
            <ReversibleVideo 
              src="/MoStuff/meettheteam/1moving.mp4"
              className="w-full h-full object-cover"
              playbackRate={0.5}
              autoPlay
              muted
              playsInline
              data-component-name="AboutPage"
            />
            <div className="absolute inset-0 bg-black opacity-30" data-component-name="AboutPage"></div>
          </div>
        </section>

        {/* Bio Section */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-r from-gray-50 via-white to-gray-50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div 
                ref={bioRef}
                className={`transform transition-all duration-1000 ${
                  bioInView ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
                }`}
              >
                <BehindTheScenesVideos className="w-full shadow-2xl" />
              </div>
              <div 
                className={`transform transition-all duration-1000 delay-300 ${
                  bioInView ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
                }`}
              >
                <div className="space-y-12">
                  <div className="mb-8">
                    <h2 className="text-4xl font-serif mb-6 text-gray-900">Why I Cry at Weddings (and Why That's a Good Thing)</h2>
                    <div className="prose prose-lg text-gray-700 space-y-6">
                      <p className="text-xl leading-relaxed">
                        I'm Mauricio, and I've shot 300+ weddings over the past 14 years. My dirty little secret? I still get emotional during the first dance. Every. Single. Time.
                      </p>
                      <p className="text-lg leading-relaxed">
                        There's something about watching two people who chose each other, surrounded by everyone they love, that gets me. I just do my job from behind the camera so you don't see the tears.
                      </p>
                      <p className="text-lg leading-relaxed">
                        I started photographing people 14+ years ago—portraits, models, whatever paid the bills. Then a friend asked me to shoot his wedding. That day changed everything. I found what I was meant to do.
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-gray-800 to-gray-400"></div>
                    <div className="pl-6">
                      <h3 className="text-2xl font-serif mb-6 text-gray-800 inline-flex items-center">
                        <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gray-800">
                          What Makes Us Different
                        </span>
                      </h3>
                      <div className="space-y-6 text-lg">
                        <div>
                          <p className="font-semibold text-gray-900 mb-2">❌ We're not the "stand here, smile, look at me" photographers</p>
                          <p className="text-gray-700 font-light leading-relaxed">
                            ✅ We're the "do your thing, we'll capture it beautifully" photographers
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-2">❌ We don't make you feel awkward with forced poses</p>
                          <p className="text-gray-700 font-light leading-relaxed">
                            ✅ We guide you into moments that feel natural
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-2">❌ We're not just vendors showing up to do a job</p>
                          <p className="text-gray-700 font-light leading-relaxed">
                            ✅ We become part of your day (just ask our past couples)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative bg-gray-50 p-8 rounded-lg">
                    <h3 className="text-2xl font-serif mb-6 text-gray-800">My Promise</h3>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      I'll capture the big moments everyone expects AND the small moments no one sees coming. The way your dad's voice cracks during his speech. Your grandma crying happy tears. The look you give each other when you think no one's watching.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed font-semibold">
                      Those moments? They're why I do this.
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-gray-800 to-gray-400"></div>
                    <div className="pl-6">
                      <h3 className="text-2xl font-serif mb-6 text-gray-800 inline-flex items-center">
                        <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gray-800">
                          When I'm Not Behind the Camera
                        </span>
                      </h3>
                      <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        When I'm not shooting weddings, I'm living in Sparta with my family, probably editing photos at 2am because I get too excited about your gallery to sleep.
                      </p>
                      <div className="bg-white p-6 rounded-lg border-l-4 border-gray-800 mt-6">
                        <h4 className="font-semibold text-lg mb-4">Fun Facts:</h4>
                        <ul className="space-y-3 text-gray-700">
                          <li>• Coffee consumed per wedding: Too many</li>
                          <li>• Favorite part of the day: First look reactions</li>
                          <li>• My backup camera has a backup camera (yes, really)</li>
                          <li>• I've photographed weddings at 50+ different venues across NJ, NY, and PA</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section ref={philosophyRef} className="py-24 relative overflow-hidden bg-gradient-to-r from-gray-50 via-white to-gray-50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className={`text-center mb-16 transform transition-all duration-700 ${
                philosophyInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <h2 className="font-serif text-4xl text-gray-800 mb-6 relative inline-block">
                  <span className="relative z-10">My Philosophy</span>
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-800 to-transparent"></span>
                </h2>
                <p className="text-gray-600 font-light leading-relaxed text-lg max-w-3xl mx-auto">
                  I believe that every love story is unique and deserves to be told in its most authentic form. 
                  My approach combines photojournalistic storytelling with fine art portraiture to create 
                  timeless images that will be cherished for generations to come.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-10">
                {[
                  {
                    title: "Authentic",
                    description: "Capturing genuine moments and real emotions",
                    detail: "I capture the raw, unfiltered emotions that tell your unique story - the tears, laughter, and everything in between."
                  },
                  {
                    title: "Artistic",
                    description: "Creating timeless images with a fine art approach",
                    detail: "Each frame is thoughtfully composed with attention to light, color, and composition to create images that are both beautiful and meaningful."
                  },
                  {
                    title: "Personal",
                    description: "Building relationships with every couple",
                    detail: "I take the time to understand your vision and build a relationship that allows me to capture your personality in every image."
                  }
                ].map((pillar, index) => (
                  <div 
                    key={index} 
                    className={`relative group h-auto transform transition-all duration-700 ${
                      visiblePhilosophyPillars.includes(index) 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-20 opacity-0'
                    }`}
                  >
                    <div className="rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-lg bg-white border border-gray-100">
                      <div className="relative">
                        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-gray-800 to-gray-400"></div>
                        <div className="p-8">
                          <h3 className="font-serif text-2xl text-gray-800 mb-4 relative inline-flex items-center">
                            <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gray-800">
                              {pillar.title}
                            </span>
                          </h3>
                          <p className="text-gray-700 font-light mb-6">{pillar.description}</p>
                          <div className="pt-4 border-t border-gray-100">
                            <p className="text-gray-600 font-light leading-relaxed text-sm">
                              {pillar.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={`mt-16 text-center transform transition-all duration-700 delay-500 ${
                philosophyInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <a 
                  href="/#contact-form" 
                  className="inline-block px-8 py-3 border border-gray-800 text-gray-800 rounded-lg font-medium tracking-wide transform transition-all duration-300 hover:bg-gray-800 hover:text-white"
                >
                  Let's Create Something Beautiful Together
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Fun Facts Section - Artistic Design */}
        <section className="py-24 bg-white relative overflow-hidden" ref={funFactsRef}>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          
          <div className="container mx-auto px-4 md:px-8">
            <div className={`transform transition-all duration-1000 ${
              funFactsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h2 className="text-3xl md:text-4xl font-serif text-center mb-16">
                <span className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-[1px] after:bg-gray-800">
                  The Person Behind the Lens
                </span>
              </h2>
              
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="col-span-1 aspect-w-3 aspect-h-4 rounded-lg overflow-hidden shadow-lg transform transition-all duration-500 hover:shadow-xl">
                    <ReversibleVideo 
                      src="/MoStuff/meettheteam/slowmo.mov"
                      className="w-full h-full object-cover"
                      playbackRate={0.5}
                      autoPlay
                      muted
                      playsInline
                      data-component-name="SlowMotionVideo"
                    />
                  </div>
                  
                  <div className="col-span-2 flex flex-col justify-center">
                    <h3 className="text-2xl font-serif mb-10 text-gray-800">
                      <span className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[1px] after:bg-gray-800">
                        Fun Facts
                      </span>
                    </h3>
                    
                    <ul className="space-y-10">
                      <li className="group">
                        <div className="flex items-start">
                          <span className="w-2 h-2 rounded-full bg-gray-800 mt-3 mr-5 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                          <p className="text-gray-700 font-light leading-relaxed text-lg">
                            I'm known to tear up during emotional moments—whether it's a father-daughter first look or a heartfelt first dance. This emotional connection helps me anticipate and capture the raw, authentic feelings that make your wedding photos truly meaningful
                          </p>
                        </div>
                      </li>
                      <li className="group">
                        <div className="flex items-start">
                          <span className="w-2 h-2 rounded-full bg-gray-800 mt-3 mr-5 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                          <p className="text-gray-700 font-light leading-relaxed text-lg">
                            My emergency kit has saved dozens of wedding day moments—from sewing loose buttons to providing stain removers for unexpected spills on white dresses
                          </p>
                        </div>
                      </li>
                      <li className="group">
                        <div className="flex items-start">
                          <span className="w-2 h-2 rounded-full bg-gray-800 mt-3 mr-5 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                          <p className="text-gray-700 font-light leading-relaxed text-lg">
                            I've developed a sixth sense for anticipating emotional moments before they happen—I'm often in position for the perfect shot seconds before anyone realizes a special moment is about to unfold
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section ref={teamRef} className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className={`text-center mb-16 transform transition-all duration-700 ${
              teamInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h2 className="font-serif text-4xl mb-6 relative inline-block">
                <span className="relative z-10">Meet The Team</span>
                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-800 to-transparent"></span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                I work with a talented team of professionals who share my passion for capturing beautiful moments.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-x-8 gap-y-16 max-w-6xl mx-auto">
              {[
                {
                  name: "Jonathan",
                  role: "Principal Photographer",
                  image: "https://res.cloudinary.com/dos0qac90/image/upload/v1761593384/hariel-xavier-photography/MoStuff/meettheteam/Jonathan.jpg",
                  bio: "Jonathan brings over 14 years of experience capturing emotional moments with his unique eye for composition and lighting."
                },
                {
                  name: "Doris",
                  role: "Photographer & Client Experience Manager",
                  image: "https://res.cloudinary.com/dos0qac90/image/upload/v1761593385/hariel-xavier-photography/MoStuff/meettheteam/doris.jpg",
                  bio: "As Mauricio's wife and a devoted mother, Doris brings warmth and intuition to every client interaction. Her artistic eye and attention to detail ensure a seamless experience from first consultation to final delivery, while her photography captures authentic moments with a uniquely personal touch."
                },
                {
                  name: "Chief",
                  role: "Lead Filmmaker",
                  image: "/MoStuff/meettheteam/Chief.JPG",
                  bio: "Chief creates stunning cinematic wedding films that perfectly complement our photography, capturing the emotion and movement of your special day in breathtaking detail."
                }
              ].map((member, index) => (
                <div 
                  key={member.name}
                  className={`text-center group transition-all duration-700 ease-out ${
                    visibleTeamMembers.includes(index) 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-10 opacity-0'
                  }`}
                >
                  <div className="relative mb-6 overflow-hidden rounded-lg aspect-square">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                        member.name === "Jonathan" ? "object-center" : 
                        member.name === "Doris" ? "object-top" : 
                        "object-[center_30%]"
                      }`}
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="font-serif text-2xl mb-1">{member.name}</h3>
                  <p className="text-gray-500 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 font-light">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instagram Feed Section */}
        <section className="py-16 bg-gradient-to-r from-gray-100 via-white to-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl mb-6 relative inline-block">
                <span className="relative z-10">Behind the Scenes</span>
                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-800 to-transparent"></span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Follow our journey and get a glimpse of our creative process
              </p>
            </div>
            <div data-component-name="AboutPage">
              <CuratorSocialFeed feedId="f9d2afdf-f60e-4050-97d7-5b52c7ffaeb3" className="w-full" />
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-gradient-to-r from-gray-50 via-white to-gray-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-4xl mb-6 relative inline-block">
              <span className="relative z-10">Ready to Work Together?</span>
              <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-800 to-transparent"></span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-10">
              I'd love to hear about your vision and how I can help capture your special moments.
            </p>
            <a 
              href="/#contact-form" 
              className="inline-block px-8 py-3 border border-gray-800 text-gray-800 rounded-lg font-medium tracking-wide transform transition-all duration-300 hover:bg-gray-800 hover:text-white"
            >
              Get in Touch
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

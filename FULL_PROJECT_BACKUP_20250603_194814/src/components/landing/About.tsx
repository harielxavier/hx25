import React from 'react';
import { useInView } from 'react-intersection-observer';
import AnimatedCounter from '../AnimatedCounter';

export default function About() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-32 bg-cream">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-16">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?q=80&w=2940"
                alt="Mauricio Fernandez"
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-6 shadow-lg">
                <AnimatedCounter end={11} suffix="+" />
                <p className="text-sm uppercase tracking-wider">Years of Experience</p>
              </div>
            </div>
            <div ref={ref} className="grid grid-cols-2 gap-8">
              <div>
                {inView && <AnimatedCounter end={750} suffix="+" />}
                <p className="text-sm uppercase tracking-wider mt-2">Weddings Captured</p>
              </div>
              <div>
                {inView && <AnimatedCounter end={25} suffix="+" />}
                <p className="text-sm uppercase tracking-wider mt-2">Destinations</p>
              </div>
            </div>
          </div>
          <div className="max-w-xl">
            <h2 className="font-serif text-5xl mb-8">The Artist Behind the Lens</h2>
            <div className="space-y-6 text-gray-700 font-light leading-relaxed">
              <p>
                Originally from Brooklyn, NY, my journey into photography began amidst the energy 
                and diversity of the city that never sleeps. Growing up in such a vibrant place, 
                I learned early on how to find beauty in the small, authentic moments that often 
                go unnoticed in the hustle of daily life.
              </p>
              <p>
                After moving to New Jersey, I built my photography business in Bergen County, 
                inspired by the contrast of urban and suburban life. Now based in the picturesque 
                Sussex County, I get to merge my love for city vibes with the charm of rustic 
                landscapes, giving my clients the best of both worlds.
              </p>
              <p>
                Over the past 11 years, I've had the privilege of photographing over 750 weddings, 
                not just in New York and New Jersey, but across 25+ stunning destinations around the world.
              </p>
              <button className="mt-8 border-2 border-black text-black px-12 py-4 hover:bg-black hover:text-white transition-all duration-300 tracking-widest uppercase text-sm">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
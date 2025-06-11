import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Navigation from '../components/Navigation';
import SEO from '../components/SEO';

export default function WorkPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const categories = [
    'All',
    'Weddings',
    'Engagements',
    'Editorial'
  ];

  const portfolio = [
    {
      category: 'weddings',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552',
      title: 'Central Park Wedding',
      description: 'Sarah & John'
    },
    {
      category: 'engagements',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a',
      title: 'Brooklyn Bridge Engagement',
      description: 'Emma & James'
    },
    {
      category: 'editorial',
      image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf',
      title: 'Bridal Editorial',
      description: 'Modern Romance'
    }
  ];

  const filteredPortfolio = selectedCategory === 'all'
    ? portfolio
    : portfolio.filter(item => item.category === selectedCategory.toLowerCase());

  return (
    <>
      <SEO 
        title="Portfolio | Xavier Photography"
        description="View our wedding, engagement, and editorial photography portfolio."
      />
      <Navigation />
      
      <main id="main-content" className="pt-24">
        {/* Portfolio Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-5xl mb-4">Portfolio</h1>
              <p className="text-gray-600 font-light max-w-2xl mx-auto">
                A curated collection of moments and memories
              </p>
            </div>

            {/* Categories */}
            <div className="flex justify-center gap-8 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category.toLowerCase())}
                  className={`text-sm tracking-wide transition-colors ${
                    selectedCategory === category.toLowerCase()
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Portfolio Grid */}
            <div 
              ref={ref}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPortfolio.map((item, index) => (
                <div
                  key={index}
                  className={`group cursor-pointer transform transition-all duration-700 ${
                    inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-center text-white">
                        <h3 className="text-2xl mb-2">{item.title}</h3>
                        <p className="font-light">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
import React from 'react';

interface Testimonial {
  id: string;
  quote: string;
  client: string;
  location: string;
  image: string;
}

const ClientExperienceJourney: React.FC = () => {
  // Sample testimonials - replace with actual testimonials
  const testimonials: Testimonial[] = [
    {
      id: '1',
      quote: "Working with Hariel was the highlight of our wedding planning process. The way he captured not just the moments, but the emotions behind them, was truly extraordinary. Our album feels like a fine art publication.",
      client: "Alexandra & James",
      location: "Villa Cimbrone, Italy",
      image: "https://source.unsplash.com/random/400x400/?wedding,couple"
    },
    {
      id: '2',
      quote: "The level of service and attention to detail was unparalleled. From our first consultation to the delivery of our heirloom album, every interaction felt personal and luxurious. The images themselves are beyond what we could have imagined.",
      client: "Olivia & William",
      location: "Château de Versailles, France",
      image: "https://source.unsplash.com/random/400x400/?wedding,elegant"
    },
    {
      id: '3',
      quote: "Hariel has an extraordinary ability to see and capture the intimate moments that tell the true story of your day. Our friends and family were moved to tears when they saw how he had documented our celebration.",
      client: "Emma & Michael",
      location: "The Plaza, New York",
      image: "https://source.unsplash.com/random/400x400/?wedding,luxury"
    }
  ];
  
  return (
    <section className="client-experience-journey py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl mb-4">The Client Experience</h2>
          <p className="font-body text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            An exclusive journey designed for couples who value artistry and emotional storytelling.
          </p>
        </header>
        
        {/* 3-panel layout with premium spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-panel bg-white dark:bg-gray-900 shadow-xl p-8 md:p-10 rounded-sm">
              {/* Client portrait */}
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.client} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Quote */}
              <blockquote className="mb-6">
                <p className="font-body text-gray-700 dark:text-gray-300 italic leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                
                {/* Client details */}
                <footer>
                  <cite className="not-italic">
                    <span className="font-display text-lg block">{testimonial.client}</span>
                    <span className="font-body text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</span>
                  </cite>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientExperienceJourney;

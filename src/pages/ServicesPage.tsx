import React from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Heart, Camera, Plane, Check } from 'lucide-react';
import Navigation from '../components/landing/Navigation';
import SEO from '../components/SEO';

export default function ServicesPage() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const services = [
    {
      title: "Wedding Photography",
      description: "Full day coverage capturing every precious moment of your special day.",
      price: "Starting at $3,500",
      features: [
        "8 Hours of Coverage",
        "Second Photographer",
        "High-Resolution Images",
        "Online Gallery",
        "Engagement Session",
        "Wedding Day Timeline",
      ],
      image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92"
    },
    {
      title: "Engagement Sessions",
      description: "Celebrate your love story with a personalized engagement shoot.",
      price: "Starting at $800",
      features: [
        "2 Hours of Coverage",
        "Multiple Locations",
        "Outfit Changes",
        "High-Resolution Images",
        "Online Gallery",
        "Location Planning",
      ],
      image: "https://images.unsplash.com/photo-1583939411023-14783179e581"
    },
    {
      title: "Destination Weddings",
      description: "Capturing your love story anywhere in the world.",
      price: "Custom Packages",
      features: [
        "Multi-Day Coverage",
        "Travel Included",
        "Welcome Dinner Coverage",
        "High-Resolution Images",
        "Online Gallery",
        "Custom Timeline",
      ],
      image: "https://images.unsplash.com/photo-1583939411023-14783179e581"
    }
  ];

  return (
    <>
      <SEO 
        title="Wedding Photography Services | Hariel Xavier Photography"
        description="Professional wedding photography services in NYC & NJ. Packages starting from $3,500."
      />
      <Navigation />
      
      <main id="main-content" className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92"
              alt="Wedding couple"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>
          <div className="relative text-center text-white">
            <h1 className="font-serif text-6xl mb-4">Services & Investment</h1>
            <p className="text-xl font-light max-w-2xl mx-auto">
              Tailored photography packages to capture your perfect day
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-cream">
          <div className="container mx-auto px-4">
            <div ref={ref} className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className={`bg-white p-8 shadow-lg transform transition-all duration-700 ${
                    inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-64 object-cover mb-6"
                  />
                  <h3 className="font-serif text-2xl mb-2">{service.title}</h3>
                  <p className="text-primary text-xl mb-4">{service.price}</p>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-primary text-white px-6 py-3 hover:bg-black transition-colors group">
                    Book Now
                    <ArrowRight className="inline-block ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-serif text-4xl text-center mb-12">Common Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "How many photos will I receive?",
                  a: "For a full wedding day, you can expect to receive 500-800 carefully edited images."
                },
                {
                  q: "When will I receive my photos?",
                  a: "You'll receive a sneak peek within 48 hours and your full gallery within 6-8 weeks."
                },
                {
                  q: "Do you have backup equipment?",
                  a: "Yes, I always bring multiple professional cameras, lenses, and lighting equipment."
                },
                {
                  q: "Can I purchase additional hours?",
                  a: "Yes, additional coverage can be added at $500/hour."
                }
              ].map((item, index) => (
                <div key={index} className="bg-cream p-6">
                  <h3 className="font-serif text-xl mb-2">{item.q}</h3>
                  <p className="text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-primary text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-4xl mb-6">Ready to Create Something Beautiful?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Let's discuss how we can capture your special day in its most authentic form.
            </p>
            <button className="bg-white text-primary px-12 py-4 hover:bg-black hover:text-white transition-colors">
              Schedule a Consultation
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
import React, { useState } from 'react';
import { ArrowRight, Heart, Camera, Plane, Check } from 'lucide-react';

interface Package {
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  popular?: boolean;
}

export default function Services() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const packages: Package[] = [
    {
      name: "Wedding Collection",
      price: "Starting at $3,500",
      description: "Full day coverage of your special day, from getting ready to the last dance.",
      icon: Heart,
      features: [
        "8 Hours of Coverage",
        "Second Photographer",
        "High-Resolution Images",
        "Online Gallery",
        "Engagement Session",
        "Wedding Day Timeline",
      ],
      popular: true
    },
    {
      name: "Engagement Session",
      price: "Starting at $800",
      description: "Capture the excitement of your engagement in a location that tells your story.",
      icon: Camera,
      features: [
        "2 Hours of Coverage",
        "Multiple Locations",
        "Outfit Changes",
        "High-Resolution Images",
        "Online Gallery",
        "Location Planning",
      ]
    },
    {
      name: "Destination Wedding",
      price: "Custom Package",
      description: "Destination wedding coverage anywhere in the world, creating memories that last forever.",
      icon: Plane,
      features: [
        "Multi-Day Coverage",
        "Travel Included",
        "Welcome Dinner Coverage",
        "High-Resolution Images",
        "Online Gallery",
        "Custom Timeline",
      ]
    }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-primary uppercase tracking-[0.2em] mb-4">Investment</p>
          <h2 className="font-serif text-5xl mb-6">Services & Collections</h2>
          <p className="text-gray-600 font-light leading-relaxed">
            Every love story deserves to be told beautifully. Choose the perfect package
            to capture your special moments in their most authentic form.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            const isSelected = selectedPackage === pkg.name;
            
            return (
              <div 
                key={pkg.name}
                className={`relative p-8 transition-all duration-500 cursor-pointer
                  ${isSelected ? 'bg-primary text-white' : 'bg-white hover:shadow-xl'}
                  ${pkg.popular ? 'border-2 border-primary' : 'border border-gray-200'}`}
                onClick={() => setSelectedPackage(pkg.name)}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 text-xs uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`inline-block p-4 rounded-full mb-6 transition-colors
                  ${isSelected ? 'bg-white' : 'bg-gray-50'}`}>
                  <Icon className={`w-8 h-8 ${isSelected ? 'text-primary' : 'text-primary'}`} />
                </div>

                <h3 className="font-serif text-2xl mb-2">{pkg.name}</h3>
                <p className={`text-xl font-light mb-4 ${isSelected ? 'text-white' : 'text-primary'}`}>
                  {pkg.price}
                </p>
                <p className={`font-light mb-8 ${isSelected ? 'text-white/80' : 'text-gray-600'}`}>
                  {pkg.description}
                </p>

                <div className="space-y-4 mb-8">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-primary'}`} />
                      <span className={`font-light ${isSelected ? 'text-white/80' : 'text-gray-600'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => onSelect(pkg)}
                  className={`w-full py-4 rounded-full transition-all ${
                    isPopular 
                      ? 'bg-primary text-white hover:bg-primary-dark' 
                      : 'bg-primary/5 text-primary hover:bg-primary hover:text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Book Consultation
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 font-light mb-8">
            All packages include complimentary engagement session and high-resolution digital files.
            <br />Custom packages available upon request.
          </p>
          <button className="w-full py-4 bg-rose text-white rounded-full hover:bg-rose-dark transition-colors">
            View Full Pricing Guide
          </button>
        </div>
      </div>
    </section>
  );
}
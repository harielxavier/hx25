import React, { useState } from 'react';
import { Heart, MapPin, Clock, Camera, Star, Sparkles, Calendar, DollarSign } from 'lucide-react';

interface ElopementPackage {
  id: string;
  name: string;
  price: number;
  monthlyPrice: number;
  duration: string;
  images: number;
  features: string[];
  popular?: boolean;
  description: string;
  idealFor: string[];
}

const elopementPackages: ElopementPackage[] = [
  {
    id: 'intimate',
    name: 'The Intimate',
    price: 1595,
    monthlyPrice: 133,
    duration: '3 hours',
    images: 200,
    description: 'Perfect for intimate ceremonies with close family',
    idealFor: ['City hall weddings', 'Backyard ceremonies', 'Small venues'],
    features: [
      '3 hours of coverage',
      '200 professionally edited images',
      'Online gallery (6 months)',
      '10 sneak peeks within 24 hours',
      'Travel within 25 miles included',
      'Personal consultation',
      'Timeline planning assistance'
    ]
  },
  {
    id: 'adventure',
    name: 'The Adventure',
    price: 2195,
    monthlyPrice: 183,
    duration: '4 hours',
    images: 300,
    popular: true,
    description: 'Our most popular package for adventurous couples',
    idealFor: ['Beach elopements', 'Mountain ceremonies', 'Destination spots'],
    features: [
      '4 hours of coverage',
      '300 professionally edited images',
      'Online gallery (1 year)',
      '15 sneak peeks within 12 hours',
      'Travel within 50 miles included',
      'Location scouting assistance',
      'Permit coordination help',
      'Personal consultation',
      'Timeline planning assistance',
      'Emergency weather backup plan'
    ]
  },
  {
    id: 'escape',
    name: 'The Escape',
    price: 2895,
    monthlyPrice: 241,
    duration: '6 hours',
    images: 400,
    description: 'Complete elopement experience with celebration coverage',
    idealFor: ['Weekend getaways', 'Destination elopements', 'Multi-location shoots'],
    features: [
      '6 hours of coverage (ceremony + celebration)',
      '400 professionally edited images',
      'Lifetime gallery hosting',
      '20 sneak peeks within 6 hours',
      'Travel within 100 miles included',
      'Mini engagement session (1 hour)',
      'Location scouting assistance',
      'Permit coordination help',
      'Personal consultation',
      'Timeline planning assistance',
      'Emergency weather backup plan',
      'Vendor recommendations',
      'Day-of coordination support'
    ]
  }
];

interface ElopementPackagesProps {
  onPackageSelect?: (packageId: string) => void;
  showBookingButton?: boolean;
}

export default function ElopementPackages({ onPackageSelect, showBookingButton = true }: ElopementPackagesProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    onPackageSelect?.(packageId);
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-rose-100 to-pink-100 rounded-full px-6 py-3 mb-6">
            <Heart className="w-5 h-5 mr-2 text-rose-500" />
            <span className="text-rose-700 font-medium">Intimate & Elegant</span>
            <Sparkles className="w-5 h-5 ml-2 text-rose-500" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            Elopement Photography
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your love story deserves to be captured beautifully, whether it's just the two of you 
            or a small gathering of your closest loved ones.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Available 7 days a week
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Last-minute bookings welcome
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Travel throughout New Jersey & beyond
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {elopementPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                selectedPackage === pkg.id 
                  ? 'border-rose-500 ring-4 ring-rose-200' 
                  : 'border-gray-200 hover:border-rose-300'
              } ${pkg.popular ? 'ring-2 ring-yellow-400' : ''}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      ${pkg.price.toLocaleString()}
                    </div>
                    <div className="text-lg text-gray-600">
                      or ${pkg.monthlyPrice}/month
                    </div>
                  </div>

                  <div className="flex justify-center items-center space-x-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {pkg.duration}
                    </div>
                    <div className="flex items-center">
                      <Camera className="w-4 h-4 mr-1" />
                      {pkg.images} images
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-gray-900">What's Included:</h4>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">Perfect For:</h4>
                  <div className="flex flex-wrap gap-2">
                    {pkg.idealFor.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {showBookingButton && (
                  <div className="space-y-3">
                    <button
                      onClick={() => handlePackageSelect(pkg.id)}
                      className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        pkg.popular
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-lg'
                          : selectedPackage === pkg.id
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
                    </button>
                    
                    <button className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors">
                      Learn More
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Not Sure Which Package is Right for You?
            </h3>
            <p className="text-gray-600 mb-6">
              Let's chat about your vision and find the perfect package for your special day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg">
                Schedule Consultation
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors">
                View Portfolio
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-rose-500" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Intimate & Personal</h4>
            <p className="text-gray-600 text-sm">
              Focus on your love story without the stress and drama of a large wedding.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Budget-Friendly</h4>
            <p className="text-gray-600 text-sm">
              Luxury photography without the luxury wedding budget. More money for your honeymoon!
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Flexible Scheduling</h4>
            <p className="text-gray-600 text-sm">
              Available 7 days a week with last-minute bookings welcome. Your timeline, your way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Clock, Camera, MapPin, Users } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  basePrice: number;
  hours: number;
  includes: string[];
}

interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface PricingCalculatorProps {
  packages: Package[];
  addOns: AddOn[];
  onPriceChange: (total: number) => void;
}

export default function PricingCalculator({ packages, addOns, onPriceChange }: PricingCalculatorProps) {
  const [selectedPackage, setSelectedPackage] = React.useState<string>('');
  const [selectedAddOns, setSelectedAddOns] = React.useState<string[]>([]);

  const calculateTotal = () => {
    const packagePrice = packages.find(p => p.id === selectedPackage)?.basePrice || 0;
    const addOnsTotal = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find(a => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
    return packagePrice + addOnsTotal;
  };

  React.useEffect(() => {
    onPriceChange(calculateTotal());
  }, [selectedPackage, selectedAddOns]);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Select Your Package</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`p-6 border rounded-lg text-left transition-all
                ${selectedPackage === pkg.id 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-200 hover:border-black'}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-medium">{pkg.name}</h4>
                  <p className="text-sm opacity-80">${pkg.basePrice}</p>
                </div>
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-2 text-sm">
                {pkg.includes.map((item, index) => (
                  <p key={index} className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    {item}
                  </p>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Additional Services</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {addOns.map((addOn) => (
            <label
              key={addOn.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all
                ${selectedAddOns.includes(addOn.id)
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 hover:border-black'}`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedAddOns.includes(addOn.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedAddOns([...selectedAddOns, addOn.id]);
                  } else {
                    setSelectedAddOns(selectedAddOns.filter(id => id !== addOn.id));
                  }
                }}
              />
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{addOn.name}</h4>
                  <p className="text-sm opacity-80">${addOn.price}</p>
                </div>
                <div className="w-5 h-5 border rounded-full flex items-center justify-center">
                  {selectedAddOns.includes(addOn.id) && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-sm mt-2">{addOn.description}</p>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between text-xl">
          <span className="font-medium">Total Investment</span>
          <span className="font-medium">${calculateTotal().toLocaleString()}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          * Travel fees may apply for locations outside of our service area
        </p>
      </div>
    </div>
  );
}
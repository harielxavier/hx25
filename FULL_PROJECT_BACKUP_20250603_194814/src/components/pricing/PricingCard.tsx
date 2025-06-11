import React from 'react';
import { Check, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface Package {
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
}

interface PricingCardProps {
  package: Package;
  isPopular?: boolean;
  addVideo?: boolean;
  setAddVideo: (value: boolean) => void;
  onSelect: (pkg: Package) => void;
  className?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  package: pkg,
  isPopular,
  addVideo,
  setAddVideo,
  onSelect,
  className = ''
}) => {
  const handleSelectPackage = () => {
    onSelect(pkg);
  };

  return (
    <motion.div 
      className={`bg-white p-8 border ${isPopular ? 'border-black' : 'border-gray-200'} relative ${className}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-black text-white py-1 px-4 text-sm">
          Most Popular
        </div>
      )}
      <h3 className="font-serif text-2xl mb-2">{pkg.name}</h3>
      <div className="flex items-baseline mb-6">
        <span className="text-4xl font-light">${pkg.price}</span>
        {addVideo && <span className="ml-2 text-sm text-gray-500">+$995 with video</span>}
      </div>
      
      <div className="space-y-4 mb-8">
        {pkg.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center mt-0.5">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span>{feature}</span>
          </div>
        ))}
      </div>
      
      <div className="mb-8">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={addVideo} 
            onChange={() => setAddVideo(!addVideo)}
            className="w-4 h-4"
          />
          <span className="flex items-center gap-1">
            <Plus className="w-4 h-4" />
            <span>Add Videography ($995)</span>
          </span>
        </label>
      </div>
      
      <button
        onClick={handleSelectPackage}
        className={`w-full py-3 ${
          isPopular ? 'bg-black text-white' : 'bg-gray-100 text-black'
        } hover:bg-black hover:text-white transition-colors`}
      >
        Select Package
      </button>
    </motion.div>
  );
};

export default PricingCard;

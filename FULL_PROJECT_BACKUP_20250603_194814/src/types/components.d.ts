declare module '../components/BookingModal' {
  import React from 'react';
  
  interface Package {
    name: string;
    price: string;
    features: string[];
    popular?: boolean;
  }
  
  interface BookingModalProps {
    package: Package;
    onClose: () => void;
  }
  
  const BookingModal: React.FC<BookingModalProps>;
  export default BookingModal;
}

declare module '../components/pricing/PricingCard' {
  import React from 'react';
  
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
  
  const PricingCard: React.FC<PricingCardProps>;
  export default PricingCard;
}

declare module '../components/pricing/AddOnCard' {
  import React from 'react';
  
  interface AddOn {
    name: string;
    items: {
      title: string;
      price: string;
      note?: string;
    }[];
  }
  
  interface AddOnCardProps {
    section: AddOn;
  }
  
  const AddOnCard: React.FC<AddOnCardProps>;
  export default AddOnCard;
}

declare module '../components/wedding/WeddingAvailabilityChecker' {
  import React from 'react';
  
  const WeddingAvailabilityChecker: React.FC;
  export default WeddingAvailabilityChecker;
}

declare module '../components/Navigation' {
  import React from 'react';
  
  const Navigation: React.FC;
  export default Navigation;
}

declare module '../components/SEO' {
  import React from 'react';
  
  interface SEOProps {
    title: string;
    description: string;
  }
  
  const SEO: React.FC<SEOProps>;
  export default SEO;
}

declare module 'react-calendar' {
  import React from 'react';
  
  interface CalendarProps {
    onChange: (date: Date) => void;
    value: Date | null;
    tileClassName: (args: { date: Date; view: string }) => string | null;
    minDate?: Date;
    maxDate?: Date;
    onActiveStartDateChange?: (args: { activeStartDate: Date }) => void;
  }
  
  const Calendar: React.FC<CalendarProps>;
  export default Calendar;
}

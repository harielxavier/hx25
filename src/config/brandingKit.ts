// src/config/brandingKit.ts

export interface BrandingConfig {
  colors: {
    primary: string;        // Main brand color (e.g., for buttons, highlights)
    secondary: string;      // Secondary brand color (e.g., for accents)
    accent: string;         // Accent color (e.g., for special highlights, CTAs)
    textDark: string;       // Dark text color (e.g., for body copy on light backgrounds)
    textLight: string;      // Light text color (e.g., for body copy on dark backgrounds)
    backgroundLight: string;// Light background color
    backgroundDark: string; // Dark background color
    neutralLight: string;   // Light neutral (e.g., borders, dividers)
    neutralDark: string;    // Dark neutral
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    primary: string;        // Main font family (e.g., for headings)
    secondary: string;      // Secondary font family (e.g., for body text)
  };
  logo: {
    default: string;        // Path to default logo (e.g., SVG or PNG)
    light?: string;         // Path to logo version for dark backgrounds
    dark?: string;          // Path to logo version for light backgrounds
    favicon: string;        // Path to favicon
  };
  companyName: string;
  tagline?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    pinterest?: string;
    // Add other platforms as needed
  };
}

// --- HARIEL XAVIER PHOTOGRAPHY BRANDING KIT ---
// This is a starting point. Please review and adjust these values to perfectly match your brand.

export const harielXavierBranding: BrandingConfig = {
  colors: {
    primary: '#6A0DAD',       // Deep Purple (inspired by the Super Deal page gradient)
    secondary: '#FF69B4',     // Hot Pink (inspired by the Super Deal page gradient)
    accent: '#FFD700',        // Gold/Yellow (for highlights, CTAs like the Gift icon)
    
    textDark: '#2D3748',      // Charcoal Gray (for readability) - Tailwind gray-800
    textLight: '#F7FAFC',     // Off-White (for readability on dark backgrounds) - Tailwind gray-100
    
    backgroundLight: '#FFFFFF',// White
    backgroundDark: '#1A202C', // Very Dark Gray/Almost Black - Tailwind gray-900
    
    neutralLight: '#E2E8F0',  // Light Gray - Tailwind gray-300
    neutralDark: '#4A5568',   // Medium Gray - Tailwind gray-600

    success: '#38A169',       // Green - Tailwind green-600
    warning: '#DD6B20',       // Orange - Tailwind orange-600
    error: '#E53E3E',         // Red - Tailwind red-600
  },
  fonts: {
    // Placeholder fonts - replace with your actual brand fonts
    // Ensure these fonts are loaded in your project (e.g., via Google Fonts or local files)
    primary: '"Montserrat", sans-serif', // Example: A modern, elegant sans-serif for headings
    secondary: '"Lato", sans-serif',     // Example: A clean, readable sans-serif for body text
  },
  logo: {
    // Using actual logo files in the /public directory
    default: '/black.png', // Main logo PNG
    light: '/black.png',   // Using same logo for dark backgrounds
    dark: '/black.png',    // Using same logo for light backgrounds
    svg: '/logo.svg',      // SVG version of the logo
    favicon: '/favicon.ico', // Standard favicon path
  },
  companyName: 'Hariel Xavier Photography',
  tagline: 'Capturing Timeless Love Stories', // From your main landing page
  socialMedia: {
    // Add your actual social media URLs
    instagram: 'https://instagram.com/harielxavierphoto', // Example
    facebook: 'https://facebook.com/harielxavierphoto',   // Example
  }
};

// Function to easily access branding (optional, but can be useful)
export const useBranding = (): BrandingConfig => {
  return harielXavierBranding;
};

export default harielXavierBranding;

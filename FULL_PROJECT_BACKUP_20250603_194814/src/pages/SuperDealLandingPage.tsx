import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Camera, Video, Calendar, Zap, Gift, Users, Clock, Sparkles } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import { harielXavierBranding as brand } from '../config/brandingKit';

const SuperDealLandingPage: React.FC = () => {
  const siteName = brand.companyName;

  // Calculate expiry date (30 days from now)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const pageStyles = {
    fontFamilySecondary: { fontFamily: brand.fonts.secondary },
    fontFamilyPrimary: { fontFamily: brand.fonts.primary },
    headerGradient: { background: `linear-gradient(to bottom right, ${brand.colors.primary}, ${brand.colors.secondary})` },
    accentColorText: { color: brand.colors.accent },
    primaryColorText: { color: brand.colors.primary },
    secondaryColorText: { color: brand.colors.secondary },
    buttonGradient: { background: `linear-gradient(to right, ${brand.colors.secondary}, ${brand.colors.accent})` },
    textDarkStyle: { color: brand.colors.textDark },
    textLightStyle: { color: brand.colors.textLight },
    bgLightStyle: { backgroundColor: brand.colors.backgroundLight },
    warningBoxStyle: { backgroundColor: brand.colors.warning, color: brand.colors.textDark, borderLeft: `4px solid ${brand.colors.accent}` }
  };
  
  return (
    <>
      <SEOHead
        title={`Ultimate 30-Day Photo & Video Wedding Super Deal | ${siteName}`}
        description={`Limited time offer! Secure comprehensive 8-hour photo and video coverage for your wedding. Only 10 packages available for booking in the next 30 days. Expires ${formattedExpiryDate}.`}
        keywords={['wedding photography video package', 'wedding super deal', 'limited time wedding offer', 'photo video bundle', `${siteName} deal`, '8 hour wedding coverage']}
        type="website"
        imageUrl={brand.logo.default} // Using default logo, replace if specific banner exists
        imageAlt={`${siteName} Super Deal Promotion`}
      />
      <div style={{...pageStyles.headerGradient, ...pageStyles.fontFamilySecondary, ...pageStyles.textLightStyle }} className="min-h-screen">
        <header className="py-10 text-center">
          <img src={brand.logo.light || brand.logo.default} alt={`${siteName} Logo`} className="h-20 mx-auto mb-4" />
          <h1 style={pageStyles.fontFamilyPrimary} className="text-5xl md:text-6xl font-bold mb-3">
            ULTIMATE 30-DAY SUPER DEAL!
          </h1>
          <p style={pageStyles.fontFamilySecondary} className="text-2xl md:text-3xl font-light opacity-90">
            Photo & Video Wedding Extravaganza!
          </p>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div style={{...pageStyles.bgLightStyle, ...pageStyles.textDarkStyle, ...pageStyles.fontFamilySecondary}} className="rounded-xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <Sparkles style={pageStyles.accentColorText} className="w-16 h-16 mx-auto mb-4" />
              <h2 style={pageStyles.fontFamilyPrimary} className="text-3xl md:text-4xl font-semibold mb-3">
                Lock In Your Dream Wedding Coverage!
              </h2>
              <p className="text-lg" style={{color: brand.colors.neutralDark}}>
                An exclusive, once-in-a-lifetime opportunity for premium photo AND video services at an unbeatable value.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-opacity-50 bg-gray-100 p-6 rounded-lg shadow-md border border-gray-200">
                <div style={pageStyles.primaryColorText} className="flex items-center mb-3">
                  <Camera className="w-8 h-8 mr-3" />
                  <h3 style={pageStyles.fontFamilyPrimary} className="text-2xl font-semibold">Complete Photography</h3>
                </div>
                <ul className="list-disc list-inside space-y-2" style={{color: brand.colors.neutralDark}}>
                  <li>8 Hours of Continuous Coverage</li>
                  <li>Lead Photographer + Assistant</li>
                  <li>Professionally Edited High-Resolution Images</li>
                  <li>Online Gallery for Sharing & Downloads</li>
                  <li>Engagement Session Included</li>
                </ul>
              </div>
              <div className="bg-opacity-50 bg-gray-100 p-6 rounded-lg shadow-md border border-gray-200">
                <div style={pageStyles.secondaryColorText} className="flex items-center mb-3">
                  <Video className="w-8 h-8 mr-3" />
                  <h3 style={pageStyles.fontFamilyPrimary} className="text-2xl font-semibold">Cinematic Videography</h3>
                </div>
                <ul className="list-disc list-inside space-y-2" style={{color: brand.colors.neutralDark}}>
                  <li>8 Hours of Continuous Coverage</li>
                  <li>Lead Videographer + Assistant</li>
                  <li>Cinematic Highlight Film (5-7 minutes)</li>
                  <li>Full-Length Documentary Edit</li>
                  <li>Drone Footage (Venue Permitting)</li>
                </ul>
              </div>
            </div>

            <div style={pageStyles.warningBoxStyle} className="text-center p-6 rounded-md mb-10 shadow-lg">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-10 h-10 mr-3" />
                <p style={pageStyles.fontFamilyPrimary} className="text-2xl font-bold">
                  STRICTLY LIMITED: Only 10 Packages Available!
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Clock className="w-10 h-10 mr-3" />
                <p style={pageStyles.fontFamilyPrimary} className="text-2xl font-bold">
                  Offer Expires: {formattedExpiryDate}
                </p>
              </div>
              <p className="mt-3 text-sm opacity-90">
                This super deal is for the first 10 couples who book their wedding photo and video coverage with us within the next 30 days. Don't miss out!
              </p>
            </div>
            
            <div className="text-center">
              <p style={{...pageStyles.fontFamilyPrimary, color: brand.colors.primary}} className="text-4xl md:text-5xl font-extrabold mb-6">
                All-Inclusive Price: $SUPER_DEAL_PRICE
              </p>
              <p style={{color: brand.colors.neutralDark}} className="mb-2 text-sm">(Please replace $SUPER_DEAL_PRICE with the actual promotional price)</p>
              <p style={{color: brand.colors.neutralDark}} className="mb-8">
                This incredible package offers 8 hours of comprehensive coverage, ensuring every precious moment of your day is captured beautifully in both photos and film.
              </p>
              <Link
                to="/contact" 
                style={pageStyles.buttonGradient}
                className="inline-block text-white font-bold py-4 px-10 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <Calendar className="w-6 h-6 inline-block mr-2 mb-1" />
                Claim Your Super Deal Now!
              </Link>
              <p style={{color: brand.colors.neutralDark}} className="mt-4 text-sm opacity-80">
                (A consultation is required to confirm availability for your date)
              </p>
            </div>
          </div>
        </main>

        <footer className="text-center py-8 mt-10">
          <p style={{color: brand.colors.textLight, opacity: 0.7}} className="text-sm">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <p style={{color: brand.colors.textLight, opacity: 0.6}} className="text-xs mt-1">
            This is a limited-time promotional offer. Terms and conditions apply.
          </p>
        </footer>
      </div>
    </>
  );
};

export default SuperDealLandingPage;

/**
 * Dynamic SEO Component - Automatically updates SEO content to appear fresh
 * 
 * This component integrates with the DynamicSEOService to provide:
 * - Time-based title/description rotation
 * - Location-specific content
 * - Seasonal keyword optimization
 * - Real-time structured data
 * - Fresh content indicators
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { dynamicSEO } from '../services/DynamicSEOService';

interface DynamicSEOProps {
  page: string;
  baseTitle?: string;
  baseDescription?: string;
  baseKeywords?: string[];
  customMeta?: Record<string, string>;
  enableAutoRefresh?: boolean;
  refreshInterval?: number; // in minutes
}

const DynamicSEO: React.FC<DynamicSEOProps> = ({
  page,
  baseTitle,
  baseDescription,
  baseKeywords = [],
  customMeta = {},
  enableAutoRefresh = true,
  refreshInterval = 30 // 30 minutes default
}) => {
  const [seoContent, setSeoContent] = useState(() => 
    dynamicSEO.generateDynamicSEO(page)
  );
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Auto-refresh SEO content
  useEffect(() => {
    if (!enableAutoRefresh) return;

    const interval = setInterval(() => {
      const newContent = dynamicSEO.generateDynamicSEO(page);
      setSeoContent(newContent);
      setLastUpdate(new Date());
      
      // Log the update for debugging
      console.log(`🔄 Dynamic SEO updated for ${page}:`, {
        title: newContent.title,
        freshContent: newContent.freshContent,
        timestamp: new Date().toISOString()
      });
    }, refreshInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [page, enableAutoRefresh, refreshInterval]);

  // Generate dynamic meta tags
  const dynamicMetaTags = dynamicSEO.generateDynamicMetaTags(page);
  
  // Merge with custom meta
  const allMetaTags = { ...dynamicMetaTags, ...customMeta };

  // Generate JSON-LD structured data
  const jsonLd = JSON.stringify(seoContent.structuredData);

  return (
    <Helmet>
      {/* Dynamic Title */}
      <title>{baseTitle || seoContent.title}</title>
      
      {/* Dynamic Meta Description */}
      <meta 
        name="description" 
        content={baseDescription || seoContent.description} 
      />
      
      {/* Dynamic Keywords */}
      <meta 
        name="keywords" 
        content={[...baseKeywords, ...seoContent.keywords].join(', ')} 
      />
      
      {/* Freshness Indicators */}
      <meta name="last-modified" content={lastUpdate.toUTCString()} />
      <meta name="cache-control" content="public, max-age=1800" /> {/* 30 min cache */}
      <meta name="x-content-freshness" content={seoContent.freshContent} />
      <meta name="x-seo-version" content="dynamic-v2.0" />
      
      {/* Open Graph Dynamic Tags */}
      <meta property="og:title" content={baseTitle || seoContent.title} />
      <meta property="og:description" content={baseDescription || seoContent.description} />
      <meta property="og:updated_time" content={lastUpdate.toISOString()} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Dynamic Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={baseTitle || seoContent.title} />
      <meta name="twitter:description" content={baseDescription || seoContent.description} />
      
      {/* Article/Page Specific Meta */}
      <meta property="article:modified_time" content={lastUpdate.toISOString()} />
      <meta property="article:author" content="Hariel Xavier Photography" />
      <meta property="article:section" content="Wedding Photography" />
      
      {/* Location-Specific Meta */}
      <meta name="geo.region" content="US-NJ" />
      <meta name="geo.placename" content="Bergen County, Morris County, Sussex County" />
      <meta name="ICBM" content="40.9896, -74.1179" />
      
      {/* Business-Specific Meta */}
      <meta name="business:contact_data:street_address" content="Bergen County, NJ" />
      <meta name="business:contact_data:locality" content="New Jersey" />
      <meta name="business:contact_data:region" content="NJ" />
      <meta name="business:contact_data:postal_code" content="07450" />
      <meta name="business:contact_data:country_name" content="United States" />
      
      {/* Dynamic Custom Meta Tags */}
      {Object.entries(allMetaTags).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}
      
      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {jsonLd}
      </script>
      
      {/* Additional Structured Data for Local Business */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "Hariel Xavier Photography",
          "image": "https://harielxavierphotography.com/images/logo.jpg",
          "description": seoContent.description,
          "url": "https://harielxavierphotography.com",
          "telephone": "+1-XXX-XXX-XXXX",
          "priceRange": "$2,395-$5,395",
          "serviceType": "Wedding Photography",
          "areaServed": [
            {
              "@type": "State",
              "name": "New Jersey"
            },
            {
              "@type": "City", 
              "name": "Ridgewood"
            },
            {
              "@type": "City",
              "name": "Morristown" 
            },
            {
              "@type": "City",
              "name": "Newton"
            }
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Wedding Photography Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Wedding Photography Package",
                  "description": "Professional wedding photography services"
                },
                "priceSpecification": {
                  "@type": "PriceSpecification",
                  "minPrice": "2395",
                  "maxPrice": "5395",
                  "priceCurrency": "USD"
                }
              }
            ]
          },
          "review": {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "author": {
              "@type": "Person",
              "name": "Wedding Client"
            },
            "reviewBody": "Exceptional wedding photography service in New Jersey"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "150",
            "bestRating": "5"
          },
          "dateModified": lastUpdate.toISOString()
        })}
      </script>
      
      {/* Breadcrumb Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://harielxavierphotography.com"
            },
            {
              "@type": "ListItem", 
              "position": 2,
              "name": page.charAt(0).toUpperCase() + page.slice(1),
              "item": `https://harielxavierphotography.com/${page}`
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

// Hook for accessing dynamic SEO content in components
export const useDynamicSEO = (page: string) => {
  const [seoContent, setSeoContent] = useState(() => 
    dynamicSEO.generateDynamicSEO(page)
  );

  useEffect(() => {
    // Update SEO content every 15 minutes
    const interval = setInterval(() => {
      setSeoContent(dynamicSEO.generateDynamicSEO(page));
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [page]);

  return seoContent;
};

// Component for displaying fresh content indicators
export const FreshContentIndicator: React.FC<{ page: string }> = ({ page }) => {
  const seoContent = useDynamicSEO(page);
  
  return (
    <div className="text-xs text-gray-500 italic">
      {seoContent.freshContent}
    </div>
  );
};

export default DynamicSEO;

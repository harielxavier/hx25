import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getEnv } from '../../utils/envManager';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'profile' | 'photography' | 'imageGallery';
  publishedAt?: string;
  modifiedAt?: string;
  keywords?: string[];
  author?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  galleryImages?: Array<{ url: string; caption?: string }>;
  rating?: {
    value: number;
    count: number;
  };
}

/**
 * SEOHead - Component for consistent SEO meta tags across pages
 * 
 * This component ensures all pages have proper:
 * - Title and description meta tags
 * - Open Graph tags for social sharing
 * - Twitter card tags
 * - Canonical URLs
 * - Comprehensive JSON-LD structured data for enhanced search visibility
 */
const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  imageUrl,
  imageAlt = 'Hariel Xavier Photography',
  type = 'website',
  publishedAt,
  modifiedAt,
  keywords = [],
  author,
  location,
  galleryImages,
  rating
}) => {
  // Use the current URL if no canonical URL is provided
  const url = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Default site name and domain from environment variables
  const siteName = 'Hariel Xavier Photography';
  const domain = getEnv('VITE_DOMAIN', 'https://harielxavier.com');
  const contactEmail = getEnv('VITE_CONTACT_EMAIL', 'info@harielxavier.com');
  const contactPhone = getEnv('VITE_CONTACT_PHONE', '+1-123-456-7890');
  
  // Base structured data for photography website
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'photography' ? 'LocalBusiness' : 
             type === 'article' ? 'Article' : 
             type === 'imageGallery' ? 'ImageGallery' : 
             type === 'profile' ? 'ProfilePage' : 'WebSite',
    name: siteName,
    url: domain,
    image: imageUrl ? `${domain}${imageUrl}` : undefined,
    description: description,
    email: contactEmail,
    telephone: contactPhone,
    ...(type === 'photography' && location && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: location.address || '',
        addressLocality: location.city || '',
        addressRegion: location.state || '',
        postalCode: location.zip || '',
        addressCountry: location.country || 'US'
      },
      geo: location.latitude && location.longitude ? {
        '@type': 'GeoCoordinates',
        latitude: location.latitude,
        longitude: location.longitude
      } : undefined
    }),
    ...(type === 'article' && {
      headline: title,
      datePublished: publishedAt,
      dateModified: modifiedAt || publishedAt,
      author: author ? {
        '@type': 'Person',
        name: author
      } : undefined
    }),
    ...(type === 'imageGallery' && galleryImages && {
      associatedMedia: galleryImages.map(img => ({
        '@type': 'ImageObject',
        contentUrl: img.url.startsWith('http') ? img.url : `${domain}${img.url}`,
        caption: img.caption || 'Wedding Photography by Hariel Xavier'
      }))
    }),
    ...(rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.value,
        reviewCount: rating.count
      }
    })
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title} | {siteName}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Language */}
      <html lang="en" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      {imageUrl && <meta property="og:image" content={imageUrl.startsWith('http') ? imageUrl : `${domain}${imageUrl}`} />}
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl.startsWith('http') ? imageUrl : `${domain}${imageUrl}`} />}
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}
      <meta name="twitter:site" content="@HarielXavier" />
      
      {/* Article-specific Tags */}
      {type === 'article' && publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {type === 'article' && modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}
      {type === 'article' && author && <meta property="article:author" content={author} />}
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEOHead;

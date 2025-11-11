import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getEnv } from '../../utils/envManager';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'profile' | 'photography' | 'imageGallery' | 'business.business';
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
  breadcrumbs?: Array<{ name: string; url: string }>;
  priceRange?: string;
  services?: Array<{ name: string; description: string }>;
  reviews?: Array<{ author: string; rating: number; text: string }>;
  noindex?: boolean;
  jsonLdExtras?: Record<string, any>;
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
  rating,
  breadcrumbs,
  priceRange,
  services,
  reviews,
  noindex = false,
  jsonLdExtras = {}
}) => {
  // Use the current URL if no canonical URL is provided
  const url = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');

  // Default site name and domain from environment variables
  const siteName = 'Hariel Xavier Photography';
  const domain = getEnv('VITE_DOMAIN', 'https://harielxavier.com');
  const contactEmail = getEnv('VITE_CONTACT_EMAIL', 'info@harielxavier.com');
  const contactPhone = getEnv('VITE_CONTACT_PHONE', '+1-862-355-3502');

  // Enhanced structured data for photography website
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'photography' || type === 'business.business' ? 'ProfessionalService' :
             type === 'article' ? 'Article' :
             type === 'imageGallery' ? 'ImageGallery' :
             type === 'profile' ? 'ProfilePage' : 'WebSite',
    '@id': `${domain}/#${type}`,
    name: siteName,
    url: url || domain,
    image: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${domain}${imageUrl}`) : undefined,
    description: description,
    email: contactEmail,
    telephone: contactPhone,
    ...(priceRange && { priceRange }),
    ...(type === 'photography' || type === 'business.business' ? {
      address: {
        '@type': 'PostalAddress',
        streetAddress: location?.address || '',
        addressLocality: location?.city || 'Sparta',
        addressRegion: location?.state || 'NJ',
        postalCode: location?.zip || '07871',
        addressCountry: location?.country || 'US'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: location?.latitude || 41.0342,
        longitude: location?.longitude || -74.6328
      },
      areaServed: [
        {
          '@type': 'State',
          name: 'New Jersey'
        },
        {
          '@type': 'State',
          name: 'New York'
        },
        {
          '@type': 'State',
          name: 'Pennsylvania'
        }
      ],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday'],
          opens: '10:00',
          closes: '17:00'
        }
      ],
      sameAs: [
        'https://www.instagram.com/harielxavierphotography',
        'https://www.facebook.com/harielxavierphotography',
        'https://www.pinterest.com/harielxavierphotography',
        'https://twitter.com/HarielXavier'
      ]
    } : {}),
    ...(services && services.length > 0 && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Photography Services',
        itemListElement: services.map(service => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            description: service.description
          }
        }))
      }
    }),
    ...(type === 'article' && {
      headline: title,
      datePublished: publishedAt,
      dateModified: modifiedAt || publishedAt,
      author: author ? {
        '@type': 'Person',
        name: author
      } : undefined,
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${domain}/logo.svg`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      }
    }),
    ...(type === 'imageGallery' && galleryImages && {
      associatedMedia: galleryImages.map(img => ({
        '@type': 'ImageObject',
        contentUrl: img.url.startsWith('http') ? img.url : `${domain}${img.url}`,
        caption: img.caption || 'Wedding Photography by Hariel Xavier',
        creator: {
          '@type': 'Person',
          name: 'Hariel Xavier'
        }
      }))
    }),
    ...(rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.value,
        reviewCount: rating.count,
        bestRating: '5',
        worstRating: '1'
      }
    }),
    ...(reviews && reviews.length > 0 && {
      review: reviews.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: '5'
        },
        reviewBody: review.text
      }))
    }),
    ...jsonLdExtras
  };

  // Breadcrumb structured data
  const breadcrumbStructuredData = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${domain}${crumb.url}`
    }))
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="author" content={author || 'Hariel Xavier'} />
      <meta name="generator" content="React, Vite" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Language and Viewport */}
      <html lang="en" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />

      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="US-NJ" />
      <meta name="geo.placename" content="Sparta" />
      <meta name="geo.position" content="41.0342;-74.6328" />
      <meta name="ICBM" content="41.0342, -74.6328" />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type === 'business.business' ? 'business.business' : type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      {imageUrl && <meta property="og:image" content={imageUrl.startsWith('http') ? imageUrl : `${domain}${imageUrl}`} />}
      {imageUrl && <meta property="og:image:width" content="1200" />}
      {imageUrl && <meta property="og:image:height" content="630" />}
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl.startsWith('http') ? imageUrl : `${domain}${imageUrl}`} />}
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}
      <meta name="twitter:site" content="@HarielXavier" />
      <meta name="twitter:creator" content="@HarielXavier" />

      {/* Article-specific Tags */}
      {type === 'article' && publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {type === 'article' && modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}
      {type === 'article' && author && <meta property="article:author" content={author} />}

      {/* Pinterest Verification */}
      <meta name="p:domain_verify" content="pinterest-domain-verify" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(baseStructuredData)}
      </script>
      {breadcrumbStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
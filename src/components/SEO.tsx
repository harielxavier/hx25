import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  ogImage?: string;
  keywords?: string;
  type?: 'website' | 'business' | 'article';
  includeRSS?: boolean;
}

export default function SEO({
  title,
  description,
  image = 'https://res.cloudinary.com/dos0qac90/image/upload/v1761593379/hariel-xavier-photography/MoStuff/black.png',
  ogImage,
  keywords,
  type = 'website',
  includeRSS = false
}: SEOProps) {
  useEffect(() => {
    document.title = title;
    
    const metaTags = {
      'description': description,
      'og:type': type,
      'og:title': title,
      'og:description': description,
      'og:image': ogImage || image,
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': ogImage || image,
    };
    
    // Add keywords if provided
    if (keywords) {
      // Use type assertion to add the keywords property
      (metaTags as Record<string, string>)['keywords'] = keywords;
    }

    Object.entries(metaTags).forEach(([name, content]) => {
      let element = document.querySelector(`meta[name="${name}"]`) ||
                    document.querySelector(`meta[property="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(name.includes('og:') ? 'property' : 'name', name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    });

    // Add schema.org JSON-LD
    let script = document.querySelector('#schema-org') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'schema-org';
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }

    let schema;
    
    if (type === 'business') {
      schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Hariel Xavier Photography",
      "image": image,
      "description": description,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Sparta",
        "addressRegion": "NJ",
        "postalCode": "07871",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "41.1399",
        "longitude": "-74.6974"
      },
      "url": window.location.origin,
      "telephone": "+1-973-729-5555",
      "priceRange": "$$$",
      "areaServed": [
        {
          "@type": "City",
          "name": "Sparta",
          "containedInPlace": {
            "@type": "State",
            "name": "New Jersey"
          }
        },
        {
          "@type": "City", 
          "name": "Sussex County",
          "containedInPlace": {
            "@type": "State",
            "name": "New Jersey"
          }
        }
      ],
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "41.1399",
          "longitude": "-74.6974"
        },
        "geoRadius": "50000"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Wedding Photography Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Wedding Photography",
              "description": "Professional wedding photography services in Sparta, NJ and Sussex County"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Engagement Photography",
              "description": "Engagement photography sessions in Sussex County, NJ"
            }
          }
        ]
      }
      };
    } else if (type === 'article') {
      schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "image": ogImage || image,
        "description": description,
        "publisher": {
          "@type": "Organization",
          "name": "Hariel Xavier Photography",
          "logo": {
            "@type": "ImageObject",
            "url": "https://res.cloudinary.com/dos0qac90/image/upload/v1761593379/hariel-xavier-photography/MoStuff/black.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": window.location.href
        },
        "datePublished": new Date().toISOString()
      };
    } else {
      schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Hariel Xavier Photography",
      "url": window.location.origin,
      "description": description,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
    }

    if (script) {
      script.textContent = JSON.stringify(schema);
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // Add RSS feed link if requested
    if (includeRSS) {
      let rssLink = document.querySelector('link[type="application/rss+xml"]');
      if (!rssLink) {
        rssLink = document.createElement('link');
        rssLink.setAttribute('rel', 'alternate');
        rssLink.setAttribute('type', 'application/rss+xml');
        rssLink.setAttribute('title', 'Hariel Xavier Photography Blog RSS Feed');
        document.head.appendChild(rssLink);
      }
      rssLink.setAttribute('href', `${window.location.origin}/feed.xml`);
    }

    // Cleanup function to remove script when component unmounts
    const cleanup = () => {
      if (script) {
        script.remove();
      }
    };
    
    return cleanup;
  }, [title, description, image, ogImage, keywords, type, includeRSS]);

  return null;
}
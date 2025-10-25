import { Helmet } from 'react-helmet-async';

interface BlogStructuredDataProps {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    author: {
      name: string;
      avatar?: string;
    };
    publishedAt?: { toDate?: () => Date; seconds?: number };
    createdAt?: { toDate?: () => Date; seconds?: number };
    updatedAt?: { toDate?: () => Date; seconds?: number };
  };
}

export default function BlogStructuredData({ post }: BlogStructuredDataProps) {
  const publishedDate = post.publishedAt?.toDate?.() || 
    (post.publishedAt?.seconds ? new Date(post.publishedAt.seconds * 1000) : new Date());
  
  const modifiedDate = post.updatedAt?.toDate?.() || 
    (post.updatedAt?.seconds ? new Date(post.updatedAt.seconds * 1000) : publishedDate);
  
  const url = `https://harielxavier.com/blog/${post.slug}`;
  
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featuredImage.startsWith('http') 
      ? post.featuredImage 
      : `https://harielxavier.com${post.featuredImage}`,
    "datePublished": publishedDate.toISOString(),
    "dateModified": modifiedDate.toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "url": "https://harielxavier.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hariel Xavier Photography",
      "logo": {
        "@type": "ImageObject",
        "url": "https://harielxavier.com/logo.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://harielxavier.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://harielxavier.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": url
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
}







'use client';

import { cancelPendingRequests } from '@/services/api';
import Head from 'next/head';
import { useEffect, useState } from 'react';

interface DynamicSEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'category' | 'search' | 'faq';
  data?: any; // Dynamic data based on type
  structuredData?: any; // Custom structured data
}

export default function DynamicSEO({
  title,
  description,
  keywords = 'martial arts, taekwondo, uniforms, gear, champion choice, fighting equipment',
  image = '/images/championchoice-logo.png',
  url = 'https://www.champzones.com',
  type = 'website',
  data,
  structuredData
}: DynamicSEOProps) {
  const [fullUrl, setFullUrl] = useState(url);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(`${url}${window.location.pathname}`);
    }
    return () => {
      cancelPendingRequests();
    };
  }, [url]);

  // Generate structured data based on type
  const generateStructuredData = (): any[] => {
    const baseOrganization = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Champion Choice",
      "url": "https://www.champzones.com",
      "logo": "https://www.champzones.com/images/championchoice-logo.png",
      "description": "Premium martial arts equipment and taekwondo uniforms",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "PK"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service"
      }
    };

    const baseWebsite = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Champion Choice",
      "url": "https://www.champzones.com",
      "description": "Premium martial arts equipment and taekwondo uniforms",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.champzones.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    const schemas: any[] = [baseOrganization, baseWebsite];

    // Add type-specific schemas
    switch (type) {
      case 'product':
        if (data) {
          schemas.push({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": data.name || title,
            "description": description,
            "image": data.images || image,
            "brand": {
              "@type": "Brand",
              "name": data.brand || "Champion Choice"
            },
            "category": data.category,
            "offers": {
              "@type": "Offer",
              "price": data.price,
              "priceCurrency": data.currency || "PKR",
              "availability": `https://schema.org/${data.availability || 'InStock'}`,
              "url": fullUrl
            }
          });
        }
        break;

      case 'article':
        if (data) {
          schemas.push({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": description,
            "image": image,
            "author": {
              "@type": "Person",
              "name": data.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Champion Choice",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.champzones.com/images/championchoice-logo.png"
              }
            },
            "datePublished": data.publishedAt,
            "dateModified": data.updatedAt || data.publishedAt,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": fullUrl
            }
          });
        }
        break;

      case 'category':
        if (data) {
          schemas.push({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": title,
            "description": description,
            "url": fullUrl,
            "image": image,
            "numberOfItems": data.productCount || 0
          });
        }
        break;

      case 'search':
        if (data) {
          schemas.push({
            "@context": "https://schema.org",
            "@type": "SearchResultsPage",
            "name": `Search Results for "${data.query}"`,
            "description": description,
            "url": fullUrl,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": data.totalResults || 0
            }
          });
        }
        break;

      case 'faq':
        if (data && data.faqs) {
          schemas.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": data.faqs.map((faq: any) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          });
        }
        break;
    }

    // Add breadcrumb schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.champzones.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": title,
          "item": fullUrl
        }
      ]
    });

    return schemas;
  };

  const schemas: any[] = structuredData || generateStructuredData();

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title} | Champion Choice</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Champion Choice" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Champion Choice" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@championchoice" />
      <meta name="twitter:creator" content="@championchoice" />
      
      {/* Additional SEO Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#DD8560" />
      <meta name="msapplication-TileColor" content="#DD8560" />
      <link rel="canonical" href={fullUrl} />
      <link rel="icon" href="/images/championchoice-logo.png" />
      <link rel="apple-touch-icon" href="/images/championchoice-logo.png" />
      
      {/* Structured Data */}
      {schemas.map((schema: any, index: number) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
    </Head>
  );
} 
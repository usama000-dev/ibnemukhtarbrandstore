'use client';

import { cancelPendingRequests } from '@/services/api';
import Head from 'next/head';
import { useEffect, useState } from 'react';

interface CategorySEOProps {
  category: {
    name: string;
    description: string;
    slug: string;
    image?: string;
    productCount: number;
    parentCategory?: string;
  };
  products?: Array<{
    name: string;
    price: number;
    currency: string;
    image: string;
    url: string;
  }>;
  url: string;
}

export default function CategorySEO({ category, products = [], url }: CategorySEOProps) {
  const [fullUrl, setFullUrl] = useState(url);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(`${url}${window.location.pathname}`);
    }
    return () => {
      cancelPendingRequests();
    };
  }, [url]);

  // Collection Schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} - Champion Choice`,
    "description": category.description,
    "url": fullUrl,
    "image": category.image || "https://www.champzones.com/images/championchoice-logo.png",
    "numberOfItems": category.productCount,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": category.productCount,
      "itemListElement": products.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "image": product.image,
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": product.currency,
            "url": product.url
          }
        }
      }))
    }
  };

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Champion Choice",
    "url": "https://www.champzones.com/",
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

  // Breadcrumb Schema
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.champzones.com/"
    }
  ];

  if (category.parentCategory) {
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 2,
      "name": category.parentCategory,
      "item": `https://www.champzones.com/${category.parentCategory.toLowerCase()}`
    });
  }

  breadcrumbItems.push({
    "@type": "ListItem",
    "position": breadcrumbItems.length + 1,
    "name": category.name,
    "item": fullUrl
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  };

  // WebSite Schema with Search
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Champion Choice",
    "url": "https://www.champzones.com/",
    "description": "Premium martial arts equipment and taekwondo uniforms",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.champzones.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{category.name} - Champion Choice</title>
      <meta name="description" content={category.description} />
      <meta name="keywords" content={`${category.name}, martial arts, ${category.slug}, champion choice, ${category.parentCategory || ''}`} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Champion Choice" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={`${category.name} - Champion Choice`} />
      <meta property="og:description" content={category.description} />
      <meta property="og:image" content={category.image || "https://www.champzones.com/images/championchoice-logo.png"} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Champion Choice" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${category.name} - Champion Choice`} />
      <meta name="twitter:description" content={category.description} />
      <meta name="twitter:image" content={category.image || "https://www.champzones.com/images/championchoice-logo.png"} />
      <meta name="twitter:site" content="@championchoice" />
      <meta name="twitter:creator" content="@championchoice" />
      
      {/* Additional SEO Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#DD8560" />
      <link rel="canonical" href={fullUrl} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema)
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
    </Head>
  );
} 
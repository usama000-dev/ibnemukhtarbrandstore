'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  productData?: {
    name: string;
    price: string;
    currency: string;
    availability: string;
    brand: string;
    category: string;
  };
  articleData?: {
    title: string;
    author: string;
    publishedTime: string;
    modifiedTime?: string;
    section: string;
    tags: string[];
  };
}

export default function SEO({
  title,
  description,
  keywords = 'martial arts, taekwondo, uniforms, gear, champion choice, fighting equipment',
  image = 'https://www.champzones.com/images/championchoice-logo.png',
  url = 'https://www.champzones.com',
  type = 'website',
  productData,
  articleData
}: SEOProps) {
  const [fullUrl, setFullUrl] = useState(url);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(`${url}${window.location.pathname}`);
    }
  }, [url]);

  // Structured Data for Organization
  const organizationSchema = {
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
    },
    "sameAs": [
      "https://www.facebook.com/Chiniot.Champ",
      "https://instagram.com/championchoice"//instagram ka url dena h page ka jisay click krtay ho official account pr chalay jaen
    ]
  };

  // Structured Data for Product (if provided)
  const productSchema = productData ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productData.name,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": productData.brand
    },
    "category": productData.category,
    "offers": {
      "@type": "Offer",
      "price": productData.price,
      "priceCurrency": productData.currency,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": productData.availability,
      "url": fullUrl,
      "seller": {
        "@type": "Organization",
        "name": "Champion Choice"
      }
    },
    "image": image,
    "url": fullUrl
  } : null;

  // Structured Data for Article (if provided)
  const articleSchema = articleData ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleData.title,
    "description": description,
    "image": image,
    "author": {
      "@type": "Person",
      "name": articleData.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Champion Choice",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.champzones.com/images/championchoice-logo.png"
      }
    },
    "datePublished": articleData.publishedTime,
    "dateModified": articleData.modifiedTime || articleData.publishedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "articleSection": articleData.section,
    "keywords": articleData.tags.join(", ")
  } : null;

  // Breadcrumb Schema
  const breadcrumbSchema = {
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
  };

  // WebSite Schema
  const websiteSchema = {
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

      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema)
          }}
        />
      )}

      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema)
          }}
        />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
    </Head>
  );
} 

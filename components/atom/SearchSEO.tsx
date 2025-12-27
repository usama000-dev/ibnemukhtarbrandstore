'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';

interface SearchSEOProps {
  query: string;
  results: Array<{
    name: string;
    description: string;
    price?: number;
    currency?: string;
    image: string;
    url: string;
    type: 'product' | 'article' | 'category';
  }>;
  totalResults: number;
  url: string;
}

export default function SearchSEO({ query, results, totalResults, url }: SearchSEOProps) {
  const [fullUrl, setFullUrl] = useState(url);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(`${url}${window.location.pathname}`);
    }
  }, [url]);

  // Search Results Schema
  const searchResultsSchema = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": `Search Results for "${query}"`,
    "description": `Search results for "${query}" - Found ${totalResults} items`,
    "url": fullUrl,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": totalResults,
      "itemListElement": results.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": item.type === 'product' ? "Product" : item.type === 'article' ? "Article" : "WebPage",
          "name": item.name,
          "description": item.description,
          "image": item.image,
          "url": item.url,
          ...(item.price && {
            "offers": {
              "@type": "Offer",
              "price": item.price,
              "priceCurrency": item.currency || "PKR"
            }
          })
        }
      }))
    }
  };

  // Organization Schema
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
    }
  };

  // WebSite Schema with Search
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
        "name": "Search",
        "item": "https://www.champzones.com/search"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `Results for "${query}"`,
        "item": fullUrl
      }
    ]
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>Search Results for &ldquo;{query}&ldquo; - Champion Choice</title>
      <meta name="description" content={`Search results for &ldquo;${query}&ldquo;. Found ${totalResults} items related to martial arts, taekwondo, and champion choice products.`} />
      <meta name="keywords" content={`${query}, search results, martial arts, taekwondo, champion choice`} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Champion Choice" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={`Search Results for &ldquo;${query}&ldquo; - Champion Choice`} />
      <meta property="og:description" content={`Search results for &ldquo;${query}&ldquo;. Found ${totalResults} items related to martial arts, taekwondo, and champion choice products.`} />
      <meta property="og:image" content="https://www.champzones.com/images/championchoice-logo.png" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Champion Choice" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`Search Results for &ldquo;${query}&ldquo; - Champion Choice`} />
      <meta name="twitter:description" content={`Search results for &ldquo;${query}&ldquo;. Found ${totalResults} items related to martial arts, taekwondo, and champion choice products.`} />
      <meta name="twitter:image" content="https://www.champzones.com/images/championchoice-logo.png" />
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
          __html: JSON.stringify(searchResultsSchema)
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
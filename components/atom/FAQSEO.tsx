'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSEOProps {
  title: string;
  description: string;
  faqs: FAQItem[];
  url: string;
  category?: string;
}

export default function FAQSEO({ title, description, faqs, url, category }: FAQSEOProps) {
  const [fullUrl, setFullUrl] = useState(url);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(`${url}${window.location.pathname}`);
    }
  }, [url]);

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
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

  // Breadcrumb Schema
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.champzones.com"
    }
  ];

  if (category) {
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 2,
      "name": category,
      "item": `https://www.champzones.com/${category.toLowerCase()}`
    });
  }

  breadcrumbItems.push({
    "@type": "ListItem",
    "position": breadcrumbItems.length + 1,
    "name": title,
    "item": fullUrl
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
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
      <title>{title} - Champion Choice</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={`FAQ, frequently asked questions, ${category || 'martial arts'}, champion choice, help`} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Champion Choice" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={`${title} - Champion Choice`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://www.champzones.com/images/championchoice-logo.png" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Champion Choice" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} - Champion Choice`} />
      <meta name="twitter:description" content={description} />
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
          __html: JSON.stringify(faqSchema)
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
'use client';

import { cancelPendingRequests } from '@/services/api';
import { useEffect, useState } from 'react';

interface BlogSEOProps {
  post: {
    title: string;
    content: string;
    excerpt?: string;
    author: string;
    publishedAt: string;
    updatedAt?: string;
    tags: string[];
    category: string;
    image?: string;
    slug: string;
  };
  url: string;
}

export default function BlogSEO({ post, url }: BlogSEOProps) {
  const [fullUrl, setFullUrl] = useState(url);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(`${url}${window.location.pathname}`);
    }
    return () => {
      cancelPendingRequests();
    };
  }, [url]);

  const description = post.excerpt || post.content.substring(0, 160);

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": description,
    "image": post.image || "https://www.champzones.com/images/championchoice-logo.png",
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Champion Choice",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.champzones.com/images/championchoice-logo.png"
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt || post.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "articleSection": post.category,
    "keywords": post.tags.join(", "),
    "wordCount": post.content.split(' ').length,
    "articleBody": post.content
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
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.champzones.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.champzones.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.category,
        "item": `https://www.champzones.com/blog/category/${post.category.toLowerCase()}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": post.title,
        "item": fullUrl
      }
    ]
  };

  // BlogPosting Schema (more specific than Article)
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": description,
    "image": post.image || "https://www.champzones.com/images/championchoice-logo.png",
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Champion Choice",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.champzones.com/images/championchoice-logo.png"
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt || post.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "articleSection": post.category,
    "keywords": post.tags.join(", "),
    "wordCount": post.content.split(' ').length,
    "articleBody": post.content,
    "url": fullUrl
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema)
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
    </>
  );
}
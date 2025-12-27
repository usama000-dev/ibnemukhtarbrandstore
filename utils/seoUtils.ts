// SEO Utility Functions for Next.js

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  tags?: string[];
  category?: string;
}

export interface ProductSEOData {
  name: string;
  description: string;
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand: string;
  category: string;
  images: string[];
  sku?: string;
  mpn?: string;
  gtin?: string;
  condition?: 'New' | 'Used' | 'Refurbished';
  rating?: {
    value: number;
    count: number;
  };
  reviews?: Array<{
    author: string;
    rating: number;
    text: string;
    date: string;
  }>;
}

export interface BlogSEOData {
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
}

// Generate basic meta tags
export const generateMetaTags = (config: SEOConfig) => {
  const {
    title,
    description,
    keywords = 'winter jackets Pakistan, winter shoes, affordable jackets, men jackets, women jackets, kids jackets, Ibnemukhtar store',
    image = '/images/championchoice-logo.png',
    url = 'https://www.champzones.com',
    type = 'website',
    author,
    publishedAt,
    updatedAt,
    tags = [],
    category
  } = config;

  const metaTags: Record<string, string> = {
    // Basic Meta Tags
    title: `${title} | Champion Choice`,
    description,
    keywords,
    robots: 'index, follow',
    author: author || 'Champion Choice',
    language: 'en',
    'revisit-after': '7 days',

    // Open Graph Tags
    'og:title': title,
    'og:description': description,
    'og:image': image,
    'og:url': url,
    'og:type': type,
    'og:site_name': 'Champion Choice',
    'og:locale': 'en_US',
    'og:image:width': '1200',
    'og:image:height': '630',

    // Twitter Card Tags
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
    'twitter:site': '@championchoice',
    'twitter:creator': '@championchoice',

    // Additional SEO Tags
    'viewport': 'width=device-width, initial-scale=1',
    'theme-color': '#DD8560',
    'msapplication-TileColor': '#DD8560'
  };

  // Add article-specific meta tags
  if (type === 'article' && author) {
    metaTags['article:author'] = author;
    if (publishedAt) metaTags['article:published_time'] = publishedAt;
    if (updatedAt) metaTags['article:modified_time'] = updatedAt;
    if (category) metaTags['article:section'] = category;
    if (tags.length > 0) metaTags['article:tag'] = tags.join(', ');
  }

  return metaTags;
};

// Generate Organization Schema
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Champion Choice",
  "url": "https://www.champzones.com",
  "logo": "https://www.champzones.com/images/championchoice-logo.png",
  "description": "Quality winter wear at affordable prices",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "PK"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://facebook.com/championchoice",
    "https://instagram.com/championchoice"
  ]
});

// Generate Website Schema
export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Champion Choice",
  "url": "https://www.champzones.com",
  "description": "Quality winter wear at affordable prices",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.champzones.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

// Generate Product Schema
export const generateProductSchema = (product: ProductSEOData, url: string) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.images,
  "brand": {
    "@type": "Brand",
    "name": product.brand
  },
  "category": product.category,
  "sku": product.sku,
  "mpn": product.mpn,
  "gtin": product.gtin,
  "condition": product.condition || "New",
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": product.currency,
    "availability": `https://schema.org/${product.availability}`,
    "url": url,
    "seller": {
      "@type": "Organization",
      "name": "Champion Choice"
    },
    "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  "aggregateRating": product.rating ? {
    "@type": "AggregateRating",
    "ratingValue": product.rating.value,
    "reviewCount": product.rating.count,
    "bestRating": 5,
    "worstRating": 1
  } : undefined,
  "review": product.reviews?.map(review => ({
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": 5,
      "worstRating": 1
    },
    "reviewBody": review.text,
    "datePublished": review.date
  }))
});

// Generate Blog Posting Schema
export const generateBlogPostingSchema = (post: BlogSEOData, url: string) => {
  const description = post.excerpt || post.content.substring(0, 160);

  return {
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
      "@id": url
    },
    "articleSection": post.category,
    "keywords": post.tags.join(", "),
    "wordCount": post.content.split(' ').length,
    "articleBody": post.content,
    "url": url
  };
};

// Generate FAQ Schema
export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
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
});

// Generate Breadcrumb Schema
export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

// Generate Collection Schema for category pages
export const generateCollectionSchema = (category: {
  name: string;
  description: string;
  image?: string;
  productCount: number;
}, products: Array<{
  name: string;
  price: number;
  currency: string;
  image: string;
  url: string;
}>, url: string) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": `${category.name} - Champion Choice`,
  "description": category.description,
  "url": url,
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
});

// Generate Search Results Schema
export const generateSearchResultsSchema = (query: string, results: Array<{
  name: string;
  description: string;
  price?: number;
  currency?: string;
  image: string;
  url: string;
  type: 'product' | 'article' | 'category';
}>, totalResults: number, url: string) => ({
  "@context": "https://schema.org",
  "@type": "SearchResultsPage",
  "name": `Search Results for "${query}"`,
  "description": `Search results for "${query}" - Found ${totalResults} items`,
  "url": url,
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
});

// Helper function to clean and format text for SEO
export const formatSEOText = (text: string, maxLength: number = 160): string => {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
    .substring(0, maxLength)
    .replace(/\s+\w*$/, ''); // Remove partial words at the end
};

// Helper function to generate keywords from content
export const generateKeywords = (content: string, additionalKeywords: string[] = []): string => {
  const baseKeywords = [
    'winter jackets',
    'winter shoes',
    'affordable jackets',
    'Ibnemukhtar',
    'winter wear',
    'Pakistan'
  ];

  const allKeywords = [...baseKeywords, ...additionalKeywords];
  return allKeywords.join(', ');
}; 
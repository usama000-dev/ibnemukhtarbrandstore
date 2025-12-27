# SEO Components for Next.js Website

This document explains how to use the comprehensive SEO components created for your Next.js website.

## 📁 Components Overview

### 1. **SEO.tsx** - Main SEO Component
The primary SEO component that handles basic meta tags, Open Graph, Twitter Cards, and structured data.
<!-- TODO:mn nay seo comps done krnay h jo abhi nahe h  -->
**Usage:**
```tsx
import SEO from '@/components/atom/SEO';

<SEO 
  title="Your Page Title"
  description="Your page description"
  keywords="martial arts, taekwondo, uniforms"
  image="/path/to/image.jpg"
  url="https://your-domain.com"
  type="website"
  productData={{
    name: "Product Name",
    price: "1000",
    currency: "PKR",
    availability: "InStock",
    brand: "Champion Choice",
    category: "Uniforms"
  }}
  articleData={{
    title: "Article Title",
    author: "Author Name",
    publishedTime: "2024-01-01",
    section: "Martial Arts",
    tags: ["taekwondo", "training"]
  }}
/>
```

### 2. **ProductSEO.tsx** - Product-Specific SEO
Enhanced SEO component specifically for product pages with detailed product schema.

**Usage:**
```tsx
import ProductSEO from '@/components/atom/ProductSEO';

<ProductSEO 
  product={{
    name: "Taekwondo Uniform",
    description: "Premium quality taekwondo uniform",
    price: 2500,
    currency: "PKR",
    availability: "InStock",
    brand: "Champion Choice",
    category: "Uniforms",
    images: ["/image1.jpg", "/image2.jpg"],
    sku: "TK001",
    rating: {
      value: 4.5,
      count: 25
    }
  }}
  url="https://your-domain.com"
/>
```

### 3. **BlogSEO.tsx** - Blog Post SEO
Specialized SEO component for blog posts with article schema and blog-specific meta tags.

**Usage:**
```tsx
import BlogSEO from '@/components/atom/BlogSEO';

<BlogSEO 
  post={{
    title: "Martial Arts Training Tips",
    content: "Your blog content here...",
    excerpt: "Short excerpt of the blog post",
    author: "John Doe",
    publishedAt: "2024-01-01T10:00:00Z",
    tags: ["training", "martial arts"],
    category: "Tips",
    image: "/blog-image.jpg",
    slug: "martial-arts-training-tips"
  }}
  url="https://your-domain.com"
/>
```

### 4. **CategorySEO.tsx** - Category Page SEO
SEO component for category/collection pages with collection schema.

**Usage:**
```tsx
import CategorySEO from '@/components/atom/CategorySEO';

<CategorySEO 
  category={{
    name: "Taekwondo Uniforms",
    description: "All taekwondo uniforms",
    slug: "taekwondo-uniforms",
    image: "/category-image.jpg",
    productCount: 25,
    parentCategory: "Uniforms"
  }}
  products={[
    {
      name: "Uniform 1",
      price: 2000,
      currency: "PKR",
      image: "/product1.jpg",
      url: "https://your-domain.com/product1"
    }
  ]}
  url="https://your-domain.com"
/>
```

### 5. **SearchSEO.tsx** - Search Results SEO
SEO component for search result pages with search results schema.

**Usage:**
```tsx
import SearchSEO from '@/components/atom/SearchSEO';

<SearchSEO 
  query="taekwondo uniform"
  results={[
    {
      name: "Product Name",
      description: "Product description",
      price: 2000,
      currency: "PKR",
      image: "/product.jpg",
      url: "https://your-domain.com/product",
      type: "product"
    }
  ]}
  totalResults={15}
  url="https://your-domain.com"
/>
```

### 6. **FAQSEO.tsx** - FAQ Page SEO
SEO component for FAQ pages with FAQ schema markup.

**Usage:**
```tsx
import FAQSEO from '@/components/atom/FAQSEO';

<FAQSEO 
  title="Frequently Asked Questions"
  description="Common questions about martial arts equipment"
  faqs={[
    {
      question: "What size uniform should I buy?",
      answer: "Choose based on your height and weight..."
    }
  ]}
  url="https://your-domain.com"
  category="Help"
/>
```

### 7. **DynamicSEO.tsx** - Dynamic SEO Component
Flexible SEO component that automatically generates appropriate schema based on content type.

**Usage:**
```tsx
import DynamicSEO from '@/components/atom/DynamicSEO';

// For Product Pages
<DynamicSEO 
  title="Product Name"
  description="Product description"
  type="product"
  data={{
    name: "Product Name",
    price: 2000,
    currency: "PKR",
    availability: "InStock",
    brand: "Champion Choice",
    category: "Uniforms"
  }}
  url="https://your-domain.com"
/>

// For Blog Posts
<DynamicSEO 
  title="Blog Post Title"
  description="Blog post description"
  type="article"
  data={{
    author: "Author Name",
    publishedAt: "2024-01-01",
    category: "Tips",
    tags: ["martial arts", "training"]
  }}
  url="https://your-domain.com"
/>
```

## 🛠️ SEO Utilities (utils/seoUtils.ts)

The SEO utilities provide helper functions for generating meta tags and structured data:

### Key Functions:

1. **generateMetaTags(config)** - Generate basic meta tags
2. **generateOrganizationSchema()** - Organization schema
3. **generateWebsiteSchema()** - Website schema with search
4. **generateProductSchema(product, url)** - Product schema
5. **generateBlogPostingSchema(post, url)** - Blog posting schema
6. **generateFAQSchema(faqs)** - FAQ schema
7. **generateBreadcrumbSchema(items)** - Breadcrumb schema
8. **generateCollectionSchema(category, products, url)** - Collection schema
9. **generateSearchResultsSchema(query, results, totalResults, url)** - Search results schema
10. **formatSEOText(text, maxLength)** - Clean and format text for SEO
11. **generateKeywords(content, additionalKeywords)** - Generate keywords

**Usage:**
```tsx
import { 
  generateMetaTags, 
  generateProductSchema, 
  generateOrganizationSchema 
} from '@/utils/seoUtils';

const metaTags = generateMetaTags({
  title: "Product Name",
  description: "Product description",
  type: "product"
});

const productSchema = generateProductSchema(productData, url);
const organizationSchema = generateOrganizationSchema();
```

## 📋 Implementation Examples

### Home Page
```tsx
import SEO from '@/components/atom/SEO';

export default function HomePage() {
  return (
    <>
      <SEO 
        title="Premium Martial Arts Equipment & Taekwondo Uniforms"
        description="Discover premium martial arts equipment, taekwondo uniforms, and fighting gear at Champion Choice. Quality gear for champions."
        keywords="martial arts equipment, taekwondo uniforms, fighting gear, champion choice"
        type="website"
      />
      {/* Your page content */}
    </>
  );
}
```

### Product Detail Page
```tsx
import ProductSEO from '@/components/atom/ProductSEO';

export default function ProductPage({ product }) {
  return (
    <>
      <ProductSEO 
        product={{
          name: product.title,
          description: product.description,
          price: product.price,
          currency: "PKR",
          availability: product.inStock ? "InStock" : "OutOfStock",
          brand: "Champion Choice",
          category: product.category,
          images: product.images,
          rating: product.rating
        }}
        url={`https://your-domain.com/product/${product.slug}`}
      />
      {/* Product content */}
    </>
  );
}
```

### Blog Post Page
```tsx
import BlogSEO from '@/components/atom/BlogSEO';

export default function BlogPost({ post }) {
  return (
    <>
      <BlogSEO 
        post={{
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          author: post.author,
          publishedAt: post.publishedAt,
          tags: post.tags,
          category: post.category,
          image: post.featuredImage,
          slug: post.slug
        }}
        url={`https://your-domain.com/blog/${post.slug}`}
      />
      {/* Blog post content */}
    </>
  );
}
```

## 🎯 Key Features

### ✅ Complete Meta Tags
- Basic meta tags (title, description, keywords)
- Open Graph tags for social media
- Twitter Card tags
- Article-specific meta tags
- Viewport and theme color tags

### ✅ Structured Data (Schema.org)
- Organization schema
- Website schema with search functionality
- Product schema with ratings and reviews
- Blog posting schema
- FAQ schema
- Collection schema for category pages
- Search results schema
- Breadcrumb schema

### ✅ SEO Optimization
- Canonical URLs
- Proper meta descriptions
- Keyword optimization
- Social media optimization
- Mobile-friendly meta tags

### ✅ Dynamic Content Support
- Automatic URL generation
- Dynamic breadcrumbs
- Flexible data structures
- Type-safe interfaces

## 🔧 Customization

### Branding
Update the following in all components:
- Organization name: "Champion Choice"
- Website URL: "[https://champzones.com](https://www.champzones.com/)"
- Logo URL: "/images/championchoice-logo.png"
- Theme color: "#DD8560"

### Social Media
Update social media handles:
- Twitter: "@championchoice"
- Facebook: "https://facebook.com/championchoice"
- Instagram: "https://instagram.com/championchoice"

## 📊 SEO Best Practices Implemented

1. **Meta Tags**: Complete set of meta tags for search engines
2. **Open Graph**: Optimized for social media sharing
3. **Twitter Cards**: Enhanced Twitter sharing experience
4. **Structured Data**: Rich snippets for search results
5. **Canonical URLs**: Prevent duplicate content issues
6. **Breadcrumbs**: Improved navigation and SEO
7. **Mobile Optimization**: Responsive meta tags
8. **Performance**: Optimized component structure

## 🚀 Getting Started

1. Import the appropriate SEO component for your page type
2. Pass the required data as props
3. The component will automatically generate all necessary meta tags and structured data
4. For dynamic pages, use the `DynamicSEO` component with appropriate type and data

## 📝 Notes

- All components are client-side rendered using `'use client'`
- Structured data is automatically generated based on content type
- Components handle URL generation automatically
- All components include organization and website schemas by default
- Breadcrumb schemas are automatically generated
- Components are optimized for performance and SEO

This comprehensive SEO setup will significantly improve your website's search engine visibility and social media sharing capabilities. 
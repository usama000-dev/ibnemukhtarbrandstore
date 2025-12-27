interface ProductSEOProps {
  product: {
    name: string;
    description: string;
    price: number;
    currency: string;
    availability: "InStock" | "OutOfStock" | "PreOrder";
    brand: string;
    category: string;
    images: string[];
    sku?: string;
    mpn?: string;
    gtin?: string;
    condition?: "New" | "Used" | "Refurbished";
    rating?: { value: number; count: number };
    reviews?: Array<{
      author: string;
      rating: number;
      text: string;
      date: string;
    }>;
  };
  url: string; // yaha full URL (server-side se) pass karna hoga
}

export default function ProductSEO({ product, url }: ProductSEOProps) {
  // Ab hum window use nahi kar rahe
  const fullUrl = url;

  // ✅ Structured Data Schemas
  // ✅ FAQ Schema for "People Also Ask"
  // Assuming description might contain questions, or we static add common FAQs
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the price of ${product.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The price of ${product.name} is ${product.currency} ${product.price} on Champion Choice.`
        }
      },
      {
        "@type": "Question",
        "name": "Is this product in stock?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": product.availability === "InStock" ? "Yes, this item is currently available for purchase." : "Currently out of stock, please check back later."
        }
      }
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: product.brand },
    category: product.category,
    sku: product.sku,
    mpn: product.mpn,
    gtin: product.gtin,
    condition: product.condition || "New",
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      url: fullUrl,
      seller: { "@type": "Organization", name: "Champion Choice" },
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      }
    },
    aggregateRating: product.rating && {
      "@type": "AggregateRating",
      ratingValue: product.rating.value,
      reviewCount: product.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    review: product.reviews?.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.text,
      datePublished: review.date,
    })),
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Champion Choice",
    url: "https://www.champzones.com",
    logo: "https://www.champzones.com/images/championchoice-logo.png",
    description: "Premium martial arts equipment and taekwondo uniforms",
    address: { "@type": "PostalAddress", addressCountry: "PK" },
    contactPoint: { "@type": "ContactPoint", contactType: "customer service" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.champzones.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category,
        item: `https://www.champzones.com/${product.category.toLowerCase()}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: fullUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

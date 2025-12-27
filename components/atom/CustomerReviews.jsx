"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Head from "next/head";
import { cancelPendingRequests } from "@/services/api";

export default function CustomerReviews() {
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      id: 5,
      name: "Ray Ali Raza Rajpoot",
      rating: 5,
      comment: "Great experience! Products exceeded my expectations. Very satisfied customer.",
      image: "https://res.cloudinary.com/do58gkhav/image/upload/v1753635560/sir_ali_raza_drltwp.jpg",
      product: "Taekwondo Shirts",
      location: "Multan, Pakistan"
    },
    {
      id: 1,
      name: "Muhammad Usama",
      rating: 5,
      comment: "Best martial arts gear I&rsquo;ve ever bought. Fast delivery and excellent customer service.",
      image: "https://res.cloudinary.com/do58gkhav/image/upload/v1753641804/7_l40u4g.png",
      product: "Taekwondo Uniform",
      location: "Chiniot, Pakistan"
    },
    {
      id: 4,
      name: "Noor ul Hassan",
      rating: 5,
      comment: "Perfect for my taekwondo classes. The uniform is durable and looks professional.",
      image: "https://res.cloudinary.com/do58gkhav/image/upload/v1753628395/noor_c0tekc.png",
      product: "Taekwondo Hoodies",
      location: "Faisalabad, Pakistan"
    },
    {
      id: 2,
      name: "Ali Hassan",
      rating: 5,
      comment: "Amazing quality uniforms! Perfect fit and comfortable material. Highly recommended!",
      image: "https://res.cloudinary.com/do58gkhav/image/upload/v1753628395/ali_hassan_gcj36e.png",
      product: "Taekwondo Kick Padds",
      location: "Karachi, Pakistan"
    },
    {
      id: 3,
      name: "Ali Nisar",
      rating: 5,
      comment: "Premium quality products at reasonable prices. Will definitely shop again!",
      image: "https://res.cloudinary.com/do58gkhav/image/upload/v1753628395/ali_ondtkq.png",
      product: "Taekwondo Gloves",
      location: "Islamabad, Pakistan"
    },
    {
      id: 4,
      name: "Zainab Khan",
      rating: 5,
      comment: "Absolutely loved the quality! I wasn&rsquo;t expecting such premium stitching. Will definitely order again.",
      image: "https://res.cloudinary.com/do58gkhav/image/upload/v1753640434/6_j0ale0.png",
      product: "Taekwondo Mugs",
      location: "Lahore, Pakistan"
    },
    {
      id: 5,
      name: "Haroon Tareen",
      rating: 4,
      comment: "Fast delivery and great customer support. The sizes fit perfectly. Just what I needed!",
      image: "https://res.cloudinary.com/do58gkhav/image/upload/v1753640475/5_eovfzu.png",
      product: "Taekwondo Shirts",
      location: "Karachi, Pakistan"
    },
    {
      id: 6,
      name: "Ahmed Iqbal",
      rating: 4,
      comment: "The fabric is so breathable and comfortable during practice. Highly recommended!",
      image: "/images/users/11.png",
      product: "Taekwondo Equipments",
      location: "Karachi, Pakistan"
    },
    {
      id: 7,
      name: "Mike Jhonson",
      rating: 4,
      comment: "Durable, comfortable, and stylish — the best taekwondo uniform I&rsquo;ve found online. Worth every rupee.",
      image: "/images/users/7.jpg",
      product: "Taekwondo Belts",
      location: "Chicago, United State"
    },
    {
      id: 8,
      name: "Leona",
      rating: 4,
      comment: "Superb stitching quality and premium fabric. My son won&rsquo;t wear any other uniform now!",
      image: "/images/users/4.jpg",
      product: "Taekwondo Belts",
      location: "Kingston, Australia"
    },

  ];

  // SEO Data
  const seoData = {
    title: "Customer Reviews & Testimonials | Champion Choice Martial Arts",
    description: "Read authentic customer reviews and testimonials from satisfied martial arts enthusiasts. Real feedback from taekwondo practitioners about our quality uniforms and equipment.",
    keywords: "customer reviews, testimonials, martial arts reviews, taekwondo uniform reviews, champion choice reviews, customer feedback, martial arts equipment reviews",
    url: "https://www.champzones.com/reviews",
    image: "/images/championchoice-logo.png",
    type: "website"
  };

  // Generate Review Schema for current review
  const generateReviewSchema = () => {
    const currentReviewData = reviews[currentReview];
    const reviewDate = new Date().toISOString();
    
    return {
      "@context": "https://schema.org",
      "@type": "Review",
      "itemReviewed": {
        "@type": "Product",
        "name": currentReviewData.product,
        "brand": {
          "@type": "Brand",
          "name": "Champion Choice"
        },
        "category": "Martial Arts Equipment"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": currentReviewData.rating,
        "bestRating": 5,
        "worstRating": 1
      },
      "author": {
        "@type": "Person",
        "name": currentReviewData.name,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": currentReviewData.location
        }
      },
      "reviewBody": currentReviewData.comment,
      "datePublished": reviewDate,
      "publisher": {
        "@type": "Organization",
        "name": "Champion Choice",
        "url": "https://www.champzones.com"
      }
    };
  };

  // Generate Aggregate Rating Schema
  const generateAggregateRatingSchema = () => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Champion Choice Martial Arts Equipment",
      "brand": {
        "@type": "Brand",
        "name": "Champion Choice"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": averageRating.toFixed(1),
        "reviewCount": reviews.length,
        "bestRating": 5,
        "worstRating": 1
      },
      "review": reviews.map(review => ({
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": 5
        },
        "author": {
          "@type": "Person",
          "name": review.name
        },
        "reviewBody": review.comment,
        "datePublished": new Date().toISOString()
      }))
    };
  };

  // Generate Organization Schema with Reviews
  const generateOrganizationSchema = () => {
    return {
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
        "contactType": "customer service",
        "email": "championhub00@gmail.com"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": reviews.length,
        "bestRating": 5,
        "worstRating": 1
      },
      "review": reviews.slice(0, 5).map(review => ({
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": 5
        },
        "author": {
          "@type": "Person",
          "name": review.name
        },
        "reviewBody": review.comment
      }))
    };
  };

  function getOptimizedCloudinaryUrl(url) {
    if (!url || !url.includes("/upload/")) return url;
    // Avoid double-transforming if already present
    if (url.includes("/upload/w_400")) return url;
    return url.replace("/upload/", "/upload/w_400,h_400,c_fill,q_auto,f_auto/");
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => {
      clearInterval(interval);
      cancelPendingRequests();
    };
  }, [reviews.length]);
  
  let OptimizedProfileUrl = getOptimizedCloudinaryUrl(reviews[currentReview].image)
  
  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        {/* Primary Meta Tags */}
        <title>{seoData.title}</title>
        <meta name="title" content={seoData.title} />
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="author" content="Champion Choice" />
        <meta name="robots" content="index, follow" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={seoData.url} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={seoData.type} />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.image} />
        <meta property="og:site_name" content="Champion Choice" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={seoData.url} />
        <meta property="twitter:title" content={seoData.title} />
        <meta property="twitter:description" content={seoData.description} />
        <meta property="twitter:image" content={seoData.image} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateReviewSchema())
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateAggregateRatingSchema())
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema())
          }}
        />
      </Head>

      <section 
        className="bg-white p-4 my-2"
        itemScope
        itemType="https://schema.org/Review"
      >
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-bold text-gray-800 mb-2"
            itemProp="name"
          >
            Happy Customers
          </h2>
          <p className="text-gray-600">What our customers say about us</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
              {/* Customer Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={OptimizedProfileUrl}
                    alt={reviews[currentReview].name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    itemProp="image"
                  />
                </div>
              </div>

              {/* Review Content */}
              <div className="flex-1 text-center md:text-left">
                {/* Stars */}
                <div 
                  className="flex justify-center md:justify-start mb-2"
                  itemProp="reviewRating"
                  itemScope
                  itemType="https://schema.org/Rating"
                >
                  <meta itemProp="ratingValue" content={reviews[currentReview].rating} />
                  <meta itemProp="bestRating" content="5" />
                  <meta itemProp="worstRating" content="1" />
                  {[...Array(reviews[currentReview].rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>

                {/* Comment */}
                <p 
                  className="text-gray-700 text-lg italic mb-3"
                  itemProp="reviewBody"
                >
                  &ldquo;{reviews[currentReview].comment}&rdquo;
                </p>

                {/* Customer Info */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h4 
                      className="font-semibold text-gray-800"
                      itemProp="author"
                      itemScope
                      itemType="https://schema.org/Person"
                    >
                      <span itemProp="name">{reviews[currentReview].name}</span>
                      <meta itemProp="address" content={reviews[currentReview].location} />
                    </h4>
                    <p className="text-sm text-gray-600">
                      {reviews[currentReview].location}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      Bought: {reviews[currentReview].product}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Indicators */}
          {/* <div className="flex justify-center mt-4 gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === currentReview ? 'bg-[#]' : 'bg-gray-300'
                  }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div> */}
        </div>

        {/* Additional SEO Content */}
        <div className="mt-8 text-center">
          <div 
            itemProp="aggregateRating"
            itemScope
            itemType="https://schema.org/AggregateRating"
            className="hidden"
          >
            <meta itemProp="ratingValue" content="4.8" />
            <meta itemProp="reviewCount" content={reviews.length} />
            <meta itemProp="bestRating" content="5" />
            <meta itemProp="worstRating" content="1" />
          </div>
        </div>
      </section>
    </>
  );
} 
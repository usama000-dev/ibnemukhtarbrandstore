"use client";
import { useState, useEffect, forwardRef, Fragment } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaFire, FaShoppingCart, FaSearchPlus } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartProvider";
import CalculatePrice from "@/utils/priceCalculator";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { Share } from "@mui/icons-material";
import ShareModal from "./ShareModal";
import { motion } from "framer-motion";
import ProductVideo from "@/components/product/ProductVideo";


// Flash Sale Countdown Component
function FlashSaleCountdown({ targetDate, onDaysChange }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate - new Date();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        setTimeLeft({
          days,
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        if (onDaysChange) onDaysChange(days);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onDaysChange) onDaysChange(0);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onDaysChange]);

  return (
    <div className="flex items-center gap-1 text-xs">
      {timeLeft.days > 0 && (
        <span className="bg-red-600 text-white px-1.5 py-0.5 rounded">
          {String(timeLeft.days).padStart(2, "0")}d
        </span>
      )}
      <span className="bg-red-600 text-white px-1.5 py-0.5 rounded">
        {String(timeLeft.hours).padStart(2, "0")}h
      </span>
      <span className="bg-red-600 text-white px-1.5 py-0.5 rounded">
        {String(timeLeft.minutes).padStart(2, "0")}m
      </span>
      <span className="bg-red-600 text-white px-1.5 py-0.5 rounded">
        {String(timeLeft.seconds).padStart(2, "0")}s
      </span>
    </div>
  );
}

// Cloudinary URL optimizer
function getOptimizedCloudinaryUrl(url) {
  if (!url || !url.includes("/upload/")) return url;
  // Avoid double-transforming if already present
  if (url.includes("/upload/w_400")) return url;
  return url.replace("/upload/", "/upload/w_400,h_400,c_fill,q_auto,f_auto/");
}

// Convert ProductCard to forwardRef
const ProductCard = forwardRef(function ProductCard(
  {
    product,
    showDiscountBadge = false,
    showCountdown = false,
    showPriceBadge = false,
    lastUniformElementRef,
  },
  ref
) {
  const [isCart, setIsCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { addToCart, removeFromCart, cart, buyNow } = useCart();
  const [flashDays, setFlashDays] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [openShare, setOpenShare] = useState(false);

  const router = useRouter();

  // ✅ Prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Check if item is in cart on component mount and when cart changes
  useEffect(() => {
    if (isClient && product) {
      const itemKey = product.slug || product.uniformNumberFormat;
      setIsCart(!!cart[itemKey]);
    }
  }, [cart, product?.slug, product?.uniformNumberFormat, isClient]);

  // ✅ Safety check for undefined product
  if (!product) {
    return (
      <div
        ref={ref || lastUniformElementRef}
        className="bg-white rounded-lg overflow-hidden shadow-sm relative animate-pulse"
      >
        <div className="w-full h-40 bg-gray-200"></div>
        <div className="p-2">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded mb-1"></div>
          <div className="h-3 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // ✅ Actual price calculation using discountPercent
  const originalPrice = product.price;

  // Check for flash sale (products and uniforms)
  const now = new Date();
  const isUniformFlashSale =
    product.flashSale === true &&
    product.flashSaleStart &&
    product.flashSaleEnd &&
    new Date(product.flashSaleStart) <= now &&
    new Date(product.flashSaleEnd) >= now &&
    product.flashSalePrice &&
    product.flashSalePrice < product.price;
  const hasFlashSale =
    (product.flashEnd && new Date(product.flashEnd) > now) ||
    isUniformFlashSale;

  // Use flash price if available and flash sale is active, otherwise use regular price
  const basePrice =
    isUniformFlashSale && product.flashSalePrice
      ? product.flashSalePrice
      : product.flashEnd &&
        new Date(product.flashEnd) > now &&
        product.flashPrice
        ? product.flashPrice
        : originalPrice;

  // Discount logic: Only apply discount if flash sale is NOT active
  const discountPercent = product.discountPercent || 0;
  const shouldApplyDiscount = !hasFlashSale && discountPercent > 0;
  const hasDiscount = shouldApplyDiscount;

  const actualPrice = shouldApplyDiscount
    ? basePrice - (basePrice * discountPercent) / 100
    : basePrice;

  let slug = product.slug
    ? `/product/${product.slug}`
    : `/product/${product._id}`;
  let rating = product.rating || 4.2; // Fixed rating instead of random
  const sold = product.sold || 150; // Fixed sold count instead of random

  // ✅ Get image source - handle both product types
  const getImageSource = () => {
    if (product.images && product.images.length > 0) {
      // console.log("Using images array:", product.images[0]);
      return product.images[0];
    }
    if (product.imageUrl) {
      // console.log("Using imageUrl:", product.imageUrl);
      return product.imageUrl;
    }
    // console.log("No image source found");
    return null;
  };

  const imageSource = getOptimizedCloudinaryUrl(getImageSource());

  // Helper to get high-res image (Cloudinary)
  const getHighResImage = () => {
    const src = getImageSource();
    if (!src) return null;
    if (!src.includes("/upload/")) return src;
    // Use 1000x1000 for zoom
    return src.replace(
      /\/upload\/.*?\//,
      "/upload/w_700,h_1050,c_fill,f_auto/"
    );
  };

  // ✅ Get product title
  const getProductTitle = () => {
    if (product.title) {
      return product.title;
    }
    if (product.company) {
      return `${product.company.toUpperCase()}`;
    }
    return "Product";
  };

  // ✅ Get product alt text
  const getProductAlt = () => {
    if (product.title) {
      return product.title;
    }
    if (product.company) {
      return `Taekwondo ${product.company} uniform (${product.size} sized /${product.upperColor} color )`;
    }
    return "Product taekwondo uniform and martial art shirt";
  };

  // ✅ Get available sizes array
  const getAvailableSizes = () => {
    if (!product?.size) return [];
    // Check if size is a string before calling split
    if (typeof product.size !== "string") return [];
    return product.size
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  // ✅ Get available colors array
  const getAvailableColors = () => {
    if (!product?.color) return [];
    // Check if color is a string before calling split
    if (typeof product.color !== "string") return [];
    return product.color
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
  };

  const getCartPrice = () => {
    // Always use discounted price if available, otherwise actual price
    return actualPrice;
  };

  const handleAddToCart = () => {
    if (!isCart) {
      if (product.slug) {
        // Regular product - use selected size and color
        setIsCart(true);
        addToCart(
          product.slug,
          1,
          getCartPrice(),
          `${product.title}(${product.size[0]}/${product.color[0]})`,
          product.size[0],
          product.color[0],
          imageSource
        );
      } else {
        // Uniform product
        setIsCart(true);
        addToCart(
          product.uniformNumberFormat,
          1,
          getCartPrice(),
          product.company,
          product.size,
          product.upperColor,
          imageSource
        );
      }
    } else {
      setIsCart(false);
      if (product.slug) {
        removeFromCart(
          product.slug,
          1,
          product.title,
          product.size,
          product.color,
          getCartPrice()
        );
      } else {
        removeFromCart(
          product.uniformNumberFormat,
          1,
          product.company,
          product.size,
          product.upperColor,
          getCartPrice()
        );
      }
    }
  };

  const handleBuyNow = () => {
    if (product.slug) {
      // Regular product - use selected size and color
      buyNow(
        product.slug,
        1,
        getCartPrice(),
        `${product.title}(${product.size[0]}/${product.color[0]})`,
        product.size[0],
        product.color[0],
        imageSource
      );
    } else {
      // Uniform product
      buyNow(
        product.uniformNumberFormat,
        1,
        getCartPrice(),
        product.company,
        product.size,
        product.upperColor,
        imageSource
      );
    }
  };

  const handleImageError = () => {
    // console.log("Image failed to load:", imageSource);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    // console.log("Image loaded successfully:", imageSource);
    setImageError(false);
    setImageLoading(false);
  };

  const handleHover = () => {
    router.prefetch(`${slug}`);
  };

  const availableSizes = getAvailableSizes();
  const availableColors = getAvailableColors();

  // SEO Structured Data for Product
  const generateProductSchema = () => {
    const productUrl = `https://www.champzones.com${slug}`;
    const productImages = product.images || [imageSource];

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: getProductTitle(),
      description:
        product.disc ||
        product.description ||
        `Buy ${getProductTitle()} - Premium martial arts equipment at Champion Choice`,
      image: productImages.map((img) => `https://www.champzones.com${img}`),
      url: productUrl,
      sku: product.slug || product.uniformNumberFormat,
      mpn: product.uniformNumberFormat || product.slug,
      brand: {
        "@type": "Brand",
        name: "Champion Choice",
      },
      category: product.category || "Martial Arts Equipment",
      offers: {
        "@type": "Offer",
        price: actualPrice,
        priceCurrency: "PKR",
        priceValidUntil: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        availability:
          product.availability > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: productUrl,
        seller: {
          "@type": "Organization",
          name: "Champion Choice",
          url: "https://www.champzones.com",
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating,
        reviewCount: sold,
        bestRating: 5,
        worstRating: 1,
      },
      review: {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: rating,
          bestRating: 5,
        },
        author: {
          "@type": "Person",
          name: "Champion Choice Customer",
        },
        reviewBody: `Great quality ${getProductTitle()} from Champion Choice`,
      },
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Size",
          value: product.size || product.uniformNumberFormat,
        },
        {
          "@type": "PropertyValue",
          name: "Color",
          value: product.color || product.upperColor,
        },
        {
          "@type": "PropertyValue",
          name: "Category",
          value: product.category,
        },
      ],
    };
  };

  // Flash Sale Schema (if applicable)
  const generateFlashSaleSchema = () => {
    if (!hasFlashSale) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: getProductTitle(),
      },
      price: actualPrice,
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
      validFrom: isUniformFlashSale
        ? product.flashSaleStart
        : product.flashStart,
      validThrough: isUniformFlashSale
        ? product.flashSaleEnd
        : product.flashEnd,
      description: `Flash Sale: ${getProductTitle()} at discounted price`,
    };
  };

  return (
    <Fragment>
      {/* SEO Structured Data */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateProductSchema()),
          }}
        />
        {hasFlashSale && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateFlashSaleSchema()),
            }}
          />
        )}
      </Head>

      <div
        onMouseEnter={handleHover} // Desktop
        onTouchStart={handleHover} // Mobile
        onPointerDown={handleHover} // Universal fallback
        ref={ref || lastUniformElementRef}
        className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 relative transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 hover:bg-gradient-to-br hover:from-white hover:via-blue-50 hover:to-purple-50 flex flex-col"
        style={{ minHeight: 260, maxWidth: 210, width: "100%" }}
        itemScope
        itemType="https://schema.org/Product"
      >
        {/* 🔖 Badges */}
        {hasDiscount || product.tags?.includes("bogo") || showPriceBadge ? (
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {/* Discount badge (for both products and uniforms) */}
            {hasDiscount && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded shadow">
                {discountPercent}% OFF
              </span>
            )}
            {/* Existing product tags (e.g. BOGO, showPriceBadge) */}
            {product.tags?.includes("bogo") && (
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded shadow">
                BOGO
              </span>
            )}
            {showPriceBadge && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded shadow">
                {showPriceBadge}
              </span>
            )}
          </div>
        ) : null}

        <div className="flex flex-col gap-1 absolute top-2 right-2 text-red-600 ">
          {/* ❤️ Favorite / Cart Icon */}
          {/* MAIN BUTTON (RING ANIMATION) */}
          <motion.button
            onClick={handleAddToCart}
            className="bg-white/80 p-1 rounded-full z-10 border border-gray-200 shadow transition-colors"
            animate={{
              rotate: [-10, 10, -8, 8, 0],
              scale: [1, 1.08, 1],
            }}
            whileTap={{ scale: 0.85 }}
            transition={{
              duration: 1.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {isCart ? (
              <FaShoppingCart size={20} />
            ) : (
              <AiOutlineShoppingCart size={20} />
            )}
          </motion.button>

          {/* Zoom Icon Overlay */}
          <button
            type="button"
            aria-label="Zoom image"
            onClick={(e) => {
              e.preventDefault();
              setZoomOpen(true);
            }}
            className=" z-10 bg-white/90 rounded-full p-1 shadow border border-gray-300 flex items-center justify-center transition-all duration-200 group-hover:scale-110 focus:outline-none"
            style={{ display: "flex" }}
          >
            <FaSearchPlus className="text-lg text-red-500" />
          </button>

          <button
            className="z-10 bg-white/90 rounded-full p-1 shadow border border-gray-300 flex items-center justify-center transition-all duration-200 group-hover:scale-110 focus:outline-none"
            onClick={() => setOpenShare(true)}
          >
            <Share fontSize="small" />
          </button>

          {/* Share Popup */}
          <ShareModal
            open={openShare}
            setOpen={setOpenShare}
            product={product}
          />
        </div>

        {/* 🖼️ Product Image or Video */}
        <Link href={`${slug}`}>
          <div className="w-full h-32 bg-gray-100 aspect-[3/2] overflow-hidden relative group-hover:bg-blue-50 transition-colors flex items-center justify-center">
            {product.videoUrl ? (
              /* Show video if available */
              <ProductVideo videoUrl={product.videoUrl} autoplay={true} className="w-full h-full" />
            ) : imageSource && !imageError ? (
              /* Show image if no video */
              <>
                <Image
                  src={imageSource}
                  alt={getProductAlt()}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  priority={false}
                  itemProp="image"
                />
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                {imageSource ? "Image not available" : "No Image"}
              </div>
            )}
          </div>
        </Link>

        {/* 📝 Product Info */}
        <div className="p-2 flex-1 flex flex-col gap-1 justify-between">
          <h3
            className="text-[15px] font-semibold line-clamp-2 text-gray-800 group-hover:text-blue-700 transition-colors leading-tight mb-0.5"
            itemProp="name"
          >
            {getProductTitle()}
          </h3>

          {/* Size/Color/Category Display (unchanged) */}
          {product.slug && (
            <>
              <div className="mt-0 text-[12px]">
                Size:
                {product.size.includes("s") && (
                  <span className="border border-gray-500 px-1 mx-1 ">S</span>
                )}
                {product.size.includes("m") && (
                  <span className="border border-gray-500 px-1 mx-1 ">M</span>
                )}
                {product.size.includes("l") && (
                  <span className="border border-gray-500 px-1 mx-1 ">L</span>
                )}
                {product.size.includes("xl") && (
                  <span className="border border-gray-500 px-1 mx-1 ">XL</span>
                )}
                {product.size.includes("xxl") && (
                  <span className="border border-gray-500 px-1 mx-1 ">XXL</span>
                )}
              </div>
              <div className="mt-0 text-[12px] flex flex-row items-center justify-start">
                Color:
                {product.color.includes("gray") && (
                  <button className="border-2 border-gray-300 ml-1 bg-gray-700 rounded-full w-5 h-5 focus:outline-none"></button>
                )}
                {product.color.includes("blue") && (
                  <button className="border-2 border-gray-300 ml-1 bg-blue-700 rounded-full w-5 h-5 focus:outline-none"></button>
                )}
                {product.color.includes("white") && (
                  <button className="border-2 border-gray-300 ml-1 bg-white rounded-full w-5 h-5 focus:outline-none"></button>
                )}
                {product.color.includes("black") && (
                  <button className="border-2 border-gray-300 ml-1 bg-black rounded-full w-5 h-5 focus:outline-none"></button>
                )}
                {product.color.includes("green") && (
                  <button className="border-2 border-gray-300 ml-1 bg-green-700 rounded-full w-5 h-5 focus:outline-none"></button>
                )}
                {product.color.includes("yellow") && (
                  <button className="border-2 border-gray-300 ml-1 bg-yellow-700 rounded-full w-5 h-5 focus:outline-none"></button>
                )}
                {product.color.includes("red") && (
                  <button className="border-2 border-gray-300 ml-1 bg-red-700 rounded-full w-5 h-5 focus:outline-none"></button>
                )}
              </div>
            </>
          )}
          {/* Size Display */}
          {product.uniformNumberFormat && (
            <div className="flex flex-row items-center justify-start">
              <div className="text-[12px]">
                Size:
                <span className=" px-1 text-gray-500  ">{product.size}cm</span>
              </div>
              <div className="text-[12px] flex items-center justify-start">
                Category:
                <button className=" ml-1 flex items-center text-gray-500 justify-center w-4 h-4 focus:outline-none">
                  {product.category.toUpperCase()}
                </button>
              </div>
            </div>
          )}
          {product.uniformNumberFormat && (
            <h4 className="text-xs font-normal line-clamp-2 text-gray-500">
              Product no:{" "}
              <span className="border border-gray-400 p-0.5 rounded bg-gray-50">
                {product.uniformNumberFormat}
              </span>
            </h4>
          )}

          {/* 🔥 Flash Countdown */}
          {hasFlashSale && (
            <div className="flex flex-col justify-start items-start gap-1 my-1">
              <span className="flex items-center gap-0.5 text-xs text-red-600">
                <FaFire className="text-red-600 text-xs" />
                {flashDays > 0 ? "Ends:" : "Ends in:"}
              </span>
              {/* For uniforms, use flashSaleEnd; for products, use flashEnd */}
              <FlashSaleCountdown
                targetDate={
                  isUniformFlashSale
                    ? new Date(product.flashSaleEnd)
                    : product.flashEnd
                      ? new Date(product.flashEnd)
                      : new Date()
                }
                onDaysChange={setFlashDays}
              />
            </div>
          )}

          {/* 💰 Pricing */}
          <div className="flex items-center mt-0">
            <span
              className="text-[#DD8560] font-bold text-[13px]"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <meta itemProp="price" content={actualPrice} />
              <meta itemProp="priceCurrency" content="PKR" />
              <meta
                itemProp="availability"
                content={
                  product.availability > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock"
                }
              />
              Rs.{actualPrice.toFixed(2)}/_
            </span>
            {(hasDiscount || hasFlashSale) &&
              originalPrice > 0 &&
              originalPrice > actualPrice && (
                <span className="text-gray-400 text-[12px] line-through ml-1">
                  Rs.{originalPrice.toFixed(2)}/_
                </span>
              )}
          </div>

          {/* 🌟 Rating & Sold */}
          <div className="flex justify-between items-center">
            <div
              className="flex items-center"
              itemProp="aggregateRating"
              itemScope
              itemType="https://schema.org/AggregateRating"
            >
              <meta itemProp="ratingValue" content={rating} />
              <meta itemProp="reviewCount" content={sold} />
              <meta itemProp="bestRating" content="5" />
              <meta itemProp="worstRating" content="1" />
              <div className="flex text-yellow-400 text-sm">
                {"★".repeat(Math.floor(rating))}
                {"☆".repeat(5 - Math.floor(rating))}
              </div>
              <span className="text-gray-500 text-xs ml-1">
                {rating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-400 text-xs">
              {sold >= 1000
                ? `${(sold / 1000).toFixed(1)}k+ sold`
                : `${sold}+ sold`}
            </span>
          </div>

          {/* 🛒 Buy Button */}

          <motion.button
            onClick={handleBuyNow}
            className="relative w-full mt-1 py-1 rounded-md text-[15px] flex items-center justify-center 
    bg-gradient-to-r from-[#DD8560] to-[#fbbf24] text-white font-bold shadow 
    hover:from-[#c77550] hover:to-yellow-400 transition-all duration-200 overflow-hidden"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [-1, 1, -1, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Waves Effect Behind Button */}
            <span className="absolute inset-0 rounded-md pointer-events-none">
              <motion.span
                className="absolute inset-0 rounded-md bg-white/20"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </span>
            BUY NOW
          </motion.button>
        </div>
        {/*
          Urdu/English:
          - Card ko modern ecommerce style mn beautiful banaya gaya hai.
          - Shadow, border, hover, smooth transition, gradient hover add kiye hain.
          - Buy Now button prominent aur rounded hai.
        */}
      </div>
      {/* Zoom Modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setZoomOpen(false)}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg max-w-full w-[90vw] md:w-[600px] lg:w-[800px] p-2 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-700 bg-white rounded-full p-2 shadow border border-gray-300 z-10"
              onClick={() => setZoomOpen(false)}
              aria-label="Close zoom"
            >
              ✕
            </button>
            {getHighResImage() ? (
              <Image
                src={getHighResImage()}
                alt={getProductAlt()}
                width={800}
                height={800}
                className="object-contain w-full h-auto max-h-[80vh] rounded"
                priority
              />
            ) : (
              <div className="w-full h-80 flex items-center justify-center text-gray-400 text-lg">
                Image not available
              </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
});

export default ProductCard;

"use client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { GoTag } from "react-icons/go";
import { GrDeliver } from "react-icons/gr";
import { HiArrowRight, HiOutlineClock } from "react-icons/hi2";
import { TbRefresh } from "react-icons/tb";
import { toast, ToastContainer } from "react-toastify";
import { useCart } from "../../context/CartProvider";
import BorderSection from "../atom/BorderSection";
import HeadingStyle from "../atom/HeadingStyle";
import LoadingComponent from "../atom/LoadingComponent";
import ProductCard from "../atom/ProductCard";
import ProductGallery from "../atom/ProductGallery";
import CountdownTimer from "../molecules/CountdownTimer";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import ProductVideo from "@/components/product/ProductVideo";

const SlugPage = ({ product, variant, params, productrelatedData }) => {
  const { trackProductView } = useFacebookPixel();
  trackProductView({
    id: product.slug,
    name: product.title,
    price: product.price,
    category: product.category,
  });
  console.log("please chek karo: ", product, variant, productrelatedData);

  const router = useRouter();
  const { addToCart, buyNow } = useCart();

  // Use ref to track if this is the initial render
  const initialRender = useRef(true);

  // Extract all available colors from the variant object
  const allColors = Object.keys(variant);

  // Get all possible sizes across all variants
  const getAllSizes = () => {
    const sizes = new Set();
    allColors.forEach((color) => {
      Object.keys(variant[color] || {}).forEach((size) => {
        sizes.add(size);
      });
    });
    return Array.from(sizes);
  };

  // Find current product's color and size from variant data
  const findCurrentVariant = () => {
    for (const color in variant) {
      for (const size in variant[color]) {
        if (variant[color][size].slug === product.slug) {
          return { color, size };
        }
      }
    }
    // Fallback to first available color and size
    const firstColor = allColors[0];
    const firstSize = firstColor
      ? Object.keys(variant[firstColor] || {})[0]
      : "";
    return { color: firstColor || "", size: firstSize || "" };
  };

  const currentVariant = findCurrentVariant();

  const [selectedColor, setSelectedColor] = useState(currentVariant.color);
  const [selectedSize, setSelectedSize] = useState(currentVariant.size);
  const [pinCode, setPinCode] = useState("");

  // Get available sizes for currently selected color
  const availableSizesForColor = selectedColor
    ? Object.keys(variant[selectedColor] || {})
    : [];

  // Reset initial render flag after first render
  useEffect(() => {
    initialRender.current = false;
  }, []);

  // Auto-navigate when variant changes (except on initial render)
  useEffect(() => {
    if (initialRender.current) return;

    if (
      selectedColor &&
      selectedSize &&
      variant[selectedColor] &&
      variant[selectedColor][selectedSize]
    ) {
      const variantSlug = variant[selectedColor][selectedSize].slug;
      if (variantSlug !== product.slug) {
        console.log("Navigating to variant:", variantSlug);
        router.push(`${process.env.NEXT_PUBLIC_HOST}/product/${variantSlug}`);
      }
    }
  }, [selectedColor, selectedSize, variant, product.slug, router]);

  const checkServiceAbility = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/api/pincode`
      );
      const data = response.data;

      if (!pinCode || pinCode === "") return;

      if (Object.keys(data).includes(pinCode.toString())) {
        toast.success("Congrats! Your pincode is serviceable", {
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
      } else {
        toast.error("Sorry! Your pincode is not serviceable", {
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    } catch (error) {
      console.error("Error fetching Pincode data:", error);
    }
  };

  const onpinChange = (e) => {
    setPinCode(e.target.value);
  };

  // Handlers with immediate navigation
  const handleColorChange = (color) => {
    if (!variant[color]) return;

    const availableSizes = Object.keys(variant[color]);
    let newSize = selectedSize;

    // If current size is not available for new color, use first available size
    if (!availableSizes.includes(selectedSize)) {
      newSize = availableSizes[0];
    }

    setSelectedColor(color);
    setSelectedSize(newSize);

    // Navigation will happen automatically in useEffect
  };

  const handleSizeChange = (size) => {
    const availableColors = allColors.filter(
      (color) => variant[color] && variant[color][size]
    );
    let newColor = selectedColor;

    // If current color is not available for new size, use first available color
    if (!availableColors.includes(selectedColor)) {
      newColor = availableColors[0];
    }

    setSelectedSize(size);
    setSelectedColor(newColor);

    // Navigation will happen automatically in useEffect
  };

  const isHtml = /<\/?[a-z][\s\S]*>/i.test(product.disc);

  if (!params) {
    return <LoadingComponent />;
  }

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <ToastContainer
        position="bottom-left"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="container px-5 py-16 mx-auto">
        <div className="w-full mx-auto flex flex-col md:flex-row md:gap-10 lg:gap-16">
          {/* Left: Product Gallery */}
          <div className="w-full md:w-1/2 flex flex-col justify-start items-center md:items-stretch gap-6">
            <div className="w-full md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]">
              <ProductGallery product={product} />
            </div>
            {product.videoUrl && (
              <div className="w-full md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]">
                <h3 className="text-gray-900 text-lg font-medium mb-2">Product Video</h3>
                <ProductVideo videoUrl={product.videoUrl} autoplay={false} />
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="w-full md:w-1/2 flex flex-col mt-8 md:mt-0">
            <div className="bg-white rounded-lg p-4 md:p-8 shadow-md">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                CHAMPIONCHOICE
              </h2>
              <h1 className="text-gray-900 text-xl md:text-3xl title-font font-medium mb-1">
                {product.title}
                {(selectedSize || selectedColor) && (
                  <>
                    {" "}
                    ({selectedSize ? selectedSize.toUpperCase() : ""}
                    {selectedSize && selectedColor ? "/" : ""}
                    {selectedColor ? selectedColor.toUpperCase() : ""})
                  </>
                )}
              </h1>

              {/* Ratings */}
              <div className="flex mb-4">
                <span className="flex items-center">
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-orange-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-orange-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-orange-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-orange-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-orange-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <span className="text-gray-600 ml-3">4 Reviews</span>
                </span>
              </div>

              {/* Flash Sale */}
              {product.flashPrice &&
                product.flashEnd &&
                new Date(product.flashEnd) > new Date() && (
                  <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-red-500 to-yellow-400 flex flex-col md:flex-row md:items-center md:justify-between gap-2 shadow-lg">
                    <div className="flex items-center gap-2">
                      <span className="bg-white text-red-600 font-bold px-2 py-1 rounded mr-2 text-xs md:text-sm">
                        FLASH SALE
                      </span>
                      <span className="text-white font-semibold text-lg md:text-2xl">
                        Rs.{product.flashPrice}/_
                      </span>
                      <span className="line-through text-white/80 text-sm md:text-base ml-2">
                        Rs.{product.price}/_
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-xs md:text-sm">
                        Ends in:
                      </span>
                      <CountdownTimer targetDate={product.flashEnd} />
                    </div>
                  </div>
                )}

              {/* Size & Color Selection */}
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5 flex-wrap gap-4">
                {/* Color selection */}
                <div className="flex items-center">
                  <span className="mr-3">Color</span>
                  {allColors.map((color) => (
                    <button
                      key={color}
                      className={`border-2 ml-1 rounded-full w-6 h-6 focus:outline-none ${selectedColor === color ? "border-black" : "border-gray-300"} ${variant[color] ? "" : "opacity-50 cursor-not-allowed"}`}
                      style={{ backgroundColor: color }}
                      title={color}
                      onClick={() => variant[color] && handleColorChange(color)}
                      disabled={!variant[color]}
                      type="button"
                    />
                  ))}
                </div>

                {/* Size selection */}
                {availableSizesForColor.length > 0 && (
                  <div className="flex items-center">
                    <span className="mr-3">Size</span>
                    <div className="relative">
                      <select
                        className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10"
                        value={selectedSize}
                        onChange={(e) => handleSizeChange(e.target.value)}
                      >
                        {availableSizesForColor.map((size) => (
                          <option key={size} value={size}>
                            {size.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 9l6 6 6-6"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Price & Actions */}
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:gap-6">
                {product.availability == 0 && (
                  <span className="title-font font-medium text-xl md:text-2xl text-gray-900 ">
                    Out of Stock!
                  </span>
                )}
                {product.availability > 0 && (
                  <HeadingStyle
                    level="7"
                    tag="span"
                    className="text-2xl md:text-3xl text-[#DD8560] font-bold"
                  >
                    Rs.{product.price}/_
                  </HeadingStyle>
                )}
                <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                  <button
                    onClick={() => {
                      buyNow(
                        product.slug,
                        1,
                        product.price,
                        product.title,
                        selectedSize,
                        selectedColor,
                        product.images[0]
                      );
                    }}
                    className=" flex items-center justify-center text-sm text-white bg-black font-normal border-0 py-2 px-4 focus:outline-none hover:bg-[#DD8560] rounded transition-all duration-150"
                  >
                    Buy Now
                  </button>
                  <button
                    disabled={product.availablity ? true : false}
                    onClick={() => {
                      addToCart(
                        product.slug,
                        1,
                        product.price,
                        product.title,
                        selectedSize,
                        selectedColor,
                        product.images[0]
                      );
                    }}
                    className="flex items-center justify-center text-sm text-white bg-[#DD8560]  border-0 py-2 px-4 focus:outline-none hover:bg-black rounded transition-all duration-150"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Description */}
              <span className="leading-relaxed mb-4">
                {isHtml ? (
                  <div
                    className="prose lg:prose-lg sm:prose-sm max-w-none leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.disc }}
                  />
                ) : (
                  <span>{product.disc}</span>
                )}
              </span>

              {/* Product Specifications */}
              {(product.brand || product.material || product.weight || product.dimensions?.length || product.careInstructions || product.warranty || product.sku || product.condition) && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {product.brand && (
                      <div className="flex">
                        <span className="font-medium text-gray-700 w-32">Brand:</span>
                        <span className="text-gray-600">{product.brand}</span>
                      </div>
                    )}
                    {product.material && (
                      <div className="flex">
                        <span className="font-medium text-gray-700 w-32">Material:</span>
                        <span className="text-gray-600">{product.material}</span>
                      </div>
                    )}
                    {product.condition && (
                      <div className="flex">
                        <span className="font-medium text-gray-700 w-32">Condition:</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${product.condition === 'New' ? 'bg-green-100 text-green-800' :
                            product.condition === 'Pre-loved' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}>
                          {product.condition}
                        </span>
                      </div>
                    )}
                    {product.sku && (
                      <div className="flex">
                        <span className="font-medium text-gray-700 w-32">SKU:</span>
                        <span className="text-gray-600 font-mono text-xs">{product.sku}</span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex">
                        <span className="font-medium text-gray-700 w-32">Weight:</span>
                        <span className="text-gray-600">{product.weight}g</span>
                      </div>
                    )}
                    {(product.dimensions?.length || product.dimensions?.width || product.dimensions?.height) && (
                      <div className="flex">
                        <span className="font-medium text-gray-700 w-32">Dimensions:</span>
                        <span className="text-gray-600">
                          {product.dimensions.length && `${product.dimensions.length}cm`}
                          {product.dimensions.width && ` × ${product.dimensions.width}cm`}
                          {product.dimensions.height && ` × ${product.dimensions.height}cm`}
                        </span>
                      </div>
                    )}
                    {product.warranty && (
                      <div className="flex col-span-1 md:col-span-2">
                        <span className="font-medium text-gray-700 w-32">Warranty:</span>
                        <span className="text-gray-600">{product.warranty}</span>
                      </div>
                    )}
                    {product.careInstructions && (
                      <div className="flex col-span-1 md:col-span-2">
                        <span className="font-medium text-gray-700 w-32">Care:</span>
                        <span className="text-gray-600">{product.careInstructions}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pin code check */}
              <div className="pin mt-6 flex space-x-2 text-sm">
                <input
                  placeholder="Please enter pin"
                  onChange={onpinChange}
                  className="px-2 border-2 rounded-md"
                  type="text"
                />
                <button
                  onClick={checkServiceAbility}
                  className="flex ml-4 text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded"
                >
                  Check
                </button>
              </div>
            </div>

            {/* Accordions and Policies */}
            <div className="mt-8">
              <Accordion sx={{ boxShadow: "none", width: "100%" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    className="flex space-x-2 items-center shadow-none"
                    component="h2"
                  >
                    <GrDeliver className="mr-3 text-gray-400" />
                    Free Flat Rate Shipping
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  Your order will be delivered within{" "}
                  <span className="font-medium">3 working days</span>, between (
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  ) - (
                  {new Date(
                    Date.now() + 3 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  ). Delivery charges are applicable.
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ boxShadow: "none", width: "100%" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    className="flex space-x-2 items-center shadow-none"
                    component="span"
                  >
                    <GoTag className="mr-3 text-gray-400" />
                    COD Policy
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  Please note that we do not offer Cash on Delivery (COD). As we
                  deliver through the post office, delivery charges must be paid
                  in advance along with the product price. Orders will only be
                  processed after full payment is received.
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ boxShadow: "none", width: "100%" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    className="flex space-x-2 items-center shadow-none"
                    component="span"
                  >
                    <HiOutlineClock className="mr-3 text-gray-400" />
                    Order Timing Policy
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  Orders placed before 3:00 PM (Monday to Saturday) are
                  processed the same day. Orders placed after 3:00 PM will be
                  processed the next working day. Orders placed on Saturday
                  after 3:00 PM will be processed on Monday, as deliveries and
                  operations are closed on Sunday.
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ boxShadow: "none", width: "100%" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    className="flex space-x-2 items-center shadow-none"
                    component="span"
                  >
                    <TbRefresh className="mr-3 text-gray-400" />
                    Return Policy
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  We offer a hassle-free return policy. If you are not satisfied
                  with your product, you can return it within 1-4 working days
                  after delivery. Please ensure the item is unused and in its
                  original packaging. Return shipping charges may apply.
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="flex flex-col items-center justify-center mt-12">
          <div className="flex flex-col items-center justify-center">
            <HeadingStyle level={"2"} tag={"h2"}>
              You may also like
            </HeadingStyle>
          </div>
          <div className="mb-8 w-full md:w-[60%]">
            <BorderSection className="md:my-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1 md:gap-3">
            {Object.keys(productrelatedData).map((key) => (
              <ProductCard
                key={productrelatedData[key]._id}
                product={productrelatedData[key]}
              />
            ))}
          </div>
          <Link
            href={"/products"}
            className="flex items-center justify-center gap-2 my-8 font-tenor tracking-[1px]"
          >
            Explore More
            <HiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SlugPage;

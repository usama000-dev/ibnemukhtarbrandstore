import Image from "next/image";
import { useState } from "react";
import Zoom from "react-medium-image-zoom";
import 'react-medium-image-zoom/dist/styles.css';
import { FaSearchPlus } from "react-icons/fa";

const ProductGallery = ({ product }) => {
  const images = product.images?.length ? product.images : [product.image];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [mobileZoomOpen, setMobileZoomOpen] = useState(false);

  // Helper: is mobile screen
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="w-full flex flex-col gap-6 px-4">
      {/* Main Image with Zoom */}
      <div className="w-full flex justify-center items-center relative">
        {/* Desktop/Tablet: Zoom on click (default) */}
        <div className="hidden md:block w-full max-w-[500px]">
          <Zoom>
            <Image
              alt={product.title}
              src={selectedImage}
              width={700}
              height={900}
              className="object-cover rounded w-full h-auto max-w-[500px] cursor-zoom-in"
              priority
            />
          </Zoom>
        </div>
        {/* Mobile: Show zoom icon overlay, tap icon or image to zoom */}
        <div className="block md:hidden w-full max-w-[400px] relative">
          <Image
            alt={product.title}
            src={selectedImage}
            width={400}
            height={500}
            className="object-cover rounded w-full h-auto max-w-[400px] cursor-pointer"
            priority
            onClick={() => setMobileZoomOpen(true)}
          />
          {/* Zoom icon overlay */}
          <button
            className="absolute bottom-2 right-2 bg-white/80 rounded-full p-2 shadow-md block md:hidden"
            onClick={() => setMobileZoomOpen(true)}
            aria-label="Zoom image"
            style={{ zIndex: 10 }}
          >
            <FaSearchPlus className="text-xl text-gray-700" />
          </button>
          {/* Mobile zoom modal (uses Zoom for consistency) */}
          {mobileZoomOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setMobileZoomOpen(false)}>
              <Zoom isZoomed>
                <Image
                  alt={product.title}
                  src={selectedImage}
                  width={700}
                  height={900}
                  className="object-contain rounded max-h-[98vh] max-w-[98vw] bg-white"
                />
              </Zoom>
            </div>
          )}
        </div>
      </div>
      {/* Thumbnails */}
      <div className="w-full flex gap-2 mt-4 justify-center lg:justify-start">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`cursor-pointer border-2 rounded ${
              selectedImage === img ? "border-blue-500" : "border-transparent"
            }`}
          >
            <Image
              src={img}
              alt={`thumb-${index}`}
              width={100}
              height={100}
              className="object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;

// components/AdvancedWhatsAppButton.js
"use client";
import { FaWhatsapp, FaTimes, FaInfoCircle } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useGlobalVariabels } from "@/hooks/useGlobalVariabels";
import { usePathname } from "next/navigation";

const AdvancedWhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPageType, setCurrentPageType] = useState("home"); // home, product, other
  const modalRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    // Simple page detection - no complex product detection
    detectPageType();

    // Close modal when clicking outside
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // SIMPLE PAGE DETECTION - No confusing product detection
  const detectPageType = () => {
    const path = window.location.pathname;

    if (path === '/' || path === '/home') {
      setCurrentPageType("home");
      setSelectedProduct(null); // No product on home page
    } else if (path.includes('/product/')) {
      setCurrentPageType("product");
      // Only detect basic product info on actual product pages
      const productTitle = document.querySelector('h1')?.innerText || 'Product';
      setSelectedProduct({
        title: productTitle,
        url: window.location.href
      });
    } else {
      setCurrentPageType("other");
      setSelectedProduct(null);
    }
  };

  // SIMPLE MESSAGE GENERATION - Easy for uneducated users
  const generateMessage = () => {
    let message = "Aslam o alaikum! ChampionChoice se rabta karen:\n\n";

    // Only include product info if we're definitely on a product page
    if (currentPageType === "product" && selectedProduct) {
      message += `Main is product ke bare mein pochna chahta/chahti hun:\n`;
      message += `📦 Product: ${selectedProduct.title}\n`;
      message += `🔗 Link: ${selectedProduct.url}\n\n`;
    } else {
      message += `Main aap ke products ke bare mein pochna chahta/chahti hun.\n\n`;
    }

    // Simple questions in Urdu/English mix (common in Pakistan)
    message += "Mujhe in cheezon ke bare mein malumat chahiye:\n";
    message += "• Product maujood hai ya nahi?\n";
    message += "• Size kya kya available hain?\n";
    message += "• Delivery kitne din mein hogi?\n";
    message += "• Price kya hai?\n\n";
    message += "Shukriya!";

    return encodeURIComponent(message);
  };

  const { whatsappNumber } = useGlobalVariabels();

  const handleWhatsAppClick = () => {
    const phoneNumber = whatsappNumber;
    const message = generateMessage();

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    setIsOpen(false);
  };

  // SIMPLE MODAL - No confusing options
  const getModalContent = () => {
    if (currentPageType === "product") {
      return {
        title: "Product ke bare mein poochain",
        buttonText: "📦 Product ki malumat lein",
        description: "Hum aap ko is product ki tamam details den ge"
      };
    } else {
      return {
        title: "ChampionChoice se rabta karen",
        buttonText: "💬 WhatsApp per message karen",
        description: "Hum aap ko tamam products ki malumat den ge"
      };
    }
  };


  const modalContent = getModalContent();
  const pathname = usePathname();

  if (pathname?.startsWith('/stream')) return null;

  return (
    <>
      {/* Simple WhatsApp Button - Always visible */}
      <div className={`fixed bottom-14 right-4 z-40 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
          title="WhatsApp per message karen"
        >
          <FaWhatsapp className="text-2xl" />
        </button>

        {/* Simple ping animation */}
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-ping"></div>
      </div>

      {/* SIMPLE MODAL - Only one button, no confusing choices */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100"
          >
            {/* Header */}
            <div className="bg-green-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <h3 className="font-bold text-lg">{modalContent.title}</h3>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                <FaTimes />
              </button>
            </div>

            {/* Body - SIMPLE */}
            <div className="p-6">
              <div className="flex items-center mb-4 text-green-600">
                <FaInfoCircle className="mr-2" />
                <span className="text-sm">5 minute mein jawab milega!</span>
              </div>

              {/* Only show product info if definitely on product page */}
              {currentPageType === "product" && selectedProduct && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-2 text-green-800">Aap ka selected product:</h4>
                  <p className="text-sm text-green-700">{selectedProduct.title}</p>
                </div>
              )}

              {/* Single Button - No confusion */}
              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 text-lg font-semibold"
                >
                  <FaWhatsapp className="mr-2 text-xl" />
                  {modalContent.buttonText}
                </button>
              </div>

              {/* Simple benefits in Urdu */}
              <div className="mt-4 text-xs text-gray-600 space-y-1">
                <p>✅ 5 minute mein jawab</p>
                <p>✅ Size malumat</p>
                <p>✅ Delivery time bataein ge</p>
                <p>✅ Cash on delivery available</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdvancedWhatsAppButton;
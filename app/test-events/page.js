"use client";

import { useFacebookPixel } from "@/hooks/useFacebookPixel";

export default function TestEventsPage() {
  const {
    trackEvent,
    trackProductView,
    trackAddToCart,
    trackBuyNowEvent,
    trackCheckout,
    trackPurchase,
  } = useFacebookPixel();

  const testProduct = {
    id: "test123",
    name: "Test Product",
    price: 99.99,
  };

  const testOrder = {
    amount: 99.99,
    currency: "USD",
    products: {
      product: { slug: "test123", quantity: 1 },
    },
  };
  const handleOrder = () => {
    console.log("test order in test event page:" , JSON.parse(JSON.stringify(testOrder)));
    trackPurchase(JSON.parse(JSON.stringify(testOrder)));
    
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Facebook Pixel Events</h1>

      <div className="flex flex-col gap-2" style={{ marginBottom: "20px" }}>
        <button
          className="bg-black rounded-sm py-2 px-4 text-white text-sm"
          onClick={() => trackProductView(testProduct)}
          style={{ marginRight: "10px" }}
        >
          Test Product View
        </button>
        <button
          className="bg-black rounded-sm py-2 px-4 text-white text-sm"
          onClick={() => trackAddToCart(testProduct, 1)}
          style={{ marginRight: "10px" }}
        >
          Test Add to Cart
        </button>
        <button
          className="bg-black rounded-sm py-2 px-4 text-white text-sm"
          onClick={() => trackBuyNowEvent(testProduct, 1)}
          style={{ marginRight: "10px" }}
        >
          Test Buy Now
        </button>
        <button
          className="bg-black rounded-sm py-2 px-4 text-white text-sm"
          onClick={() => trackCheckout([testProduct], testProduct.price)}
          style={{ marginRight: "10px" }}
        >
          Test Checkout
        </button>
        <button
          className="bg-black rounded-sm py-2 px-4 text-white text-sm"
          onClick={handleOrder}
        >
          Test Purchase
        </button>
      </div>

      <p>
        Check Facebook Events Manager to see if these events are being recorded.
      </p>
    </div>
  );
}

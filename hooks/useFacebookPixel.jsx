// hooks/useFacebookPixel.js
"use client";

import { useCallback } from "react";
import {
  trackEvent,
  trackPageView,
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
  trackPurchase,
  trackBuyNow
} from "@/lib/facebookPixel";

export const useFacebookPixel = () => {
  const trackCustomEvent = useCallback((eventName, parameters) => {
    trackEvent(eventName, parameters);
  }, []);

  const trackProductView = useCallback((product) => {
    trackViewContent(product);
  }, []);

  const trackAddToCartEvent = useCallback((product, quantity = 1) => {
    trackAddToCart(product, quantity);
  }, []);

  const trackCheckout = useCallback((products, total) => {
    console.log("in use facebook pixle products: ",products)
    console.log("in use facebook pixle total: ", total)
    trackInitiateCheckout(products, total);
  }, []);

  const trackOrder = useCallback((orderData) => {
    console.log("order data in useFacebookPixel ::",orderData);
    trackPurchase(orderData);
  }, [])
  const trackBuyNowEvent = useCallback((product, quantity = 1) => {
    trackBuyNow(product, quantity);
  }, []);

  return {
    trackEvent: trackCustomEvent,
    trackPageView,
    trackProductView,
    trackAddToCart: trackAddToCartEvent,
    trackCheckout,
    trackPurchase: trackOrder,
    trackBuyNow: trackBuyNowEvent,
  };
};

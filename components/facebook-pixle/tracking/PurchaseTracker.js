'use client'

import { useFacebookPixel } from '@/hooks/useFacebookPixel';
import { useEffect } from 'react';

export default function PurchaseTracker({ orderData }) {
  const { trackPurchase } = useFacebookPixel();

  useEffect(() => {
    if (orderData) {
      trackPurchase(orderData);
    }
  }, [orderData, trackPurchase]);

  return null;
}
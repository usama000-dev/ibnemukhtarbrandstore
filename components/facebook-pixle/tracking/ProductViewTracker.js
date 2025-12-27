'use client'

import { useEffect } from 'react';
import { useFacebookPixel } from '@/hooks/useFacebookPixel';

export default function ProductViewTracker({ product }) {
  const { trackProductView } = useFacebookPixel();

  useEffect(() => {
    if (product) {
      trackProductView(product);
    }
  }, [product, trackProductView]);

  return null;
}
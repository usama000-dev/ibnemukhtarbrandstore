"use client";
// store/productCache.js
import { create } from 'zustand'

export const useProductCache = create((set, get) => ({
  productCache: {},
  setProduct: (slug, data, type) =>
    set((state) => ({
      productCache: {
        ...state.productCache,
        [slug]: { data, type }, // 👈 type: "product" or "uniform"
      },
    })),
  getProduct: (slug) => get().productCache[slug] || null,
}))

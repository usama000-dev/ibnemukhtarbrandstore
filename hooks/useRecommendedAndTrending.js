import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { cancelPendingRequests } from '@/services/api';

// Helper to deduplicate by unique key (for products)
function dedupeByKey(arr, key1, key2) {
  const seen = new Set();
  return arr.filter(item => {
    if (!item) return false;
    const val = item[key1] || item[key2];
    if (!val) return false;
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

export default function useRecommendedAndTrending() {
  const { user, isAdmin, localToken } = useAuth();
  const isLoggedIn = !!(user && typeof user === 'object' && user.email);
  const [orders, setOrders] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forYou, setForYou] = useState([]);
  const [trending, setTrending] = useState([]);
  const [allForYou, setAllForYou] = useState([]);
  const [allTrending, setAllTrending] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // 1. Fetch all products
      const productsRes = await axios.get('/api/getProducts');
      const products = (productsRes.data && Array.isArray(productsRes.data.products)) ? productsRes.data.products : [];
      setAllProducts(products);

      // 2. Fetch orders if logged in
      let userOrders = [];
      if (isLoggedIn && user && user.email && localToken && localToken.value) {
        try {
          const ordersRes = await axios.post('/api/get-orders', { token: localToken.value });
          userOrders = (ordersRes.data && Array.isArray(ordersRes.data.orders)) ? ordersRes.data.orders : [];
        } catch (e) {
          userOrders = [];
        }
      }
      setOrders(userOrders);

      // 3. For You logic
      let matchedProducts = [];
      if (!isLoggedIn || !userOrders.length) {
        // Not logged in or no orders: show popular products
        matchedProducts = products.filter(p => p && p.popular === true);
      } else {
        // Match all categories from ordered products
        const orderedCategories = new Set();
        userOrders.forEach(order => {
          if (order && order.products) {
            Object.values(order.products).forEach(prod => {
              if (!prod || !prod.slug || !prod.category) {
                return;
              }
              orderedCategories.add(String(prod.category).toLowerCase().trim());
            });
          }
        });
        matchedProducts = [];
        orderedCategories.forEach(cat => {
          matchedProducts.push(...products.filter(p => p && String(p.category).toLowerCase().trim() === cat));
        });
      }

      // Dedupe and set
      const dedupedProducts = dedupeByKey(matchedProducts, 'slug', 'uniformNumberFormat');
      setForYou(dedupedProducts.slice(0, 6)); // Show up to 6 for home
      setAllForYou(dedupedProducts); // All for "See All" page

      // 4. Trending logic: always popular products
      const popularProducts = products.filter(p => p && p.popular === true);
      const dedupedTrendingProducts = dedupeByKey(popularProducts, 'slug', 'uniformNumberFormat');
      setTrending(dedupedTrendingProducts.slice(0, 6)); // Show up to 6 for home
      setAllTrending(dedupedTrendingProducts); // All for "See All" page

      setLoading(false);
    }
    fetchData();
    return () => {
      cancelPendingRequests();
    };
  }, [user, localToken]);

  return {
    loading,
    forYou,
    trending,
    allForYou,
    allTrending,
  };
} 
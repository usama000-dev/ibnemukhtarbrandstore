// lib/facebookPixel.js
export const trackEvent = (eventName, parameters = {}) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, parameters);
      console.log(`Facebook Pixel Event: ${eventName}`, parameters);
    }
  };
  
  export const trackPageView = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
      console.log('Facebook Pixel: PageView tracked');
    }
  };
  
  // Standard events for e-commerce
  export const trackViewContent = (product) => {
    trackEvent('ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: 'PKR'
    });
  };
  
  
  export const trackAddToCart = (product, quantity = 1) => {
    console.log("__________________________________________");
    console.log("product:: ",product);
    console.log("product:: ",quantity);
    console.log("__________________________________________");
    
    // Extract the product key and data from your cart structure
    const productKey = Object.keys(product); // Gets the key like "653" or "taekwondo-training-tshirt-mens-sports-fit-black"
    
    const productData = product[productKey]; // Gets the product details
    console.log("__________________________________________");
    console.log("productKey:: ",productKey);
    console.log("productData:: ",productData);
    console.log("__________________________________________")
    trackEvent('AddToCart', {
      content_ids: [productKey], // Use the product key as content_ids
      content_name: productData.name,
      content_type: 'product',
      value: productData.price * quantity,
      currency: 'PKR', // Based on your price values
      quantity: quantity
    });
  };
  export const trackBuyNow = (product, quantity = 1) => {
    trackEvent('BuyNow', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price * quantity,
      currency: 'PKR',
      quantity: quantity
    });
  };
  
  export const trackInitiateCheckout = (cartObj, total) => {
  console.log("_______________________");
  console.log("cartObj:::", cartObj);
  console.log("total:::", total);
  console.log("_______________________");

  // Convert object to array of products with id included
  const productsArray = Object.entries(cartObj).map(([id, data]) => ({
    id,
    ...data
  }));

  trackEvent('InitiateCheckout', {
    content_ids: productsArray.map(p => p.id), // array of IDs
    value: total,
    currency: 'PKR',
    num_items: productsArray.length
  });
};

  
  export const trackPurchase = (orderData) => {
    const products = orderData.products || {};
    console.log('____________________________________');
    
  console.log("order data in facebookPixel ::",orderData);
  console.log("products data in facebookPixel ::",products);
  console.log('____________________________________');
  
    trackEvent("Purchase", {
      value: orderData.amount,
      currency: orderData?.currency || "PKR",
  
      // Product IDs
      content_ids: Object.keys(products).map((key) => {
        const item = products[key];
        return item?.slug
          ? item.slug
          : item?.uniformNumberFormat || "Uniform" + Math.floor(Math.random() * 1000000);
      }),
  
      content_type: "product",
  
      // Product Details
      contents: Object.keys(products).map((key) => {
        const item = products[key];
        return {
          id: item?.slug
            ? item.slug
            : item?.uniformNumberFormat || "Uniform" + Math.floor(Math.random() * 1000000),
          quantity: item?.qty || 1,
        };
      }),
    });
  };
  
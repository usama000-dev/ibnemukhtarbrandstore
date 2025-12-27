// ============================================
// ANNOUNCEMENT BAR - QUICK COPY-PASTE EXAMPLES
// ============================================

// 1. CURRENT IMPLEMENTATION (Already in Home.jsx)
// Purple/Pink/Indigo gradient with welcome messages
<AnnouncementBar 
  messages={[
    'Welcome to Ibnemukhtar Brand Store! خوش آمدید 🎉',
    'Free Shipping on Orders Over Rs. 2000 📦',
    'Limited Time Offer - Up to 30% Off! 🔥',
    'Cash on Delivery Available 💰'
  ]}
  bgColor="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
  speed={25}
  icon="✨"
/>

// ============================================
// 2. FLASH SALE VERSION
// Red/Orange gradient for urgent sales
<AnnouncementBar 
  messages={[
    'Flash Sale! 50% Off Everything! 🔥',
    'Hurry! Limited Time Only! ⏰',
    'Shop Now Before It Ends! 🛍️'
  ]}
  bgColor="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600"
  speed={20}
  icon="🔥"
  separator="⚡"
/>

// ============================================
// 3. ISLAMIC/EID THEME
// Green gradient for Islamic occasions
<AnnouncementBar 
  messages={[
    'Eid Mubarak! عید مبارک 🌙',
    'Special Eid Collection Available 🎁',
    'Free Delivery on All Orders 🚚'
  ]}
  bgColor="bg-gradient-to-r from-green-700 via-emerald-600 to-green-700"
  speed={25}
  icon="🌙"
  textColor="text-white"
/>

// ============================================
// 4. PREMIUM DARK VERSION
// Elegant dark theme
<AnnouncementBar 
  messages={[
    'Premium Quality Products 👑',
    'Trusted by 10,000+ Customers ⭐',
    '100% Original Guarantee ✓'
  ]}
  bgColor="bg-gradient-to-r from-gray-900 via-gray-800 to-black"
  speed={30}
  icon="✨"
  fontSize="text-base"
/>

// ============================================
// 5. WINTER SALE
// Blue/Cyan gradient for winter theme
<AnnouncementBar 
  messages={[
    'Winter Collection Now Available! ❄️',
    'Warm Up with 40% Off! 🧥',
    'Limited Stock - Order Now! 🛒'
  ]}
  bgColor="bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700"
  speed={25}
  icon="❄️"
/>

// ============================================
// 6. NEW ARRIVALS
// Teal/Purple gradient
<AnnouncementBar 
  messages={[
    'New Arrivals Just Landed! 🎁',
    'Latest Fashion Trends 👕',
    'Shop the Collection Now! 🛍️'
  ]}
  bgColor="bg-gradient-to-r from-teal-600 via-purple-600 to-pink-600"
  speed={25}
  icon="✨"
/>

// ============================================
// 7. RAMADAN SPECIAL
// Green with Islamic theme
<AnnouncementBar 
  messages={[
    'Ramadan Kareem! رمضان کریم 🌙',
    'Special Ramadan Offers 🎁',
    'Free Delivery All Month 🚚'
  ]}
  bgColor="bg-gradient-to-r from-green-800 via-emerald-700 to-green-800"
  speed={25}
  icon="🌙"
  height="h-12"
  fontSize="text-base"
/>

// ============================================
// 8. SIMPLE SINGLE MESSAGE
// Minimal version with one message
<AnnouncementBar 
  messages="Free Shipping on Orders Over Rs. 2000! 📦"
  bgColor="bg-gradient-to-r from-blue-600 to-purple-600"
  speed={20}
  icon="🎉"
/>

// ============================================
// 9. ADVANCED VERSION WITH GLOW
// Premium look with all effects
<AnnouncementBarAdvanced 
  messages={[
    'Premium Quality Products 👑',
    'Same Day Dispatch Available 🚀',
    'Trusted by Thousands ⭐'
  ]}
  bgColor="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600"
  speed={20}
  icon="⚡"
  glowEffect={true}
  height="h-14"
  fontSize="text-base md:text-lg"
  fontWeight="font-bold"
/>

// ============================================
// 10. URDU ONLY VERSION
// For Urdu-speaking audience
<AnnouncementBar 
  messages={[
    'خوش آمدید! ہمارے اسٹور میں 🎉',
    'مفت ڈیلیوری 2000 روپے سے زیادہ 📦',
    'کیش آن ڈیلیوری دستیاب 💰'
  ]}
  bgColor="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600"
  speed={30}
  icon="✨"
  fontSize="text-base"
/>

// ============================================
// 11. MINIMAL CLEAN VERSION
// No icons, simple and clean
<AnnouncementBar 
  messages={[
    'Free Shipping Over Rs. 2000',
    'Cash on Delivery Available',
    '100% Original Products'
  ]}
  bgColor="bg-gray-800"
  textColor="text-gray-100"
  speed={25}
  icon=""
  separator="|"
/>

// ============================================
// 12. COLORFUL PARTY VERSION
// Multiple colors for festive occasions
<AnnouncementBar 
  messages={[
    'Big Sale! Up to 70% Off! 🎊',
    'Limited Time Only! 🎉',
    'Shop Now! 🛍️'
  ]}
  bgColor="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600"
  speed={18}
  icon="🎉"
  separator="★"
/>

// ============================================
// HOW TO USE:
// 1. Import the component at the top of your file:
//    import AnnouncementBar from '../atom/AnnouncementBar';
//    OR
//    import AnnouncementBarAdvanced from '../atom/AnnouncementBarAdvanced';
//
// 2. Copy any example above and paste it in your component
//
// 3. Customize the messages, colors, and props as needed
//
// 4. That's it! The animation will work automatically
// ============================================

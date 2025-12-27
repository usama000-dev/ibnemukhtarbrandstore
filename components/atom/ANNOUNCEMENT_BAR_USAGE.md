# Announcement Bar Components - Usage Guide

## Components Created

### 1. **AnnouncementBar.jsx** (Simple & Clean)
Basic animated scrolling announcement bar with smooth animations.

### 2. **AnnouncementBarAdvanced.jsx** (Premium & Animated)
Advanced version with glow effects, shine animations, and background patterns.

---

## How to Use

### Basic Usage (Already Added to Home.jsx)

```jsx
import AnnouncementBar from '../atom/AnnouncementBar';

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
```

### Advanced Usage

```jsx
import AnnouncementBarAdvanced from '../atom/AnnouncementBarAdvanced';

<AnnouncementBarAdvanced 
  messages={[
    'Special Eid Sale - Up to 50% Off! 🌙',
    'New Collection Available Now 🎁',
    'Free Delivery Across Pakistan 🚚'
  ]}
  bgColor="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600"
  speed={20}
  icon="⚡"
  glowEffect={true}
  separator="★"
/>
```

---

## Available Props

### Common Props (Both Components)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `messages` | string or Array<string> | Array of 3 messages | Messages to display in the bar |
| `bgColor` | string | Gradient purple to pink | Tailwind background color class |
| `textColor` | string | 'text-white' | Tailwind text color class |
| `height` | string | 'h-10' or 'h-12' | Tailwind height class |
| `speed` | number | 20-25 | Animation speed in seconds (higher = slower) |
| `fontSize` | string | 'text-sm' | Tailwind font size class |
| `fontWeight` | string | 'font-semibold' or 'font-bold' | Tailwind font weight class |
| `icon` | string | '🎉' or '⚡' | Icon/emoji before each message |
| `pauseOnHover` | boolean | true | Pause animation when hovering |
| `separator` | string | '•' or '★' | Separator between messages |

### Advanced Component Only

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `glowEffect` | boolean | true | Add glow and shine effects |
| `animationType` | string | 'scroll' | Animation type (future feature) |

---

## Usage Examples

### 1. Sale Announcement
```jsx
<AnnouncementBar 
  messages="Flash Sale! 40% Off Everything - Today Only! 🔥"
  bgColor="bg-gradient-to-r from-red-600 to-orange-600"
  speed={15}
  icon="🔥"
/>
```

### 2. Multiple Messages
```jsx
<AnnouncementBar 
  messages={[
    'Free Shipping on Orders Over Rs. 2000',
    'Cash on Delivery Available',
    '100% Original Products',
    'Easy Returns & Exchange'
  ]}
  bgColor="bg-gradient-to-r from-blue-600 to-purple-600"
  speed={30}
  separator="•"
/>
```

### 3. Urdu/English Mix
```jsx
<AnnouncementBar 
  messages={[
    'خوش آمدید - Welcome to Our Store! 🎉',
    'مفت ڈیلیوری - Free Delivery 📦',
    'کیش آن ڈیلیوری دستیاب - COD Available 💰'
  ]}
  bgColor="bg-gradient-to-r from-green-600 to-teal-600"
  speed={25}
  icon="✨"
/>
```

### 4. Premium Look (Advanced Component)
```jsx
<AnnouncementBarAdvanced 
  messages={[
    'Premium Quality Products 👑',
    'Trusted by 10,000+ Customers ⭐',
    'Same Day Dispatch Available 🚀'
  ]}
  bgColor="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600"
  speed={20}
  icon="⚡"
  glowEffect={true}
  height="h-14"
  fontSize="text-base md:text-lg"
/>
```

### 5. Minimal Style
```jsx
<AnnouncementBar 
  messages="New Winter Collection Now Available ❄️"
  bgColor="bg-gray-900"
  textColor="text-gray-100"
  speed={20}
  icon=""
  separator=""
/>
```

---

## Where to Use

You can add these announcement bars anywhere in your application:

1. **Top of Homepage** ✅ (Already added)
2. **Top of Product Pages**
3. **Top of Category Pages**
4. **Above Footer**
5. **In Modal/Popup**
6. **Checkout Page**
7. **Above Navigation**

---

## Color Schemes

### Suggested Gradients

```jsx
// Purple to Pink (Default)
bgColor="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600"

// Blue to Purple
bgColor="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"

// Green to Teal
bgColor="bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600"

// Red to Orange (Sale)
bgColor="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600"

// Dark Elegant
bgColor="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"

// Islamic Green
bgColor="bg-gradient-to-r from-green-700 via-emerald-600 to-green-700"
```

---

## Tips for Best Results

1. **Keep messages short** - 5-10 words per message works best
2. **Use emojis** - They make the bar more eye-catching
3. **Match your brand colors** - Use your brand's color scheme
4. **Don't make it too fast** - Speed 20-30 is ideal for readability
5. **Test on mobile** - Make sure text is readable on small screens
6. **Use contrasting colors** - Ensure text is easily readable

---

## Performance Note

Both components use Framer Motion for smooth animations. The animations are GPU-accelerated and won't impact page performance.

---

## Need Help?

The components are fully customizable through props. Just change the prop values to match your needs!

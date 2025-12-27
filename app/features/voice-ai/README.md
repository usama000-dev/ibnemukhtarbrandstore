# Voice AI Module - Complete Guide

## Overview
AI-powered voice guidance system using Groq AI for dynamic, context-aware responses in Urdu and English.

## Structure
```
app/features/voice-ai/
├── components/
│   ├── VoiceWidget.tsx          # Mic button (manual trigger)
│   └── PageVoiceGuide.tsx       # Auto page guidance (STATIC)
├── hooks/
│   ├── useNativeVoice.ts        # Manual voice control
│   ├── usePageContext.ts        # Page state tracking
│   ├── useAIVoice.ts            # AI voice generation (dynamic)
│   ├── useCheckoutVoice.ts      # Checkout field monitoring
│   └── usePaymentVoice.ts       # Payment tab guidance
├── config/
│   ├── knowledge-base.ts        # Intent patterns
│   ├── payment-details.ts       # Bank account info
│   └── welcome-messages.ts      # Static welcome messages (FAST)
└── models/
    └── VoiceQuestion.js         # Learning database
```

## Usage

### 1. Automatic Page Guidance (Already Integrated)
```javascript
// In layout.js (already done)
import { PageVoiceGuide } from './features/voice-ai';

<PageVoiceGuide />
```

### 2. Checkout Field Guidance
```javascript
// In CheckoutPage.jsx
import { useCheckoutVoice } from '@/app/features/voice-ai';

function CheckoutPage() {
  const [formData, setFormData] = useState({...});
  
  // Add this hook - it will automatically speak when fields are filled
  useCheckoutVoice(formData);
  
  return (...)
}
```

### 3. Payment Tab Guidance
```javascript
// In PaymentMethods.jsx or manual-payment page
import { usePaymentVoice } from '@/app/features/voice-ai';

function PaymentMethods() {
  const [selected, setSelected] = useState('easypaisa');
  
  // Add this hook - it will speak when tab changes
  usePaymentVoice(selected);
  
  return (...)
}
```

## Features

### ✅ Site-Aware Routing (SMART - NEW)
- **Knows ALL pages** on champzones.com (20+ pages)
- **Validates before routing** - No more wrong page navigation
- **Smart keyword matching** - "hoodie" → /hoodies
- **Intelligent suggestions** - "Did you mean hoodies, tshirts?"
- **Multilingual** - English + Urdu keywords

### ✅ Automatic Page Welcome (STATIC - INSTANT)
- **NO AI DELAY** - Hard-coded messages for instant playback
- Homepage: "Champion Choice mein aapka swagat hai..."
- Product: "Is product ke baare mein koi sawal..."
- Checkout: "Checkout page par aapka swagat..."
- **Speed:** Plays within 1 second of page load

### ✅ Checkout Step-by-Step (DYNAMIC - AI)
- Name filled → "Shukriya! Ab email darj karein."
- Email filled → "Perfect! Phone number please."
- Pincode valid → "Mubarak! Area serviceable hai."

### ✅ Payment Method Guidance (STATIC)
- EasyPaisa → Speaks account number
- JazzCash → Speaks account number
- Meezan Bank → Speaks account, IBAN
- COD → "Available hai, Rs. 100 extra charge lagega"

### ✅ AI-Powered Responses (DYNAMIC - for questions only)
- Context-aware (knows user name, cart items)
- Female voice (uses feminine Urdu)
- Natural language (not robotic)

## Payment Details
```javascript
EasyPaisa: 0346-7383686 (Ali Raza)
JazzCash: 0312-0905007 (Ali Raza)
Meezan Bank: 
  - Branch: CHINNIOT BRANCH
  - Account: 48010104279973
  - IBAN: PK58MEZN0048010104279973
  - Title: Ali Raza
COD: Not available
```

## Removal Process
1. Delete `app/features/voice-ai/` folder
2. Delete `app/api/voice/` folder
3. Remove `<PageVoiceGuide />` from `layout.js`
4. Remove `<VoiceWidget />` from `layout.js`
5. Remove imports from `layout.js`

## Environment Variables
```
GROQ_API_KEY=your_key_here
NEXT_PUBLIC_GROQ_API_KEY=your_key_here
```

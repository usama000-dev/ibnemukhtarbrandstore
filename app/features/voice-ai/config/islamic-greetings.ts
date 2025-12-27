// Islamic Greetings & Respectful Language System
// Replaces "swagat" with proper Islamic greetings

export interface GreetingContext {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    location?: string; // Pakistan, India, etc.
    language: 'ur' | 'en';
    isReturningUser: boolean;
}

// Islamic Greetings (Time-based)
export const ISLAMIC_GREETINGS = {
    morning: {
        ur: "Assalam-o-Alaikum! Subah bakhair. Main aapki madad ke liye hazir hoon.",
        en: "Assalam-o-Alaikum! Good morning. I'm here to help you."
    },
    afternoon: {
        ur: "Assalam-o-Alaikum! Kaise hain aap? Main aapki madad kar sakti hoon.",
        en: "Assalam-o-Alaikum! How are you? I can help you."
    },
    evening: {
        ur: "Assalam-o-Alaikum! Sham bakhair. Kya main aapki madad kar sakti hoon?",
        en: "Assalam-o-Alaikum! Good evening. May I help you?"
    },
    night: {
        ur: "Assalam-o-Alaikum! Raat bakhair. Main aapki kya madad kar sakti hoon?",
        en: "Assalam-o-Alaikum! Good night. How may I assist you?"
    }
};

// Page-specific Islamic greetings (NO "swagat")
export const PAGE_GREETINGS = {
    homepage: {
        ur: "Assalam-o-Alaikum! Champion Choice mein aapka khair maqdam. Main aapki shopping assistant hoon.",
        en: "Assalam-o-Alaikum! Welcome to Champion Choice. I am your shopping assistant."
    },
    product_detail: {
        ur: "Assalam-o-Alaikum! Is product ke baare mein koi sawal ho to zaroor poochein.",
        en: "Assalam-o-Alaikum! If you have any questions about this product, please ask."
    },
    checkout: {
        ur: "Assalam-o-Alaikum! Checkout page par aapka khair maqdam. Apni details fill karein.",
        en: "Assalam-o-Alaikum! Welcome to checkout. Please fill in your details."
    },
    payment: {
        ur: "Assalam-o-Alaikum! Payment method select karein. Main aapko account details bataungi.",
        en: "Assalam-o-Alaikum! Select your payment method. I will provide account details."
    },
    contact: {
        ur: "Assalam-o-Alaikum! Contact page par aapka khair maqdam. Hamen message kar sakte hain.",
        en: "Assalam-o-Alaikum! Welcome to contact page. You can message us."
    },
    ai_shopping: {
        ur: "Assalam-o-Alaikum! AI shopping assistant aapki madad ke liye tayar hai.",
        en: "Assalam-o-Alaikum! AI shopping assistant is ready to help."
    },
    products_list: {
        ur: "Assalam-o-Alaikum! Hamari products dekh rahe hain. Koi pasand aaye to batayein.",
        en: "Assalam-o-Alaikum! Browsing our products. Let me know if you like something."
    },
    account: {
        ur: "Assalam-o-Alaikum! Aapke account page par khair maqdam.",
        en: "Assalam-o-Alaikum! Welcome to your account page."
    },
    orders: {
        ur: "Assalam-o-Alaikum! Aapke orders yahan hain. Koi sawal ho to poochein.",
        en: "Assalam-o-Alaikum! Your orders are here. Feel free to ask questions."
    },
    blog: {
        ur: "Assalam-o-Alaikum! Blog section mein khair maqdam. Interesting articles padhein.",
        en: "Assalam-o-Alaikum! Welcome to blog section. Read interesting articles."
    },
    search: {
        ur: "Assalam-o-Alaikum! Search results yahan hain.",
        en: "Assalam-o-Alaikum! Search results are here."
    },
    other: {
        ur: "Assalam-o-Alaikum! Champion Choice mein khair maqdam. Main aapki madad ke liye hazir hoon.",
        en: "Assalam-o-Alaikum! Welcome to Champion Choice. I'm here to help you."
    }
};

// Get time of day
export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return 'morning';      // 5 AM - 12 PM
    if (hour >= 12 && hour < 17) return 'afternoon';   // 12 PM - 5 PM
    if (hour >= 17 && hour < 21) return 'evening';     // 5 PM - 9 PM
    return 'night';                                     // 9 PM - 5 AM
}

// Detect location (simplified - can be enhanced with IP geolocation)
export function detectLocation(): string {
    // Check browser language
    const lang = navigator.language || 'en';

    // Pakistan/Urdu speakers
    if (lang.includes('ur') || lang.includes('pk')) return 'Pakistan';

    // Default
    return 'Pakistan'; // Default to Pakistan for now
}

// Get appropriate greeting
export function getIslamicGreeting(
    pageName: string,
    context?: Partial<GreetingContext>
): string {
    const timeOfDay = context?.timeOfDay || getTimeOfDay();
    const language = context?.language || 'ur';

    // Get page-specific greeting
    const page = pageName as keyof typeof PAGE_GREETINGS;
    const pageGreeting = PAGE_GREETINGS[page] || PAGE_GREETINGS.other;

    return pageGreeting[language];
}

// Get time-based greeting (for general use)
export function getTimeBasedGreeting(language: 'ur' | 'en' = 'ur'): string {
    const timeOfDay = getTimeOfDay();
    return ISLAMIC_GREETINGS[timeOfDay][language];
}

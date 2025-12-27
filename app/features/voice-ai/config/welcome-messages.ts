// Static Welcome Messages - Islamic Greetings
// No AI delay, instant playback with respectful Islamic language

export const WELCOME_MESSAGES = {
    homepage: {
        ur: "Assalam-o-Alaikum! Champion Choice mein aapka khair maqdam. Main aapki shopping assistant hoon. Kya main aapki madad kar sakti hoon?",
        en: "Assalam-o-Alaikum! Welcome to Champion Choice. I am your shopping assistant. How can I help you?"
    },
    product_detail: {
        ur: "Assalam-o-Alaikum! Is product ke baare mein koi sawal ho to zaroor poochein. Main aapki madad ke liye hazir hoon.",
        en: "Assalam-o-Alaikum! If you have any questions about this product, feel free to ask. I'm here to help."
    },
    checkout: {
        ur: "Assalam-o-Alaikum! Checkout page par aapka khair maqdam. Apni details fill karein, main har step mein aapki madad karungi.",
        en: "Assalam-o-Alaikum! Welcome to checkout page. Fill in your details, I will guide you through each step."
    },
    payment: {
        ur: "Assalam-o-Alaikum! Payment method select karein. Main aapko account details bataungi.",
        en: "Assalam-o-Alaikum! Select your payment method. I will provide you the account details."
    },
    contact: {
        ur: "Assalam-o-Alaikum! Contact page par aapka khair maqdam. Aap hamen WhatsApp, call, ya message kar sakte hain.",
        en: "Assalam-o-Alaikum! Welcome to contact page. You can WhatsApp, call, or message us."
    },
    ai_shopping: {
        ur: "Assalam-o-Alaikum! AI shopping assistant aapki madad ke liye tayar hai. Koi bhi product search karein.",
        en: "Assalam-o-Alaikum! AI shopping assistant is ready to help. Search for any product."
    },
    products_list: {
        ur: "Assalam-o-Alaikum! Hamari products dekh rahe hain. Koi pasand aaye to mujhe batayein.",
        en: "Assalam-o-Alaikum! Browsing our products. Let me know if you like something."
    },
    account: {
        ur: "Assalam-o-Alaikum! Aapke account page par khair maqdam. Apni details yahan dekh sakte hain.",
        en: "Assalam-o-Alaikum! Welcome to your account page. You can view your details here."
    },
    orders: {
        ur: "Assalam-o-Alaikum! Aapke orders yahan hain. Koi sawal ho to poochein.",
        en: "Assalam-o-Alaikum! Your orders are here. Feel free to ask any questions."
    },
    blog: {
        ur: "Assalam-o-Alaikum! Blog section mein aapka khair maqdam. Interesting articles padhein.",
        en: "Assalam-o-Alaikum! Welcome to blog section. Read interesting articles."
    },
    search: {
        ur: "Assalam-o-Alaikum! Search results yahan hain. Koi product pasand aaye to batayein.",
        en: "Assalam-o-Alaikum! Search results are here. Let me know if you like any product."
    },
    other: {
        ur: "Assalam-o-Alaikum! Champion Choice mein aapka khair maqdam. Main aapki madad ke liye hazir hoon.",
        en: "Assalam-o-Alaikum! Welcome to Champion Choice. I'm here to help you."
    }
};

// Get welcome message for a page (returns Urdu by default)
export function getWelcomeMessage(pageName: string, language: 'ur' | 'en' = 'ur'): string {
    const page = pageName as keyof typeof WELCOME_MESSAGES;
    return WELCOME_MESSAGES[page]?.[language] || WELCOME_MESSAGES.other[language];
}

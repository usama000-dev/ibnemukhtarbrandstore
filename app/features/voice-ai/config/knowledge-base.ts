// Hardcoded Knowledge Base for Voice AI
// This file contains all initial responses and patterns

export const KNOWLEDGE_BASE = [
    {
        id: 'contact',
        patterns: ['contact', 'rabta', 'رابطہ', 'team', 'call', 'whatsapp', 'message', 'کانٹیکٹ'],
        response: {
            ur: "Theek hai, contact page khol raha hoon. Aap WhatsApp, call, ya message kar sakte hain.",
            en: "Opening contact page. You can WhatsApp, call, or message us."
        },
        action: { type: 'navigate', route: '/contact-us' }
    },
    {
        id: 'cart',
        patterns: ['cart', 'add', 'dalo', 'کارٹ', 'rakh', 'شامل'],
        response: {
            ur: "Ji, cart mein add kar raha hoon.",
            en: "Adding to cart."
        },
        action: { type: 'addCart' }
    },
    {
        id: 'checkout',
        patterns: ['buy', 'khareed', 'خرید', 'checkout', 'order', 'lelo'],
        response: {
            ur: "Checkout page khol raha hoon. Apna naam aur address fill karein.",
            en: "Opening checkout. Please fill your name and address."
        },
        action: { type: 'navigate', route: '/checkout' }
    },
    {
        id: 'search',
        patterns: ['chahiye', 'چاہیے', 'dikhao', 'دکھاؤ', 'show', 'find', 'search'],
        response: {
            ur: "Theek hai, main {{query}} dhoond raha hoon...",
            en: "Sure, searching for {{query}}..."
        },
        action: { type: 'search' }
    }
];

export const FILLER_WORDS = [
    'mujhe', 'mujhay', 'chahiye', 'dikhao', 'show', 'me', 'i', 'need', 'want', 'کو', 'مجھے'
];

// AI Memory - Website Knowledge Base
// This file contains all website data and functions for AI to use

export const AI_MEMORY = {
    // Website Structure (from sitemap)
    routes: {
        static: [
            '/',
            '/about',
            '/contact-us',
            '/checkout',
            '/myaccount',
            '/orders',
            '/login',
            '/signup',
            '/privacy-policy',
            '/refund-policy',
            '/return-policy',
            '/shiping-policy',
            '/terms-conditions'
        ],
        products: [
            '/all-products/trending',
            '/all-products/recommended',
            '/all-products/flash-sale',
            '/tshirts',
            '/hoodies',
            '/mugs',
            '/stickers',
            '/uniforms',
            '/uniforms-company'
        ],
        blog: '/blog'
    },

    // Product Categories (for navigation)
    categories: {
        'shirt': '/tshirts',
        'shirts': '/tshirts',
        'tshirt': '/tshirts',
        'tshirts': '/tshirts',

        'hoodie': '/hoodies',
        'hoodies': '/hoodies',

        'mug': '/mugs',
        'mugs': '/mugs',
        'cup': '/mugs',

        'sticker': '/stickers',
        'stickers': '/stickers',

        'uniform': '/uniforms',
        'uniforms': '/uniforms',
        'dobok': '/uniforms',
        'karate': '/uniforms',
        'taekwondo': '/uniforms',

        'trending': '/all-products/trending',
        'recommended': '/all-products/recommended',
        'flash': '/all-products/flash-sale',
        'sale': '/all-products/flash-sale',

        'contact': '/contact-us',
        'about': '/about',
        'cart': '/cart',
        'checkout': '/checkout',
        'orders': '/orders',
        'account': '/myaccount'
    } as Record<string, string>,

    // Uniform Sizes
    uniformSizes: ['120', '130', '140', '150', '160', '170', '180', '190'],

    // Uniform Categories
    uniformCategories: ['A', 'A+', 'B', 'C', 'D'],

    // Colors (Urdu & English)
    colors: {
        'white': ['white', 'safed', 'سفید'],
        'black': ['black', 'kala', 'کالا'],
        'red': ['red', 'lal', 'سرخ'],
        'blue': ['blue', 'neela', 'نیلا'],
        'yellow': ['yellow', 'peela', 'پیلا'],
        'green': ['green', 'hara', 'ہرا']
    },

    // Intent Keywords
    intents: {
        navigate: ['page', 'kholo', 'open', 'jao', 'dikhaو', 'لے جاؤ', 'کھولو'],
        search: ['dhundo', 'search', 'chahiye', 'find', 'ڈھونڈو', 'چاہیے'],
        filter: ['size', 'category', 'color', 'filter', 'سائز', 'رنگ'],
        addCart: ['cart', 'add', 'dalo', 'کارٹ', 'شامل'],
        checkout: ['buy', 'khareed', 'checkout', 'order', 'خرید']
    }
};

// Helper Functions for AI

/**
 * Detect intent from transcript
 */
export function detectIntent(transcript: string): string {
    const lower = transcript.toLowerCase();

    // Check navigate keywords
    if (AI_MEMORY.intents.navigate.some(k => lower.includes(k))) {
        return 'navigate';
    }

    // Check search keywords
    if (AI_MEMORY.intents.search.some(k => lower.includes(k))) {
        return 'search';
    }

    // Check filter keywords
    if (AI_MEMORY.intents.filter.some(k => lower.includes(k))) {
        return 'filter';
    }

    // Check cart keywords
    if (AI_MEMORY.intents.addCart.some(k => lower.includes(k))) {
        return 'addCart';
    }

    // Check checkout keywords
    if (AI_MEMORY.intents.checkout.some(k => lower.includes(k))) {
        return 'checkout';
    }

    return 'search'; // Default to search
}

/**
 * Find route from category name
 */
export function findRoute(categoryName: string): string | null {
    const lower = categoryName.toLowerCase();
    return AI_MEMORY.categories[lower] || null;
}

/**
 * Extract uniform parameters from transcript
 */
export function extractUniformParams(transcript: string) {
    const params: any = {};

    // Extract size
    const sizeMatch = transcript.match(/(\d{3})\s*(size|cm|سائز)?/i);
    if (sizeMatch && AI_MEMORY.uniformSizes.includes(sizeMatch[1])) {
        params.size = sizeMatch[1];
    }

    // Extract category
    const categoryMatch = transcript.match(/\b([A-D]|A\+)\s*(category|grade|کیٹگری)?/i);
    if (categoryMatch) {
        params.category = categoryMatch[1].toUpperCase();
    }

    // Extract color
    for (const [colorEn, variations] of Object.entries(AI_MEMORY.colors)) {
        if (variations.some(v => transcript.toLowerCase().includes(v))) {
            params.color = colorEn;
            break;
        }
    }

    return params;
}

/**
 * Build filter URL for uniforms
 */
export function buildUniformURL(params: any): string {
    const queryParams = new URLSearchParams();

    if (params.size) queryParams.append('size', params.size);
    if (params.category) queryParams.append('category', params.category);
    if (params.color) queryParams.append('color', params.color);

    const queryString = queryParams.toString();
    return queryString ? `/uniforms?${queryString}` : '/uniforms';
}

/**
 * Extract product name from transcript
 */
export function extractProductName(transcript: string): string {
    // Remove filler words
    const fillers = ['mujhe', 'chahiye', 'dikhao', 'show', 'find', 'search', 'dhundo'];
    let words = transcript.toLowerCase().split(' ');
    words = words.filter(w => !fillers.includes(w) && w.length > 2);
    return words.join(' ');
}

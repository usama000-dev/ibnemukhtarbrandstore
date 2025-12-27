// Function Registry - All Available Voice-Controlled Functions
// AI can execute these functions based on user voice commands

export interface AIFunction {
    name: string;
    description: string;
    keywords: string[]; // Trigger keywords (English + Urdu)
    category: 'shopping' | 'account' | 'search' | 'content';
    requiresAuth: boolean;
    requiresConfirmation: boolean;
    isDestructive: boolean;
    parameters: {
        name: string;
        type: 'string' | 'number' | 'boolean';
        required: boolean;
        description: string;
    }[];
    execute: (params: any, context: any) => Promise<any>;
}

export const FUNCTION_REGISTRY: AIFunction[] = [
    // CART OPERATIONS
    {
        name: 'addToCart',
        description: 'Add current product to cart',
        keywords: ['cart', 'add', 'daal do', 'cart mein', 'کارٹ میں'],
        category: 'shopping',
        requiresAuth: false,
        requiresConfirmation: false,
        isDestructive: false,
        parameters: [
            { name: 'productId', type: 'string', required: false, description: 'Product ID (auto-detected from page)' },
            { name: 'quantity', type: 'number', required: false, description: 'Quantity (default: 1)' }
        ],
        execute: async (params, context) => {
            try {
                // Get product ID from context or params
                const productId = params.productId || context.currentProductId;
                const quantity = params.quantity || 1;

                if (!productId) {
                    return { success: false, message: 'Koi product select nahi hai' };
                }

                // Add to cart (localStorage)
                const cart = JSON.parse(localStorage.getItem('cart') || '{}');
                cart[productId] = (cart[productId] || 0) + quantity;
                localStorage.setItem('cart', JSON.stringify(cart));

                // Trigger cart update event
                window.dispatchEvent(new Event('cartUpdated'));

                return {
                    success: true,
                    message: `Product cart mein add ho gaya hai. Total items: ${Object.keys(cart).length}`
                };
            } catch (error: any) {
                return { success: false, message: `Error: ${error.message}` };
            }
        }
    },

    {
        name: 'clearCart',
        description: 'Clear all items from cart',
        keywords: ['cart khali', 'clear cart', 'remove all', 'سب ہٹا دو'],
        category: 'shopping',
        requiresAuth: false,
        requiresConfirmation: true, // Destructive action
        isDestructive: true,
        parameters: [],
        execute: async (params, context) => {
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('cartUpdated'));
            return { success: true, message: 'Cart khali kar di gayi hai' };
        }
    },

    // COUPON OPERATIONS
    {
        name: 'applyCoupon',
        description: 'Apply discount coupon code',
        keywords: ['coupon', 'discount', 'apply', 'code', 'کوپن'],
        category: 'shopping',
        requiresAuth: false,
        requiresConfirmation: false,
        isDestructive: false,
        parameters: [
            { name: 'code', type: 'string', required: true, description: 'Coupon code' }
        ],
        execute: async (params, context) => {
            try {
                const response = await fetch('/api/apply-coupon', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: params.code })
                });

                const result = await response.json();

                if (result.success) {
                    return {
                        success: true,
                        message: `Coupon apply ho gaya! ${result.discount}% discount mil gaya`
                    };
                } else {
                    return { success: false, message: 'Coupon invalid hai ya expire ho gaya' };
                }
            } catch (error: any) {
                return { success: false, message: 'Coupon apply nahi ho saka' };
            }
        }
    },

    // ORDER TRACKING
    {
        name: 'trackOrder',
        description: 'Track order status',
        keywords: ['track', 'order status', 'kahan hai', 'delivery', 'آرڈر'],
        category: 'account',
        requiresAuth: true,
        requiresConfirmation: false,
        isDestructive: false,
        parameters: [
            { name: 'orderId', type: 'string', required: false, description: 'Order ID (optional, uses last order)' }
        ],
        execute: async (params, context) => {
            try {
                const orderId = params.orderId || context.lastOrderId;

                if (!orderId) {
                    return { success: false, message: 'Koi order nahi mila. Pehle login karein' };
                }

                const response = await fetch(`/api/track-order/${orderId}`);
                const result = await response.json();

                if (result.success) {
                    return {
                        success: true,
                        message: `Aapka order ${result.location} mein hai. Status: ${result.status}`
                    };
                } else {
                    return { success: false, message: 'Order track nahi ho saka' };
                }
            } catch (error: any) {
                return { success: false, message: 'Order tracking mein error aayi' };
            }
        }
    },

    // NEWSLETTER
    {
        name: 'subscribeNewsletter',
        description: 'Subscribe to newsletter',
        keywords: ['newsletter', 'subscribe', 'email updates', 'نیوز لیٹر'],
        category: 'content',
        requiresAuth: false,
        requiresConfirmation: false,
        isDestructive: false,
        parameters: [
            { name: 'email', type: 'string', required: true, description: 'Email address' }
        ],
        execute: async (params, context) => {
            try {
                const response = await fetch('/api/newsletter/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: params.email })
                });

                const result = await response.json();

                if (result.success) {
                    return { success: true, message: 'Newsletter subscribe ho gaya! Shukriya' };
                } else {
                    return { success: false, message: 'Email already subscribed hai' };
                }
            } catch (error: any) {
                return { success: false, message: 'Subscribe nahi ho saka' };
            }
        }
    },

    // SEARCH OPERATIONS
    {
        name: 'searchProducts',
        description: 'Search for products',
        keywords: ['search', 'find', 'dhundo', 'تلاش'],
        category: 'search',
        requiresAuth: false,
        requiresConfirmation: false,
        isDestructive: false,
        parameters: [
            { name: 'query', type: 'string', required: true, description: 'Search query' }
        ],
        execute: async (params, context) => {
            // Navigate to AI shopping with query
            const searchURL = `/ai-shopping?q=${encodeURIComponent(params.query)}`;
            window.location.href = searchURL;
            return { success: true, message: `"${params.query}" search kar rahi hoon` };
        }
    }
];

// Find function by keywords
export function findFunctionByKeywords(transcript: string): AIFunction | null {
    const lower = transcript.toLowerCase();

    for (const func of FUNCTION_REGISTRY) {
        const matched = func.keywords.some(keyword =>
            lower.includes(keyword.toLowerCase())
        );
        if (matched) return func;
    }

    return null;
}

// Extract parameters from transcript
export function extractFunctionParameters(transcript: string, func: AIFunction): any {
    const params: any = {};

    // Extract coupon code (uppercase alphanumeric)
    if (func.name === 'applyCoupon') {
        const match = transcript.match(/([A-Z0-9]{4,})/);
        if (match) params.code = match[1];
    }

    // Extract email
    if (func.name === 'subscribeNewsletter') {
        const emailMatch = transcript.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) params.email = emailMatch[1];
    }

    // Extract search query
    if (func.name === 'searchProducts') {
        // Remove trigger words and extract remaining
        const cleaned = transcript
            .replace(/search|find|dhundo|تلاش/gi, '')
            .trim();
        if (cleaned) params.query = cleaned;
    }

    return params;
}

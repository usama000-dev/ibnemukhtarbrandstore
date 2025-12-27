// Safety Controls - Prevent misuse of voice-controlled functions

export const SAFETY_RULES = {
    // Blocked functions (admin only - NOT accessible via voice)
    blockedFunctions: [
        'deleteUser',
        'createProduct',
        'updateProduct',
        'deleteProduct',
        'modifyOrder',
        'refundPayment',
        'accessAdminPanel',
        'deleteReview',
        'banUser'
    ],

    // Destructive actions requiring explicit confirmation
    destructiveActions: [
        'clearCart',
        'cancelOrder',
        'deleteAccount',
        'removeAllAddresses',
        'unsubscribeNewsletter'
    ],

    // Rate limiting (prevent spam)
    rateLimits: {
        addToCart: { max: 10, window: 60000 }, // 10 per minute
        applyCoupon: { max: 5, window: 60000 }, // 5 per minute
        subscribeNewsletter: { max: 1, window: 3600000 }, // 1 per hour
        trackOrder: { max: 10, window: 60000 }, // 10 per minute
        searchProducts: { max: 20, window: 60000 } // 20 per minute
    },

    // Confirmation phrases
    confirmationPhrases: [
        'yes confirm',
        'han confirm',
        'theek hai confirm',
        'yes',
        'han',
        'ji han'
    ]
};

// Rate limiter
class RateLimiter {
    private attempts: Map<string, number[]> = new Map();

    canExecute(functionName: string): boolean {
        const limit = SAFETY_RULES.rateLimits[functionName as keyof typeof SAFETY_RULES.rateLimits];
        if (!limit) return true;

        const now = Date.now();
        const attempts = this.attempts.get(functionName) || [];

        // Remove old attempts outside window
        const validAttempts = attempts.filter(time => now - time < limit.window);

        // Check if under limit
        if (validAttempts.length >= limit.max) {
            return false;
        }

        // Add new attempt
        validAttempts.push(now);
        this.attempts.set(functionName, validAttempts);

        return true;
    }

    getRemainingTime(functionName: string): number {
        const limit = SAFETY_RULES.rateLimits[functionName as keyof typeof SAFETY_RULES.rateLimits];
        if (!limit) return 0;

        const attempts = this.attempts.get(functionName) || [];
        if (attempts.length === 0) return 0;

        const oldestAttempt = Math.min(...attempts);
        const timeElapsed = Date.now() - oldestAttempt;
        const remaining = limit.window - timeElapsed;

        return Math.max(0, Math.ceil(remaining / 1000)); // seconds
    }
}

export const rateLimiter = new RateLimiter();

// Check if confirmation phrase
export function isConfirmation(transcript: string): boolean {
    const lower = transcript.toLowerCase().trim();
    return SAFETY_RULES.confirmationPhrases.some(phrase =>
        lower.includes(phrase)
    );
}

// Check if function is blocked
export function isBlockedFunction(functionName: string): boolean {
    return SAFETY_RULES.blockedFunctions.includes(functionName);
}

// Check if function is destructive
export function isDestructiveFunction(functionName: string): boolean {
    return SAFETY_RULES.destructiveActions.includes(functionName);
}

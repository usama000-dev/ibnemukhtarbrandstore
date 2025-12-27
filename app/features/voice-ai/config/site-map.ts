// Site Map - All Available Pages on champzones.com (COMPLETE)
// Enhanced with smart routing priorities and purposes

export interface SitePage {
    path: string;
    name: string;
    keywords: string[];
    category: 'product' | 'policy' | 'account' | 'info' | 'shopping';
    description: string;
    purpose: string;
    useWhen: string;
    priority: number;
}

export const SITE_MAP: SitePage[] = [
    // SPECIALIZED SEARCH PAGES (HIGHEST PRIORITY)
    {
        path: '/uniforms-search',
        name: 'Uniform Advanced Search',
        keywords: ['uniform search', 'filter uniform', 'size', 'category', 'color', 'advanced search'],
        category: 'shopping',
        description: 'Advanced uniform search with filters',
        purpose: 'Filter uniforms by size, category, color, company',
        useWhen: 'User wants to filter uniforms with specific parameters (size/category/color)',
        priority: 10 // HIGHEST - Use for filtered queries
    },
    {
        path: '/ai-shopping',
        name: 'AI Shopping',
        keywords: ['ai shopping', 'smart search', 'product search', 'chahiye', 'dhundo'],
        category: 'shopping',
        description: 'AI-powered product search',
        purpose: 'Search products using AI',
        useWhen: 'User searches for specific products ("dobok chahiye")',
        priority: 8
    },

    // PRODUCT PAGES
    {
        path: '/uniforms',
        name: 'Uniforms',
        keywords: ['uniform', 'uniforms', 'martial arts', 'karate', 'taekwondo', 'یونیفارم'],
        category: 'product',
        description: 'Browse all martial arts uniforms',
        purpose: 'Browse all uniforms without filters',
        useWhen: 'User wants to see all uniforms (no specific filters)',
        priority: 5 // Lower than uniforms-search
    },
    {
        path: '/hoodies',
        name: 'Hoodies',
        keywords: ['hoodies', 'hoodie', 'sweatshirt', 'jacket', 'ہوڈی', 'جیکٹ'],
        category: 'product',
        description: 'Hoodies and sweatshirts collection',
        purpose: 'Browse all hoodies',
        useWhen: 'User wants to see hoodies',
        priority: 5
    },
    {
        path: '/tshirts',
        name: 'T-Shirts',
        keywords: ['tshirt', 't-shirt', 'tshirts', 'shirt', 'ٹی شرٹ'],
        category: 'product',
        description: 'T-shirts collection',
        purpose: 'Browse all t-shirts',
        useWhen: 'User wants to see t-shirts',
        priority: 5
    },
    {
        path: '/mugs',
        name: 'Mugs',
        keywords: ['mug', 'mugs', 'cup', 'coffee', 'مگ', 'کپ'],
        category: 'product',
        description: 'Custom mugs collection',
        purpose: 'Browse all mugs',
        useWhen: 'User wants to see mugs',
        priority: 5
    },
    {
        path: '/stickers',
        name: 'Stickers',
        keywords: ['sticker', 'stickers', 'اسٹیکر'],
        category: 'product',
        description: 'Custom stickers collection',
        purpose: 'Browse all stickers',
        useWhen: 'User wants to see stickers',
        priority: 5
    },
    {
        path: '/uniforms-company',
        name: 'Company Uniforms',
        keywords: ['company uniform', 'office uniform', 'کمپنی یونیفارم'],
        category: 'product',
        description: 'Company and office uniforms',
        purpose: 'Browse company/office uniforms',
        useWhen: 'User wants company or office uniforms',
        priority: 6
    },
    {
        path: '/all-products',
        name: 'All Products',
        keywords: ['all products', 'products', 'shop', 'store', 'سب پروڈکٹس'],
        category: 'product',
        description: 'Browse all products',
        purpose: 'See all products in one place',
        useWhen: 'User wants to browse everything',
        priority: 4
    },

    // SHOPPING & SEARCH
    {
        path: '/search',
        name: 'General Search',
        keywords: ['search', 'find', 'dhoondo', 'تلاش'],
        category: 'shopping',
        description: 'General site search',
        purpose: 'Search across entire website',
        useWhen: 'General search query',
        priority: 3
    },
    {
        path: '/checkout',
        name: 'Checkout',
        keywords: ['checkout', 'buy', 'purchase', 'order', 'خریدیں'],
        category: 'shopping',
        description: 'Checkout and place order',
        purpose: 'Complete purchase',
        useWhen: 'User wants to buy/checkout',
        priority: 7
    },

    // ACCOUNT PAGES
    {
        path: '/myaccount',
        name: 'My Account',
        keywords: ['account', 'profile', 'my account', 'اکاؤنٹ'],
        category: 'account',
        description: 'User account and profile',
        purpose: 'View/edit account details',
        useWhen: 'User wants to see account info',
        priority: 5
    },
    {
        path: '/orders',
        name: 'My Orders',
        keywords: ['orders', 'my orders', 'order history', 'آرڈرز'],
        category: 'account',
        description: 'View order history',
        purpose: 'Track and view orders',
        useWhen: 'User wants to see orders',
        priority: 6
    },
    {
        path: '/login',
        name: 'Login',
        keywords: ['login', 'signin', 'sign in', 'لاگ ان'],
        category: 'account',
        description: 'Login to account',
        purpose: 'User authentication',
        useWhen: 'User wants to login',
        priority: 5
    },
    {
        path: '/signup',
        name: 'Sign Up',
        keywords: ['signup', 'register', 'sign up', 'رجسٹر'],
        category: 'account',
        description: 'Create new account',
        purpose: 'New user registration',
        useWhen: 'User wants to create account',
        priority: 5
    },

    // INFO PAGES
    {
        path: '/about',
        name: 'About Us',
        keywords: ['about', 'about us', 'company', 'ہمارے بارے'],
        category: 'info',
        description: 'About Champion Choice',
        purpose: 'Company information',
        useWhen: 'User wants to know about company',
        priority: 3
    },
    {
        path: '/contact-us',
        name: 'Contact Us',
        keywords: ['contact', 'contact us', 'support', 'help', 'رابطہ'],
        category: 'info',
        description: 'Contact and support',
        purpose: 'Get in touch with us',
        useWhen: 'User needs help or wants to contact',
        priority: 6
    },
    {
        path: '/blog',
        name: 'Blog',
        keywords: ['blog', 'articles', 'news', 'بلاگ'],
        category: 'info',
        description: 'Blog and articles',
        purpose: 'Read articles and tips',
        useWhen: 'User wants to read blog',
        priority: 3
    },

    // POLICY PAGES
    {
        path: '/privacy-policy',
        name: 'Privacy Policy',
        keywords: ['privacy', 'privacy policy', 'پرائیویسی'],
        category: 'policy',
        description: 'Privacy policy',
        purpose: 'Privacy information',
        useWhen: 'User wants privacy details',
        priority: 2
    },
    {
        path: '/terms-conditions',
        name: 'Terms & Conditions',
        keywords: ['terms', 'conditions', 'terms and conditions', 'شرائط'],
        category: 'policy',
        description: 'Terms and conditions',
        purpose: 'Terms of service',
        useWhen: 'User wants terms info',
        priority: 2
    },
    {
        path: '/refund-policy',
        name: 'Refund Policy',
        keywords: ['refund', 'refund policy', 'return money', 'واپسی'],
        category: 'policy',
        description: 'Refund policy',
        purpose: 'Refund information',
        useWhen: 'User wants refund details',
        priority: 2
    },
    {
        path: '/return-policy',
        name: 'Return Policy',
        keywords: ['return', 'return policy', 'exchange', 'واپس'],
        category: 'policy',
        description: 'Return and exchange policy',
        purpose: 'Return/exchange info',
        useWhen: 'User wants return details',
        priority: 2
    },
    {
        path: '/shiping-policy',
        name: 'Shipping Policy',
        keywords: ['shipping', 'delivery', 'shipping policy', 'ڈیلیوری'],
        category: 'policy',
        description: 'Shipping and delivery policy',
        purpose: 'Shipping information',
        useWhen: 'User wants delivery details',
        priority: 2
    }
];

// Find page by keyword with priority consideration
export function findPageByKeyword(query: string): SitePage | null {
    const lowerQuery = query.toLowerCase().trim();

    // First try exact path match
    const exactMatch = SITE_MAP.find(page =>
        page.path.toLowerCase() === `/${lowerQuery}` ||
        page.path.toLowerCase() === lowerQuery
    );
    if (exactMatch) return exactMatch;

    // Then try keyword match - sort by priority
    const keywordMatches = SITE_MAP.filter(page =>
        page.keywords.some(keyword =>
            lowerQuery.includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(lowerQuery)
        )
    ).sort((a, b) => b.priority - a.priority); // Higher priority first

    if (keywordMatches.length > 0) return keywordMatches[0];

    // Try name match
    const nameMatch = SITE_MAP.find(page =>
        page.name.toLowerCase().includes(lowerQuery) ||
        lowerQuery.includes(page.name.toLowerCase())
    );
    if (nameMatch) return nameMatch;

    return null;
}

// Get all pages in a category
export function getPagesByCategory(category: SitePage['category']): SitePage[] {
    return SITE_MAP.filter(page => page.category === category);
}

// Get page suggestions (for "did you mean?")
export function getSimilarPages(query: string, limit: number = 3): SitePage[] {
    const lowerQuery = query.toLowerCase();

    // Score each page based on similarity
    const scored = SITE_MAP.map(page => {
        let score = 0;

        // Check keywords
        page.keywords.forEach(keyword => {
            if (keyword.toLowerCase().includes(lowerQuery)) score += 3;
            if (lowerQuery.includes(keyword.toLowerCase())) score += 2;
        });

        // Check name
        if (page.name.toLowerCase().includes(lowerQuery)) score += 2;
        if (lowerQuery.includes(page.name.toLowerCase())) score += 1;

        // Boost by priority
        score += page.priority * 0.1;

        return { page, score };
    });

    // Return top matches
    return scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.page);
}

// Validate if page exists
export function isValidPage(path: string): boolean {
    return SITE_MAP.some(page => page.path === path);
}

// Get all product pages
export function getProductPages(): SitePage[] {
    return getPagesByCategory('product');
}

// Get specialized search pages
export function getSearchPages(): SitePage[] {
    return SITE_MAP.filter(page =>
        page.category === 'shopping' && page.priority >= 8
    );
}

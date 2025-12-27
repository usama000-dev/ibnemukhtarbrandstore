'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export interface PageContext {
    page: string;
    pageName: string;
    userName: string | null;
    isLoggedIn: boolean;
    cartCount: number;
    checkoutStep: number;
    paymentTab: string | null;
    productData: any | null;
}

export function usePageContext() {
    const pathname = usePathname();
    const [context, setContext] = useState<PageContext>({
        page: '/',
        pageName: 'homepage',
        userName: null,
        isLoggedIn: false,
        cartCount: 0,
        checkoutStep: 0,
        paymentTab: null,
        productData: null
    });

    useEffect(() => {
        // Get user info from localStorage
        const email = localStorage.getItem('email');
        const userName = localStorage.getItem('name') || localStorage.getItem('userName');

        // Get cart from localStorage
        let cartCount = 0;
        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '{}');
            cartCount = Object.keys(cart).length;
        } catch (e) {
            cartCount = 0;
        }

        // Determine page name from pathname
        let pageName = 'homepage';
        if (pathname === '/') pageName = 'homepage';
        else if (pathname.startsWith('/product/')) pageName = 'product_detail';
        else if (pathname === '/checkout') pageName = 'checkout';
        else if (pathname === '/checkout/manual-payment') pageName = 'payment';
        else if (pathname.startsWith('/all-products')) pageName = 'products_list';
        else if (pathname === '/contact-us') pageName = 'contact';
        else if (pathname === '/ai-shopping') pageName = 'ai_shopping';
        else if (pathname === '/search') pageName = 'search';
        else if (pathname === '/myaccount') pageName = 'account';
        else if (pathname === '/orders') pageName = 'orders';
        else if (pathname.startsWith('/blog')) pageName = 'blog';
        else pageName = 'other';

        setContext({
            page: pathname,
            pageName,
            userName: userName || null,
            isLoggedIn: !!email,
            cartCount,
            checkoutStep: 0,
            paymentTab: null,
            productData: null
        });
    }, [pathname]);

    // Method to update context (for checkout steps, payment tabs, etc.)
    const updateContext = (updates: Partial<PageContext>) => {
        setContext(prev => ({ ...prev, ...updates }));
    };

    return { context, updateContext };
}

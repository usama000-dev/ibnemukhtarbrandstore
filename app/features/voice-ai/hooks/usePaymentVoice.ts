'use client';

import { useEffect, useRef } from 'react';
import { useAIVoice } from './useAIVoice';
import { usePageContext } from './usePageContext';
import { PAYMENT_VOICE_SCRIPTS } from '../config/payment-details';

export function usePaymentVoice(selectedTab: string) {
    const { speak } = useAIVoice();
    const { context } = usePageContext();
    const lastTabRef = useRef<string>('');

    useEffect(() => {
        // Only speak if tab actually changed
        if (selectedTab && selectedTab !== lastTabRef.current) {
            lastTabRef.current = selectedTab;

            // Wait a moment for tab animation to complete
            setTimeout(() => {
                const script = PAYMENT_VOICE_SCRIPTS[selectedTab as keyof typeof PAYMENT_VOICE_SCRIPTS];
                if (script) {
                    // Use Urdu script by default
                    speak(script.ur);
                }
            }, 800);
        }
    }, [selectedTab, speak]);

    return { lastTabRef };
}

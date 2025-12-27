'use client';

import { useEffect, useRef } from 'react';
import { usePageContext } from '../hooks/usePageContext';
import { getWelcomeMessage } from '../config/welcome-messages';

export default function PageVoiceGuide() {
    const { context } = usePageContext();
    const hasSpokenRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        // Don't speak if already spoken for this page in this session
        const sessionKey = `voice-${context.page}`;
        if (sessionStorage.getItem(sessionKey)) {
            return;
        }

        // Wait 1 second after page load (reduced from 2 seconds for faster response)
        const timer = setTimeout(() => {
            if (!hasSpokenRef.current.has(context.page)) {
                hasSpokenRef.current.add(context.page);
                sessionStorage.setItem(sessionKey, 'true');

                // Get static welcome message for this page
                const message = getWelcomeMessage(context.pageName, 'ur');

                // Speak immediately using native browser TTS (no AI delay)
                if (window.speechSynthesis && message) {
                    const utterance = new SpeechSynthesisUtterance(message);

                    // Try to use female voice
                    const voices = window.speechSynthesis.getVoices();
                    const femaleVoice = voices.find(v =>
                        v.name.toLowerCase().includes('female') ||
                        v.name.toLowerCase().includes('samantha') ||
                        v.name.toLowerCase().includes('google')
                    );
                    if (femaleVoice) utterance.voice = femaleVoice;

                    utterance.rate = 1.0;
                    utterance.pitch = 1.1;
                    utterance.lang = 'ur-PK';

                    window.speechSynthesis.speak(utterance);
                    console.log('🎙️ Static Welcome:', message);
                }
            }
        }, 1000); // Reduced to 1 second for faster playback

        return () => clearTimeout(timer);
    }, [context.page, context.pageName]);

    // This component doesn't render anything
    return null;
}

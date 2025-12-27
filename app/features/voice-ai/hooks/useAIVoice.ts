'use client';

import { useState, useCallback } from 'react';
import Groq from 'groq-sdk';
import { PageContext } from './usePageContext';

const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || '',
    dangerouslyAllowBrowser: true // For client-side usage
});

export function useAIVoice() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [lastSpoken, setLastSpoken] = useState<string>('');

    const speak = useCallback((text: string) => {
        if (!window.speechSynthesis) return;

        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);

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

        utterance.onend = () => {
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
        setLastSpoken(text);
    }, []);

    const generateAndSpeak = useCallback(async (context: PageContext, task: string, additionalInfo?: any) => {
        let countdownInterval: NodeJS.Timeout | undefined;
        try {
            // Start thinking state with countdown
            setIsThinking(true);
            setCountdown(3);

            // Countdown timer
            countdownInterval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            const systemPrompt = `You are a helpful FEMALE AI assistant for Champion Choice e-commerce website.

CRITICAL RULES:
1. You are FEMALE - always use feminine language in Urdu: "main karungi" (NOT "karunga"), "main hoon" (feminine)
2. Keep responses under 15 seconds (max 30 words)
3. Speak in Roman Urdu if user is Pakistani, English if needed
4. Be warm, helpful, and respectful
5. Address user as "${context.userName || 'sir'}"

Current Context:
- Page: ${context.pageName}
- User: ${context.userName || 'Guest'}
- Logged In: ${context.isLoggedIn}
- Cart Items: ${context.cartCount}
- Task: ${task}
${additionalInfo ? `- Additional Info: ${JSON.stringify(additionalInfo)}` : ''}

Generate a natural, helpful voice response for this situation.`;

            const completion = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Generate voice guidance for: ${task}` }
                ],
                temperature: 0.7,
                max_tokens: 100
            });

            const response = completion.choices[0].message.content || '';
            console.log('🎙️ AI Voice:', response);

            // Stop thinking, start speaking
            if (countdownInterval) clearInterval(countdownInterval);
            setIsThinking(false);
            setCountdown(0);
            speak(response);
            return response;

        } catch (error) {
            console.error('AI Voice Error:', error);
            if (countdownInterval) clearInterval(countdownInterval);
            setIsThinking(false);
            setCountdown(0);
            // Fallback to simple message
            speak("Main aapki madad ke liye hazir hoon.");
            return null;
        }
    }, [speak]);

    const stopSpeaking = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return {
        isSpeaking,
        isThinking,
        countdown,
        lastSpoken,
        speak,
        generateAndSpeak,
        stopSpeaking
    };
}

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function useNativeVoice() {
    const router = useRouter();
    const [state, setState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
    const [transcript, setTranscript] = useState('');

    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthesisRef.current = window.speechSynthesis;

            // @ts-ignore
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'ur-PK';

                recognition.onstart = () => setState('listening');

                recognition.onresult = (event: any) => {
                    const text = event.results[0][0].transcript;
                    console.log('🎤 Heard:', text);
                    setTranscript(text);
                    handleVoiceIntent(text);
                };

                recognition.onerror = (event: any) => {
                    console.error('Mic Error:', event.error);
                    setState('idle');
                };

                recognitionRef.current = recognition;
            }
        }
    }, []);

    const speak = (text: string) => {
        if (!synthesisRef.current) return;

        setState('speaking');
        const utterance = new SpeechSynthesisUtterance(text);

        const voices = synthesisRef.current.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('ur') || v.name.includes('Google'));
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        utterance.lang = 'ur-PK';

        utterance.onend = () => {
            setState('idle');
        };

        synthesisRef.current.speak(utterance);
    };

    const handleVoiceIntent = async (text: string) => {
        setState('processing');

        try {
            const res = await fetch('/api/voice/intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript: text, language: 'ur' }),
            });

            const data = await res.json();

            console.log('🧠 Intent:', data.intent, 'Action:', data.action);

            if (data.response) {
                speak(data.response);
            }

            if (data.action) {
                executeAction(data.action);
            }

        } catch (err) {
            console.error('Intent Error:', err);
            speak("Maaf kijiye, kuch masla ho gaya.");
            setState('idle');
        }
    };

    const executeAction = (action: any) => {
        switch (action.type) {
            case 'search':
                if (action.payload.query) {
                    router.push(`/ai-shopping?q=${encodeURIComponent(action.payload.query)}`);
                }
                break;

            case 'navigate':
                router.push(action.route);
                break;

            case 'addCart':
                console.log('Add to cart action');
                break;

            default:
                console.log('Unknown action:', action.type);
        }
    };

    const startListening = useCallback(() => {
        if (synthesisRef.current?.speaking) {
            synthesisRef.current.cancel();
        }

        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.warn('Recognition already started');
            }
        } else {
            alert('Voice recognition not supported. Please use Chrome.');
        }
    }, []);

    const stopForced = useCallback(() => {
        if (recognitionRef.current) recognitionRef.current.stop();
        if (synthesisRef.current) synthesisRef.current.cancel();
        setState('idle');
    }, []);

    return {
        state,
        transcript,
        startListening,
        stopForced
    };
}

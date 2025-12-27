'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { useRouter } from 'next/navigation';

// Declare global type for Vapi to avoid TS errors
const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');

export function useVapi() {
    const router = useRouter();
    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [volume, setVolume] = useState(0);

    // Safety Timeout Ref
    const connectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // ✅ Initialize Vapi Events
    useEffect(() => {
        const onCallStart = () => {
            console.log('🎤 Vapi Event: call-start');
            setConnecting(false);
            setConnected(true);
            if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
        };

        const onCallEnd = () => {
            console.log('🛑 Vapi Event: call-end');
            setConnecting(false);
            setConnected(false);
            setIsSpeaking(false);
            if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
        };

        const onError = (e: any) => {
            console.error('❌ Vapi Event: error', e);
            setConnecting(false);
            setConnected(false);
            if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
        };

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
        const onVolumeLevel = (level: number) => setVolume(level);

        const onMessage = (message: any) => {
            if (message.type === 'function-call' && message.functionCall.name === 'performSearch') {
                const query = message.functionCall.parameters.query;
                if (query) {
                    console.log('🛒 AI performSearch:', query);
                    router.push(`/ai-shopping?q=${encodeURIComponent(query)}`);
                }
            }
        };

        // Attach Listeners
        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('volume-level', onVolumeLevel);
        vapi.on('message', onMessage);

        return () => {
            // Cleanup Listeners
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('error', onError);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('volume-level', onVolumeLevel);
            vapi.off('message', onMessage);
        };
    }, [router]);

    // ✅ Start Call with Diagnostics
    const startCall = useCallback(async () => {
        const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
        const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

        console.log('🚀 Starting Vapi Call...');
        console.log(`🔑 Public Key Present: ${!!publicKey}`);
        console.log(`🤖 Assistant ID Present: ${!!assistantId}`);

        if (!assistantId || !publicKey) {
            alert('Missing API Keys. Please restart your server (npm run dev).');
            return;
        }

        setConnecting(true);

        // Safety Valve: Force stop loading after 15 seconds if nothing happens
        connectTimeoutRef.current = setTimeout(() => {
            if (!connected) {
                console.warn('⚠️ Connection Timeout: Vapi did not respond in 15s.');
                setConnecting(false);
                alert('Connection timed out. Please check your internet or microphone permissions.');
            }
        }, 15000);

        try {
            await vapi.start(assistantId);
            console.log('✅ vapi.start() called successfully');
        } catch (err) {
            console.error('❌ Failed to execute vapi.start():', err);
            setConnecting(false);
            if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
            alert('Failed to connect to AI. Check console logs.');
        }
    }, [connected]);

    const stopCall = useCallback(() => {
        vapi.stop();
    }, []);

    const toggleCall = useCallback(() => {
        if (connected) {
            stopCall();
        } else {
            startCall();
        }
    }, [connected, startCall, stopCall]);

    return {
        connecting,
        connected,
        isSpeaking,
        volume,
        toggleCall,
    };
}

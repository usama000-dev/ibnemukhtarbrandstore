'use client';
import { useNativeVoice } from '../hooks/useNativeVoice';
import { useAIVoice } from '../hooks/useAIVoice';
import { AnimatePresence, motion } from 'framer-motion';

export default function VoiceWidget() {
    const { state, startListening, stopForced } = useNativeVoice();
    const { isThinking, countdown } = useAIVoice();

    const isActive = state !== 'idle';
    const isListening = state === 'listening';
    const isProcessing = state === 'processing' || isThinking;
    const isSpeaking = state === 'speaking';

    // Determine button color based on state
    let buttonColor = 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/50'; // Default (idle)
    let buttonShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.25)";

    if (isListening) {
        buttonColor = 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/50';
        buttonShadow = "0 0 30px rgba(59, 130, 246, 0.6)";
    } else if (isProcessing) {
        buttonColor = 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/50';
        buttonShadow = "0 0 30px rgba(234, 179, 8, 0.6)";
    } else if (isSpeaking) {
        buttonColor = 'bg-green-500 hover:bg-green-600 shadow-green-500/50';
        buttonShadow = "0 0 30px rgba(34, 197, 94, 0.6)";
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-20 right-0 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-xl mb-2 whitespace-nowrap border border-white/10 shadow-xl"
                    >
                        <div className="flex items-center gap-2">
                            {isListening && <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                            {isProcessing && <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" />}
                            {isSpeaking && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}

                            <span className="text-sm font-medium">
                                {isListening && "Listening..."}
                                {isProcessing && (
                                    <span className="flex items-center gap-2">
                                        Thinking...
                                        {countdown > 0 && (
                                            <span className="text-yellow-300 font-bold text-lg">
                                                {countdown}
                                            </span>
                                        )}
                                    </span>
                                )}
                                {isSpeaking && "Speaking..."}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={isActive ? stopForced : startListening}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${buttonColor}`}
                animate={{
                    boxShadow: buttonShadow
                }}
            >
                {isActive ? (
                    <div className="flex gap-1 items-center h-6">
                        <motion.div
                            animate={{ height: [10, 20, 10] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                            className="w-1 bg-white rounded-full"
                        />
                        <motion.div
                            animate={{ height: [15, 25, 15] }}
                            transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                            className="w-1 bg-white rounded-full"
                        />
                        <motion.div
                            animate={{ height: [10, 20, 10] }}
                            transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                            className="w-1 bg-white rounded-full"
                        />
                    </div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                )}
            </motion.button>
        </div>
    );
}

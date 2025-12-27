// Voice AI Module - Single Export Point
// Import this in layout.js: import VoiceWidget from '@/app/features/voice-ai'

export { default } from './components/VoiceWidget';
export { default as PageVoiceGuide } from './components/PageVoiceGuide';
export { useNativeVoice } from './hooks/useNativeVoice';
export { usePageContext } from './hooks/usePageContext';
export { useAIVoice } from './hooks/useAIVoice';
export { useCheckoutVoice } from './hooks/useCheckoutVoice';
export { usePaymentVoice } from './hooks/usePaymentVoice';
export { KNOWLEDGE_BASE } from './config/knowledge-base';
export { PAYMENT_DETAILS, PAYMENT_VOICE_SCRIPTS } from './config/payment-details';
export { WELCOME_MESSAGES, getWelcomeMessage } from './config/welcome-messages';
export { SITE_MAP, findPageByKeyword, isValidPage, getSimilarPages, getProductPages } from './config/site-map';
export { ISLAMIC_GREETINGS, PAGE_GREETINGS, getIslamicGreeting, getTimeBasedGreeting, getTimeOfDay } from './config/islamic-greetings';
export { FUNCTION_REGISTRY, findFunctionByKeywords, extractFunctionParameters } from './config/function-registry';
export { FunctionExecutor } from './utils/function-executor';
export { SAFETY_RULES, rateLimiter, isConfirmation } from './config/safety-controls';
export * from './config/ai-memory';


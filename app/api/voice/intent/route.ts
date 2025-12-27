import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import VoiceQuestion from '@/app/features/voice-ai/models/VoiceQuestion';
import { KNOWLEDGE_BASE, FILLER_WORDS } from '@/app/features/voice-ai/config/knowledge-base';
import { detectIntent, findRoute, extractUniformParams, buildUniformURL, extractProductName } from '@/app/features/voice-ai/config/ai-memory';
import { findPageByKeyword, getSimilarPages, SITE_MAP } from '@/app/features/voice-ai/config/site-map';
import { FunctionExecutor } from '@/app/features/voice-ai/utils/function-executor';
import { rateLimiter, isConfirmation } from '@/app/features/voice-ai/config/safety-controls';
import { connectDb } from '@/middleware/mongodb';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Cache for selected model (refreshes on server restart)
let selectedModel: string | null = null;

// Dynamic model selection
async function selectBestModel(): Promise<string> {
    if (selectedModel) return selectedModel;

    try {
        const models = await groq.models.list();

        // Prefer models with good multilingual support
        const preferredModels = [
            'llama-3.3-70b-versatile',
            'llama-3.1-70b-versatile',
            'mixtral-8x7b-32768',
            'llama3-70b-8192'
        ];

        for (const preferred of preferredModels) {
            const found = models.data.find((m: any) => m.id === preferred);
            if (found) {
                selectedModel = preferred;
                console.log('🤖 Selected Model:', selectedModel);
                return selectedModel;
            }
        }

        // Fallback to first available model
        selectedModel = models.data[0]?.id || 'llama-3.3-70b-versatile';
        console.log('🤖 Fallback Model:', selectedModel);
        return selectedModel;

    } catch (error) {
        console.warn('Model selection failed, using default');
        return 'llama-3.3-70b-versatile';
    }
}

const SYSTEM_PROMPT = `Assalam-o-Alaikum! You are the CHAMPION CHOICE SMART Voice Assistant with COMPLETE knowledge of champzones.com.

LANGUAGE RULES:
- Detect user's language (Urdu/English)
- Reply in Roman Urdu for Urdu speakers: "Ji sir, main aapki madad karungi"
- You are FEMALE: use "karungi" not "karunga", "main hoon" (feminine)
- Keep responses under 20 words
- Use Islamic respectful language: "Assalam-o-Alaikum", "khair maqdam", "Shukriya"

COMPLETE WEBSITE KNOWLEDGE:

SPECIALIZED SEARCH PAGES (USE THESE FIRST):
- /uniforms-search - ADVANCED uniform filtering (size/category/color)
- /ai-shopping - AI product search ("dobok chahiye")

PRODUCT PAGES:
- /uniforms - Browse ALL uniforms (NO filters)
- /hoodies - Browse hoodies
- /tshirts - Browse t-shirts
- /mugs - Browse mugs
- /stickers - Browse stickers
- /uniforms-company - Company uniforms
- /all-products - All products

SHOPPING PAGES:
- /checkout - Checkout
- /search - General search

ACCOUNT PAGES:
- /myaccount - User account
- /orders - Order history
- /login - Login
- /signup - Sign up

INFO PAGES:
- /about - About us
- /contact-us - Contact
- /blog - Blog

SMART ROUTING RULES (CRITICAL):
1. Uniform WITH filters (size/category/color) → [FILTER: params] → /uniforms-search
2. Uniform WITHOUT filters → [NAVIGATE: uniforms] → /uniforms
3. Product search ("dobok chahiye") → [SEARCH: dobok] → /ai-shopping
4. General search → /search

EXAMPLES:
User: "160 size C category uniform dikhao"
You: "Ji, 160 size C category uniforms dikha rahi hoon. [FILTER: size=160 category=C]"
Route: /uniforms-search?size=160&category=C

User: "uniforms dikhao"
You: "Ji, uniforms dikha rahi hoon. [NAVIGATE: uniforms]"
Route: /uniforms

User: "dobok chahiye"
You: "Theek hai, dobok dhoond rahi hoon. [SEARCH: dobok]"
Route: /ai-shopping?q=dobok

CRITICAL: Use the RIGHT page for the RIGHT purpose! Filtered uniforms MUST use /uniforms-search!`;

function similarity(s1: string, s2: string): number {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;
    const editDistance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
    return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(s1: string, s2: string): number {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else if (j > 0) {
                let newValue = costs[j - 1];
                if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                }
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function extractQuery(transcript: string): string {
    const words = transcript.split(' ').filter(word =>
        !FILLER_WORDS.includes(word.toLowerCase()) && word.length > 2
    );
    return words.join(' ');
}

export async function POST(req: Request) {
    try {
        const { transcript, language = 'ur' } = await req.json();

        if (!transcript) {
            return NextResponse.json({ error: 'Transcript required' }, { status: 400 });
        }

        await connectDb();

        console.log('🎤 Processing:', transcript);

        // Check learned responses first (for speed)
        const pastQuestions = await VoiceQuestion.find({ adminReviewed: true }).limit(50);
        let bestMatch = null;
        let bestScore = 0;

        for (const q of pastQuestions) {
            const score = similarity(transcript, q.transcript);
            if (score > bestScore && score > 0.7) {
                bestScore = score;
                bestMatch = q;
            }
        }

        if (bestMatch) {
            console.log('📚 Using Learned Response:', bestScore);
            await VoiceQuestion.create({
                transcript,
                intentType: 'learned',
                matchedResponse: bestMatch.matchedResponse,
                actionTaken: bestMatch.actionTaken,
                similarityScore: bestScore,
                adminReviewed: true
            });

            return NextResponse.json({
                intent: 'learned',
                response: bestMatch.matchedResponse,
                action: bestMatch.actionTaken,
                confidence: bestScore
            });
        }

        // Use Groq AI for new queries
        const model = await selectBestModel();

        const completion = await groq.chat.completions.create({
            model,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: transcript }
            ],
            temperature: 0.7,
            max_tokens: 100
        });

        const aiResponse = completion.choices[0].message.content || "Sorry, I didn't understand.";
        console.log('🤖 Groq Response:', aiResponse);

        // Parse action tags using AI memory
        let action = null;
        let cleanResponse = aiResponse;

        if (aiResponse.includes('[NAVIGATE:')) {
            const match = aiResponse.match(/\[NAVIGATE: (.*?)\]/);
            const pageName = match ? match[1].trim() : '';

            // NEW: Validate page exists using site map
            const foundPage = findPageByKeyword(pageName);

            if (foundPage) {
                // Page exists - navigate
                action = { type: 'navigate', route: foundPage.path };
                cleanResponse = aiResponse.replace(/\[NAVIGATE:.*?\]/, '').trim();
                console.log('✅ Valid page found:', foundPage.path);
            } else {
                // Page doesn't exist - suggest alternatives
                const similar = getSimilarPages(pageName, 3);
                if (similar.length > 0) {
                    const suggestions = similar.map(p => p.name).join(', ');
                    cleanResponse = `Sorry sir, "${pageName}" page available nahi hai. Kya aap ${suggestions} dekhna chahte hain?`;
                } else {
                    cleanResponse = `Sorry sir, yeh page available nahi hai. Main aapko hoodies, tshirts, mugs, ya uniforms dikha sakti hoon.`;
                }
                action = null; // Don't navigate to invalid page
                console.log('❌ Invalid page requested:', pageName);
            }
        } else if (aiResponse.includes('[SEARCH:')) {
            const match = aiResponse.match(/\[SEARCH: (.*?)\]/);
            const query = match ? match[1] : extractProductName(transcript);
            action = { type: 'search', payload: { query } };
            cleanResponse = aiResponse.replace(/\[SEARCH:.*?\]/, '').trim();
        } else if (aiResponse.includes('[FILTER:')) {
            const match = aiResponse.match(/\[FILTER: (.*?)\]/);
            const filterString = match ? match[1] : '';

            // Parse filter parameters
            const params = extractUniformParams(filterString || transcript);

            // SMART ROUTING: Use uniforms-search for filtered queries
            const queryParams = new URLSearchParams();
            if (params.size) queryParams.append('size', params.size);
            if (params.category) queryParams.append('category', params.category);
            if (params.color) queryParams.append('color', params.color);
            if (params.company) queryParams.append('company', params.company);

            const uniformSearchURL = `/uniforms-search?${queryParams.toString()}`;

            action = { type: 'navigate', route: uniformSearchURL };
            cleanResponse = aiResponse.replace(/\[FILTER:.*?\]/, '').trim();
            console.log('✅ Smart route to uniforms-search:', uniformSearchURL);
        } else if (aiResponse.includes('[CART]')) {
            action = { type: 'addCart' };
            cleanResponse = aiResponse.replace('[CART]', '').trim();
        } else if (aiResponse.includes('[CHECKOUT]')) {
            action = { type: 'navigate', route: '/checkout' };
        }

        // Save to learning database
        await VoiceQuestion.create({
            transcript,
            intentType: action?.type || 'other',
            matchedResponse: cleanResponse,
            actionTaken: action,
            similarityScore: 1.0,
            adminReviewed: false // Requires admin review
        });

        return NextResponse.json({
            intent: action?.type || 'chat',
            response: cleanResponse || aiResponse,
            action,
            confidence: 1.0
        });

    } catch (error: any) {
        console.error('Groq Error:', error);
        return NextResponse.json({
            error: 'AI Service Error',
            details: error.message
        }, { status: 500 });
    }
}

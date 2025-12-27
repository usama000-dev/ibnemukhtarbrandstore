import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
You are the "Champion Choice" Smart Assistant.
Your Goal: Help customers find martial arts gear (Products or Uniforms).
Your Personality: Energetic, Helpful, Concise.
Language:
1. Detect the language of the user's message.
2. If Urdu, reply in Roman Urdu (e.g., "Ji sir, main apko boxing gloves dikhati hoon").
3. If English, reply in English.

Tools:
- If the user asks for a product (e.g., "Show me gloves", "I need a uniform", "Price of dobok"),
- You MUST output a special trigger text: "[SEARCH: query]".
- Example: "[SEARCH: red taekwondo uniform]"
- Do NOT say "I will search for that". Just say the trigger.

Conversation:
- Isolate the search trigger from the polite response if possible.
- If the user says "Hello" or socializes, reply warmly in their language.
- Keep answers very short (under 20 words) so they are easy to speak.
`;

async function generateWithFallback(message: string) {
    const modelsToTry = ["models/gemini-2.0-flash", "models/gemini-pro-latest"];
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`🤖 Trying Model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });

            // Standard Prompt Engineering (Universal Compatibility)
            const chat = model.startChat({
                history: [
                    { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                    { role: "model", parts: [{ text: "Understood. I am ready to help as the Champion Choice Assistant." }] },
                ],
            });

            const result = await chat.sendMessage(message);
            const text = result.response.text();

            console.log(`✅ Success with ${modelName}`);
            return text;

        } catch (error: any) {
            console.warn(`⚠️ Failed with ${modelName}:`, error.message?.substring(0, 100));
            lastError = error;
            // Continue to next model in loop
        }
    }
    throw lastError; // If all fail
}

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });
        if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY missing' }, { status: 500 });

        // 🧠 Smart Execution: Try Flash -> Fallback to Pro
        const reply = await generateWithFallback(message);

        console.log('💎 Final Reply:', reply);

        let shouldSearch = false;
        let searchQuery = "";
        let cleanReply = reply;

        // Check for Tool Call Trigger
        if (reply.includes("[SEARCH:")) {
            shouldSearch = true;
            const match = reply.match(/\[SEARCH: (.*?)\]/);
            if (match) {
                searchQuery = match[1];
            }
            cleanReply = reply.replace(/\[SEARCH:.*?\]/, "").trim();
            if (!cleanReply) cleanReply = "Opening search results...";
        }

        return NextResponse.json({
            reply: cleanReply,
            shouldSearch,
            searchQuery
        });

    } catch (error: any) {
        console.error('ALL Gemini Models Failed:', error);
        return NextResponse.json({
            error: 'AI Service Unavailable',
            details: error.message
        }, { status: 500 });
    }
}

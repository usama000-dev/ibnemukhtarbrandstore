const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access API key from env (mocked here for script execution context if needed, but better to rely on system env)
// Note: In the tool execution, we might need to inline the key if dotenv isn't loaded, 
// but let's try assuming the environment is set or pass it directly.
// For this script, I will read it from process.env if available.

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("Fetching available models...");

    try {
        // For listModels, we access the ModelManager via the genAI instance (depends on SDK version).
        // In @google/generative-ai, listModels might be on the client or specific manager.
        // Common pattern:
        // const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY);
        // Let's use simple fetch to be SDK agnostic for a quick debug if SDK fails.

        // Attempting SDK method if available, else fetch
        // Actually, let's just use fetch to be 100% sure what the API sees
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            console.error("NO API KEY FOUND");
            return;
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.models) {
            console.log("✅ AVAILABLE MODELS:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`); // e.g. models/gemini-pro
                }
            });
        } else {
            console.error("❌ No models found or Error:", data);
        }

    } catch (err) {
        console.error("Script Error:", err);
    }
}

listModels();

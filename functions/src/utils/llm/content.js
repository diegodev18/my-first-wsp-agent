import { ai } from "../../lib/llm.js"
import { GEMINI_MODEL } from "../../config.js";

export const get = async (prompt) => {
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
        return null;
    }

    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `${prompt}. Que la respuesta sea breve y concisa, no exceda los 500 caracteres.`,
        config: {
            maxOutputTokens: 100,
            temperature: 0.5,
        }
    });

    return response;
}

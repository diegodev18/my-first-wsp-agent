import { ai } from "../../lib/llm.js"
import { GEMINI_MODEL } from "../../config.js";

export const get = async (contents) => {
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
                topK: 40,
                topP: 0.9,
                candidateCount: 1,
            }
        });
        return response;
    } catch (err) {
        console.error("Error calling LLM:", err);
        return null;
    }
}

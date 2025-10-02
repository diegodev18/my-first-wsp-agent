import { ai } from "../../lib/llm.js"
import { GEMINI_MODEL } from "../../config.js";
import { promptRules } from "./prompt.js";

export const get = async (userPrompt, history = []) => {
    if (!userPrompt || typeof userPrompt !== "string" || userPrompt.trim() === "") {
        return null;
    }

    try {
        let contents = [];
        if (history && Array.isArray(history) && history.length > 0) {
            contents = [...history];
        }

        const currentUserMessage = {
            role: "user",
            parts: [{ text: promptRules(userPrompt) }],
        };
        contents.push(currentUserMessage);

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

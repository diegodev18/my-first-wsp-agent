import { ai } from "../../lib/llm.js"
import { GEMINI_MODEL } from "../../config.js";
import { promptRules } from "./prompt.js";

export const get = async (userPrompt) => {
    if (!userPrompt || typeof userPrompt !== "string" || userPrompt.trim() === "") {
        return null;
    }

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: promptRules(userPrompt),
        });
        return response;
    } catch (err) {
        console.error("Error calling LLM:", err);
        return null;
    }

}

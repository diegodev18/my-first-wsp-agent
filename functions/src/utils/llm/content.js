import { ai } from "../../lib/llm.js"
import { GEMINI_MODEL } from "../../config.js";
import { promptTemplate } from "./prompt.js";

export const get = async (userPrompt, userMemory) => {
    if (!userPrompt || typeof userPrompt !== "string" || userPrompt.trim() === "") {
        return null;
    }

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: promptTemplate(userPrompt, userMemory),
            config: {
                maxOutputTokens: 100,
                temperature: 0.5,
            }
        });
        return response;
    } catch (err) {
        return null;
    }

}

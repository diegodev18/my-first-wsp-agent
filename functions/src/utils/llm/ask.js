import { promptRules } from "./prompt.js";
import { get as generateContent } from "./content.js";

export const get = async (userPrompt, history = [], rules = true) => {
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
            parts: [{ text: userPrompt }],
        };
        contents.push(currentUserMessage);

        const customConfig = rules ? {
            systemInstruction: promptRules,
        } : {};

        const response = await generateContent(contents, customConfig);
        return response;
    } catch (err) {
        console.error("Error calling LLM:", err);
        return null;
    }

}

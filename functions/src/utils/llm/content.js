import { ai } from "../../lib/llm.js"

export const get = async (prompt) => {
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
        return null;
    }

    const response = await ai.models.generateContent({
        contents: prompt,
        config: {
            maxOutputTokens: 1024,
        }
    });

    return response;
}

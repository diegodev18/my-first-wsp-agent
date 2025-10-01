import { ai } from "../../lib/llm.js"

export const get = async (prompt) => {
    const response = await ai.models.generateContent({
        contents: prompt,
        config: {
            maxOutputTokens: 1024,
        }
    });

    return response;
}

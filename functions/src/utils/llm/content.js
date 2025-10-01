import { ai } from "../../lib/llm.js"

export const get = async (text) => {
    const response = await ai.models.generateContent({
        contents: text,
        config: {
            maxOutputTokens: 1024,
        }
    });

    return response;
}

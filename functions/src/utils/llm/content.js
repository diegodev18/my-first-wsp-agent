import { ai } from "../../lib/llm"

export const get = async (text) => {
    const response = await ai.models.generateContent({
        contents: text,
        config: {
            maxOutputTokens: 1024,
        }
    });

    return response;
}

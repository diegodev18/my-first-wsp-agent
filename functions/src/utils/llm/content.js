import { ai } from "../../lib/llm.js"

export const get = async (prompt) => {
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
        return null;
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response;
}

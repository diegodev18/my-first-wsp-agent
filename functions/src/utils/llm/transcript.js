import { ai } from "../../lib/llm.js";
import { GEMINI_MODEL } from "../../config.js";

export const get = async (audioBase64) => {
    try {
        const response = await ai.models.generateContent({
            contents: [
                {
                    parts: [
                        { text: "Transcribe este audio en texto en español:" },
                        {
                            inlineData: {
                                mimeType: "audio/ogg",
                                data: audioBase64,
                            },
                        },
                    ],
                },
            ],
            model: GEMINI_MODEL,
        });

        return response.candidates[0].content.parts[0].text;
    } catch (err) {
        console.error("Error transcribing audio:", err);
        return null;
    }
};

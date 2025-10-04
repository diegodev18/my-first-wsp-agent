import { ai } from "../../lib/llm.js";
import { GEMINI_MODEL } from "../../config.js";
import { promptToTranscript } from "./prompt.js";

export const get = async (audioBase64) => {
    try {
        const response = await ai.models.generateContent({
            contents: [
                {
                    parts: [
                        { text: promptToTranscript },
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

        return response;
    } catch (err) {
        console.error("Error transcribing audio:", err);
        return null;
    }
};

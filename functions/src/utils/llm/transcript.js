import fs from "fs";
import { ai } from "../../lib/llm.js";
import { GEMINI_MODEL } from "../../config.js";

export const get = async (audioFilePath) => {
    try {

        const audioFile = fs.readFileSync(audioFilePath);
        if (!audioFile) return null;

        const response = await ai.models.generateContent(
            [
                {
                    role: "user",
                    parts: [
                        { text: "Transcribe este audio en texto en español:" },
                        {
                            inlineData: {
                                mimeType: "audio/ogg",
                                data: audioFile.toString("base64"),
                            },
                        },
                    ],
                },
            ],
            {
                model: GEMINI_MODEL,
            }
        );

        return response;
    } catch (err) {
        console.error("Error transcribing audio:", err);
        return null;
    }
};

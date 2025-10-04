import { get as generateContent } from "./content.js";
import { promptToTranscript } from "./prompt.js";

export const get = async (audioBase64) => {
    try {
        const response = await generateContent([
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
        ]);

        return response;
    } catch (err) {
        console.error("Error transcribing audio:", err);
        return null;
    }
};

import { GoogleGenAI } from "@google/genai";

import { GEMINI_API_KEY } from "../config.js";

export const ai = new GoogleGenAI({
    model: "gemini-2.5-flash",
    apiKey: GEMINI_API_KEY,
});

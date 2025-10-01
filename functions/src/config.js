import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ quiet: true });
}

export const {
    META_APP_ID,
    META_APP_SECRET,
    WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_VERIFY_TOKEN,
    GEMINI_API_KEY,
    GEMINI_MODEL = "gemini-2.5-flash",
} = process.env;

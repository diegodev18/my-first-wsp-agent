import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ quiet: true });
}

export const {
    META_APP_ID,
    META_APP_SECRET,
    PORT = 3000,
    WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID,
} = process.env;

import { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID } from "../../config.js";

export const send = async (phoneNumber, payload) => {
    const response = await fetch(`https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        body: JSON.stringify({
            messaging_product: "whatsapp",
            to: phoneNumber,
            ...payload
        }),
        headers: {
            "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        },
        method: "POST",
    })
    const data = await response.json();

    if (!response.ok) {
        console.error("Error sending message:", data);
        return null;
    }
    return data;
}

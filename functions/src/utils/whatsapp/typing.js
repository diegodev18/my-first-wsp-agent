import { fetchPost as fetchPostWhatsapp } from "./api.js";

export const handleTypingIndicator = async (phoneNumber, messageId) => {
    const payload = {
        status: "read",
        message_id: messageId,
        typing_indicator: {
            type: "text",
        }
    };
    const response = await fetchPostWhatsapp(phoneNumber, payload);
    if (!response) {
        return false;
    }
    return true;
}

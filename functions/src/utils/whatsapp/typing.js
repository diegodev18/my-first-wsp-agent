import { fetchPost as fetchPostWhatsapp } from "./api.js";

export const handleTypingIndicator = async (phoneNumber, isTyping) => {
    const payload = {
        type: "typing",
        typing: isTyping ? "on" : "off"
    };
    const response = await fetchPostWhatsapp(phoneNumber, payload);
    if (!response) {
        return false;
    }
    return true;
}

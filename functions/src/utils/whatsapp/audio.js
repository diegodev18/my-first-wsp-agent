import { WHATSAPP_ACCESS_TOKEN } from "../../config.js";

export const downloadAudio = async (mediaId) => {
    const response = await fetch(`https://graph.facebook.com/v22.0/${mediaId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`
        }
    });
    if (!response.ok) return false;

    const data = await response.json();
    if (!data || !data.url) return false;

    const audioDownloaded = await fetch(data.url, {
        headers: {
            "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`
        },
        output: "audio.ogg"
    });
    if (!audioDownloaded.ok) return false;

    return true;
}

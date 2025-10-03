import fs from "fs";

import { WHATSAPP_ACCESS_TOKEN } from "../../config.js";

fs.mkdirSync("/tmp", { recursive: true });

export const downloadAudio = async (mediaId) => {
    const response = await fetch(`https://graph.facebook.com/v22.0/${mediaId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`
        }
    });
    if (!response.ok) return null;

    const data = await response.json();
    if (!data || !data.url) return null;

    const timestamp = Date.now().toString();
    const filePath = `/tmp/audio_${timestamp}.ogg`;

    const audioDownloaded = await fetch(data.url, {
        headers: {
            "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`
        },
        output: filePath
    });
    if (!audioDownloaded.ok) return null;

    return filePath;
}

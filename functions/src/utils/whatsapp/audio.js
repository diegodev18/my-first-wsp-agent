import fs from "fs";

import { WHATSAPP_ACCESS_TOKEN } from "../../config.js";

fs.mkdirSync("/tmp", { recursive: true });

export const get = async (mediaId) => {
    const response = await fetch(`https://graph.facebook.com/v22.0/${mediaId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`
        }
    });
    if (!response.ok) return null;

    const data = await response.json();
    if (!data || !data.url) return null;

    try {
        const audioDownloaded = await fetch(data.url, {
            headers: {
                "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`
            },
        });
        if (!audioDownloaded.ok) return null;

        const arrayBuffer = await audioDownloaded.arrayBuffer();

        const buffer = Buffer.from(arrayBuffer);

        const base64Data = buffer.toString("base64");

        return base64Data;
    } catch (err) {
        console.error("Error downloading audio file:", err);
        return null;
    }

}

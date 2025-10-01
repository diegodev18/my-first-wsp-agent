import fs from "fs";
import path from "path";

import {
    META_APP_ID,
    META_APP_SECRET,
    WHATSAPP_ACCESS_TOKEN
} from "../../config.js";

const whatsappTokensPath = path.join("tokens", "whatsapp_token.json");

const getParams = () => {
    const savedToken = getStoredToken();

    const params = new URLSearchParams();
    params.append("grant_type", "fb_exchange_token");
    params.append("client_id", META_APP_ID);
    params.append("client_secret", META_APP_SECRET);
    params.append("fb_exchange_token", savedToken && savedToken.access_token ? savedToken.access_token : WHATSAPP_ACCESS_TOKEN);
    return params.toString();
}

export const getRefreshToken = async () => {
    const response = await fetch(`https://graph.facebook.com/v22.0/oauth/access_token?${getParams()}`);
    const data = await response.json();

    if (!response.ok) {
        console.error("Error refreshing WhatsApp token:", data);
        return null;
    }

    data.refreshedAt = new Date().toISOString();

    return data;
}

const refresh = async () => {
    const refreshedToken = await getRefreshToken();
    if (!refreshedToken) return false;

    fs.writeFileSync(whatsappTokensPath, JSON.stringify(refreshedToken));
    return true;
}

export const setRefreshInterval = async () => {
    const missingKeys = [META_APP_ID, META_APP_SECRET, WHATSAPP_ACCESS_TOKEN].filter(key => !key);
    if (missingKeys.length > 0) {
        throw new Error(`Missing: WhatsApp environment variables -> ${missingKeys.join(", ")}`);
    }

    const interval = 60 * 60 * 1000 * 24 * 20; // 20 days

    fs.mkdirSync("tokens", { recursive: true });

    if (!fs.existsSync(whatsappTokensPath)) {
        const success = await refresh();
        if (!success) {
            throw new Error("Failed to obtain initial WhatsApp token. Please check your configuration.");
        }
    }

    setTimeout(async () => {
        await refresh();

        setInterval(async () => {
            await refresh();
        }, interval);
    }, interval);
}

export const getStoredToken = () => {
    if (!fs.existsSync(whatsappTokensPath)) {
        return null;
    }
    const tokenData = fs.readFileSync(whatsappTokensPath, "utf-8");
    return JSON.parse(tokenData);
}

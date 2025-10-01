import { WHATSAPP_VERIFY_TOKEN } from "../config.js";
import { send as sendMessage } from "../utils/whatsapp/message.js";

export const getWebhook = (req, res) => {
    const { "hub.mode": mode, "hub.challenge": challenge, "hub.verify_token": verifyToken } = req.query;

    if (mode && challenge && verifyToken === WHATSAPP_VERIFY_TOKEN) {
        console.log("Webhook verified");
        return res.status(200).send(challenge);
    }

    return res.status(403).end();
};

export const postWebhook = (req, res) => {
    console.log("Webhook received:", JSON.stringify(req.body, null, 2));

    const msg = req.body.entry[0].changes[0].value.messages[0];
    if (msg && msg.type === "text" && msg.from) {
        const payload = {
            type: "text",
            text: {
                body: `You sent: ${msg.text.body}`
            }
        }
        sendMessage(msg.from, payload);
    }

    return res.status(200).end();
}

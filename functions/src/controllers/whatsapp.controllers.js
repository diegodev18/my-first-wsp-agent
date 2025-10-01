import { WHATSAPP_VERIFY_TOKEN } from "../config.js";
import { send as sendMessage } from "../utils/whatsapp/message.js";
import { get } from "../utils/llm/content.js";

export const getWebhook = (req, res) => {
    const { "hub.mode": mode, "hub.challenge": challenge, "hub.verify_token": verifyToken } = req.query;

    if (mode && challenge && verifyToken === WHATSAPP_VERIFY_TOKEN) {
        req.log.info("Webhook verified");
        return res.status(200).send(challenge);
    }

    return res.status(403).end();
};

export const postWebhook = async (req, res) => {
    req.log.info("Webhook received:", JSON.stringify(req.body, null, 2));

    const msg = req.body.entry[0].changes[0].value.messages[0];
    if (msg && msg.type === "text" && msg.from) {
        const response = await get(msg.text.body);

        const payload = {
            type: "text",
            text: {
                body: response
            }
        }
        sendMessage(msg.from, payload);
    }

    return res.status(200).end();
}

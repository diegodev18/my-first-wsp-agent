import { WHATSAPP_VERIFY_TOKEN } from "../config.js";
import { send as sendMessage } from "../utils/whatsapp/message.js";
import { get as askToLlm } from "../utils/llm/content.js";
import { get as getMemory } from "../utils/db/memory.js";

export const getWebhook = (req, res) => {
    const { "hub.mode": mode, "hub.challenge": challenge, "hub.verify_token": verifyToken } = req.query;

    if (mode && challenge && verifyToken === WHATSAPP_VERIFY_TOKEN) {
        req.log.info("Webhook verified");
        return res.status(200).send(challenge);
    }

    return res.status(403).end();
};

export const postWebhook = async (req, res) => {
    req.log.info(`Webhook received: ${JSON.stringify(req.body, null, 2)}`);

    const entry = req.body && req.body.entry && req.body.entry[0];
    const change = entry && entry.changes && entry.changes[0];
    const value = change && change.value;
    const messages = value && value.messages;
    const msg = messages && messages[0];

    if (msg && msg.type === "text" && msg.from && msg.text) {
        req.log.info(`Message from ${msg.from}: ${msg.text.body}`);

        const memory = await getMemory(msg.from);

        const response = await askToLlm(msg.text.body, memory);

        if (!response || !response.text) {
            req.log.error("No response from LLM or response is invalid");
        }

        const payload = {
            type: "text",
            text: {
                body: response && response.text ?
                    response.text :
                    "Lo siento, no puedo procesar tu solicitud en este momento.",
            }
        };
        sendMessage(msg.from, payload);
    }

    return res.status(200).end();
}

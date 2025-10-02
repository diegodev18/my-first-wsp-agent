import { WHATSAPP_VERIFY_TOKEN } from "../config.js";
import { send as sendMessage } from "../utils/whatsapp/message.js";
import { get as getMemory, add as addMemory } from "../utils/db/memory.js";
import { getParamsFromPrompt } from "../utils/llm/repository.js";

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

        let answer = "Perdon, no pude procesar tu solicitud en este momento.";

        const memory = await getMemory(msg.from);

        const response = await getParamsFromPrompt(msg.text.body, memory);

        addMemory(msg.from, msg.text.body);

        if (!response) {
            req.log.error("No response from LLM or response is invalid");
        } else if (response.type === "general") {
            answer = response.reason || answer;
        } else if (response.type === "repository") {
            answer = `Parece que quieres información sobre el repositorio ${response.owner}/${response.repo}. Actualmente, no puedo acceder a datos en tiempo real, pero puedo ayudarte con preguntas generales sobre GitHub o cómo trabajar con repositorios. ¿En qué más puedo ayudarte?`;
        } else if (response.type === "file") {
            answer = `Parece que quieres información sobre el archivo ${response.filePath} en el repositorio ${response.owner}/${response.repo}. Actualmente, no puedo acceder a datos en tiempo real, pero puedo ayudarte con preguntas generales sobre GitHub o cómo trabajar con archivos en repositorios. ¿En qué más puedo ayudarte?`;
        }

        const payload = {
            type: "text",
            text: {
                body: answer
            }
        };
        sendMessage(msg.from, payload);
    }

    return res.status(200).end();
}

import { WHATSAPP_VERIFY_TOKEN } from "../config.js";
import { fetchPost as fetchPostWhatsapp } from "../utils/whatsapp/api.js";
import { get as getMemory, add as addMemory } from "../utils/db/memory.js";
import { getParamsFromPrompt, getRepositoryInfo, getFileInfo } from "../utils/llm/repository.js";
import { get as askToLlm } from "../utils/llm/content.js";
import { generalPrompt } from "../utils/llm/prompt.js";
import { handleTypingIndicator } from "../utils/whatsapp/typing.js";
import { get as transcriptAudio } from "../utils/llm/transcript.js";
import { downloadAudio } from "../utils/whatsapp/audio.js";

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

    if (msg && (msg.type === "text" || msg.type === "audio") && msg.from) {
        await handleTypingIndicator(msg.from, msg.id);

        let userMessage = msg.text.body;
        if (msg.type === "audio") {
            const audioFilePath = await downloadAudio(msg.audio.id);
            if (!audioFilePath) {
                req.log.error("Failed to download audio file");
                return res.status(200).end();
            }
            userMessage = await transcriptAudio(audioFilePath);
            if (!userMessage) {
                req.log.error("Failed to transcribe audio file");
                return res.status(200).end();
            }
        } else if (!userMessage) {
            req.log.error("No text body found in the message");
            return res.status(400).end();
        }

        req.log.info(`Message from ${msg.from}: ${userMessage}`);

        let answer = "Perdon, no pude procesar tu solicitud en este momento.";

        const memory = await getMemory(msg.from);

        const response = await getParamsFromPrompt(userMessage, memory);

        addMemory(msg.from, userMessage);

        if (!response || typeof response !== "object") {
            req.log.error("No response from LLM or response is invalid");
        } else if (response.type === "general" && response.reason) {
            answer = response.reason;
        } else if (response.type === "general") {
            answer = (await askToLlm(generalPrompt(userMessage, memory))).text;
        } else if (response.type === "repository" && response.owner && response.repo) {
            answer = (await getRepositoryInfo(userMessage, memory, response.owner, response.repo)).text;
        } else if (response.type === "file") {
            answer = (await getFileInfo(userMessage, memory, response.owner, response.repo, response.filePath)).text;
        } else {
            req.log.error(`Unknown response type from LLM: ${JSON.stringify(response)}`);
        }

        const payload = {
            type: "text",
            text: {
                body: answer
            }
        };
        fetchPostWhatsapp(msg.from, payload);
    }

    if (msg && msg.type === "audio" && msg.from && msg.audio) {
        req.log.info(`Audio message from ${msg.from}, media ID: ${msg.audio.id}`);

        await handleTypingIndicator(msg.from, msg.id);

        req.log.info(`Transcription for audio message from ${msg.from} is not implemented yet.`);
    }

    return res.status(200).end();
}

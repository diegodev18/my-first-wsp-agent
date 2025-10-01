export const getWebhook = (req, res) => {
    const { "hub.mode": mode, "hub.challenge": challenge, "hub.verify_token": verifyToken } = req.query;

    if (mode && challenge && verifyToken === WHATSAPP_VERIFY_TOKEN) {
        console.log("Webhook verified");
        return res.status(200).send(challenge);
    }

    return res.status(403).end();
};

export const postWebhook = (req, res) => {
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
    console.log(`[${timestamp}] Webhook received:`, JSON.stringify(req.body, null, 2));

    return res.status(200).end();
}

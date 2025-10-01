import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v1/https";
import logger from "firebase-functions/logger";


setGlobalOptions({ maxInstances: 10 });

export const api = onRequest((req, res) => {
    logger.info("Hello logs!", { structuredData: true });
    res.send("Hello from Firebase!");
});

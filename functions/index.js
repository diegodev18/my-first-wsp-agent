import * as v2 from "firebase-functions/v2";

v2.setGlobalOptions({ maxInstances: 10 });

export const api = v2.https.onRequest((req, res) => {
    v2.logger.info("Hello logs!", { structuredData: true });
    res.send("Hello from Firebase!");
});

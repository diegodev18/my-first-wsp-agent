import * as functions from "firebase-functions/v2";
import app from "./src/app.js";

functions.setGlobalOptions({
    region: "us-central1",  // o tu región preferida
    memory: "512MiB",
    maxInstances: 10,
});

export const api = functions.https.onRequest(app);

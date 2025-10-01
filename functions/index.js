import * as v2 from "firebase-functions/v2";
import app from "./src/app";

v2.setGlobalOptions({ maxInstances: 10 });

export const api = v2.https.onRequest(app);

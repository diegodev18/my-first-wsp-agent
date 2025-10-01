import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v1/https";
import logger from "firebase-functions/logger";

setGlobalOptions({ maxInstances: 10 });

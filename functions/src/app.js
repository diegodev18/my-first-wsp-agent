import express from "express";
import logger from "pino-http";

import whatsappRoutes from "./routes/whatsapp.routes.js";
import { setRefreshInterval } from "./utils/whatsapp/token.js";

setRefreshInterval();

const app = express();

app.use(logger());
app.use(express.json());

app.use("/whatsapp", whatsappRoutes);

export default app;

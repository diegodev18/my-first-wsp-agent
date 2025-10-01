import express from "express";
import pino from "pino-http";

import whatsappRoutes from "./routes/whatsapp.routes.js";
import { setRefreshInterval } from "./utils/whatsapp/token.js";

setRefreshInterval();

const app = express();

app.use(pino());
app.use(express.json());

app.use("/whatsapp", whatsappRoutes);

export default app;

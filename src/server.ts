// @deno-types="@types/express"
import express from "express";
import { Response } from "express";
// @deno-types="@types/cors"
import cors from "cors";
import logger from "./logger.ts";

import "@std/dotenv/load";
import routes from "./routes/index.ts";

const APP_PORT = Number(Deno.env.get('APP_PORT')) || 8000;

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: Deno.env.get('FRONTEND_ALLOWED_URL')
}

app.use(cors(corsOptions));
app.use(logger);
app.use(express.json());
app.use('/api/v1', routes);

app.get('/api/v1/health-check', (_, res: Response) => {
  res.json({ code: 200, status: 'OK' });
});

app.listen(APP_PORT, () => {
  console.log(`Server is running on ${APP_PORT} port`);
});

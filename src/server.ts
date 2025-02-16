// @deno-types="npm:@types/express@5.0.0"
import express from "npm:express@4.21.2";
import { Response } from "npm:express@4.21.2";
// @deno-types="npm:@types/cors@2.8.17"
import cors from "npm:cors@2.8.5";
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

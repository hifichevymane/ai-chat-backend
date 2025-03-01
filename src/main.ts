// @deno-types="@types/express"
import express from 'express';
import { Response } from 'express';
// @deno-types="@types/cors"
import cors from 'cors';
import logger from './logger.ts';
import ollama from 'ollama';
import '@std/dotenv/load';

import routes from './routes/index.ts';
import { MODEL_ID } from './constants.ts';

const APP_PORT = Number(Deno.env.get('APP_PORT')) || 8000;

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: Deno.env.get('FRONTEND_ALLOWED_URL'),
};

app.use(cors(corsOptions));
app.use(logger);
app.use(express.json());
app.use('/api/v1', routes);

app.get('/api/v1/health-check', (_, res: Response) => {
  res.json({ code: 200, status: 'OK' });
});

app.listen(APP_PORT, async () => {
  // Load the llm model
  const llmResponse = await ollama.chat({
    model: MODEL_ID,
    messages: [],
  });

  if (llmResponse.done) {
    console.log('LLM model has been loaded');
  } else {
    console.log('Error while loading LLM model');
  }

  console.log(`Server is running on ${APP_PORT} port`);
});

const cleanup = async () => {
  // Unload the llm model
  const llmResponse = await ollama.chat({
    model: MODEL_ID,
    messages: [],
    keep_alive: 0
  });

  if (llmResponse.done) {
    console.log('LLM model has been unloaded');
  } else {
    console.log('Error while unloading LLM model');
  }

  Deno.exit(0);
};

// Cleanup on exiting
Deno.addSignalListener('SIGINT', cleanup);
Deno.addSignalListener('SIGTERM', cleanup);

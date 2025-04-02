import '@std/dotenv/load';
import 'reflect-metadata';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import logger from './logger.ts';
import ollama from 'ollama';

import { initializeDB } from './database/index.ts';
import routes from './routes/index.ts';
import { MODEL_ID } from './constants.ts';

initializeDB();

const APP_PORT = Number(Deno.env.get('APP_PORT')) || 8000;

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: Deno.env.get('FRONTEND_ALLOWED_URL'),
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use('/api', routes);

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

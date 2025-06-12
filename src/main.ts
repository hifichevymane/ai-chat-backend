import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';

import express from 'express';
import { Response } from 'express';
import cors from 'cors';
import logger from './logger';
import ollama from 'ollama';
import { initializeDB } from './database';

import routes from './routes';
import { MODEL_ID } from './constants';

initializeDB();

const APP_PORT = Number(process.env.APP_PORT) || 8000;

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: process.env.FRONTEND_ALLOWED_URL
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
    messages: []
  });

  if (llmResponse.done) {
    console.log('LLM model has been loaded');
  } else {
    console.log('Error while loading LLM model');
  }

  console.log(`Server is running on ${APP_PORT} port`);
});

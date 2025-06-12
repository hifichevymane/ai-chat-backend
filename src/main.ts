import 'reflect-metadata';

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { Response } from 'express';
import cors from 'cors';
import logger from './logger';
import ollama from 'ollama';
import { initializeDatabase } from './database';

import routes from './routes';

try {
  await initializeDatabase();
  // Load the llm model
  const llmResponse = await ollama.chat({
    model: process.env.MODEL_ID,
    messages: []
  });

  if (llmResponse.done) {
    console.log('LLM model has been loaded successfully!');
  } else {
    throw new Error('Error while loading LLM model');
  }
} catch (err) {
  console.error(err);
  throw err;
}

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

app.listen(APP_PORT, () => {
  console.log(`Server is running on ${APP_PORT} port`);
});

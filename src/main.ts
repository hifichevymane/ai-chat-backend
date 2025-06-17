import dotenv from 'dotenv';
dotenv.config();

import { Server } from 'http';
import express, { type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { LLMService } from './services';

import routes from './routes';

let server: Server;
const main = async (): Promise<void> => {
  try {
    // Load the llm model
    const llmService = new LLMService();
    const isLoaded = await llmService.loadModel();
    if (isLoaded) {
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
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', routes);

  app.get('/api/health-check', (_, res: Response) => {
    res.json({ code: 200, status: 'OK' });
  });

  server = app.listen(APP_PORT, () => {
    console.log(`Server is running on ${APP_PORT} port`);
  });
};
await main();

const gracefulShutdown = async (): Promise<void> => {
  try {
    // Unload the model
    const llmService = new LLMService();
    const isUnloaded = await llmService.unloadModel();
    if (isUnloaded) {
      console.log('LLM model has been unloaded successfully!');
    } else {
      throw new Error('Error while unloading LLM model');
    }

    server.close(() => {
      console.debug('HTTP server is closed...');
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const shutdownHandler = (): void => {
  gracefulShutdown().catch((err: unknown) => {
    if (err instanceof Error) {
      console.error('Error during graceful shutdown:', err);
    }
    process.exit(1);
  });
};

process.on('SIGTERM', shutdownHandler);
process.on('SIGINT', shutdownHandler);

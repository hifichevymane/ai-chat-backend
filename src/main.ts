import dotenv from 'dotenv';
dotenv.config();

import { Server } from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import { AuthService } from './services';
import { errorHandler } from './middlewares/error-handler';

import routes from './routes';

import { loadLLM, unloadLLM } from './llm-lifecycle';

async function main(): Promise<void> {
  await loadLLM();
  const server = setupServer();
  addShutdownHandlers(server);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});

function setupServer(): Server {
  const app = express();

  app.use(cors({ origin: process.env.FRONTEND_ALLOWED_URL }));
  app.use(helmet());
  app.use(morgan('common'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  AuthService.useJWTStrategy();
  app.use(passport.initialize());

  app.use('/api', routes);

  app.use(errorHandler);

  const port = Number(process.env.APP_PORT) || 8000;
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  return server;
}

function addShutdownHandlers(server: Server): void {
  const handler = (): void => {
    server.close(() => {
      console.debug('HTTP server is closed...');
    });

    unloadLLM().catch((err: unknown) => {
      console.error('Error during graceful shutdown:', err);
      process.exit(1);
    });
  };

  process.on('SIGTERM', handler);
  process.on('SIGINT', handler);
}

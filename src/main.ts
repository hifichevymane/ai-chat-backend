import dotenv from 'dotenv';
dotenv.config();

import { Server } from 'http';
import app from './app';
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

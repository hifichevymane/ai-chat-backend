// @deno-types="@types/express"
import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();

    let logLevel = 'info';
    let log = console.log;
    let logColor = 'green';

    const { statusCode } = res;
    if (statusCode >= 400 && statusCode < 500) {
      logLevel = 'warn';
      log = console.warn;
      logColor = 'yellow';
    } else if (statusCode >= 500) {
      logLevel = 'error';
      log = console.error;
      logColor = 'red';
    }

    log(
      `%c[${timestamp}] [${logLevel.toUpperCase()}] ${req.method} ${req.url} ${statusCode} - ${duration}ms`,
      `color: ${logColor}`
    );
  });

  next();
};

export default logger;

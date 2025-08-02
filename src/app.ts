import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import { AuthService } from './services';
import { errorHandler } from './middlewares';
import routes from './routes';

const app = express();

if (!process.env.FRONTEND_ALLOWED_URL) {
  throw new Error('FRONTEND_ALLOWED_URL is not set');
}
if (!process.env.COOKIE_SECRET) {
  throw new Error('COOKIE_SECRET is not set');
}

app.use(
  cors({
    origin: process.env.FRONTEND_ALLOWED_URL,
    credentials: true
  })
);
app.use(helmet());
app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

AuthService.useJWTStrategy();
app.use(passport.initialize());

app.use('/api', routes);

app.use(errorHandler);

export default app;

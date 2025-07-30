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

app.use(cors({ origin: process.env.FRONTEND_ALLOWED_URL }));
app.use(helmet());
app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

AuthService.useJWTStrategy();
app.use(passport.initialize());

app.use('/api', routes);

app.use(errorHandler);

export default app;

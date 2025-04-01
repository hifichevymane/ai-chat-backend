// @deno-types="@types/express"
import { Router } from 'express';
import chats from './chats.ts';
import auth from './auth.ts';

const router = Router();
router.use('/chats', chats);
router.use('/auth', auth);

export default router;

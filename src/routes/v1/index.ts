// @deno-types="@types/express"
import { Router } from 'express';
import chats from './chats.ts';

const router = Router();
router.use('/chats', chats);

export default router;

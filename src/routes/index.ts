import { Router } from 'express';
import chatRouter from './chat.ts';

const router = Router();
router.use(chatRouter);

export default router;

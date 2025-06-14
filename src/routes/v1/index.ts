import { Router } from 'express';
import chats from './chats';

const router = Router();

router.use('/chats', chats);

export default router;

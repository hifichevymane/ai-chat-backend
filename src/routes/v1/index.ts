import { Router } from 'express';
import chats from './chats';

const router = Router();
router.use(chats);

export default router;

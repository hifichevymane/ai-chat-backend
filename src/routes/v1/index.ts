import { Router } from 'express';
import chats from './chats';
import auth from './auth';

const router = Router();

router.use('/chats', chats);
router.use('/auth', auth);

export default router;

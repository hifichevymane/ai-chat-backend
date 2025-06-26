import { Router } from 'express';
import chats from './chats';
import users from './users';

const router = Router();

router.use('/chats', chats);
router.use('/users', users);

export default router;

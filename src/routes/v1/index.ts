import { Router } from 'express';
import chats from './chats';
import users from './users';
import auth from './auth';

const router = Router();

router.use('/chats', chats);
router.use('/users', users);
router.use('/auth', auth);

export default router;

import { Router } from 'express';
import chats from './chats';
import auth from './auth';
import users from './users';

const router = Router();

router.use('/chats', chats);
router.use('/auth', auth);
router.use('/users', users);

export default router;

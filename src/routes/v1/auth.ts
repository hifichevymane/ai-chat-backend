import { Router } from 'express';
import { login, verify, logout } from '../../controllers/auth';

const router = Router();

router.post('/login', login);
router.post('/verify', verify);
router.post('/logout', logout);

export default router;

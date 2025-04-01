import { signUp } from '../../controllers/auth/index.ts';
import { Router } from 'express';

const router = Router();
router.post('/sign-up', signUp);

export default router;

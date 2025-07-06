import { Router } from 'express';
import { login, verify, logout } from '../../controllers/auth';
import { validateBody } from '../../middlewares/validate';
import {
  loginBodySchema,
  verifyBodySchema
} from '../../controllers/auth/schemas';

const router = Router();

router.post('/login', validateBody(loginBodySchema), login);
router.post('/verify', validateBody(verifyBodySchema), verify);
router.post('/logout', logout);

export default router;

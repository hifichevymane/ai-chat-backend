import { Router } from 'express';
import { login, verify, logout, signUp, me } from '../../controllers/auth';
import { validateBody, authenticateJWT } from '../../middlewares';
import {
  loginBodySchema,
  verifyBodySchema,
  signUpBodySchema
} from '../../controllers/auth/schemas';

const router = Router();

router.post('/login', validateBody(loginBodySchema), login);
router.post('/logout', logout);
router.post('/sign-up', validateBody(signUpBodySchema), signUp);
router.post('/verify', validateBody(verifyBodySchema), verify);
router.get('/me', authenticateJWT, me);

export default router;

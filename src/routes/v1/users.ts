import { Router } from 'express';
import { create } from '../../controllers/users';
import { validateBody } from '../../middlewares';
import { createUserBodySchema } from '../../controllers/users/schemas';

const router = Router();

router.post('/', validateBody(createUserBodySchema), create);

export default router;

import { Router } from 'express';
import { create } from '../../controllers/users';

const router = Router();

router.post('/', create);

export default router;
